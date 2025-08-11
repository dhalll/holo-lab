import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import ThreeScene from '@/components/ThreeScene';
import MaterialsDatabase from '@/components/MaterialsDatabase';
import { Send, Database, Building } from 'lucide-react';

interface ChatMessage {
  type: string;
  content: string;
  showOptions?: boolean;
  showConstraints?: boolean;
  showFurnitureQuestion?: boolean;
  showFurnitureOptions?: boolean;
  showVariants?: boolean;
  showProceedButton?: boolean;
}

const DesignerCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMaterialsDatabase, setShowMaterialsDatabase] = useState(false);

  const selectedBuildingId = location.state?.selectedBuildingId || null;

  const [currentModelPath, setCurrentModelPath] = useState("/lovable-uploads/scene(2).gltf");
  const [useVariantModel, setUseVariantModel] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', content: 'Hi there! How can we customize your space?', showOptions: true }
  ]);
  const [userInput, setUserInput] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedVolumeHeight, setSelectedVolumeHeight] = useState<string>('');
  const [selectedSpacePreference, setSelectedSpacePreference] = useState<string>('');
  const [selectedShading, setSelectedShading] = useState<string>('');
  const [wantsFurniture, setWantsFurniture] = useState<boolean | null>(null);
  const [selectedFurnitureType, setSelectedFurnitureType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const programs = ['Gym', 'Meeting Space', 'Bar', 'Greenhouse', 'Terrace'];

  const handleProgramSelect = (program: string) => {
    if (selectedPrograms.includes(program)) {
      setSelectedPrograms(selectedPrograms.filter(p => p !== program));
    } else if (selectedPrograms.length < 2) {
      const newPrograms = [...selectedPrograms, program];
      setSelectedPrograms(newPrograms);

      if (newPrograms.length === 1) {
        setMessages(prev => [
          ...prev,
          { type: 'user', content: `Selected: ${program}` },
          { type: 'bot', content: `Great choice! You can select one more program to combine with ${program}, or proceed with just this one.`, showProceedButton: true }
        ]);
      } else if (newPrograms.length === 2) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { type: 'user', content: `Selected: ${newPrograms.join(' + ')}` },
            { type: 'bot', content: `Thanks! Excited to design your ${newPrograms.join(' and ').toLowerCase()}. Let's gather some more info:`, showConstraints: true }
          ]);
        }, 500);
      }
    }
  };

  const handleProceedWithPrograms = () => {
    if (selectedPrograms.length >= 1) {
      const programText = selectedPrograms.length === 1
        ? selectedPrograms[0].toLowerCase()
        : selectedPrograms.join(' and ').toLowerCase();

      setMessages(prev => [
        ...prev,
        { type: 'user', content: `Proceed with: ${selectedPrograms.join(' + ')}` },
        { type: 'bot', content: `Perfect! Let's design your ${programText}. Let's gather some more info:`, showConstraints: true }
      ]);
    }
  };

  const handleVolumeHeightSelect = (option: string) => {
    setSelectedVolumeHeight(option);
    setMessages(prev => [...prev, { type: 'user', content: `Volume & Height: ${option}` }]);
  };

  const handleSpacePreferenceSelect = (option: string) => {
    setSelectedSpacePreference(option);
    setMessages(prev => [...prev, { type: 'user', content: `Space Preference: ${option}` }]);
  };

  const handleShadingSelect = (option: string) => {
    setSelectedShading(option);
    setMessages(prev => [...prev, { type: 'user', content: `Shading: ${option}` }]);
  };

  const handleConstraintsComplete = () => {
    setMessages(prev => [
      ...prev,
      { type: 'bot', content: 'Would you like furniture included with your program?', showFurnitureQuestion: true }
    ]);
  };

  const handleFurnitureResponse = (wantsFurniture: boolean) => {
    setWantsFurniture(wantsFurniture);
    if (wantsFurniture) {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Yes, include furniture' },
        { type: 'bot', content: 'Great! What type of furniture would you prefer?', showFurnitureOptions: true }
      ]);
    } else {
      setMessages(prev => [...prev, { type: 'user', content: 'No furniture needed' }]);
      startGeneration();
    }
  };

  const handleFurnitureTypeSelect = (furnitureType: string) => {
    setSelectedFurnitureType(furnitureType);
    setMessages(prev => [...prev, { type: 'user', content: `Selected: ${furnitureType}` }]);
    startGeneration();
  };

  const startGeneration = () => {
    setIsGenerating(true);

    if (selectedBuildingId === 'mesh_448') {
      setUseVariantModel(true); // ✅ 进入变体模式
      const variants = [
        "/lovable-uploads/mesh448_1.gltf",
        "/lovable-uploads/mesh448_2.gltf"
      ];
      const chosen = variants[Math.floor(Math.random() * variants.length)];
      setCurrentModelPath(chosen);
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: 'Analyzing your requirements and available materials...' },
        { type: 'bot', content: 'I\'ve generated 3 design options for you.', showVariants: true }
      ]);
      setIsGenerating(false);
      setCanProceed(true);
    }, 3000);
  };

  const handleVariantSelect = (variant: number) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', content: `Selected Option ${variant}` },
      { type: 'bot', content: `Perfect! Option ${variant} has been selected. You can now proceed with your customized design.` }
    ]);
    setCanProceed(true);
  };

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

  const handleProceed = () => {
    navigate('/designer/output');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative overflow-hidden">
      <ProgressBar currentStep={3} />
      <BackButton onClick={() => navigate('/designer/location')} />
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black z-10">CUSTOMIZE</h1>

      {/* Top Right Logo */}
      <div className="absolute top-0 right-10 z-15 p-0 py-0 px-0">
        <HoloLogo variant="top-right" className="w-24 h-24" />
      </div>

      <div className="px-8 pt-16 pb-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        {/* 3D 模型 */}
        <div className="flex flex-col items-center">
          <WorkflowWindow className="w-[600px] h-[600px]">
            <ThreeScene
              className="w-full h-full"
              modelPath={currentModelPath}
              isolatedMeshId={useVariantModel ? null : selectedBuildingId}
              useVariantModel={useVariantModel} // ✅ 传给 ThreeScene
            />
          </WorkflowWindow>
        </div>

        {/* 右侧聊天面板 */}
        <div className="ml-12 w-[300px] flex flex-col h-[600px]">
          <div className="h-full bg-gradient-to-b from-white to-holo-teal rounded-xl flex flex-col p-4">
            {/* 顶部按钮 */}
            <div className="flex justify-end space-x-3 mb-4">
              <button
                onClick={() => setShowMaterialsDatabase(true)}
                className="w-10 h-10 bg-holo-black border-2 border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral"
              >
                <Database size={20} className="text-white" />
              </button>
              <button
                onClick={() => navigate('/environmental-analysis')}
                className="w-10 h-10 bg-holo-black border-2 border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral"
              >
                <Building size={20} className="text-white" />
              </button>
            </div>

            {/* 聊天内容 */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                    msg.type === 'user' ? 'bg-holo-coral text-white' : 'bg-white border border-holo-teal/20'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isGenerating && <div className="text-sm text-gray-500">Generating...</div>}
            </div>

            {/* 输入框 */}
            <div className="border-t border-holo-teal/20 pt-4 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Add any specific requirements..."
                  className="flex-1 px-4 py-2 border border-holo-teal/30 rounded-lg focus:ring-2 focus:ring-holo-coral"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-holo-coral text-white rounded-lg"
                >
                  <Send size={16} />
                </button>
              </div>
              {canProceed && (
                <button
                  onClick={handleProceed}
                  className="w-full mt-4 py-3 bg-gradient-teal-coral text-white rounded-lg"
                >
                  Proceed to Final Design
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 材料数据库弹窗 */}
      {showMaterialsDatabase && (
        <MaterialsDatabase isOpen={showMaterialsDatabase} onClose={() => setShowMaterialsDatabase(false)} />
      )}
    </div>
  );
};

export default DesignerCustomization;
