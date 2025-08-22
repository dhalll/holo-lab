import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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

  // 统一识别 446/447/448/449 的 _1/_2 变体
  const isVariantModel = /mesh44(6|7|8|9)_(1|2)\.gltf$/i.test(modelPath || '');
  const isMesh448Model =
    modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 进入新 modelPath 前，记录当前视角（给“非变体”保留方向）
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
      camera: {
        position: [5, 5, 5] as [number, number, number],
        fov: 75,
      },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    []
  );

  // 拿到 GLTF “根”（避免只对某个子 mesh 算包围盒）
  const getModelRoot = (obj: THREE.Object3D): THREE.Object3D => {
    let root: THREE.Object3D = obj;
    while (root.parent && root.parent.type !== 'Scene') root = root.parent;
    return root;
  };

  // 更稳的“框选到视口”——用 boundingSphere
  const frameObjectToView = (
    cam: THREE.PerspectiveCamera,
    controls: any,
    object3D: THREE.Object3D,
    keepDirection: THREE.Vector3 | null,
    padding: number // 0.9 ~ 0.95
  ) => {
    const box = new THREE.Box3().setFromObject(object3D);
    if (box.isEmpty()) return;

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const center = sphere.center.clone();
    const radius = sphere.radius;

    // 方向：若 keepDirection 为空（变体），用一个稳定的俯视等角方向
    const dir =
      keepDirection && keepDirection.length() > 0
        ? keepDirection.clone().normalize()
        : new THREE.Vector3(1, 1, 1).normalize();

    // 距离估算：考虑到 FOV，仅按垂直方向计算足够
    const fov = (cam.fov * Math.PI) / 180;
    const distance = (radius / Math.sin(fov / 2)) / padding;

    cam.position.copy(center.clone().add(dir.multiplyScalar(distance)));
    controls.target.copy(center);

    // 适当扩展裁剪面，避免超大/超远被裁掉
    cam.near = Math.max(distance * 0.001, 0.01);
    cam.far = distance * 10;
    cam.updateProjectionMatrix();
    controls.update();
  };

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
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

            // 变体：忽略旧方向，强制使用固定方向，保证每次都在画面中心
            if (isVariantModel) {
              frameObjectToView(
                cam,
                controls,
                root,
                null, // 不保留旧方向
                0.92  // 大小合适
              );
              // 固定后把这个方向记下来，后续手动交互再切也不会跳
              lastDirRef.current = new THREE.Vector3()
                .subVectors(cam.position, target)
                .normalize();
              lastDistRef.current = cam.position.distanceTo(target);
            } else {
              // 非变体：沿用旧方向，视觉更连贯
              const keepDir =
                lastDirRef.current ??
                new THREE.Vector3().subVectors(cam.position, target).normalize();
              frameObjectToView(cam, controls, root, keepDir, 0.92);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 仅“非变体的 448”允许二次拉近 */}
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

