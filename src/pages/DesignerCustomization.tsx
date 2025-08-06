import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import ThreeScene from '@/components/ThreeScene';
import MaterialsDatabase from '@/components/MaterialsDatabase';
import { Send, Database, Building } from 'lucide-react';

const DesignerCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedMeshName = location.state?.selectedMeshName || null;
  const cameraPosition = location.state?.cameraPosition || null;
  const cameraTarget = location.state?.cameraTarget || null;

  const [variantModelPath, setVariantModelPath] = useState("");
  const [useVariantModel, setUseVariantModel] = useState(false);

  useEffect(() => {
    if (selectedMeshName === "mesh_448") {
      const variants = [
        "/lovable-uploads/structure example.gltf",
        "/lovable-uploads/test to upload to three,js 2.gltf"
      ];
      const chosen = variants[Math.floor(Math.random() * variants.length)];
      setVariantModelPath(chosen);
      setUseVariantModel(true);
    }
  }, [selectedMeshName]);

  return (
    <ThreeScene
      modelPath={useVariantModel ? variantModelPath : "/lovable-uploads/scene(2).gltf"}
      isolatedMeshId={useVariantModel ? null : selectedMeshName}
    />
  );
};

export default DesignerCustomization;