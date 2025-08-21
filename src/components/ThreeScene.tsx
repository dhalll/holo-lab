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

const isVariantPath = (p: string) =>
  /mesh44[6-9]_[12]\.gltf$/i.test(p) || /mesh(446|447|448|449)_[12]\.gltf$/i.test(p);

function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  controls: any,
  object3D: THREE.Object3D,
  opts?: {
    padding?: number;     // >1 更远，<1 更近
    minDistance?: number; // 底线距离
    maxDistance?: number; // 顶线距离
    keepDirection?: THREE.Vector3 | null; // 用这个方向摆放相机（单位向量）
  }
) {
  const padding = opts?.padding ?? 1.0;

  // 用包围盒算中心与尺度
  const box = new THREE.Box3().setFromObject(object3D);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // 取最长边做“需要显示的半径”
  const maxSize = Math.max(size.x, size.y, size.z);
  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
  // 计算能把最长边放进视口的距离
  const distance = (maxSize / (2 * Math.tan(halfFov))) * padding;

  // 方向：优先保持之前方向；没有的话给一个斜上方的默认方向
  const dir =
    opts?.keepDirection?.clone() ??
    new THREE.Vector3(-1.2, 1.0, 1.2).normalize();

  // 设置 target 和相机位置
  controls.target.copy(center);
  camera.position.copy(center.clone().add(dir.multiplyScalar(distance)));

  // 限制 distance（可选）
  if (opts?.minDistance) {
    const d = camera.position.distanceTo(controls.target);
    if (d < opts.minDistance) {
      const corr = opts.minDistance / d;
      const v = camera.position.clone().sub(controls.target).multiplyScalar(corr);
      camera.position.copy(controls.target.clone().add(v));
    }
  }
  if (opts?.maxDistance) {
    const d = camera.position.distanceTo(controls.target);
    if (d > opts.maxDistance) {
      const corr = opts.maxDistance / d;
      const v = camera.position.clone().sub(controls.target).multiplyScalar(corr);
      camera.position.copy(controls.target.clone().add(v));
    }
  }

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

  // OrbitControls 与“上一视角方向、距离”
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    []
  );

  // 每次模型切换前，先记录旧的“相机->target”方向
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;
    const dir = new THREE.Vector3().subVectors(cam.position, target).normalize();
    lastDirRef.current = dir;
  }, [modelPath, isolatedMeshId]);

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            // 可选：点击时把相机渐进 zoom 到该 mesh（保留原有逻辑）
            if (isVariantPath(modelPath) && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(root) => {
            const controls = controlsRef.current;
            if (!controls || !root) return;
            const cam = controls.object as THREE.PerspectiveCamera;

            const variant = isVariantPath(modelPath);

            // 1) 如果在 Customize 页面：scene(2).gltf + isolatedMeshId
            //    -> 只对准被隔离的那一个 mesh（避免把整座城市装进视口）
            // 2) 如果是变体 gltf（meshXXX_1/2.gltf）
            //    -> 用整个 glTF 根结点作为目标，并尽量保持之前的观察方向
            let focus: THREE.Object3D = root;

            if (!variant && isolatedMeshId) {
              // 找到那一个被隔离的 mesh（按 name）
              const byName = root.getObjectByName(isolatedMeshId);
              focus = byName ?? root;
            }

            // padding：
            //  - 变体时稍微靠近一点（0.9）
            //  - 隔离一个 mesh 时取 1.0（标准填充）
            const padding = variant ? 0.9 : 1.0;

            fitCameraToObject(cam, controls, focus, {
              padding,
              // 变体时尽量沿用旧方向；第一次没有旧方向就用默认斜上角方向
              keepDirection: lastDirRef.current,
            });
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 如果你还有进入后自动微缩放/过渡的逻辑，保留即可 */}
        {isVariantPath(modelPath) && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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
