import React, { useRef, Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Define the colors for selection and default states
const SELECTED_COLOR = new THREE.Color(0xF57B4E); // The requested darker orange
const HOVER_EMISSIVE_COLOR = new THREE.Color(0x111111); // A subtle dark glow for hover
const DEFAULT_MESH_COLOR = new THREE.Color(0xcccccc); // A light grey for unselected meshes

interface GLTFModelProps {
  onBuildingClick: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
}

const GLTFModel = ({ onBuildingClick, modelPath = '/lovable-uploads/scene (2).gltf' }: GLTFModelProps) => {
  // Ensure the model path is correctly encoded for spaces or special characters
  const finalPath = modelPath.includes('%20') ? modelPath : encodeURI(modelPath);
  console.log('Loading GLTF from original path:', modelPath);
  console.log('Final encoded path:', finalPath);
  
  // useGLTF hook loads the 3D model. It handles caching and suspense.
  const { scene } = useGLTF(finalPath); 
  console.log('GLTF scene loaded successfully:', scene);

  // useRef to hold a reference to the entire model group in the Three.js scene
  const modelRef = useRef<THREE.Group>(null); 
  // useThree hook provides access to the Three.js context (camera, renderer, gl context)
  const { camera, gl } = useThree(); 
  
  // State to manage the currently hovered and selected objects (meshes)
  const [hoveredObject, setHoveredObject] = useState<THREE.Mesh | null>(null);
  const [selectedObject, setSelectedObject] = useState<THREE.Mesh | null>(null);
  
  // Refs for Raycaster and Mouse Vector2 for efficient updates in callbacks
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Map to store the TRUE original material of each mesh at load time.
  // This is crucial for correctly reverting colors without losing original properties.
  const originalMaterialsMap = useRef(new Map<THREE.Mesh, THREE.Material | THREE.Material[]>());

  // Effect to traverse the scene and store original materials once on initial load.
  // It also sets an initial default color for all meshes.
  useEffect(() => {
    if (scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          // Store a deep clone of the material to ensure we have an unmodified version.
          // This handles both single materials and arrays of materials (MultiMaterial).
          const clonedMaterial = object.material instanceof Array
            ? object.material.map(mat => (mat as THREE.Material).clone())
            : (object.material as THREE.Material).clone();
          
          originalMaterialsMap.current.set(object, clonedMaterial);

          // Apply a default color to all meshes initially.
          // This ensures a consistent base state before any interaction.
          if (object.material instanceof THREE.MeshStandardMaterial) {
              object.material.color.set(DEFAULT_MESH_COLOR);
              object.material.emissive.set(0x000000); // Ensure no initial emissive
          } else if (object.material instanceof Array) {
              object.material.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.color.set(DEFAULT_MESH_COLOR);
                      mat.emissive.set(0x000000);
                  }
              });
          }
        }
      });
      console.log('Original materials stored for:', originalMaterialsMap.current.size, 'meshes');
    }
  }, [scene]); // This effect runs only when the 'scene' object changes (i.e., on initial GLTF load).

  // Callback to apply a material to a mesh (handles single or array of materials)
  const applyMaterial = useCallback((mesh: THREE.Mesh, material: THREE.Material | THREE.Material[]) => {
    if (material instanceof Array) {
      mesh.material = material.map(mat => mat.clone());
    } else {
      mesh.material = material.clone();
    }
  }, []);

  // Callback to reset a mesh to its true original appearance using the stored original material.
  const resetMeshAppearance = useCallback((mesh: THREE.Mesh) => {
    const originalMaterial = originalMaterialsMap.current.get(mesh);
    if (originalMaterial) {
      applyMaterial(mesh, originalMaterial); // Restore the true original material
    } else {
      // Fallback: If original not found (should ideally not happen), set to a default grey.
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.color.set(DEFAULT_MESH_COLOR);
        mesh.material.emissive.set(0x000000);
      } else if (mesh.material instanceof Array) {
        mesh.material.forEach(mat => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.color.set(DEFAULT_MESH_COLOR);
            mat.emissive.set(0x000000);
          }
        });
      }
    }
  }, [applyMaterial]);

  // handlePointerMove: Manages hover effects on meshes.
  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!modelRef.current) return;

    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);

    const newHoveredObject = intersects.length > 0 ? (intersects[0].object as THREE.Mesh) : null;

    // Logic for un-hovering the previous object
    if (hoveredObject && hoveredObject !== newHoveredObject) {
      // Only reset if the hoveredObject is NOT the currently selectedObject
      if (hoveredObject !== selectedObject) {
        resetMeshAppearance(hoveredObject);
      }
      setHoveredObject(null); // Clear hovered state
    }

    // Logic for hovering over a new object
    if (newHoveredObject && newHoveredObject instanceof THREE.Mesh && newHoveredObject !== hoveredObject) {
      // Only apply hover effect if the new object is NOT the currently selectedObject
      if (newHoveredObject !== selectedObject) {
        // Apply a subtle emissive (glow) for hover effect
        if (newHoveredObject.material instanceof THREE.MeshStandardMaterial) {
          newHoveredObject.material.emissive.set(HOVER_EMISSIVE_COLOR); 
        } else if (newHoveredObject.material instanceof Array) {
          newHoveredObject.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive.set(HOVER_EMISSIVE_COLOR);
            }
          });
        }
        setHoveredObject(newHoveredObject); // Set new hovered state
      }
    }
  }, [camera, gl, hoveredObject, selectedObject, resetMeshAppearance]);

  // handlePointerLeave: Explicitly handles when the mouse leaves the entire model group.
  // This ensures the hover effect is removed when moving off the canvas.
  const handlePointerLeave = useCallback(() => {
    if (hoveredObject && hoveredObject !== selectedObject) {
      resetMeshAppearance(hoveredObject);
      setHoveredObject(null);
    }
  }, [hoveredObject, selectedObject, resetMeshAppearance]);


  // handleClick: Manages selection and deselection of meshes.
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    if (!modelRef.current) return;

    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(modelRef.current.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh; // Cast the intersected object to a Mesh
      
      if (object instanceof THREE.Mesh) {
        // Case 1: Clicking the currently selected object (to deselect it)
        if (selectedObject === object) {
          resetMeshAppearance(selectedObject); // Reset its color to original
          setSelectedObject(null); // Clear selected state
          onBuildingClick(null, null); // Inform parent nothing is selected
        } 
        // Case 2: Clicking a new object
        else {
          // Deselect the previously selected object if one exists
          if (selectedObject) {
            resetMeshAppearance(selectedObject); // Reset its color to original
          }

          // Apply the darker orange color to the newly clicked object
          if (object.material instanceof THREE.MeshStandardMaterial) {
            object.material.color.copy(SELECTED_COLOR); // Set main color to orange
            object.material.emissive.set(0x000000); // Ensure no emissive from hover
          } else if (object.material instanceof Array) {
            object.material.forEach(mat => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.color.copy(SELECTED_COLOR);
                mat.emissive.set(0x000000);
              }
            });
          }
          
          setSelectedObject(object); // Update selected object state to the new one
          
          // Get a meaningful name for the clicked building
          const buildingName = object.name || object.parent?.name || `Mesh_${object.uuid.slice(0, 8)}`;
          console.log('Building clicked:', buildingName);
          onBuildingClick(buildingName, object); // Inform parent component about the new selection
        }
      }
    } else {
      // Clicked outside any mesh: deselect the current one if any is selected
      if (selectedObject) {
        resetMeshAppearance(selectedObject); // Reset its color to original
        setSelectedObject(null); // Clear selected state
        onBuildingClick(null, null); // Inform parent that nothing is selected
      }
    }
  }, [camera, gl, onBuildingClick, selectedObject, resetMeshAppearance]);

  // The <group> component is a container for the 3D model.
  // It attaches the ref and event handlers for pointer interactions.
  return (
    <group 
      ref={modelRef}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onPointerLeave={handlePointerLeave} // Added onPointerLeave handler
    >
      {/* <primitive> is used to render a raw Three.js object (like the loaded GLTF scene) */}
      <primitive object={scene} scale={[5, 5, 5]} />
    </group>
  );
};

