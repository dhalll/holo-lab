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

  // OrbitControls & 相机视角记录
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 基准：用户在原始 mesh_448 上看到的相机方向/距离/目标（用于变体复用）
  const baseDirRef = useRef<THREE.Vector3 | null>(null);
  const baseTargetRef = useRef<THREE.Vector3 | null>(null);
  const baseDistRef = useRef<number | null>(null);

  // 当前是否为 448 的变体模型
  const isMesh448Variant = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  // 原有自动居中逻辑保留（仅在 448 变体时使用）
  useEffect(() => {
    if (isMesh448Variant) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Variant]);

  // 画布配置
  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景
      },
    }),
    []
  );

  // 在 modelPath 切换时记录旧视角（方向/距离）
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

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('ThreeScene mounted with modelPath:', modelPath);
  }, [modelPath]);

  // —— 工具：拿到 GLTF 在 R3F Scene 下的根节点（避免只拿到某个子 mesh）——
  function getModelRoot(obj: THREE.Object3D): THREE.Object3D {
    let root = obj;
    while (root.parent && root.parent.type !== 'Scene') {
      root = root.parent;
    }
    return root;
  }

  // —— 工具：将目标对象以指定方向/留白比例“框选到视口” —— 
  function frameObjectToView(
    cam: THREE.PerspectiveCamera,
    controls: any,
    object: THREE.Object3D,
    dir: THREE.Vector3,
    paddingScale = 1.18 // 适当留白，避免太满或太小
  ) {
    const box = new THREE.Box3().setFromObject(object);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const center = sphere.center.clone();
    const radius = Math.max(sphere.radius, 0.001);

    const fov = (cam.fov * Math.PI) / 180;
    const distance = (radius / Math.sin(fov / 2)) * 1.15 * paddingScale; // 距离 = 半径 / sin(fov/2) * 调整系数

    const target = controls.target as THREE.Vector3;
    target.copy(center);

    const eye = center.clone().add(dir.clone().multiplyScalar(distance));
    cam.position.copy(eye);

    cam.near = Math.max(0.01, distance - radius * 2);
    cam.far = distance + radius * 4;
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
            if (isMesh448Variant && mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            const controls = controlsRef.current;

            // 1) 记录原始 mesh_448 的“基准视角”
            //    在 customize 初始（非变体）且隔离的是 mesh_448 时记录
            if (!isMesh448Variant && isolatedMeshId === 'mesh_448' && controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              const rootObject = getModelRoot(mainMesh);
              const box = new THREE.Box3().setFromObject(rootObject);
              const center = new THREE.Vector3();
              box.getCenter(center);

              baseTargetRef.current = center.clone();
              baseDirRef.current = new THREE.Vector3().subVectors(cam.position, target).normalize();
              baseDistRef.current = cam.position.distanceTo(target);

              // 把 target 微调到模型中心，保证后面复现角度更稳定
              target.copy(center);
              controls.update();
            }

            // 2) 变体加载：用基准角度 + 框选到视口
            if (isMesh448Variant && controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;

              const rootObject = getModelRoot(mainMesh);
              const dir =
                (baseDirRef.current && baseDirRef.current.clone()) ||
                (lastDirRef.current && lastDirRef.current.clone()) ||
                new THREE.Vector3(-1, 0.65, 1).normalize();

              // 留白比例可微调（1.10~1.25），确保大小与初始一致且完全可见
              frameObjectToView(cam, controls, rootObject, dir, 1.25);

              // 维持你原先的自动居中缩放行为（如需）
              if (autoCenter) setSelectedMeshForCamera(null);
            }

            // 原有 mesh448 自动居中逻辑仍保留
            if (isMesh448Variant && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 原有：仅在 448 变体时启用缩放控制器 */}
        {isMesh448Variant && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

        {/* 绑定 OrbitControls 引用 */}
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
