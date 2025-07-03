
import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CameraController from './three/CameraController';
import SceneWithFallback from './three/SceneWithFallback';

interface ThreeSceneProps {
  className?: string;
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
  isolatedMeshId?: string | null;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = "", 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf",
  isolatedMeshId = null
}) => {
  console.log('ThreeScene rendering with props:', { 
    className, 
    modelPath, 
    onBuildingClick: !!onBuildingClick,
    isolatedMeshId 
  });

  useEffect(() => {
    console.log('ThreeScene mounted with modelPath:', modelPath);
    
    // Test if the model file exists
    fetch(modelPath)
      .then(response => {
        if (!response.ok) {
          console.warn(`Model file not found at ${modelPath}, status: ${response.status}`);
        } else {
          console.log(`Model file found at ${modelPath}`);
        }
      })
      .catch(error => {
        console.error(`Error checking model file at ${modelPath}:`, error);
      });
  }, [modelPath]);

  return (
    <div className={className}>
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 75 }}
        onCreated={({ gl }) => {
          console.log('Canvas created successfully');
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
      >
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
