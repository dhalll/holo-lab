
import React, { useRef, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLTFModel = ({ onBuildingClick }: { onBuildingClick: (buildingName: string) => void }) => {
  console.log('Loading GLTF from: /lovable-uploads/scene.gltf');
  
  try {
    const { scene } = useGLTF('/lovable-uploads/scene.gltf');
    const modelRef = useRef<THREE.Group>(null);
    const { camera, gl } = useThree();
    const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    console.log('GLTF scene loaded:', scene);

    // Store original materials for hover effects
    const originalMaterials = useRef(new Map<THREE.Object3D, THREE.Material | THREE.Material[]>());

    const createMaterialWithColor = (originalMaterial: THREE.Material | THREE.Material[], color: THREE.Color) => {
      if (originalMaterial instanceof Array) {
        return originalMaterial.map(mat => {
          const clonedMat = mat.clone();
          if ('emissive' in clonedMat && clonedMat.emissive instanceof THREE.Color) {
            clonedMat.emissive = color;
          }
          return clonedMat;
        });
      } else {
        const clonedMat = originalMaterial.clone();
        if ('emissive' in clonedMat && clonedMat.emissive instanceof THREE.Color) {
          clonedMat.emissive = color;
        }
        return clonedMat;
      }
    };

    const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
      if (!modelRef.current) return;

      mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);

      // Reset previous hover if it's not the selected object
      if (hoveredObject && hoveredObject !== intersects[0]?.object && hoveredObject !== selectedObject) {
        const originalMaterial = originalMaterials.current.get(hoveredObject);
        if (originalMaterial && hoveredObject instanceof THREE.Mesh) {
          hoveredObject.material = originalMaterial;
        }
        setHoveredObject(null);
      }

      // Apply hover effect to new object (only if it's not already selected)
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object instanceof THREE.Mesh && object !== hoveredObject && object !== selectedObject) {
          // Store original material if not already stored
          if (!originalMaterials.current.has(object)) {
            originalMaterials.current.set(object, object.material);
          }

          // Create holo blue highlight material for hover
          const holoBlueColor = new THREE.Color(0x00CED1); // holo blue/cyan
          const highlightMaterial = createMaterialWithColor(object.material, holoBlueColor);

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
        
        // Reset previous selection
        if (selectedObject && selectedObject instanceof THREE.Mesh) {
          const originalMaterial = originalMaterials.current.get(selectedObject);
          if (originalMaterial) {
            selectedObject.material = originalMaterial;
          }
        }

        // Set new selection
        if (object instanceof THREE.Mesh) {
          // Store original material if not already stored
          if (!originalMaterials.current.has(object)) {
            originalMaterials.current.set(object, object.material);
          }

          // Create orange selection material
          const orangeColor = new THREE.Color(0xFF6600); // orange
          const selectionMaterial = createMaterialWithColor(object.material, orangeColor);

          object.material = selectionMaterial;
          setSelectedObject(object);
          
          // Clear hover state since this object is now selected
          if (hoveredObject === object) {
            setHoveredObject(null);
          }

          const buildingName = object.name || object.parent?.name || 'Unknown Building';
          console.log('Building clicked:', buildingName);
          onBuildingClick(buildingName);
        }
      }
    }, [camera, gl, onBuildingClick, selectedObject, hoveredObject]);

    useFrame((state, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += delta * 0.1;
      }
    });

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
  onBuildingClick?: (buildingName: string) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = '', 
  onBuildingClick = (name) => console.log('Building clicked:', name)
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f0f0f0');
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
          <GLTFModel onBuildingClick={onBuildingClick} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
