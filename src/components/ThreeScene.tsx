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

  // === 保持视角用 ===
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // ✅ 新增：记录“初始 mesh_448（灰城）”时的基准视角（中心/方向/距离）
  const baseTargetRef = useRef<THREE.Vector3 | null>(null);
  const baseDirRef = useRef<THREE.Vector3 | null>(null);
  const baseDistRef = useRef<number | null>(null);

  // 当前是否加载的是 448 的“变体”模型
  const isMesh448Variant = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 变体刚加载时稍微拉远一点（让画面更完整）
  const VARIANT_ZOOM_SCALE = 1.18;

  // 只有在切换到 448 变体时，临时触发一次自动居中（两秒后关闭）
  useEffect(() => {
    if (isMesh448Variant) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Variant]);

  // Canvas 配置
  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.setClearColor(0x000000, 0); // 透明背景
    }
  }), []);

  // 记录切换前的相机方向/距离（用于普通切换的回退逻辑）
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

            // === A) 在“初始灰城模式 + 选中 mesh_448”时，记录基准视角 ===
            if (!isMesh448Variant && isolatedMeshId === 'mesh_448' && controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              // 用 mesh_448 的包围盒中心作为基准 target
              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);

              // 记录当前视角（方向/距离 + 目标）
              baseTargetRef.current = center.clone();
              baseDirRef.current = new THREE.Vector3().subVectors(cam.position, target).normalize();
              baseDistRef.current = cam.position.distanceTo(target);

              // 可顺带把 target 对齐到 mesh_448 中心（避免之前 target 偏移）
              target.copy(center);
              controls.update();
            }

            // === B) 切到 448 变体时，强行用“基准视角”来摆放相机 ===
            if (isMesh448Variant && controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              if (baseTargetRef.current && baseDirRef.current && baseDistRef.current != null) {
                const dist = baseDistRef.current * VARIANT_ZOOM_SCALE;
                target.copy(baseTargetRef.current);
                cam.position.copy(
                  baseTargetRef.current.clone().add(
                    baseDirRef.current.clone().multiplyScalar(dist)
                  )
                );
                cam.updateProjectionMatrix();
                controls.update();
              } else {
                // 兜底：如果没有基准（用户直接进来就是 448 变体），
                // 则用“上一视角”+ 新模型中心来放置，尽量稳妥。
                const box = new THREE.Box3().setFromObject(mainMesh);
                const center = new THREE.Vector3();
                box.getCenter(center);
                const dir = (lastDirRef.current ?? new THREE.Vector3(1,1,1).normalize()).clone();
                const dist = (lastDistRef.current ?? 8) * VARIANT_ZOOM_SCALE;
                target.copy(center);
                cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));
                cam.updateProjectionMatrix();
                controls.update();
              }

              // 不触发变体的自动缩放/贴近（避免“钻进管子里”）
              if (autoCenter) {
                setSelectedMeshForCamera(null);
              }
            }

            // === C) 维持你之前的 mesh448 自动居中逻辑（非变体时可用）===
            if (!isMesh448Variant && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 变体时关闭 ZoomController，避免它覆盖我们设好的基准视角 */}
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
