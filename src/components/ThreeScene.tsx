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

const VARIANT_REGEX = /mesh44(6|7|8|9)_(1|2)\.gltf$/i;
// 统一的视图“留白”系数；你确认 0.9 正好，这里默认 0.9
const FIT_PADDING = 0.9;

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  onBuildingClick,
  modelPath = '/lovable-uploads/scene(2).gltf',
  isolatedMeshId = null,
  selectableMeshes = [],
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);

  // OrbitControls & 记录切换前的视角（方向 + 距离）
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 是否是 446/447/448/449 的任一变体
  const isAnyVariant = useMemo(
    () => VARIANT_REGEX.test(modelPath ?? ''),
    [modelPath]
  );

  // 画布配置
  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    []
  );

  // 记录“切换前”的相机方向与距离（相对 target）
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

  // 工具：拿到根节点（确保不是落在某个子 Group 上）
  const getSceneRoot = (obj: THREE.Object3D) => {
    let root: THREE.Object3D = obj;
    while (root.parent) root = root.parent;
    return root;
  };

  // 工具：把根节点“框选到视口”，并尽量保持切换前的方向
  const fitRootToView = (root: THREE.Object3D) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    // 用整棵 GLTF（根）计算包围盒
    const box = new THREE.Box3().setFromObject(root);
    if (!isFinite(box.min.x) || !isFinite(box.max.x)) return;

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const radius = Math.max(size.x, size.y, size.z) * 0.5;
    const fov = (cam.fov * Math.PI) / 180;
    // “刚好装下”的距离
    let neededDist = radius / Math.sin(fov / 2);
    // 乘以你指定的留白系数
    neededDist *= FIT_PADDING;

    // 尽量保持切换前的观察方向
    const dir =
      lastDirRef.current?.clone() ??
      new THREE.Vector3(1, 1, 1).normalize();

    target.copy(center);
    cam.position.copy(center.clone().add(dir.multiplyScalar(neededDist)));

    cam.near = Math.max(neededDist * 0.01, 0.1);
    cam.far = neededDist * 1000;
    cam.updateProjectionMatrix();
    controls.update();
  };

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            if (isAnyVariant && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // 统一：只要是 446/447/448/449 的任一变体，加载完成后
            // 就“上溯根节点 + fit 到视口 + 复用旧方向”
            if (isAnyVariant && mainMesh) {
              const root = getSceneRoot(mainMesh);
              fitRootToView(root);
              // 留下以便 CameraZoomController 做一点点过渡动效（如果你仍在用它）
              setSelectedMeshForCamera(root as unknown as THREE.Mesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 仍保留轻微的自动 zoom/过渡（如果不需要，删掉下面这行即可） */}
        {isAnyVariant && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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
