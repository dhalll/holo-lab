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
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);

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
          child.userData.buildingName = child.name || `mesh_${Math.random().toString(36).substr(2, 9)}`;
        }
      });
    }
  }, [scene]);

  const handleClick = (event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    if (intersected && intersected.object.userData.isBuilding && onBuildingClick) {
      const clickedMesh = intersected.object as THREE.Mesh;
      const buildingName = intersected.object.userData.buildingName;
      
      // Deselect previous mesh if there was one
      if (selectedMesh && selectedMesh !== clickedMesh) {
        if (selectedMesh.userData.originalMaterial) {
          selectedMesh.material = selectedMesh.userData.originalMaterial;
        }
      }
      
      // Select the new mesh with orange highlighting but keep it visible
      if (clickedMesh.userData.originalMaterial) {
        const originalMaterial = clickedMesh.userData.originalMaterial as THREE.Material;
        clickedMesh.material = new THREE.MeshLambertMaterial({ 
          color: 0xF57B4E,
          transparent: false,
          opacity: 1
        });
      }
      
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
      
      // Only highlight on hover if it's not the selected mesh
      if (selectedMesh !== intersected.object) {
        // Highlight the building with orange color #F57B4E but keep it visible
        if (intersected.object.material) {
          intersected.object.material = new THREE.MeshLambertMaterial({ 
            color: 0xF57B4E,
            transparent: true,
            opacity: 0.8
          });
        }
      }
    }
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    const intersected = event.intersections[0];
    if (intersected && intersected.object.userData.isBuilding) {
      setHoveredBuilding(null);
      document.body.style.cursor = 'default';
      
      // Only restore original material if it's not the selected mesh
      if (selectedMesh !== intersected.object) {
        // Restore original material
        if (intersected.object.userData.originalMaterial) {
          intersected.object.material = intersected.object.userData.originalMaterial;
        }
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
