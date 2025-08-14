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

  // 仅在 mesh448 变体时生效（Customize 页才会加载这两个 glTF）
  const isMesh448Variant =
    modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 记录与复用相机朝向（方向 + 距离）
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 让变体看上去更合适的“边距系数”（越大越远，模型越小）
  // 你可以把这个数调大一点点（比如 1.7 ~ 2.0）让模型更小；调小会更大
  const FIT_PADDING = 1.8;

  // Canvas 基础配置（不动其他页面）
  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景
      },
    }),
    [],
  );

  // 在 modelPath 变化（如从 scene 切到 mesh448_1/2）前，先记下当前视角
  useEffect(() => {
    const ctrls = controlsRef.current;
    if (!ctrls) return;
    const cam = ctrls.object as THREE.PerspectiveCamera;
    const target = ctrls.target as THREE.Vector3;

    const dir = new THREE.Vector3().subVectors(cam.position, target).normalize();
    const dist = cam.position.distanceTo(target);

    lastDirRef.current = dir;
    lastDistRef.current = dist;
  }, [modelPath]);

  // 让相机“合适地”框住模型（只对 mesh448 变体做）
  const fitCameraToObject = (
    ctrls: any,
    object: THREE.Object3D,
    opts?: { padding?: number; keepDir?: THREE.Vector3 | null },
  ) => {
    const cam = ctrls.object as THREE.PerspectiveCamera;
    const target = ctrls.target as THREE.Vector3;

    // 模型包围盒
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 保持切换前的观察方向；若没有，就沿当前方向看过去
    const keepDir =
      opts?.keepDir ??
      new THREE.Vector3().subVectors(cam.position, target).normalize();

    // 计算能完整放入视锥的距离（考虑 FOV 与画布宽高比）
    const fov = (cam.fov * Math.PI) / 180; // 弧度
    const aspect = cam.aspect > 0 ? cam.aspect : 1.6;

    // 在水平与垂直视角下需要的最小距离，取最大者
    const fitHeightDistance = (size.y * 0.5) / Math.tan(fov * 0.5);
    // 等效的水平 FOV（由垂直 FOV + 宽高比推得）
    const fovX = 2 * Math.atan(Math.tan(fov / 2) * aspect);
    const fitWidthDistance = (size.x * 0.5) / Math.tan(fovX * 0.5);

    const padding = opts?.padding ?? 1.0;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * padding;

    // 设置 target + position
    target.copy(center);
    cam.position.copy(center.clone().add(keepDir.multiplyScalar(distance)));

    cam.near = Math.max(distance / 100, 0.1);
    cam.far = distance * 1000;
    cam.updateProjectionMatrix();
    ctrls.update();
  };

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            // 原有点击回调保留
            if (isMesh448Variant && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // ✅ 只在 mesh448 变体时进行“居中 + 合理距离”的自适应
            if (isMesh448Variant && mainMesh) {
              const ctrls = controlsRef.current;
              if (ctrls) {
                const keepDir =
                  lastDirRef.current ??
                  new THREE.Vector3()
                    .subVectors(
                      (ctrls.object as THREE.PerspectiveCamera).position,
                      ctrls.target as THREE.Vector3,
                    )
                    .normalize();

                fitCameraToObject(ctrls, mainMesh, {
                  padding: FIT_PADDING,
                  keepDir,
                });
              }
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 你原先的缩放控制，保留（仅在 mesh448 变体时渲染） */}
        {isMesh448Variant && (
          <CameraZoomController selectedMesh={selectedMeshForCamera} />
        )}

        {/* 其它模型/页面不受影响 */}
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
