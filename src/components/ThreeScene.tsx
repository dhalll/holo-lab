
import React, { useEffect, useMemo } from 'react';
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
  modelPath = "/lovable-uploads/scene(2).gltf",
  isolatedMeshId = null
}) => {
  console.log('ThreeScene rendering with props:', { 
    className, 
    modelPath, 
    onBuildingClick: !!onBuildingClick,
    isolatedMeshId 
  });

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
