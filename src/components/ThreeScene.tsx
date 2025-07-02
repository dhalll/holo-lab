
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CameraController from './three/CameraController';
import SceneWithFallback from './three/SceneWithFallback';

interface ThreeSceneProps {
  className?: string;
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
  isolatedMeshId?: string | null; // New prop for mesh isolation
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = "", 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf",
  isolatedMeshId = null // Default to null for normal behavior
}) => {
  console.log('ThreeScene rendering with props:', { 
    className, 
    modelPath, 
    onBuildingClick: !!onBuildingClick,
    isolatedMeshId 
  });

  return (
    <div className={className}>
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SceneWithFallback 
          onBuildingClick={onBuildingClick} 
          modelPath={modelPath}
          isolatedMeshId={isolatedMeshId}
        />
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
