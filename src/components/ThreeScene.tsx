import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CameraController from './three/CameraController';
import CameraZoomController from './three/CameraZoomController';
import SceneWithFallback from './three/SceneWithFallback';

interface ThreeSceneProps {
  className?: string;
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
  isolatedMeshId?: string | null;
  selectableMeshes?: string[];
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  onBuildingClick,
  modelPath = '/lovable-uploads/scene(2).gltf',
  isolatedMeshId = null,
  selectableMeshes = [],
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] =
    useState<THREE.Mesh | null>(null);

  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // ✅ 识别 446/447/448/449 的 _1/_2 变体
  const isVariantModel = /mesh44(6|7|8|9)_(1|2)\.gltf$/i.test(modelPath || '');
  const isMesh448Model =
    modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // ---- 自动居中（多帧）需要的数据 ----
  const autoFitRef = useRef<{
    root: THREE.Object3D | null;
    framesLeft: number;
    keepDir: THREE.Vector3 | null;
  }>({ root: null, framesLeft: 0, keepDir: null });

  // 切换模型前记录当前方向/距离
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    lastDirRef.current = new THREE.Vector3()
      .subVectors(cam.position, target)
      .normalize();
    lastDistRef.current = cam.position.distanceTo(target);
  }, [modelPath]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景
      },
    }),
    []
  );

  // 取到 GLTF 真正的根（直接挂在 Scene 下）
  const getModelRoot = (obj: THREE.Object3D): THREE.Object3D => {
    let root: THREE.Object3D = obj;
    while (root.parent && root.parent.type !== 'Scene') root = root.parent;
    return root;
  };

  // 用包围球进行“框选到视口”
  const frameObjectToView = (
    cam: THREE.PerspectiveCamera,
    controls: any,
    object3D: THREE.Object3D,
    keepDirection: THREE.Vector3 | null,
    padding: number
  ) => {
    const box = new THREE.Box3().setFromObject(object3D);
    if (box.isEmpty()) return;

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    const center = sphere.center.clone();
    const radius = Math.max(sphere.radius, 0.001);

    const dir =
      keepDirection && keepDirection.length() > 0
        ? keepDirection.clone().normalize()
        : new THREE.Vector3(1, 1, 1).normalize();

    const fov = (cam.fov * Math.PI) / 180;
    const distance = (radius / Math.sin(fov / 2)) / padding;

    cam.position.copy(center.clone().add(dir.multiplyScalar(distance)));
    controls.target.copy(center);
    cam.near = Math.max(distance * 0.001, 0.01);
    cam.far = distance * 10;
    cam.updateProjectionMatrix();
    controls.update();
  };

  // 🔁 关键：在前 20 帧每帧都强制居中一次，彻底避免“被其他更新顶回去”
  useFrame(() => {
    const controls = controlsRef.current;
    const { root, framesLeft, keepDir } = autoFitRef.current;
    if (!controls || !root || framesLeft <= 0) return;

    const cam = controls.object as THREE.PerspectiveCamera;
    frameObjectToView(cam, controls, root, keepDir, 0.92);
    autoFitRef.current.framesLeft -= 1;
  });

  return (
    <div className={className}>
      {/* 用 modelPath 作为 key 可以在切换文件时彻底重建 Canvas/Controls（更稳） */}
      <Canvas key={modelPath} {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            // 只对“非变体的 448”保留二次拉近
            if (!isVariantModel && isMesh448Model && mesh) {
              setSelectedMeshForCamera(mesh);
            }
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;
            if (!controls || !mainMesh) return;

            const cam = controls.object as THREE.PerspectiveCamera;
            const target = controls.target as THREE.Vector3;
            const root = getModelRoot(mainMesh);

            if (isVariantModel) {
              // 变体：忽略之前方向，强制使用固定方向；并在接下来的 20 帧持续校正
              autoFitRef.current.root = root;
              autoFitRef.current.keepDir = null; // 固定默认方向
              autoFitRef.current.framesLeft = 20; // 可按需调大/调小

              // 初次也做一次，避免用户看到闪动
              frameObjectToView(cam, controls, root, null, 0.92);
            } else {
              // 非变体：保持上一次用户朝向，并在几帧内微调以稳定（少一些帧）
              const keepDir =
                lastDirRef.current ??
                new THREE.Vector3().subVectors(cam.position, target).normalize();

              autoFitRef.current.root = root;
              autoFitRef.current.keepDir = keepDir;
              autoFitRef.current.framesLeft = 8;

              frameObjectToView(cam, controls, root, keepDir, 0.92);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 非变体的 448 允许二次拉近（保留旧逻辑） */}
        {!isVariantModel && isMesh448Model && (
          <CameraZoomController selectedMesh={selectedMeshForCamera} />
        )}

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;


