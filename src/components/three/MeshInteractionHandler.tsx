
import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { MaterialManager } from './MaterialManager';

interface MeshInteractionHandlerProps {
  meshRef: React.RefObject<THREE.Group>;
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  onMeshSelected?: (mesh: THREE.Mesh | null) => void;
  children: React.ReactNode;
}

const MeshInteractionHandler: React.FC<MeshInteractionHandlerProps> = ({
  meshRef,
  onBuildingClick,
  onMeshSelected,
  children
}) => {
  const [hoveredMesh, setHoveredMesh] = useState<THREE.Mesh | null>(null);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    
    if (intersected && intersected.object.userData.isBuilding) {
      const clickedMesh = intersected.object as THREE.Mesh;
      const buildingName = intersected.object.userData.buildingName;
      
      if (selectedMesh === clickedMesh) {
        // Clicking the same mesh - deselect it
        MaterialManager.resetMeshToDefault(clickedMesh);
        setSelectedMesh(null);
        console.log('Building deselected:', buildingName);
        onBuildingClick?.(null, null);
        onMeshSelected?.(null);
      } else {
        // Clicking a different mesh - select it
        // First reset the previously selected mesh
        if (selectedMesh) {
          MaterialManager.resetMeshToDefault(selectedMesh);
        }
        
        // Set the new mesh as selected
        MaterialManager.setMeshToSelected(clickedMesh);
        setSelectedMesh(clickedMesh);
        console.log('Building selected:', buildingName);
        onBuildingClick?.(buildingName, clickedMesh);
        onMeshSelected?.(clickedMesh);
      }
    } else {
      // Clicked on background - deselect any selected mesh
      if (selectedMesh) {
        MaterialManager.resetMeshToDefault(selectedMesh);
        setSelectedMesh(null);
        console.log('Background clicked - deselecting');
        onBuildingClick?.(null, null);
        onMeshSelected?.(null);
      }
    }
  }, [selectedMesh, onBuildingClick, onMeshSelected]);

  const handlePointerOver = useCallback((event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    
    if (intersected && intersected.object.userData.isBuilding) {
      const hoveredMeshObj = intersected.object as THREE.Mesh;
      
      if (hoveredMeshObj !== selectedMesh && hoveredMeshObj !== hoveredMesh) {
        MaterialManager.setMeshToHover(hoveredMeshObj);
        setHoveredMesh(hoveredMeshObj);
      }
      
      document.body.style.cursor = 'pointer';
    }
  }, [selectedMesh, hoveredMesh]);

  const handlePointerOut = useCallback((event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    
    if (intersected && intersected.object.userData.isBuilding) {
      const mesh = intersected.object as THREE.Mesh;
      
      // Only reset to default if it's not the selected mesh
      if (mesh !== selectedMesh && mesh === hoveredMesh) {
        MaterialManager.resetMeshToDefault(mesh);
        setHoveredMesh(null);
      }
      
      document.body.style.cursor = 'default';
    }
  }, [selectedMesh, hoveredMesh]);

  return (
    <group
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={[1, 1, 1]}
      position={[0, -2, 0]}
    >
      {children}
    </group>
  );
};

export default MeshInteractionHandler;
