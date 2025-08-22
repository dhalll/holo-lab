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

const DEFAULT_VIEW_DIR = new THREE.Vector3(-1.2, 0.9, 1.4).normalize(); // 第一次没有历史角时用的默认斜俯视方向
const FIT_PADDING = 1.12; // 画面内留白(越大越小) —— 只针对进入 Customize 的基础场景

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = "",
  onBuildingClick,
  modelPath = "/lovable-uploads/scene(2).gltf",
  isolatedMeshId = null,
  selectableMeshes = []
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);

  // OrbitControls & 历史视角
  const controlsRef = useRef<any>(null);
  const lastDirRef   = useRef<THREE.Vector3 | null>(null);
  const lastDistRef  = useRef<number | null>(null);

  // 是否是你上传的“变体”模型（本需求暂时不处理变体的自动居中）
  const isVariantModel =
    /mesh44(6|7|8|9)_(1|2)\.gltf$/i.test(modelPath) ||
    modelPath.includes('mesh446_') ||
    modelPath.includes('mesh447_') ||
    modelPath.includes('mesh448_') ||
    modelPath.includes('mesh449_');

  // 进入/切换模型前先记录当前相机方向 & 距离，便于过渡
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

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 60 }, // 稍小的 FOV 更建筑
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      }
    }),
    []
  );

  /**
   * 把 object “框选到视口”
   * - 计算包围盒中心与尺寸
   * - 用相机 FOV 严格算一个合适的观察距离
   * - 维持既有观察方向（没有则用默认方向）
   */
  function frameObjectToView(
    obj: THREE.Object3D,
    controls: any,
    padding = FIT_PADDING
  ) {
    if (!obj || !controls) return;

    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    // 1) 包围盒
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 2) 基于 FOV 的距离（保证无论画布比例如何，都能完整显示）
    const maxSize = Math.max(size.x, size.y, size.z);
    const fov = (cam.fov * Math.PI) / 180;
    const halfFovV = fov / 2;
    const halfFovH = Math.atan(Math.tan(halfFovV) * cam.aspect);

    // 取最紧方向的距离
    const distV = (maxSize * padding) / Math.sin(halfFovV); // 近似：让对角/最大边都能放下
    const distH = (maxSize * padding) / Math.sin(halfFovH);
    const dist = Math.max(distV, distH);

    // 3) 方向：优先沿用上一次的观察方向；没有则用默认
    const dir = (lastDirRef.current ?? DEFAULT_VIEW_DIR).clone();

    // 4) 写入相机与 target
    target.copy(center);
    cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));

    cam.near = Math.max(0.01, dist * 0.01);
    cam.far = dist * 100;
    cam.updateProjectionMatrix();
    controls.update();
  }

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(rootScene) => {
            const controls = controlsRef.current;
            if (!controls || !rootScene) return;

            // ========= 只在“基础场景 + 指定了 isolatedMeshId”时，居中选中建筑 =========
            const isBaseScene =
              !isVariantModel && (modelPath.includes('scene(') || modelPath.includes('scene'));

            if (isBaseScene && isolatedMeshId) {
              // 在整棵树里找该建筑
              const picked =
                rootScene.getObjectByName(isolatedMeshId) ?? rootScene;

              frameObjectToView(picked, controls, FIT_PADDING);
              return;
            }

            // ========= 其他情况（比如没传 isolatedMeshId / 变体）保守策略：对整棵 root 居中一次 =========
            frameObjectToView(rootScene, controls, 1.15);
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 这里原本只给 448 用的缩放/过渡可继续保留；不影响“进入页面的居中” */}
        <CameraZoomController selectedMesh={selectedMeshForCamera} />

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
