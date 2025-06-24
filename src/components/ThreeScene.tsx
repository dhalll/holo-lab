
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLTFModel = () => {
  console.log('Loading GLTF from: /lovable-uploads/scene.gltf');
  
  try {
    const { scene } = useGLTF('/lovable-uploads/scene.gltf');
    const modelRef = useRef<THREE.Group>(null);

    console.log('GLTF scene loaded:', scene);

    useFrame((state, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += delta * 0.1;
      }
    });

    return (
      <group ref={modelRef}>
        <primitive object={scene} scale={[2, 2, 2]} />
      </group>
    );
  } catch (error) {
    console.error('Error loading GLTF:', error);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
};

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        }>
          <GLTFModel />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
