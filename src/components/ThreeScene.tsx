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

const paddingScale = 0.9; // ✅ 统一缩放：模型更大更贴近（你确认0.9“刚好”）

// 取整棵GLTF根节点，避免只用到某个子mesh导致测量偏差
function getModelRoot(obj: THREE.Object3D): THREE.Object3D {
  let root = obj;
  while (root.parent && root.parent.type !== 'Scene') {
    root = root.parent;
  }
  return root;
}

// 将对象“框选到视口”：方向保持、尺寸合适、居中显示
function frameObjectToView(
  camera: THREE.PerspectiveCamera,
  controls: any,
  object: THREE.Object3D,
  direction: THREE.Vector3,
  pad: number
) {
  const box = new THREE.Box3().setFromObject(object);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const center = sphere.center.clone();
  const radius = Math.max(sphere.radius, 0.001);

  const fov = (camera.fov * Math.PI) / 180;
  // 距离 = 半径 / sin(fov/2) * 系数；pad < 1 更近（更大），>1 更远（更小）
  const distance = (radius / Math.sin(fov / 2)) * 1.15 * pad;

  const target = controls.target as THREE.Vector3;
  target.copy(center);

  const dir = direction.clone().normalize();
  camera.position.copy(center.clone().add(dir.multiplyScalar(distance)));

  camera.near = Math.max(0.01, distance - radius * 2);
  camera.far = Math.max(camera.far, distance + radius * 4);
  camera.updateProjectionMatrix();

  controls.update();
}

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

  // ✅ 识别 446/447/448/449 的全部“变体”模型
  const isVariantModel = useMemo(() => {
    const p = modelPath.toLowerCase();
    return (
      p.includes('mesh446_1') || p.includes('mesh446_2') ||
      p.includes('mesh447_1') || p.includes('mesh447_2') ||
      p.includes('mesh448_1') || p.includes('mesh448_2') ||
      p.includes('mesh449_1') || p.includes('mesh449_2')
    );
  }, [modelPath]);

  // 记录切换前的观察方向（从target指向相机）
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;
    lastDirRef.current = new THREE.Vector3().subVectors(cam.position, target).normalize();
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

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            if (isVariantModel && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;
            if (!controls || !mainMesh) return;

            // 👉 对 446/447/448/449 的 _1/_2 统一执行“居中 + 尺寸适配”
            if (isVariantModel) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const rootObject = getModelRoot(mainMesh);

              const direction =
                (lastDirRef.current && lastDirRef.current.clone()) ||
                new THREE.Vector3(-1, 0.65, 1); // 兜底方向，接近你之前的视角

              frameObjectToView(cam, controls, rootObject, direction, paddingScale);

              // 供 CameraZoomController 使用（如不需要可去掉）
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* ✅ 对所有变体启用（如果你不需要这个行为，可删除这一行） */}
        {isVariantModel && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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
