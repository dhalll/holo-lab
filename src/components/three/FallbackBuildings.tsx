import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface FallbackBuildingsProps {
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
}

const FallbackBuildings: React.FC<FallbackBuildingsProps> = ({ onBuildingClick }) => {
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const handleClick = (buildingName: string, mesh: THREE.Mesh) => {
    // First, deselect the previous mesh if there was one
    if (selectedMesh && selectedMesh.userData.originalMaterial) {
      selectedMesh.material = selectedMesh.userData.originalMaterial;
    }
    
    // Then select the new mesh with orange highlighting
    if (mesh.userData.originalMaterial) {
      mesh.material = new THREE.MeshLambertMaterial({ 
        color: 0xF57B4E,
        transparent: false,
        opacity: 1
      });
    }
    
    // Update the selected mesh state
    setSelectedMesh(mesh);
    console.log('Building clicked:', buildingName);
    if (onBuildingClick) {
      onBuildingClick(buildingName, mesh);
    }
  };

  const handlePointerOver = (mesh: THREE.Mesh, buildingName: string) => {
    setHoveredBuilding(buildingName);
    document.body.style.cursor = 'pointer';
    
    // Only highlight on hover if it's not the selected mesh
    if (selectedMesh !== mesh) {
      // Highlight the building with orange color #F57B4E but keep it visible
      if (mesh.material) {
        mesh.material = new THREE.MeshLambertMaterial({ 
          color: 0xF57B4E,
          transparent: true,
          opacity: 0.8
        });
      }
    }
  };

  const handlePointerOut = (mesh: THREE.Mesh) => {
    setHoveredBuilding(null);
    document.body.style.cursor = 'default';
    
    // Only restore original material if it's not the selected mesh
    if (selectedMesh !== mesh) {
      // Restore original material
      if (mesh.userData.originalMaterial) {
        mesh.material = mesh.userData.originalMaterial;
      }
    }
  };

  useEffect(() => {
    // Create fallback buildings when component mounts
    const buildings = [
      { name: 'building_1', position: [-2, 0, -2], size: [1, 2, 1] },
      { name: 'building_2', position: [0, 0, -2], size: [1.5, 3, 1] },
      { name: 'building_3', position: [2, 0, -2], size: [1, 1.5, 1] },
      { name: 'building_4', position: [-2, 0, 0], size: [1, 2.5, 1] },
      { name: 'building_5', position: [2, 0, 0], size: [1.2, 1.8, 1] },
      { name: 'building_6', position: [-1, 0, 2], size: [1, 3.5, 1] },
      { name: 'building_7', position: [1, 0, 2], size: [1.3, 2.2, 1] },
    ];

    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  const Building = ({ name, position, size }: { name: string; position: [number, number, number]; size: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (meshRef.current) {
        meshRef.current.userData.originalMaterial = meshRef.current.material;
        meshRef.current.userData.isBuilding = true;
        meshRef.current.userData.buildingName = name;
      }
    }, [name]);

    return (
      <mesh
        ref={meshRef}
        position={position}
        onClick={() => meshRef.current && handleClick(name, meshRef.current)}
        onPointerOver={() => meshRef.current && handlePointerOver(meshRef.current, name)}
        onPointerOut={() => meshRef.current && handlePointerOut(meshRef.current)}
      >
        <boxGeometry args={size} />
        <meshLambertMaterial color={0x888888} />
      </mesh>
    );
  };

  return (
    <group position={[0, -2, 0]}>
      {/* Ground plane */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color={0x90EE90} />
      </mesh>
      
      {/* Buildings */}
      <Building name="building_1" position={[-2, 0, -2]} size={[1, 2, 1]} />
      <Building name="building_2" position={[0, 0, -2]} size={[1.5, 3, 1]} />
      <Building name="building_3" position={[2, 0, -2]} size={[1, 1.5, 1]} />
      <Building name="building_4" position={[-2, 0, 0]} size={[1, 2.5, 1]} />
      <Building name="building_5" position={[2, 0, 0]} size={[1.2, 1.8, 1]} />
      <Building name="building_6" position={[-1, 0, 2]} size={[1, 3.5, 1]} />
      <Building name="building_7" position={[1, 0, 2]} size={[1.3, 2.2, 1]} />
    </group>
  );
};

export default FallbackBuildings;
