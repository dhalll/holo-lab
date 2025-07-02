
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialManager } from './MaterialManager';
import MeshInteractionHandler from './MeshInteractionHandler';
import CameraZoomController from './CameraZoomController';

interface BuildingMeshProps {
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
  isolatedMeshId?: string | null; // New prop for mesh isolation
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf",
  isolatedMeshId = null
}) => {
  const [modelError, setModelError] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const [isolatedMesh, setIsolatedMesh] = useState<THREE.Mesh | null>(null);
  const meshRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();
  
  try {
    const { scene } = useGLTF(modelPath);

    useEffect(() => {
      if (scene && meshRef.current) {
        // Clear existing children
        meshRef.current.clear();
        
        // Clone the scene and add to our mesh
        const clonedScene = scene.clone();
        
        // Handle mesh isolation logic
        if (isolatedMeshId) {
          let targetMesh: THREE.Mesh | null = null;
          
          // Traverse all meshes to find the target and hide others
          clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              MaterialManager.initializeMesh(child);
              
              // Check if this is the mesh we want to isolate
              const meshId = child.userData.buildingName || child.name || child.uuid;
              
              if (meshId === isolatedMeshId) {
                // This is our target mesh - make it visible and orange
                targetMesh = child;
                MaterialManager.setMeshToSelected(child);
                child.visible = true;
              } else {
                // Hide all other meshes by making them transparent
                if (MaterialManager.isMeshMaterial(child.material)) {
                  const transparentMaterial = new THREE.MeshStandardMaterial({
                    transparent: true,
                    opacity: 0
                  });
                  child.material = transparentMaterial;
                }
                child.visible = false;
              }
            }
          });
          
          // Set the isolated mesh and center camera on it
          if (targetMesh) {
            setIsolatedMesh(targetMesh);
            setSelectedMesh(targetMesh);
            
            // Center camera on the isolated mesh after a short delay
            setTimeout(() => {
              if (targetMesh && camera && controls) {
                const box = new THREE.Box3().setFromObject(targetMesh);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Calculate the distance needed to fit the object in view
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
                let cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 2; // Increased padding for better view
                
                // Ensure minimum distance
                cameraDistance = Math.max(cameraDistance, 3);
                
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
                  const duration = 1500; // 1.5 second animation
                  
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
            }, 100);
          }
        } else {
          // Normal behavior - set up all meshes with default properties
          clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              MaterialManager.initializeMesh(child);
            }
          });
        }
        
        meshRef.current.add(clonedScene);
      }
    }, [scene, isolatedMeshId, camera, controls]);

    const handleMeshSelected = (mesh: THREE.Mesh | null) => {
      if (!isolatedMeshId) { // Only update selection if not in isolation mode
        setSelectedMesh(mesh);
      }
    };

    // If we're in isolation mode, don't render interactive components
    if (isolatedMeshId) {
      return (
        <>
          <group 
            ref={meshRef} 
            scale={[1, 1, 1]}
            position={[0, -2, 0]}
          />
          <CameraZoomController selectedMesh={isolatedMesh} />
        </>
      );
    }

    // Normal interactive mode
    return (
      <>
        <MeshInteractionHandler
          meshRef={meshRef}
          onBuildingClick={onBuildingClick}
          onMeshSelected={handleMeshSelected}
        >
          <group ref={meshRef} />
        </MeshInteractionHandler>
        <CameraZoomController selectedMesh={selectedMesh} />
      </>
    );
  } catch (error) {
    console.warn('Failed to load GLTF model:', error);
    return null;
  }
};

export default BuildingMesh;
