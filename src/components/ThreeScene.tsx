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
  className = "", 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene(2).gltf",
  isolatedMeshId = null,
  selectableMeshes = []
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);
  const [autoCenter, setAutoCenter] = useState(false);

  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  const baseTargetRef = useRef<THREE.Vector3 | null>(null);
  const baseDirRef = useRef<THREE.Vector3 | null>(null);
  const baseDistRef = useRef<number | null>(null);

  const isMesh448Variant = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 进入 448 变体时，短暂允许自动居中（我们会手动放置相机，随后关闭）
  useEffect(() => {
    if (isMesh448Variant) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Variant]);

  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.setClearColor(0x000000, 0);
    }
  }), []);

  // 记录切换前的方向/距离（无基准时兜底）
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

  useEffect(() => {
    console.log('ThreeScene mounted with modelPath:', modelPath);
  }, [modelPath]);

  // === 帮助函数：把对象“框选”到视窗，给定朝向方向 dir，自动计算合适距离 ===
  const frameObjectToView = (
    cam: THREE.PerspectiveCamera,
    controls: any,
    object: THREE.Object3D,
    dir: THREE.Vector3,
    fit = 1.15,        // 越大看得越远
  ) => {
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // 用包围球半径拟合到相机竖向 FOV
    const radius = size.length() / 2;
    const vFov = THREE.MathUtils.degToRad(cam.fov);
    // 距离：让整个球刚好落入视口，再乘以 fit
    const dist = (radius / Math.sin(vFov / 2)) * fit;

    // 适当的 near/far，避免裁剪
    cam.near = Math.max(0.1, dist / 100);
    cam.far = Math.max(cam.far, dist * 50);
    cam.updateProjectionMatrix();

    controls.target.copy(center);
    cam.position.copy(center.clone().add(dir.normalize().multiplyScalar(dist)));
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
            if (isMesh448Variant && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;

            // 记录基础视角：初始场景中，用户选择 mesh_448 时
            if (!isMesh448Variant && isolatedMeshId === 'mesh_448' && controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);

              baseTargetRef.current = center.clone();
              baseDirRef.current = new THREE.Vector3().subVectors(cam.position, target).normalize();
              baseDistRef.current = cam.position.distanceTo(target);

              // 保证 target 就在中心
              target.copy(center);
              controls.update();
            }

            // === 关键：加载 448 变体时，基于包围球自动“框选到视口” ===
            if (isMesh448Variant && controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;

              // 优先用“初始 mesh_448 的方向”，否则用上一视角方向，再否则用一个稳定兜底方向
              const dir =
                (baseDirRef.current && baseDirRef.current.clone()) ||
                (lastDirRef.current && lastDirRef.current.clone()) ||
                new THREE.Vector3(-1, 0.65, 1).normalize(); // 兜底：与初始橙色视角相近

              // 使用通用“框选”算法；fit 取 1.15 ~ 1.2 之间即可
              frameObjectToView(cam, controls, mainMesh, dir, 1.18);

              // 变体时不再用缩放控制器，避免再次推进
              if (autoCenter) setSelectedMeshForCamera(null);
            }

            // 保留你原本的自动居中逻辑（只针对非变体）
            if (!isMesh448Variant && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 变体时关闭缩放控制器，避免“贴脸” */}
        {!isMesh448Variant && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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
