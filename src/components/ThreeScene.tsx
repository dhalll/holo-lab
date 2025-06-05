
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';

const RotatingStructure = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Mock pipe structure */}
      <Box position={[0, 0, 0]} args={[0.1, 2, 0.1]} material-color="#C8C8C8" />
      <Box position={[1, 0, 0]} args={[0.1, 2, 0.1]} material-color="#C8C8C8" />
      <Box position={[-1, 0, 0]} args={[0.1, 2, 0.1]} material-color="#C8C8C8" />
      <Box position={[0, 0, 1]} args={[0.1, 2, 0.1]} material-color="#C8C8C8" />
      <Box position={[0, 0, -1]} args={[0.1, 2, 0.1]} material-color="#C8C8C8" />
      
      {/* Joints */}
      <Box position={[0, 1, 0]} args={[0.2, 0.2, 0.2]} material-color="#F57B4E" />
      <Box position={[1, 1, 0]} args={[0.2, 0.2, 0.2]} material-color="#F57B4E" />
      <Box position={[-1, 1, 0]} args={[0.2, 0.2, 0.2]} material-color="#F57B4E" />
      <Box position={[0, 1, 1]} args={[0.2, 0.2, 0.2]} material-color="#F57B4E" />
      <Box position={[0, 1, -1]} args={[0.2, 0.2, 0.2]} material-color="#F57B4E" />
    </group>
  );
};

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingStructure />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
