
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MaterialManager } from './MaterialManager';
import MeshInteractionHandler from './MeshInteractionHandler';
import CameraZoomController from './CameraZoomController';

interface BuildingMeshProps {
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf" 
}) => {
  const [modelError, setModelError] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const meshRef = useRef<THREE.Group>(null);
  
  try {
    const { scene } = useGLTF(modelPath);

    useEffect(() => {
      if (scene && meshRef.current) {
        // Clear existing children
        meshRef.current.clear();
        
        // Clone the scene and add to our mesh
        const clonedScene = scene.clone();
        
        // Set up all meshes with default properties
        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            MaterialManager.initializeMesh(child);
          }
        });
        
        meshRef.current.add(clonedScene);
      }
    }, [scene]);

    const handleMeshSelected = (mesh: THREE.Mesh | null) => {
      setSelectedMesh(mesh);
    };

    return (
      <>
        <MeshInteractionHandler
          meshRef={meshRef}
          onBuildingClick={onBuildingClick}
          onMeshSelected={handleMeshSelected}
        >
          <group ref={meshRef} />
        </MeshInteractionHandler>
        <CameraZoomController selectedMesh={selectedMesh} />
      </>
    );
  } catch (error) {
    console.warn('Failed to load GLTF model:', error);
    return null;
  }
};

export default BuildingMesh;
