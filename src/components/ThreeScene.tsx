
import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

interface ModelProps {
  modelPath: string;
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
}

function Model({ modelPath, onBuildingClick }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const [hoveredMesh, setHoveredMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData.originalColor = child.material instanceof THREE.Material 
            ? child.material.color?.clone() 
            : null;
          
          // Add click handler
          child.userData.onClick = () => {
            console.log('Mesh clicked:', child.name || 'unnamed mesh');
            if (onBuildingClick) {
              onBuildingClick(child.name || `mesh_${child.id}`, child);
            }
          };
        }
      });
    }
  }, [scene, onBuildingClick]);

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    const mesh = event.object as THREE.Mesh;
    setHoveredMesh(mesh);
    
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.color.setHex(0xff6b35);
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: any) => {
    const mesh = event.object as THREE.Mesh;
    setHoveredMesh(null);
    
    if (mesh.userData.originalColor && mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.color.copy(mesh.userData.originalColor);
    }
    document.body.style.cursor = 'default';
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    const mesh = event.object as THREE.Mesh;
    console.log('3D Model clicked:', mesh.name || `mesh_${mesh.id}`);
    
    if (onBuildingClick) {
      onBuildingClick(mesh.name || `mesh_${mesh.id}`, mesh);
    }
  };

  return (
    <primitive 
      object={scene} 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = "", 
  onBuildingClick,
  modelPath = "/lovable-uploads/scene (2).gltf"
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mountRef} className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ 
          position: [0, 5, 10], 
          fov: 75,
          aspect: 1,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#f0f8ff' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Model modelPath={modelPath} onBuildingClick={onBuildingClick} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
