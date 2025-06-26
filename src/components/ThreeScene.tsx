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

const FallbackBuildings: React.FC<BuildingMeshProps> = ({ onBuildingClick }) => {
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
        
        // First, deselect the previous mesh if there was one
        if (selectedMesh && selectedMesh.userData.originalMaterial) {
          selectedMesh.material = selectedMesh.userData.originalMaterial;
        }
        
        // Then select the new mesh with orange highlighting
        if (clickedMesh.userData.originalMaterial) {
          clickedMesh.material = new THREE.MeshLambertMaterial({ 
            color: 0xF57B4E,
            transparent: false,
            opacity: 1
          });
        }
        
        // Update the selected mesh state
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
  } catch (error) {
    console.warn('Failed to load GLTF model, using fallback buildings:', error);
    return <FallbackBuildings onBuildingClick={onBuildingClick} />;
  }
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
