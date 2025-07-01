
import React from 'react';
import BuildingMesh from './BuildingMesh';
import * as THREE from 'three';

interface SceneWithFallbackProps {
  onBuildingClick?: (buildingName: string, mesh?: THREE.Mesh) => void;
  modelPath?: string;
}

const SceneWithFallback: React.FC<SceneWithFallbackProps> = ({ onBuildingClick, modelPath }) => {
  return (
    <BuildingMesh onBuildingClick={onBuildingClick} modelPath={modelPath} />
  );
};

export default SceneWithFallback;
