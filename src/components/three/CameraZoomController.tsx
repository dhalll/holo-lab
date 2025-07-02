
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraZoomControllerProps {
  selectedMesh: THREE.Mesh | null;
}

const CameraZoomController: React.FC<CameraZoomControllerProps> = ({ selectedMesh }) => {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (selectedMesh && controls) {
      // Calculate bounding box of the selected mesh
      const box = new THREE.Box3().setFromObject(selectedMesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Calculate the distance needed to fit the object in view
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5; // Add some padding
      
      // Ensure minimum distance
      cameraDistance = Math.max(cameraDistance, 2);
      
      // Calculate new camera position
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      const newPosition = center.clone().sub(direction.multiplyScalar(cameraDistance));
      
      // Animate camera to new position
      if ('object' in controls) {
        const orbitControls = controls as any;
        orbitControls.target.copy(center);
        
        // Smoothly animate to new position
        const startPosition = camera.position.clone();
        const startTime = Date.now();
        const duration = 1000; // 1 second animation
        
        const animateCamera = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Smooth easing function
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          camera.position.lerpVectors(startPosition, newPosition, easeProgress);
          orbitControls.update();
          
          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          }
        };
        
        animateCamera();
      }
    }
  }, [selectedMesh, camera, controls]);

  return null;
};

export default CameraZoomController;
