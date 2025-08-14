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

  // OrbitControls & “上一视角”记录
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);   // 相机到 target 的单位方向
  const lastDistRef = useRef<number | null>(null);         // 距离（用于非变体时回落）
  const FIT_PADDING = 1.25;                                // 适配留白（可按需要微调）

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
      camera: { position: [5, 5, 5] as [number, number, number], fov: 50 },
      onCreated: ({ gl, camera }: { gl: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera }) => {
        gl.setClearColor(0x000000, 0);
        // 更稳妥的近远裁剪
        camera.near = 0.01;
        camera.far = 5000;
        camera.updateProjectionMatrix();
      },
    }),
    []
  );

  /**
   * 在切换 modelPath 的瞬间（新模型还没载入），
   * 记录当前相机 -> target 的方向与距离，供新模型复用“角度”。
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

  // ————————————————— 渲染 —————————————————
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
          onModelLoaded={(mainObject) => {
            const controls = controlsRef.current;
            if (!controls || !mainObject) return;

            const cam = controls.object as THREE.PerspectiveCamera;
            const target = controls.target as THREE.Vector3;

            // 1) 取得新模型的包围盒/包围球中心与大小
            const box = new THREE.Box3().setFromObject(mainObject);
            const center = new THREE.Vector3();
            box.getCenter(center);

            const sphere = new THREE.Sphere();
            box.getBoundingSphere(sphere);
            const radius = sphere.radius || box.getSize(new THREE.Vector3()).length() * 0.5;

            // 2) 复用“上一视角的方向”
            const currentDir =
              lastDirRef.current ??
              new THREE.Vector3().subVectors(cam.position, target).normalize();

            // 3) 计算能完整装入视锥的合适距离（垂直/水平取最大）
            const fov = (cam.fov * Math.PI) / 180;
            const fitHeightDistance = (radius / Math.sin(fov / 2)) * FIT_PADDING;
            const fitWidthDistance = fitHeightDistance / (cam.aspect || 1);
            const fitDistance = Math.max(fitHeightDistance, fitWidthDistance);

            // 4) 更新 near/far，防止裁剪，同时设置 target & position
            cam.near = Math.max(0.01, fitDistance * 0.01);
            cam.far = Math.max(2000, fitDistance * 10);
            target.copy(center);
            cam.position.copy(center.clone().add(currentDir.clone().multiplyScalar(fitDistance)));

            cam.updateProjectionMatrix();
            controls.update();

            // 保留你原来 mesh448 的自动居中缩放逻辑（用于 ZoomController）
            if (isMesh448Model && autoCenter) setSelectedMeshForCamera(mainObject as unknown as THREE.Mesh);
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 仅在 mesh448 变体时启用（你原来的逻辑保留） */}
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

