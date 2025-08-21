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

const VARIANT_REGEX = /mesh44[6-9]_[12]\.gltf$/i;

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  onBuildingClick,
  modelPath = '/lovable-uploads/scene(2).gltf',
  isolatedMeshId = null,
  selectableMeshes = [],
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);

  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  const isVariant = VARIANT_REGEX.test(modelPath);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 60 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    []
  );

  /**
   * 记录切换前的视角方向 & 距离（用于切换到变体后沿相同方向“框选”）
   */
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

  /**
   * 将相机按“包围盒”框选到对象，且尽量沿原有视角方向
   */
  const fitCameraToObject = (
    cam: THREE.PerspectiveCamera,
    controls: any,
    object: THREE.Object3D,
    padding = 1.12 // 越大越留白；你之前说 0.9 合适，这里给轻微留白，自己可微调
  ) => {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 相机裁剪面，避免大模型近裁剪
    const maxSize = Math.max(size.x, size.y, size.z);
    cam.near = Math.max(0.01, maxSize / 500);
    cam.far = maxSize * 50;

    // 根据 fov & 画幅比例计算需要的距离
    const fov = (cam.fov * Math.PI) / 180;
    const aspect = cam.aspect || 1;

    // 让宽高都能被包含
    const fitHeightDistance = (size.y / 2) / Math.tan(fov / 2);
    const halfFovHorizontal = Math.atan(Math.tan(fov / 2) * aspect);
    const fitWidthDistance = (size.x / 2) / Math.tan(halfFovHorizontal);

    // 再考虑深度（Z 尺寸），给一点冗余
    const distance = padding * Math.max(fitHeightDistance, fitWidthDistance, size.z);

    // 视角方向：优先沿切换前的方向；没有就用一个舒服的默认方向
    const dir =
      lastDirRef.current?.clone().normalize() ??
      new THREE.Vector3(-1, 1.1, 1).normalize();

    // 设置 target & position
    controls.target.copy(center);
    cam.position.copy(center.clone().add(dir.multiplyScalar(distance)));

    cam.updateProjectionMatrix();
    controls.update();
  };

  useEffect(() => {
    // 初次挂载或路径变化，仅用于调试可留
    // console.log('ThreeScene mounted with modelPath:', modelPath);
  }, [modelPath]);

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            if (isVariant && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;
            if (!controls || !mainMesh) return;

            const cam = controls.object as THREE.PerspectiveCamera;

            // ★★ 核心：不管是 scene(2) 还是变体，拿“root”做包围盒并框选到视口
            let root: THREE.Object3D = mainMesh;
            while (root.parent) root = root.parent;

            fitCameraToObject(cam, controls, root, 1.12);

            // 记录新的距离（供下次切换时沿同一方向）
            const dist = cam.position.distanceTo(controls.target);
            lastDistRef.current = dist;
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 可保留你之前的轻微自动缩放动画，如果不需要可以移除 */}
        {isVariant && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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
