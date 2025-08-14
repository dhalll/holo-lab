
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
  className = "", 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene(2).gltf",
  isolatedMeshId = null,
  selectableMeshes = []
}) => {
  const [selectedMeshForCamera, setSelectedMeshForCamera] = useState<THREE.Mesh | null>(null);
  const [autoCenter, setAutoCenter] = useState(false);

  // ✅ 保存当前相机视角（方向 + 距离）与 OrbitControls 引用
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // ✅ 仅识别变体模型
  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Model]);

  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.setClearColor(0x000000, 0);
    }
  }), []);

  // ✅ 在 modelPath 切换时，记录旧视角（相机位置相对 target 的方向和距离）
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
    console.log('ThreeScene mounted with modelPath:', modelPath);
  }, [modelPath]);

  // ----------------------------
  // 🔶 仅在变体模型时使用的“橙色高亮”最小改动
  // 与 Location 页接近的橙色（不要红色）
  const HIGHLIGHT_ORANGE = new THREE.Color('#FF6A3D'); // 你要更接近可微调为 '#FF7A45'
  const lastHighlightedRef = useRef<THREE.Object3D | null>(null);

  // 给对象（及子网格）着色，首次着色会把原色存到 material.userData._origColor
  const tintObject = (obj: THREE.Object3D, color: THREE.Color) => {
    obj.traverse((child: any) => {
      if (child?.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: any) => {
          if (mat?.color) {
            if (!mat.userData?._origColor) {
              mat.userData = mat.userData || {};
              mat.userData._origColor = mat.color.clone();
            }
            mat.color.copy(color);
            mat.needsUpdate = true;
          }
        });
      }
    });
  };

  // 恢复对象（及子网格）原始颜色
  const restoreObject = (obj: THREE.Object3D) => {
    obj.traverse((child: any) => {
      if (child?.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: any) => {
          const orig: THREE.Color | undefined = mat?.userData?._origColor;
          if (orig && mat.color) {
            mat.color.copy(orig);
            mat.needsUpdate = true;
          }
        });
      }
    });
  };
  // ----------------------------

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback 
          onBuildingClick={(buildingName, mesh) => {
            // 🔸保持你原来的相机处理
            if (isMesh448Model && mesh) setSelectedMeshForCamera(mesh);

            // 🔸仅当是变体模型时，点击高亮为橙色（并恢复上一个）
            if (isMesh448Model && mesh) {
              if (lastHighlightedRef.current && lastHighlightedRef.current !== mesh) {
                restoreObject(lastHighlightedRef.current);
              }
              tintObject(mesh, HIGHLIGHT_ORANGE);
              lastHighlightedRef.current = mesh;
            }

            // 🔸透传原回调
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // ✅ 新模型加载后，用相同角度与距离对准“新模型中心”
            const controls = controlsRef.current;
            if (controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              // 新模型中心
              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);

              // 之前的方向/距离（不存在则用当前）
              const dir = (lastDirRef.current ?? new THREE.Vector3().subVectors(cam.position, target).normalize()).clone();
              const dist = lastDistRef.current ?? cam.position.distanceTo(target);

              target.copy(center);
              cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));

              cam.updateProjectionMatrix();
              controls.update();
            }

            // 保留你原来的 mesh448 自动居中缩放逻辑
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }

            // 每次换新模型时清空上一次高亮记录，避免误染
            lastHighlightedRef.current = null;
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {isMesh448Model && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

        {/* ✅ 绑定 OrbitControls 引用 */}
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



