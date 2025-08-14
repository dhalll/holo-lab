
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

  // OrbitControls 与相机角度/距离保存（保持切换时角度）
  const controlsRef = useRef<any>(null);
  const lastDirRef = useRef<THREE.Vector3 | null>(null);
  const lastDistRef = useRef<number | null>(null);

  // 上一次被高亮的物体（用于恢复原色）
  const lastHighlightedRef = useRef<THREE.Object3D | null>(null);

  // 仅识别变体文件
  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');

  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Model]);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
      onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0); // 透明背景
      },
    }),
    []
  );

  // 切模型前记录当前相机视角
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

  // 统一的橙色（与 Location 页一致）
  const HIGHLIGHT_ORANGE = new THREE.Color('#FF5722');

  // 把一个物体（及其子网格）的材质改为橙色；首次改色会把原色缓存到 material.userData._origColor
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

  // 恢复一个物体（及其子网格）的原始颜色
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

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SceneWithFallback
          onBuildingClick={(buildingName, mesh) => {
            // ★ 点击 mesh 时做高亮：恢复上一个 → 给当前的设为橙色
            if (lastHighlightedRef.current && lastHighlightedRef.current !== mesh) {
              restoreObject(lastHighlightedRef.current);
            }
            if (mesh) {
              tintObject(mesh, HIGHLIGHT_ORANGE);
              lastHighlightedRef.current = mesh;
            }

            // 变体时用于初次居中缩放
            if (isMesh448Model && mesh) setSelectedMeshForCamera(mesh);

            // 透传给外部（保持你原有的回调）
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // 新模型加载后，沿用之前相机角度/距离，对准新模型中心
            const controls = controlsRef.current;
            if (controls && mainMesh) {
              const cam = controls.object as THREE.PerspectiveCamera;
              const target = controls.target as THREE.Vector3;

              const box = new THREE.Box3().setFromObject(mainMesh);
              const center = new THREE.Vector3();
              box.getCenter(center);

              const dir =
                lastDirRef.current?.clone() ??
                new THREE.Vector3().subVectors(cam.position, target).normalize();
              const dist = lastDistRef.current ?? cam.position.distanceTo(target);

              target.copy(center);
              cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));

              cam.updateProjectionMatrix();
              controls.update();
            }

            // 保留原先 mesh448 的自动居中缩放
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }

            // 切换到新模型时，清空上一次高亮记录（避免错误复用）
            lastHighlightedRef.current = null;
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />

        {/* 变体初次载入的轻微自动居中缩放 */}
        {isMesh448Model && <CameraZoomController selectedMesh={selectedMeshForCamera} />}

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