// Fallback component to display if the GLTF model fails to load (e.g., network error, invalid path)
const FallbackModel = ({ onBuildingClick }: { onBuildingClick: (buildingName: string | null, mesh?: THREE.Mesh | null) => void }) => {
  // Use useEffect to inform the parent component that a fallback model is active.
  useEffect(() => {
    onBuildingClick('Fallback Model', null);
  }, [onBuildingClick]);

  return (
    // A simple group of colored boxes as a visual fallback
    <group onClick={(event) => {
      console.log('Fallback building clicked');
      onBuildingClick('Fallback Building', undefined);
    }}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[1.5, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#F57B4E" />
      </mesh>
      <mesh position={[-1.5, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#7ED321" />
      </mesh>
    </group>
  );
};

interface ThreeSceneProps {
  className?: string;
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
}

// ThreeScene component: Sets up the R3F Canvas and includes the GLTFModel.
const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = '', 
  onBuildingClick = (name, mesh) => console.log('Building clicked:', name, mesh),
  modelPath = '/lovable-uploads/scene (2).gltf' // Default model path
}) => {
  console.log('ThreeScene initialized with modelPath:', modelPath);
  
  return (
    <div className={`w-full h-full ${className}`}>
      {/* Canvas is the main R3F component that sets up the WebGL renderer and scene */}
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 50 }} // Initial camera position and field of view
        onCreated={({ gl }) => {
          gl.setClearColor('#FFFFFF'); // Set the background color of the canvas to white
          console.log('Canvas created successfully');
        }}
      >
        {/* Lighting for the scene */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />

        {/* Suspense handles the loading state of the GLTF model.
            While the model is loading, the FallbackModel is displayed. */}
        <Suspense fallback={
          <FallbackModel onBuildingClick={onBuildingClick} /> 
        }>
          {/* Render the GLTFModel component, passing down click handler and model path */}
          <GLTFModel onBuildingClick={onBuildingClick} modelPath={modelPath} />
        </Suspense>

        {/* OrbitControls allows the user to pan, zoom, and rotate the camera around the scene */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;