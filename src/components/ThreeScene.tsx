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

const paddingScale = 0.9; // ✅ 与 448 保持一致

// ✅ 统一的取景函数（无需额外文件依赖）
function frameObjectToView(
  camera: THREE.PerspectiveCamera,
  controls: any,
  object: THREE.Object3D,
  direction: THREE.Vector3,
  padding: number
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera.fov * Math.PI) / 180;
  let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));

  cameraZ *= padding;

  const dir = direction.clone().normalize();
  const offset = dir.multiplyScalar(cameraZ);

  camera.position.copy(center.clone().add(offset));
  camera.lookAt(center);
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.update();
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

  // OrbitControls & 相机朝向记录
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);

  // ✅ 识别 446/447/448/449 的变体模型
  const isVariantModel = useMemo(() => {
    const p = modelPath.toLowerCase();
    return (
      p.includes('mesh446_1') || p.includes('mesh446_2') ||
      p.includes('mesh447_1') || p.includes('mesh447_2') ||
      p.includes('mesh448_1') || p.includes('mesh448_2') ||
      p.includes('mesh449_1') || p.includes('mesh449_2')
    );
  }, [modelPath]);

  // mesh448 系的“自动居中缩放”标志仍然保留
  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Model]);

  // 记录切换前相机朝向（从控制器 target 指向相机位置）
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    // 记录切换前的观察方向（尽量保持用户当前视角）
    const dir = new THREE.Vector3().subVectors(cam.position, target).normalize();
    lastDirRef.current = dir;
  }, [modelPath]);

  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.setClearColor(0x000000, 0); // 透明背景
    }
  }), []);

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
            // ✅ 变体模型：统一做“居中 + 取景缩放”，与 448 一致
            const controls = controlsRef.current;
            if (controls && mainMesh && isVariantModel) {
              const cam = controls.object as THREE.PerspectiveCamera;

              // 如果 glTF 把几何包在上一层 Group 中，用父级包围盒更稳妥
              const objectToFrame = mainMesh.parent ?? mainMesh;

              // 优先使用切换前的观察方向；没有则使用默认 [1,1,1]
              const direction = lastDirRef.current ?? new THREE.Vector3(1, 1, 1);

              frameObjectToView(cam, controls, objectToFrame, direction, paddingScale);
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

        {/* 保留你原先的缩放控制（只对 448 开启） */}
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
