
import React, { useEffect, useMemo, useState } from 'react';
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
  
  console.log('ThreeScene rendering with props:', { 
    className, 
    modelPath, 
    onBuildingClick: !!onBuildingClick,
    isolatedMeshId 
  });

  // Check if this is a mesh448 model that needs centering
  const isMesh448Model = modelPath.includes('mesh448_1') || modelPath.includes('mesh448_2');
  
  // Auto-center mesh448 models when they load
  useEffect(() => {
    if (isMesh448Model) {
      setAutoCenter(true);
      // Reset auto-center after a short delay to allow model to load
      const timer = setTimeout(() => setAutoCenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modelPath, isMesh448Model]);

  // Memoize the canvas configuration to prevent unnecessary re-renders
  const canvasConfig = useMemo(() => ({
    camera: { position: [5, 5, 5] as [number, number, number], fov: 75 },
    onCreated: ({ gl }: { gl: THREE.WebGLRenderer }) => {
      console.log('Canvas created successfully');
      gl.setClearColor(0x000000, 0); // Transparent background
    }
  }), []);

  useEffect(() => {
    console.log('ThreeScene mounted with modelPath:', modelPath);
  }, [modelPath]);

  return (
    <div className={className}>
      <Canvas {...canvasConfig}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SceneWithFallback 
          onBuildingClick={(buildingName, mesh) => {
            // Handle mesh448 models - automatically center camera on the main mesh
            if (isMesh448Model && mesh) {
              setSelectedMeshForCamera(mesh);
            }
            onBuildingClick?.(buildingName, mesh);
          }}
          onModelLoaded={(mainMesh) => {
            // Auto-center mesh448 models when they first load
            if (isMesh448Model && mainMesh && autoCenter) {
              setSelectedMeshForCamera(mainMesh);
            }
          }}
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
          selectableMeshes={selectableMeshes}
        />
        {/* Camera zoom controller for mesh448 models to ensure centering */}
        {isMesh448Model && <CameraZoomController selectedMesh={selectedMeshForCamera} />}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
