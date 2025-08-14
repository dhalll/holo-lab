
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
  /** ✅ 新增：用于在切到变体时保持初始角度，同时自适应新模型大小 */
  cameraSettings?: { position: [number, number, number]; target: [number, number, number] } | null;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = "",
  onBuildingClick,
  modelPath = "/lovable-uploads/scene(2).gltf",
  isolatedMeshId = null,
  selectableMeshes = [],
  cameraSettings = null
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);
  const [autoCenter, setAutoCenter] = useState(false);

  // OrbitControls / Camera 引用
  const controlsRef = useRef<any>(null);
  const loadedMainMeshRef = useRef<THREE.Object3D | null>(null);

  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

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

  // ✅ 当 cameraSettings 或 模型加载完成 时：用初始方向 + 适配距离 来对准新模型中心
  useEffect(() => {
    const controls = controlsRef.current;
    const main = loadedMainMeshRef.current;
    if (!controls || !main || !cameraSettings) return;

    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    // 新模型包围盒中心与半径
    const box = new THREE.Box3().setFromObject(main);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const radius = size.length() / 2;

    // 根据相机 fov 计算合适距离（留一点边距）
    const fov = (cam.fov * Math.PI) / 180;
    const fitDist = radius / Math.sin(fov / 2) * 1.2; // 1.2 = padding

    // 用 cameraSettings 提供的方向（position->target）
    const csPos = new THREE.Vector3(...cameraSettings.position);
    const csTar = new THREE.Vector3(...cameraSettings.target);
    const dir = new THREE.Vector3().subVectors(csPos, csTar).normalize();

    target.copy(center);
    cam.position.copy(center.clone().add(dir.multiplyScalar(fitDist)));

    cam.updateProjectionMatrix();
    controls.update();
  }, [cameraSettings]);

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
            // 记录主模型，供上面 cameraSettings 的自适应逻辑使用
            loadedMainMeshRef.current = mainMesh || null;

            // 保留原有 mesh448 自动居中缩放逻辑
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 保留你的 Zoom 控制器 */}
        {isMesh448Model && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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




