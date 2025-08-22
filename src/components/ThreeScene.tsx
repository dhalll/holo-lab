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

const DEFAULT_VIEW_DIR = new THREE.Vector3(-1.2, 0.9, 1.35).normalize();
const FIT_PADDING = 1.12;

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = "",
  onBuildingClick,
  modelPath = "/lovable-uploads/scene(2).gltf",
  isolatedMeshId = null,
  selectableMeshes = []
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);

  const controlsRef = useRef<any>(null);
  const lastDirRef   = useRef<THREE.Vector3 | null>(null);
  const lastDistRef  = useRef<number | null>(null);

  const isVariantModel =
    /mesh44(6|7|8|9)_(1|2)\.gltf$/i.test(modelPath) ||
    modelPath.includes('mesh446_') ||
    modelPath.includes('mesh447_') ||
    modelPath.includes('mesh448_') ||
    modelPath.includes('mesh449_');

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;
    lastDirRef.current  = new THREE.Vector3().subVectors(cam.position, target).normalize();
    lastDistRef.current = cam.position.distanceTo(target);
  }, [modelPath]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 60 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
      }
    }),
    []
  );

  function frameObjectToView(obj: THREE.Object3D, controls: any, padding = FIT_PADDING) {
    if (!obj || !controls) return;

    const cam = controls.object as THREE.PerspectiveCamera;
    const target = controls.target as THREE.Vector3;

    const box = new THREE.Box3().setFromObject(obj);
    if (!isFinite(box.min.x) || !isFinite(box.max.x)) return; // 没有几何体时保护

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fovV = (cam.fov * Math.PI) / 180;
    const halfV = fovV / 2;
    const halfH = Math.atan(Math.tan(halfV) * cam.aspect);

    const distV = (maxSize * padding) / Math.sin(Math.max(0.35, halfV)); // 防极端近
    const distH = (maxSize * padding) / Math.sin(Math.max(0.35, halfH));
    const dist = Math.max(distV, distH);

    const dir = (lastDirRef.current ?? DEFAULT_VIEW_DIR).clone();

    target.copy(center);
    cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));

    cam.near = Math.max(0.01, dist * 0.01);
    cam.far  = Math.max(cam.near + 1, dist * 100);
    cam.updateProjectionMatrix();
    controls.update();
  }

  /** 兼容性更强的名字匹配：精确、包含、去符号、点号/下划线互换 */
  function collectNodesById(root: THREE.Object3D, rawId: string): THREE.Object3D[] {
    if (!rawId) return [];
    const want = rawId;
    const variations = new Set<string>([
      want,
      want.replace(/_/g, ''),
      want.replace(/_/g, '.'),
      want.replace(/\./g, '_'),
      want.replace(/^mesh_/, 'mesh') // mesh_447 与 mesh447 兼容
    ]);

    const result: THREE.Object3D[] = [];
    root.traverse((obj) => {
      if (!obj.name) return;
      const n = obj.name;
      if (variations.has(n) || [...variations].some(v => n.includes(v))) {
        result.push(obj);
      }
    });
    return result;
  }

  /** 多节点合并成一个 Group 以便统一计算包围盒 */
  function mergeAsGroup(nodes: THREE.Object3D[]): THREE.Group | null {
    if (nodes.length === 0) return null;
    if (nodes.length === 1) return nodes[0] as THREE.Group as any;

    const g = new THREE.Group();
    // 用 add() 的引用，不克隆，纯计算包围盒用途
    nodes.forEach(n => g.add(n));
    return g;
  }

  /** 进入 Customize 页面：优先按 isolatedMeshId 框选该建筑；找不到再退化到 root */
  function frameOnLoad(rootScene: THREE.Object3D) {
    const controls = controlsRef.current;
    if (!controls || !rootScene) return;

    const isBaseScene =
      !isVariantModel && (modelPath.includes('scene(') || modelPath.includes('scene'));

    if (isBaseScene && isolatedMeshId) {
      const nodes = collectNodesById(rootScene, isolatedMeshId);
      if (nodes.length > 0) {
        const g = mergeAsGroup(nodes)!;
        frameObjectToView(g, controls, FIT_PADDING);
        return;
      }
      // 第一次遍历没命中：延迟一帧再试（有些节点可能异步 attach）
      requestAnimationFrame(() => {
        const nodes2 = collectNodesById(rootScene, isolatedMeshId);
        if (nodes2.length > 0) {
          const g2 = mergeAsGroup(nodes2)!;
          frameObjectToView(g2, controls, FIT_PADDING);
        } else {
          // 还是没有，退化到整棵 root
          frameObjectToView(rootScene, controls, 1.15);
        }
      });
      return;
    }

    // 非基础场景 / 未传 isolatedMeshId：退化到 root
    frameObjectToView(rootScene, controls, 1.15);
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
            frameOnLoad(rootScene);
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 原有过渡控制保留，不影响“进入页面”的居中 */}
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
