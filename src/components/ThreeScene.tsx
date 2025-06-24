import React, { useRef, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLTFModel = ({ 
  onBuildingClick, 
  modelPath = '/lovable-uploads/scene (2).gltf' 
}: { 
  onBuildingClick: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}) => {
  console.log('Loading GLTF from:', modelPath);
  
  try {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef<THREE.Group>(null);
    const { camera, gl } = useThree();
    const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
    const [selectedObject, setSelectedObject] = useState<THREE.Mesh | null>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    console.log('GLTF scene loaded:', scene);

    // Store original materials for hover and selection effects
    const originalMaterials = useRef(new Map<THREE.Object3D, THREE.Material | THREE.Material[]>());

    const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
      if (!modelRef.current) return;

      mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);

      // Reset previous hover (but don't reset selected object)
      if (hoveredObject && hoveredObject !== intersects[0]?.object && hoveredObject !== selectedObject) {
        const originalMaterial = originalMaterials.current.get(hoveredObject);
        if (originalMaterial && hoveredObject instanceof THREE.Mesh) {
          hoveredObject.material = originalMaterial;
        }
        setHoveredObject(null);
      }

      // Apply hover effect to new object (if it's not already selected)
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object instanceof THREE.Mesh && object !== hoveredObject && object !== selectedObject) {
          // Store original material if not already stored
          if (!originalMaterials.current.has(object)) {
            originalMaterials.current.set(object, object.material);
          }

          // Create highlighted material
          const highlightMaterial = object.material instanceof Array 
            ? object.material.map((mat: any) => mat.clone())
            : (object.material as any).clone();

          if (highlightMaterial instanceof Array) {
            highlightMaterial.forEach((mat: any) => {
              if ('emissive' in mat && mat.emissive instanceof THREE.Color) {
                mat.emissive = new THREE.Color(0x444444);
              }
            });
          } else if ('emissive' in highlightMaterial && highlightMaterial.emissive instanceof THREE.Color) {
            highlightMaterial.emissive = new THREE.Color(0x444444);
          }

          object.material = highlightMaterial;
          setHoveredObject(object);
        }
      }
    }, [camera, gl, hoveredObject, selectedObject]);

    const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
      if (!modelRef.current) return;

      mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        
        if (object instanceof THREE.Mesh) {
          // Reset previous selection
          if (selectedObject && selectedObject !== object) {
            const originalMaterial = originalMaterials.current.get(selectedObject);
            if (originalMaterial) {
              selectedObject.material = originalMaterial;
            }
          }

          // Store original material if not already stored
          if (!originalMaterials.current.has(object)) {
            originalMaterials.current.set(object, object.material);
          }

          // Apply selection material with hex color #F57B4E
          const selectionMaterial = object.material instanceof Array 
            ? object.material.map((mat: any) => mat.clone())
            : (object.material as any).clone();

          if (selectionMaterial instanceof Array) {
            selectionMaterial.forEach((mat: any) => {
              if ('emissive' in mat && mat.emissive instanceof THREE.Color) {
                mat.emissive = new THREE.Color(0xF57B4E);
              }
              if ('color' in mat && mat.color instanceof THREE.Color) {
                mat.color = new THREE.Color(0xF57B4E);
              }
            });
          } else {
            if ('emissive' in selectionMaterial && selectionMaterial.emissive instanceof THREE.Color) {
              selectionMaterial.emissive = new THREE.Color(0xF57B4E);
            }
            if ('color' in selectionMaterial && selectionMaterial.color instanceof THREE.Color) {
              selectionMaterial.color = new THREE.Color(0xF57B4E);
            }
          }

          object.material = selectionMaterial;
          setSelectedObject(object);

          const buildingName = object.name || object.parent?.name || `Mesh_${object.uuid.slice(0, 8)}`;
          console.log('Building clicked:', buildingName);
          onBuildingClick(buildingName, object);
        }
      }
    }, [camera, gl, onBuildingClick, selectedObject]);

    return (
      <group 
        ref={modelRef}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        <primitive object={scene} scale={[5, 5, 5]} />
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
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = '', 
  onBuildingClick = (name, mesh) => console.log('Building clicked:', name, mesh),
  modelPath = '/lovable-uploads/scene (2).gltf'
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#FFFFFF'); // White background
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        }>
          <GLTFModel onBuildingClick={onBuildingClick} modelPath={modelPath} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
