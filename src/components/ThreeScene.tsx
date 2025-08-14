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
  const [autoCenter, setAutoCenter] = useState(false);

  // 相机/控制器引用 & 视角缓存
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // ✅ 新增：记录“基准视口”的空间范围（来自 customization 页第一次看到的 mesh_448）
  const baseCenterRef = useRef<THREE.Vector3 | null>(null);
  const baseSizeRef = useRef<THREE.Vector3 | null>(null);

  const isMesh448Variant = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  useEffect(() => {
    if (isMesh448Variant) {
      setAutoCenter(true);
      const t = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(t);
    }
  }, [modelPath, isMesh448Variant]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      },
    }),
    []
  );

  // 切模型前，记录当前观察方向与距离
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

  // 用“盒子适配”计算所需距离（同时考虑横向与纵向 FOV，取较大值）
  function calcFitDistanceByBox(
    cam: THREE.PerspectiveCamera,
    size: THREE.Vector3,
    padding = 1.6
  ) {
    const vFOV = (cam.fov * Math.PI) / 180;
    const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * cam.aspect);
    const fitH = (size.y * 0.5) / Math.tan(vFOV / 2);
    const fitW = (size.x * 0.5) / Math.tan(hFOV / 2);
    return Math.max(fitH, fitW) * padding;
  }

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            if (isMesh448Variant && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;
            if (!controls || !mainMesh) return;

            const cam = controls.object as THREE.PerspectiveCamera;
            const target = controls.target as THREE.Vector3;

            // ① 在初次进入 customization（非变体，且隔离 mesh_448）时，记录“基准视口”的中心与尺寸
            if (!isMesh448Variant && isolatedMeshId === 'mesh_448') {
              const baseBox = new THREE.Box3().setFromObject(mainMesh);
              const baseCenter = new THREE.Vector3();
              const baseSize = new THREE.Vector3();
              baseBox.getCenter(baseCenter);
              baseBox.getSize(baseSize);
              baseCenterRef.current = baseCenter;
              baseSizeRef.current = baseSize;
            }

            // ② 计算要对齐的中心与尺寸：
            //    若是变体 => 使用“基准视口”的中心/尺寸（保证与图1一致）；
            //    否则（普通 scene）=> 用当前模型本身的盒子。
            const useBox = new THREE.Box3().setFromObject(mainMesh);
            const meshCenter = new THREE.Vector3();
            const meshSize = new THREE.Vector3();
            useBox.getCenter(meshCenter);
            useBox.getSize(meshSize);

            const center =
              isMesh448Variant && baseCenterRef.current
                ? baseCenterRef.current.clone()
                : meshCenter;

            const size =
              isMesh448Variant && baseSizeRef.current
                ? baseSizeRef.current.clone()
                : meshSize;

            // ③ 距离：同时考虑横/纵 FOV，取较大值；padding 可微调（1.5~1.8）
            const padding = 2.0;
            const fitDist = calcFitDistanceByBox(cam, size, padding);

            // ④ 方向：维持切换前的观察方向（没有就用当前方向）
            const currentDir = new THREE.Vector3().subVectors(cam.position, target).normalize();
            const dir = (lastDirRef.current ?? currentDir).clone();

            // ⑤ 设置 target 与相机位置
            target.copy(center);
            cam.position.copy(center.clone().add(dir.multiplyScalar(fitDist)));

            // ⑥ 适当设置 near/far，避免裁剪
            cam.near = Math.max(0.1, fitDist / 1000);
            cam.far = fitDist * 1000;

            cam.updateProjectionMatrix();
            controls.update();

            // 保留原自动居中缩放逻辑（可与上面并存）
            if (isMesh448Variant && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {isMesh448Variant && (
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
