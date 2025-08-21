// src/components/ThreeScene.tsx
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

const SCENE_ZOOM   = 0.90; // 进入 Customize 时，框选主 scene 中的 isolated mesh 的放大系数（越小越近）
const VARIANT_ZOOM = 1.05; // 切到 _1/_2 变体时，框选整棵变体模型的放大系数

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  onBuildingClick,
  modelPath = '/lovable-uploads/scene(2).gltf',
  isolatedMeshId = null,
  selectableMeshes = [],
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);

  // OrbitControls + 最近一次视角（用于变体切换时沿用方向）
  const controlsRef = useRef<any>(null);
  const lastDirRef  = useRef<THREE.Vector3 | null>(null);   // camera->target 的单位方向
  const lastDistRef = useRef<number | null>(null);          // camera 与 target 的距离

  const isVariantModel =
    /mesh4(46|47|48|49)_(1|2)\.gltf$/i.test(modelPath) || /mesh\d+_(1|2)\.gltf$/i.test(modelPath);
  const isSceneModel = /scene/i.test(modelPath);

  // 进入/切换模型前记录当前视角
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    const dir = new THREE.Vector3().subVectors(cam.position, target).normalize();
    const dist = cam.position.distanceTo(target);

    lastDirRef.current = dir;
    lastDistRef.current = dist;
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

  // 根据目标对象（mesh 或整棵 scene）框选并居中
  const frameObject = (
    controls: any,
    obj: THREE.Object3D,
    opts?: { zoom?: number; usePrevDir?: boolean }
  ) => {
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;
    const zoom = opts?.zoom ?? 1.0;

    // 用包围盒/球获取半径与中心
    const box = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const radius = sphere.radius || box.getSize(new THREE.Vector3()).length() * 0.5 || 1;

    // 计算相机距离（根据 FOV 与半径）
    const fov = THREE.MathUtils.degToRad(cam.fov);
    const distance = (radius / Math.sin(fov / 2)) * zoom;

    // 使用之前的观察方向（更平滑），没有则用默认方向
    const dir =
      (opts?.usePrevDir && lastDirRef.current
        ? lastDirRef.current.clone()
        : new THREE.Vector3(1, 1, 1).normalize());

    target.copy(center);
    cam.position.copy(center.clone().add(dir.multiplyScalar(distance)));

    cam.updateProjectionMatrix();
    controls.update();

    // 记录新的方向/距离，便于下次切换继续沿用
    lastDirRef.current = new THREE.Vector3().subVectors(cam.position, target).normalize();
    lastDistRef.current = cam.position.distanceTo(target);
  };

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            if (mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(root: THREE.Object3D) => {
            const controls = controlsRef.current;
            if (!controls || !root) return;

            if (isSceneModel) {
              // ① 主 scene：找到 isolatedMeshId 对应的节点，否则退回整棵 scene
              const focus =
                (isolatedMeshId
                  ? root.getObjectByName(isolatedMeshId as string)
                  : null) || root;
              frameObject(controls, focus, { zoom: SCENE_ZOOM, usePrevDir: true });
            } else if (isVariantModel) {
              // ② 变体 glTF：对整棵变体模型框选，并沿用上次的观察方向
              frameObject(controls, root, { zoom: VARIANT_ZOOM, usePrevDir: true });
            } else {
              // 兜底：任何其他模型都对整棵 root 框选
              frameObject(controls, root, { zoom: 1.0, usePrevDir: true });
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 如果你还有点击放大之类逻辑，保留它 */}
        {isVariantModel && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

        {/* 绑定 OrbitControls 引用 */}
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
