import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
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

/** 用当前相机角度，把相机与 controls.target 调整到 box 的中心，并按 padding 计算合适距离 */
function frameCameraToBox(
  camera: THREE.PerspectiveCamera,
  controls: any | null,
  box: THREE.Box3,
  padding = 1.0
) {
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // 以当前相机的朝向来保持角度
  const currentTarget = controls ? controls.target.clone() : new THREE.Vector3();
  const dir = camera.position.clone().sub(currentTarget).normalize();

  // 计算需要的距离（同时考虑宽高与纵横比）
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const fitHeightDistance = (size.y / 2) / Math.tan(vFov / 2);
  const fitWidthDistance  = (size.x / 2) / Math.tan(vFov / 2) / camera.aspect;
  const distance = padding * Math.max(fitHeightDistance, fitWidthDistance, size.z);

  const newPos = center.clone().add(dir.multiplyScalar(distance));

  if (controls) controls.target.copy(center);
  camera.position.copy(newPos);
  camera.updateProjectionMatrix();
  if (controls) controls.update();
}

/** 在整城 scene + 传入 isolatedMeshId 的情况下，等子网格出现后自动居中 */
const FitIsolated: React.FC<{
  name: string | null | undefined;
  modelPath: string;
  controlsRef: React.RefObject<any>;
  padding?: number;
}> = ({ name, modelPath, controlsRef, padding = 1.05 }) => {
  const { scene, camera } = useThree();

  useEffect(() => {
    if (!name) return;
    let canceled = false;
    let tries = 0;

    const tryFit = () => {
      if (canceled) return;
      const obj = scene.getObjectByName(name);
      if (obj) {
        const box = new THREE.Box3().setFromObject(obj);
        frameCameraToBox(camera as THREE.PerspectiveCamera, controlsRef.current, box, padding);
        return;
      }
      // 模型还没挂到场景上就下一帧再查（最多约 60 次）
      if (tries++ < 60) requestAnimationFrame(tryFit);
    };

    tryFit();
    return () => { canceled = true; };
  }, [name, modelPath, scene, camera, controlsRef, padding]);

  return null;
};

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  onBuildingClick,
  modelPath = '/lovable-uploads/scene(2).gltf',
  isolatedMeshId = null,
  selectableMeshes = [],
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);
  const [autoCenter, setAutoCenter] = useState(false);

  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 是否为“独立变体”模型（mesh446_1.gltf / mesh447_2.gltf 等）
  const isVariantModel = /mesh\d+_[12]\.gltf$/i.test(modelPath);

  useEffect(() => {
    if (isVariantModel) {
      setAutoCenter(true);
      const t = setTimeout(() => setAutoCenter(false), 1500);
      return () => clearTimeout(t);
    }
  }, [modelPath, isVariantModel]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    []
  );

  // 记录切换前相机的“方向与距离”，切换模型后沿同方向对准新中心
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

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* 当是整城 scene 且有 isolatedMeshId 时，加载完后对准该子网格 */}
        {!isVariantModel && isolatedMeshId && (
          <FitIsolated
            name={isolatedMeshId}
            modelPath={modelPath}
            controlsRef={controlsRef}
            padding={1.05}   // 可微调：>1 拉远，<1 拉近
          />
        )}

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            if (isVariantModel && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // 仅对“独立变体”模型做一次整体居中（整城 scene 的居中由 FitIsolated 负责）
            if (isVariantModel && mainMesh) {
              const controls = controlsRef.current;
              if (controls) {
                const cam = controls.object as THREE.PerspectiveCamera;
                const target = controls.target as THREE.Vector3;

                // 上溯到 GLTF 的根（确保拿到完整包围盒）
                let root: THREE.Object3D = mainMesh;
                while (root.parent && root.parent.type !== 'Scene') root = root.parent;

                const box = new THREE.Box3().setFromObject(root);
                // 用上一次的相机方向保持角度
                const dir =
                  (lastDirRef.current ??
                    new THREE.Vector3().subVectors(cam.position, target).normalize()).clone();

                // 0.9 稍微比“完全包裹”更近一点（你说 0.9 “刚好”）
                frameCameraToBox(cam, controls, box, 0.9);

                // 再沿“记录的方向”修正一次位置（让角度与切换前一致）
                const center = new THREE.Vector3();
                box.getCenter(center);
                const dist = lastDistRef.current ?? cam.position.distanceTo(target);
                cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));
                if (controls) controls.target.copy(center);
                cam.updateProjectionMatrix();
                if (controls) controls.update();
              }

              if (autoCenter) {
                setSelectedMeshForCamera(mainMesh);
              }
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 只在独立变体时启用这个小的“呼吸缩放” */}
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
