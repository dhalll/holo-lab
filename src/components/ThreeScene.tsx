
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLTFModel = () => {
  const { scene } = useGLTF('/lovable-uploads/scene.gltf');
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={[1, 1, 1]} />
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
        <Suspense fallback={null}>
          <GLTFModel />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
