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

/** 用包围球把相机“框选”到物体（稳健，不受模型长宽高比例影响） */
function fitCameraToObject(opts: {
  camera: THREE.PerspectiveCamera;
  controls: any;              // OrbitControls
  object: THREE.Object3D;     // GLTF 根节点
  keepDir?: THREE.Vector3;    // 保留切换前的观察方向（可选）
  padding?: number;           // 画面留白比例（1 = 刚好贴合）
}) {
  const { camera, controls, object, keepDir, padding = 1.0 } = opts;

  // 1) 计算世界坐标下的包围盒/包围球
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(object);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const center = sphere.center.clone();
  const radius = Math.max(sphere.radius, 1e-6); // 防 0

  // 2) 以包围球半径推算需要的距离：distance = radius / tan(fov/2)
  const halfFovRad = THREE.MathUtils.degToRad(camera.fov * 0.5);
  let distance = (radius / Math.tan(halfFovRad)) * padding;

  // 3) 夹紧“不过近”的最小距离，避免透视夸张（446/447 的关键）
  const minDistance = radius * 2.0; // 可按需调为 2.5 或 3.0
  distance = Math.max(distance, minDistance);

  // 4) 方向：保留切换前的视角方向；没有就用一个等角方向
  const dir = (keepDir && keepDir.length() > 0
    ? keepDir.clone().normalize()
    : new THREE.Vector3(1, 0.8, 1).normalize());

  // 5) 设置相机位置与目标点
  controls.target.copy(center);
  camera.position.copy(center.clone().add(dir.multiplyScalar(distance)));

  // 6) 调整 near/far，避免裁剪
  camera.near = Math.min(distance * 0.01, radius * 0.1);
  camera.far  = Math.max(distance * 10,  radius * 4);
  camera.updateProjectionMatrix();
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

  // OrbitControls 引用（用于读取/写入相机与 target）
  const controlsRef = useRef<any>(null);

  // 是否是 448 的两个变体（旧逻辑可留用，不影响新算法）
  const isMesh448Model =
    modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 切到 448 变体时短暂自动居中动画（保留你原来的行为）
  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Model]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景
      }
    }),
    []
  );

  useEffect(() => {
    // 方便观察：加载何种模型
    // console.log('[ThreeScene] modelPath:', modelPath);
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
          onModelLoaded={(root) => {
            const controls = controlsRef.current;
            if (!controls || !root) return;

            const cam = controls.object as THREE.PerspectiveCamera;
            const target = controls.target as THREE.Vector3;

            // 取当前相机到 target 的方向，用于保持切换前视角方向
            const keepDir = new THREE.Vector3()
              .subVectors(cam.position, target)
              .normalize();

            // 用包围球稳健框选到视口（所有 446/447/448/449 变体通用）
            fitCameraToObject({
              camera: cam,
              controls,
              object: root,     // 一定传 GLTF 根节点
              keepDir,
              padding: 1.0      // 可微调：0.9~1.2
            });

            // 保留你原来的 448 自动居中缩放逻辑
            if (isMesh448Model && root && autoCenter) {
              setSelectedMeshForCamera(root as unknown as THREE.Mesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 仅 448 保留你的 zoom 动画（不影响其它） */}
        {isMesh448Model && (
          <CameraZoomController selectedMesh={selectedMeshForCamera} />
        )}

        {/* OrbitControls（务必保留 ref） */}
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

