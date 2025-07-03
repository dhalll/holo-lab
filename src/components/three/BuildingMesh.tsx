
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialManager } from './MaterialManager';
import MeshInteractionHandler from './MeshInteractionHandler';
import CameraZoomController from './CameraZoomController';
import FallbackBuildings from './FallbackBuildings';

interface BuildingMeshProps {
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
  isolatedMeshId?: string | null;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf",
  isolatedMeshId = null
}) => {
  const [modelError, setModelError] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const [isolatedMesh, setIsolatedMesh] = useState<THREE.Mesh | null>(null);
  const meshRef = useRef<THREE.Group>(null);
  const { camera, controls, scene } = useThree();
  
  // Try to load GLTF with error handling
  let gltfScene = null;
  let gltfError = null;
  
  try {
    const gltfResult = useGLTF(modelPath);
    gltfScene = gltfResult.scene;
    console.log('GLTF loaded successfully:', modelPath);
  } catch (error) {
    console.warn('Failed to load GLTF model:', error);
    gltfError = error;
    setModelError(true);
  }

  useEffect(() => {
    if (gltfScene && meshRef.current && !modelError) {
      console.log('Setting up GLTF scene');
      setModelLoaded(true);
      
      // Clear existing children
      meshRef.current.clear();
      
      // Clone the scene and add to our mesh
      const clonedScene = gltfScene.clone();
      
      // Handle mesh isolation logic
      if (isolatedMeshId) {
        // Set subtle holo blue background
        scene.background = new THREE.Color('#A5C1C8');
        
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
              let cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 2;
              
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
                const duration = 1500;
                
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
        // Normal behavior - reset background and set up all meshes with default properties
        scene.background = null;
        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            MaterialManager.initializeMesh(child);
          }
        });
      }
      
      meshRef.current.add(clonedScene);
    } else if (gltfError || modelError) {
      console.log('Using fallback buildings due to GLTF load error');
      setModelError(true);
      setModelLoaded(false);
    }
  }, [gltfScene, isolatedMeshId, camera, controls, scene, modelError]);

  const handleMeshSelected = (mesh: THREE.Mesh | null) => {
    if (!isolatedMeshId) {
      setSelectedMesh(mesh);
    }
  };

  // If model failed to load, use fallback buildings
  if (modelError || (!modelLoaded && !gltfScene)) {
    console.log('Rendering fallback buildings');
    return (
      <>
        <FallbackBuildings onBuildingClick={onBuildingClick} />
        <CameraZoomController selectedMesh={selectedMesh} />
      </>
    );
  }

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
};

export default BuildingMesh;
