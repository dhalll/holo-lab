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

  // ✅ 扩展到 446/447/448/449 的 1/2 变体
  const isVariantModel = /(mesh44[6-9]_(1|2)\.gltf)/.test(modelPath);

  // 记录与复用相机朝向（方向 + 距离）
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 让变体看上去更合适的“边距系数”（越大越远，模型更小）
  const FIT_PADDING = 1.8;

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    [],
  );

  // 记录切换前的视角
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

  // 自适应到对象
  const fitCameraToObject = (
    ctrls: any,
    object: THREE.Object3D,
    opts?: { padding?: number; keepDir?: THREE.Vector3 | null },
  ) => {
    const cam = ctrls.object as THREE.PerspectiveCamera;
    const target = ctrls.target as THREE.Vector3;

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const keepDir =
      opts?.keepDir ??
      new THREE.Vector3().subVectors(cam.position, target).normalize();

    const fov = (cam.fov * Math.PI) / 180;
    const aspect = cam.aspect > 0 ? cam.aspect : 1.6;
    const fitHeightDistance = (size.y * 0.5) / Math.tan(fov * 0.5);
    const fovX = 2 * Math.atan(Math.tan(fov / 2) * aspect);
    const fitWidthDistance = (size.x * 0.5) / Math.tan(fovX * 0.5);

    const padding = opts?.padding ?? 1.0;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * padding;

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
            if (isVariantModel && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            if (isVariantModel && mainMesh) {
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

        {isVariantModel && (
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

