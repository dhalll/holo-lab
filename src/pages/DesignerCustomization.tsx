// ✅ Fully integrated DesignerCustomization with mesh_448 model variants and full original UI logic + chat logic
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

  const [variantModelPath, setVariantModelPath] = useState("/lovable-uploads/scene(2).gltf");
  const [useVariantModel, setUseVariantModel] = useState(false);
  const [showMaterialsDatabase, setShowMaterialsDatabase] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi there! How can we customize your space?'
    }
  ]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (selectedMeshName === "mesh_448") {
      const variants = [
        "/lovable-uploads/mesh448_1.gltf",
        "/lovable-uploads/mesh448_2.gltf"
      ];
      const chosen = variants[Math.floor(Math.random() * variants.length)];
      setVariantModelPath(chosen);
      setUseVariantModel(true);
    }
  }, [selectedMeshName]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: userInput },
        { type: 'bot', content: 'Thanks! We\'ll take that into account.' }
      ]);
      setUserInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative overflow-hidden">
      <ProgressBar currentStep={3} />

      <BackButton onClick={() => navigate('/designer/location')} />

      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black z-10">
        CUSTOMIZE
      </h1>

      {/* Top Right Logo */}
      <div className="absolute top-0 right-10 z-15 p-0 py-0 px-0">
        <HoloLogo variant="top-right" className="w-24 h-24" />
      </div>

      <div className="px-8 pt-16 pb-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        {/* Centered Map */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* 3D Map Window */}
            <div className="mb-6">
              <WorkflowWindow className="w-[600px] h-[600px]">
                <ThreeScene
                  className="w-full h-full"
                  modelPath={useVariantModel ? variantModelPath : "/lovable-uploads/scene(2).gltf"}
                  isolatedMeshId={useVariantModel ? null : selectedMeshName}
                />
              </WorkflowWindow>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="ml-12 w-[300px] flex flex-col h-[600px]">
          <div className="h-full bg-gradient-to-b from-white to-holo-teal rounded-xl flex flex-col p-4">
            <div className="flex justify-end space-x-3 mb-4">
              <button
                onClick={() => setShowMaterialsDatabase(true)}
                className="w-10 h-10 bg-holo-black border-2 border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral transition-colors duration-200"
              >
                <Database size={20} className="text-white" />
              </button>
              <button
                onClick={() => navigate('/environmental-analysis')}
                className="w-10 h-10 bg-holo-black border-2 border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral transition-colors duration-200"
              >
                <Building size={20} className="text-white" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                    msg.type === 'user' ? 'bg-holo-coral text-white' : 'bg-white border border-holo-teal/20'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-holo-teal/20 pt-4 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Add any specific requirements..."
                  className="flex-1 px-4 py-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-holo-coral text-white rounded-lg hover:bg-holo-coral/80 transition-colors duration-200"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Materials Database Modal */}
      {showMaterialsDatabase && (
        <MaterialsDatabase
          isOpen={showMaterialsDatabase}
          onClose={() => setShowMaterialsDatabase(false)}
        />
      )}
    </div>
  );
};

export default DesignerCustomization;