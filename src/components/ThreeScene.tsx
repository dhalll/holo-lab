
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

  // ✅ 新增：保存当前相机视角（方向 + 距离）以及 OrbitControls 引用
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 检测 mesh448 变体
  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // mesh448 初始自动居中（保留你的原逻辑）
  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Model]);

  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.setClearColor(0x000000, 0); // 透明背景
    }
  }), []);

  // ✅ 新增：在模型路径即将切换时，记录当前视角（相机位置相对 target 的方向与距离）
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    const dir = new THREE.Vector3().subVectors(cam.position, target).normalize();
    const dist = cam.position.distanceTo(target);

    lastDirRef.current = dir;
    lastDistRef.current = dist;
  }, [modelPath]); // 当 modelPath 改变时记录旧视角

  // 调试日志
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
            if (isMesh448Model && mesh) {
              setSelectedMeshForCamera(mesh);
            }
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // ✅ 关键：新模型加载完成后，用之前的角度和距离对准“新模型中心”
            const controls = controlsRef.current;
            if (controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              // 新模型中心
              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);

              // 之前的方向与距离（不存在时，用当前）
              const dir = (lastDirRef.current ?? new THREE.Vector3().subVectors(cam.position, target).normalize()).clone();
              const dist = lastDistRef.current ?? cam.position.distanceTo(target);

              // 设置新视角：保持方向与距离不变，target 切到新模型中心
              target.copy(center);
              cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));

              cam.updateProjectionMatrix();
              controls.update();
            }

            // 保留你原来的 mesh448 初次自动居中（与上面的对齐逻辑不冲突）
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 若是 mesh448 变体，保留你的自动居中缩放辅助 */}
        {isMesh448Model && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

        {/* ✅ 给 OrbitControls 一个 ref，便于读取/设置相机与 target */}
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
