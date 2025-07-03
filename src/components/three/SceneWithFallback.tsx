
import React, { Suspense, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import BuildingMesh from './BuildingMesh';
import FallbackBuildings from './FallbackBuildings';

interface SceneWithFallbackProps {
  onBuildingClick?: (buildingName: string | null, mesh?: THREE.Mesh | null) => void;
  modelPath?: string;
  isolatedMeshId?: string | null;
}

const LoadingFallback = () => (
  <Text 
    position={[0, 0, 0]} 
    fontSize={0.5} 
    color="white"
    anchorX="center" 
    anchorY="middle"
  >
    Loading 3D Model...
  </Text>
);

const ErrorFallback: React.FC<SceneWithFallbackProps> = ({ 
  onBuildingClick 
}) => {
  console.log('Rendering error fallback with simple buildings');
  return <FallbackBuildings onBuildingClick={onBuildingClick} />;
};

const SceneWithFallback: React.FC<SceneWithFallbackProps> = ({ 
  onBuildingClick, 
  modelPath = "/lovable-uploads/scene (2).gltf",
  isolatedMeshId = null
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorFallback onBuildingClick={onBuildingClick} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <BuildingMesh 
        onBuildingClick={onBuildingClick} 
        modelPath={modelPath}
        isolatedMeshId={isolatedMeshId}
      />
    </Suspense>
  );
};

export default SceneWithFallback;
