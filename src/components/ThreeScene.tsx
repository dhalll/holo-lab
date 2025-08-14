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
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);
  const [autoCenter, setAutoCenter] = useState(false);

  // 记录 OrbitControls / 上一次的观察方向与距离（用于保持角度）
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  const isMesh448Model =
    modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // mesh448 变体初次加载时做一次自动居中（保留你原先的逻辑）
  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      const t = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(t);
    }
  }, [modelPath, isMesh448Model]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景
      },
    }),
    []
  );

  // 在 modelPath 即将切换时，记录当前观察方向与距离（用于保持角度）
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
    // 仅用于调试
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
            if (isMesh448Model && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // ★ 关键：新模型加载完成 → 用同角度 + 以包围盒中心为 target 放置相机，并缩小 padding 让模型更大
            const controls = controlsRef.current;
            if (controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              // 计算包围盒中心与半径
              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);

              const size = new THREE.Vector3();
              box.getSize(size);
              const radius = size.length() / 2;

              // 以 FOV 计算合适的观察距离；padding 调小为 0.8 让模型更大
              const fov = (cam.fov * Math.PI) / 180;
              const fitDist = (radius / Math.sin(fov / 2)) * 1;

              // 保持用户的观察方向（如果没有记录，则用当前方向）
              const currentDir = new THREE.Vector3()
                .subVectors(cam.position, target)
                .normalize();
              const dir = (lastDirRef.current ?? currentDir).clone();

              // 以中心为 target，沿着相同方向、按计算距离放置相机
              target.copy(center);
              cam.position.copy(center.clone().add(dir.multiplyScalar(fitDist)));

              cam.updateProjectionMatrix();
              controls.update();
            }

            // 保留你原来的 mesh448 自动居中缩放逻辑
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 你的缩放/居中控制器（继续保留） */}
        {isMesh448Model && (
          <CameraZoomController selectedMesh={selectedMeshForCamera} />
        )}

        {/* 绑定 OrbitControls ref 以便控制相机 */}
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
