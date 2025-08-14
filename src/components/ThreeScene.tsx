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

  // OrbitControls 与视角记录
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  const isMesh448Model =
    modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

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

  // 切换模型前记录观察方向与距离
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
            // —— 相机对准新模型 —— //
            const controls = controlsRef.current;
            if (controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              // 包围盒中心与尺寸
              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);
              const size = new THREE.Vector3();
              box.getSize(size);

              // 计算需要的观察距离：同时考虑横向与纵向 FOV，取较大值
              const vFOV = (cam.fov * Math.PI) / 180; // 垂直FOV
              const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * cam.aspect); // 水平FOV

              const fitHeightDistance = (size.y * 0.5) / Math.tan(vFOV / 2);
              const fitWidthDistance = (size.x * 0.5) / Math.tan(hFOV / 2);

              // padding > 1 拉远；< 1 拉近。你可微调 1.4 ~ 1.8
              const padding = 1.8;
              const fitDist = Math.max(fitHeightDistance, fitWidthDistance) * padding;

              // 维持切换前的观察方向（找不到则用当前方向）
              const currentDir = new THREE.Vector3()
                .subVectors(cam.position, target)
                .normalize();
              const dir = (lastDirRef.current ?? currentDir).clone();

              // 设置 target 与相机位置
              target.copy(center);
              cam.position.copy(center.clone().add(dir.multiplyScalar(fitDist)));

              // 稳定 near/far，避免裁剪过近
              cam.near = Math.max(0.1, fitDist / 1000);
              cam.far = fitDist * 1000;

              cam.updateProjectionMatrix();
              controls.update();
            }

            // 保留原自动居中缩放逻辑
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {isMesh448Model && (
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

