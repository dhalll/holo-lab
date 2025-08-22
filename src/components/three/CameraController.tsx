
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraController: React.FC = () => {
  // Safely access useThree with error handling
  let camera: THREE.Camera;
  try {
    const threeState = useThree();
    camera = threeState.camera;
  } catch (error) {
    console.error('CameraController: useThree hook failed:', error);
    return null;
  }
  
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

export default CameraController;
