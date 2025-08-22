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

  // ---- 保存当前相机视角（方向 + 距离）与 OrbitControls 引用 ----
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // ✅ 统一判断 446/447/448/449 的 _1/_2 变体
  const isVariantModel = /mesh44(6|7|8|9)_(1|2)\.gltf$/i.test(modelPath || "");

  // 旧逻辑中用到的 448 判断，这里保留但不再用于缩放控制
  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 对变体在加载窗口时短暂打开 autoCenter（不触发二次拉近）
  useEffect(() => {
    if (isVariantModel) {
      setAutoCenter(true);
      const t = setTimeout(() => setAutoCenter(false), 1200);
      return () => clearTimeout(t);
    }
  }, [modelPath, isVariantModel]);

  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.setClearColor(0x000000, 0); // 透明背景
    }
  }), []);

  // 记录切换前的视角（相机位置相对 target 的方向和距离）
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

  // 取整棵GLTF根节点，避免只用到某个子mesh导致测量偏差
  const getModelRoot = (obj: THREE.Object3D): THREE.Object3D => {
    let root: THREE.Object3D = obj;
    while (root.parent && root.parent.type !== 'Scene') {
      root = root.parent;
    }
    return root;
  };

  // 自适应把对象“框选到视口”
  const frameObjectToView = (
    cam: THREE.PerspectiveCamera,
    controls: any,
    object3D: THREE.Object3D,
    keepDirection?: THREE.Vector3 | null,
    paddingScale: number = 0.9
  ) => {
    const box = new THREE.Box3().setFromObject(object3D);
    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxSize = Math.max(size.x, size.y, size.z);
      const fov = (cam.fov * Math.PI) / 180;
      // 距离 = 物体半径 / tan(FOV/2) / padding
      const distance = (maxSize / 2) / Math.tan(fov / 2) / paddingScale;

      // 方向：优先使用切换前的视角方向
      const dir = (keepDirection && keepDirection.length() > 0
        ? keepDirection.clone()
        : new THREE.Vector3(1, 1, 1).normalize());

      const newPos = center.clone().add(dir.multiplyScalar(distance));
      cam.position.copy(newPos);
      controls.target.copy(center);
      cam.updateProjectionMatrix();
      controls.update();
    }
  };

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            // 变体不再触发 CameraZoomController 的二次拉近
            if (!isVariantModel && isMesh448Model && mesh) {
              setSelectedMeshForCamera(mesh);
            }
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;
            if (controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              // 用整棵 GLTF 的根来计算包围盒
              const rootObject = getModelRoot(mainMesh);

              // 之前记录的方向、距离
              const keepDir =
                lastDirRef.current ??
                new THREE.Vector3().subVectors(cam.position, target).normalize();

              // ✅ 统一使用 0.9 的 padding，让模型大小合适且居中
              frameObjectToView(cam, controls, rootObject, keepDir, 0.9);
            }

            // 旧的 448 自动居中逻辑保留，但对“变体”禁用 CameraZoom（二次拉近）
            if (!isVariantModel && isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* ❗ 关键：对 446/447/448/449 的 _1/_2 变体禁用二次拉近 */}
        {!isVariantModel && isMesh448Model && (
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


