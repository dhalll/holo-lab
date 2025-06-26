
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingMeshProps {
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ onBuildingClick, modelPath = "/lovable-uploads/scene (2).gltf" }) => {
  const [modelError, setModelError] = useState(false);
  
  try {
    const { scene } = useGLTF(modelPath);
    const meshRef = useRef<THREE.Group>(null);
    const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
    const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);

    useEffect(() => {
      if (scene && meshRef.current) {
        // Clear existing children
        meshRef.current.clear();
        
        // Clone the scene and add to our mesh
        const clonedScene = scene.clone();
        
        // Filter out green planes and black blocks
        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const material = child.material as THREE.Material;
            
            // Check if it's a green plane or black block and remove it
            if (material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshBasicMaterial) {
              const color = material.color;
              // Remove green planes (green color check)
              if (color.r < 0.2 && color.g > 0.4 && color.b < 0.2) {
                child.visible = false;
                return;
              }
              // Remove black blocks (very dark colors)
              if (color.r < 0.1 && color.g < 0.1 && color.b < 0.1) {
                child.visible = false;
                return;
              }
            }
            
            // Set up building interactions for visible meshes
            child.userData.originalMaterial = child.material;
            child.userData.isBuilding = true;
            child.userData.buildingName = child.name || `mesh_${Math.random().toString(36).substr(2, 9)}`;
          }
        });
        
        meshRef.current.add(clonedScene);
      }
    }, [scene]);

    const handleClick = (event: any) => {
      event.stopPropagation();
      const intersected = event.intersections[0];
      if (intersected && intersected.object.userData.isBuilding && onBuildingClick) {
        const clickedMesh = intersected.object as THREE.Mesh;
        const buildingName = intersected.object.userData.buildingName;
        
        // Update the selected mesh state without visual highlighting
        setSelectedMesh(clickedMesh);
        console.log('Building clicked:', buildingName);
        onBuildingClick(buildingName, clickedMesh);
      }
    };

    const handlePointerOver = (event: any) => {
      event.stopPropagation();
      const intersected = event.intersections[0];
      if (intersected && intersected.object.userData.isBuilding) {
        const buildingName = intersected.object.userData.buildingName;
        setHoveredBuilding(buildingName);
        document.body.style.cursor = 'pointer';
      }
    };

    const handlePointerOut = (event: any) => {
      event.stopPropagation();
      const intersected = event.intersections[0];
      if (intersected && intersected.object.userData.isBuilding) {
        setHoveredBuilding(null);
        document.body.style.cursor = 'default';
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
  } catch (error) {
    console.warn('Failed to load GLTF model, using fallback buildings:', error);
    return null;
  }
};

export default BuildingMesh;
