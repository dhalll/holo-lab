
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

interface BuildingMeshProps {
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ onBuildingClick, modelPath = "/lovable-uploads/scene (2).gltf" }) => {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  useEffect(() => {
    if (scene && meshRef.current) {
      // Clear existing children
      meshRef.current.clear();
      
      // Clone the scene and add to our mesh
      const clonedScene = scene.clone();
      meshRef.current.add(clonedScene);

      // Set up building interactions
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData.originalMaterial = child.material;
          child.userData.isBuilding = true;
          child.userData.buildingName = child.name || `building-${Math.random().toString(36).substr(2, 9)}`;
        }
      });
    }
  }, [scene]);

  const handleClick = (event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    if (intersected && intersected.object.userData.isBuilding && onBuildingClick) {
      const buildingName = intersected.object.userData.buildingName;
      console.log('Building clicked:', buildingName);
      onBuildingClick(buildingName, intersected.object);
    }
  };

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    if (intersected && intersected.object.userData.isBuilding) {
      const buildingName = intersected.object.userData.buildingName;
      setHoveredBuilding(buildingName);
      document.body.style.cursor = 'pointer';
      
      // Highlight the building
      if (intersected.object.material) {
        intersected.object.material = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
      }
    }
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    if (intersected && intersected.object.userData.isBuilding) {
      setHoveredBuilding(null);
      document.body.style.cursor = 'default';
      
      // Restore original material
      if (intersected.object.userData.originalMaterial) {
        intersected.object.material = intersected.object.userData.originalMaterial;
      }
    }
  };

  return (
    <group
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={[1, 1, 1]}
      position={[0, -2, 0]}
    />
  );
};

const CameraController: React.FC = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = "", 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf" 
}) => {
  console.log('ThreeScene rendering with props:', { className, modelPath, onBuildingClick: !!onBuildingClick });

  return (
    <div className={className}>
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <BuildingMesh onBuildingClick={onBuildingClick} modelPath={modelPath} />
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
