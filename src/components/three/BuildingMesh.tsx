
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingMeshProps {
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ onBuildingClick, modelPath = "/lovable-uploads/scene (2).gltf" }) => {
  const [modelError, setModelError] = useState(false);
  
  try {
    const { scene } = useGLTF(modelPath);
    const meshRef = useRef<THREE.Group>(null);
    const [hoveredMesh, setHoveredMesh] = useState<THREE.Mesh | null>(null);
    const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);

    // Color constants
    const DEFAULT_COLOR = new THREE.Color(0xcccccc); // Light grey
    const SELECTED_COLOR = new THREE.Color(0xF57B4E); // Orange
    const HOVER_EMISSIVE = new THREE.Color(0xF57B4E); // Orange emissive for hover

    useEffect(() => {
      if (scene && meshRef.current) {
        // Clear existing children
        meshRef.current.clear();
        
        // Clone the scene and add to our mesh
        const clonedScene = scene.clone();
        
        // Set up all meshes with default properties
        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Store original material for reference
            child.userData.originalMaterial = child.material;
            child.userData.isBuilding = true;
            child.userData.buildingName = child.name || `mesh_${Math.random().toString(36).substr(2, 9)}`;
            
            // Create new material with default color
            const newMaterial = child.material.clone();
            newMaterial.color = DEFAULT_COLOR.clone();
            newMaterial.emissive = new THREE.Color(0x000000); // No emissive initially
            child.material = newMaterial;
          }
        });
        
        meshRef.current.add(clonedScene);
      }
    }, [scene]);

    // Helper function to reset mesh to default state
    const resetMeshToDefault = (mesh: THREE.Mesh) => {
      if (mesh && mesh.material) {
        mesh.material.color = DEFAULT_COLOR.clone();
        mesh.material.emissive = new THREE.Color(0x000000);
      }
    };

    // Helper function to set mesh to selected state
    const setMeshToSelected = (mesh: THREE.Mesh) => {
      if (mesh && mesh.material) {
        mesh.material.color = SELECTED_COLOR.clone();
        mesh.material.emissive = new THREE.Color(0x000000); // Remove any emissive
      }
    };

    // Helper function to set mesh to hover state
    const setMeshToHover = (mesh: THREE.Mesh) => {
      if (mesh && mesh.material && mesh !== selectedMesh) {
        mesh.material.emissive = HOVER_EMISSIVE.clone();
      }
    };

    const handleClick = (event: any) => {
      event.stopPropagation();
      const intersected = event.intersections[0];
      
      if (intersected && intersected.object.userData.isBuilding) {
        const clickedMesh = intersected.object as THREE.Mesh;
        const buildingName = intersected.object.userData.buildingName;
        
        if (selectedMesh === clickedMesh) {
          // Clicking the same mesh - deselect it
          resetMeshToDefault(clickedMesh);
          setSelectedMesh(null);
          console.log('Building deselected:', buildingName);
          onBuildingClick?.(null, null);
        } else {
          // Clicking a different mesh - select it
          // First reset the previously selected mesh
          if (selectedMesh) {
            resetMeshToDefault(selectedMesh);
          }
          
          // Set the new mesh as selected
          setMeshToSelected(clickedMesh);
          setSelectedMesh(clickedMesh);
          console.log('Building selected:', buildingName);
          onBuildingClick?.(buildingName, clickedMesh);
        }
      } else {
        // Clicked on background - deselect any selected mesh
        if (selectedMesh) {
          resetMeshToDefault(selectedMesh);
          setSelectedMesh(null);
          console.log('Background clicked - deselecting');
          onBuildingClick?.(null, null);
        }
      }
    };

    const handlePointerOver = (event: any) => {
      event.stopPropagation();
      const intersected = event.intersections[0];
      
      if (intersected && intersected.object.userData.isBuilding) {
        const hoveredMeshObj = intersected.object as THREE.Mesh;
        
        if (hoveredMeshObj !== selectedMesh) {
          setMeshToHover(hoveredMeshObj);
          setHoveredMesh(hoveredMeshObj);
        }
        
        document.body.style.cursor = 'pointer';
      }
    };

    const handlePointerOut = (event: any) => {
      event.stopPropagation();
      const intersected = event.intersections[0];
      
      if (intersected && intersected.object.userData.isBuilding) {
        const mesh = intersected.object as THREE.Mesh;
        
        // Only reset to default if it's not the selected mesh
        if (mesh !== selectedMesh) {
          resetMeshToDefault(mesh);
        }
        
        setHoveredMesh(null);
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
    console.warn('Failed to load GLTF model:', error);
    return null;
  }
};

export default BuildingMesh;
