
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraController: React.FC = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

export default CameraController;
