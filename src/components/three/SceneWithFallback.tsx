
import React, { useState } from 'react';
import BuildingMesh from './BuildingMesh';
import FallbackBuildings from './FallbackBuildings';
import * as THREE from 'three';

interface SceneWithFallbackProps {
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

const SceneWithFallback: React.FC<SceneWithFallbackProps> = ({ onBuildingClick, modelPath }) => {
  const [useFallback, setUseFallback] = useState(false);

  const handleModelError = () => {
    setUseFallback(true);
  };

  if (useFallback) {
    return <FallbackBuildings onBuildingClick={onBuildingClick} />;
  }

  return (
    <>
      <BuildingMesh onBuildingClick={onBuildingClick} modelPath={modelPath} />
      <FallbackBuildings onBuildingClick={onBuildingClick} />
    </>
  );
};

export default SceneWithFallback;
