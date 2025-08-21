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
  /** 可选：调大一点会看起来更“远”，默认 0.9（你说这个刚好） */
  fitPadding?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  onBuildingClick,
  modelPath = '/lovable-uploads/scene(2).gltf',
  isolatedMeshId = null,
  selectableMeshes = [],
  fitPadding = 0.9, // 你之前觉得 0.9 刚好，这里设为默认
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);

  // OrbitControls & 视角记忆
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);

  // 是否为变体模型（mesh446/447/448/449 的 *_1 / *_2）
  const isVariantModel = /mesh44[6-9]_[12]\.gltf$/i.test(modelPath);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景，保持原有视觉
      },
    }),
    []
  );

  /** 记录切换模型前的相机方向（保持切换前的视角方向） */
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;
    const dir = new THREE.Vector3().subVectors(cam.position, target).normalize();
    lastDirRef.current = dir;
  }, [modelPath]);

  /** 核心：把相机“框选”到一个对象（保持方向，自动居中 + 合适大小） */
  function fitCameraToObject(
    object: THREE.Object3D,
    camera: THREE.PerspectiveCamera,
    controls: any,
    padding = 0.9
  ) {
    // 用对象包围盒计算中心 & 尺寸
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 计算需要的距离：同时考虑宽高（横向要用水平 FOV）
    const fovY = THREE.MathUtils.degToRad(camera.fov);
    const fovX = 2 * Math.atan(Math.tan(fovY / 2) * camera.aspect);

    const distForHeight = (size.y / 2) / Math.tan(fovY / 2);
    const distForWidth = (size.x / 2) / Math.tan(fovX / 2);
    const dist = Math.max(distForHeight, distForWidth);

    // 取上一帧视角方向，保持用户感觉一致；否则用一个默认对角方向
    const dir = (lastDirRef.current ?? new THREE.Vector3(1, 1, 1).normalize()).clone();

    // padding < 1 => 留边（物体更小一些）
    const finalDist = dist / (padding > 0 ? padding : 1);

    // 设置 target & 相机位置
    controls.target.copy(center);
    camera.position.copy(center.clone().add(dir.multiplyScalar(finalDist)));

    // 更新 near/far，避免裁剪
    camera.near = Math.max(0.01, finalDist / 1000);
    camera.far = finalDist * 1000;

    camera.updateProjectionMatrix();
    controls.update();
  }

  /** onModelLoaded：统一处理两种情况
   * 1) 有 isolatedMeshId（Customization 页面） => 居中到该 mesh
   * 2) 变体模型（mesh446/7/8/9_*.gltf） => 居中到整个根节点
   * 其它页面（比如 Location）不会触发（因为没有传 isolatedMeshId，且也不是变体）
   */
  const handleModelLoaded = (mainMesh: THREE.Object3D | null) => {
    const controls = controlsRef.current;
    if (!controls || !mainMesh) return;

    const cam = controls.object as THREE.PerspectiveCamera;

    // 拿到 GLTF 的根
    let root: THREE.Object3D = mainMesh;
    while (root.parent) root = root.parent;

    // 优先：Customization 页面传了 isolatedMeshId，就对准这个 mesh
    if (isolatedMeshId) {
      const target = root.getObjectByName(isolatedMeshId) || mainMesh;
      fitCameraToObject(target, cam, controls, fitPadding);
      return;
    }

    // 其次：变体模型（mesh446_1/2 … mesh449_1/2）对准整棵模型
    if (isVariantModel) {
      fitCameraToObject(root, cam, controls, fitPadding);
      return;
    }

    // 其他情况（例如 Location 页面），不改任何相机逻辑
  };

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            // 如果你后面还有“点选后缩放”的交互，保留引用
            if (mesh) setSelectedMeshForCamera(mesh);
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={handleModelLoaded}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 如果你还有点击某 mesh 后做轻微变焦，这里保留原有控制器 */}
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
