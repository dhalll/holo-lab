import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import ThreeScene from '@/components/ThreeScene';
import MaterialsDatabase from '@/components/MaterialsDatabase';
import { Send, Bot, User, Database, Building } from 'lucide-react';

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
  
  // Get the selected building ID and mesh from navigation state
  const selectedBuildingId = location.state?.selectedBuildingId || null;
  const selectedMesh = location.state?.selectedMesh || null;
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      content: 'Hi there! How can we customize your space?',
      showOptions: true
    }
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
  const [useVariantModel, setUseVariantModel] = useState(false);
  const [variantModelPath, setVariantModelPath] = useState<string>('');

  const programs = ['Gym', 'Meeting Space', 'Bar', 'Greenhouse', 'Terrace'];

  // Camera auto-adjustment effect when component mounts with selectedBuildingId
  useEffect(() => {
    if (selectedBuildingId) {
      console.log('DesignerCustomization loaded with building:', selectedBuildingId);
      // The ThreeScene will automatically handle camera positioning through isolatedMeshId prop
    }
  }, [selectedBuildingId]);

  const handleProgramSelect = (program: string) => {
    if (selectedPrograms.includes(program)) {
      setSelectedPrograms(selectedPrograms.filter(p => p !== program));
    } else if (selectedPrograms.length < 2) {
      const newPrograms = [...selectedPrograms, program];
      setSelectedPrograms(newPrograms);
      
      if (newPrograms.length === 1) {
        setMessages(prev => [
          ...prev,
          { type: 'user', content: Selected: ${program}, showOptions: false },
          { 
            type: 'bot', 
            content: Great choice! You can select one more program to combine with ${program}, or proceed with just this one.,
            showOptions: false,
            showProceedButton: true
          }
        ]);
      } else if (newPrograms.length === 2) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { type: 'user', content: Selected: ${newPrograms.join(' + ')}, showOptions: false },
            { 
              type: 'bot', 
              content: Thanks! Excited to design your ${newPrograms.join(' and ').toLowerCase()}. Let's gather some more info:,
              showConstraints: true
            }
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
        { type: 'user', content: Proceed with: ${selectedPrograms.join(' + ')}, showOptions: false },
        { 
          type: 'bot', 
          content: Perfect! Let's design your ${programText}. Let's gather some more info:,
          showConstraints: true
        }
      ]);
    }
  };

  const handleVolumeHeightSelect = (option: string) => {
    setSelectedVolumeHeight(option);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: Volume & Height: ${option}, showOptions: false }
    ]);
  };

  const handleSpacePreferenceSelect = (option: string) => {
    setSelectedSpacePreference(option);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: Space Preference: ${option}, showOptions: false }
    ]);
  };

  const handleShadingSelect = (option: string) => {
    setSelectedShading(option);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: Shading: ${option}, showOptions: false }
    ]);
  };

  const handleConstraintsComplete = () => {
    setMessages(prev => [
      ...prev,
      { 
        type: 'bot', 
        content: 'Would you like furniture included with your program?',
        showFurnitureQuestion: true
      }
    ]);
  };

  const handleFurnitureResponse = (wantsFurniture: boolean) => {
    setWantsFurniture(wantsFurniture);
    if (wantsFurniture) {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Yes, include furniture', showOptions: false },
        { 
          type: 'bot', 
          content: 'Great! What type of furniture would you prefer?',
          showFurnitureOptions: true
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'No furniture needed', showOptions: false }
      ]);
      startGeneration();
    }
  };

  const handleFurnitureTypeSelect = (furnitureType: string) => {
    setSelectedFurnitureType(furnitureType);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: Selected: ${furnitureType}, showOptions: false }
    ]);
    startGeneration();
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: 'Analyzing your requirements and available materials...', showOptions: false },
        { 
          type: 'bot', 
          content: 'I\'ve generated 3 design options for you. Option 1 uses 285 PVC pipes + 20 steel pipes, with 45 3D-printable joints. Estimated CO₂ savings: 1.2 tonnes.',
          showVariants: true
        }
      ]);
      setIsGenerating(false);
      setCanProceed(true);
    }, 3000);
  };

  const handleVariantSelect = (variant: number) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', content: Selected Option ${variant}, showOptions: false },
      { type: 'bot', content: Perfect! Option ${variant} has been selected. You can now proceed with your customized design., showOptions: false }
    ]);
    setCanProceed(true);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: userInput, showOptions: false },
        { type: 'bot', content: 'Thank you for the additional details. I\'ll incorporate this into your design requirements.', showOptions: false }
      ]);
      setUserInput('');
    }
  };

  const handleProceed = () => {
    navigate('/designer/output');
  };

  const handleMaterialsDatabaseClick = () => {
    setShowMaterialsDatabase(true);
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
            {/* 3D Map Window - Isolated view with camera auto-adjustment */}
            <div className="mb-6">
              <WorkflowWindow className="w-[600px] h-[600px]">
                <ThreeScene 
                  className="w-full h-full" 
                  modelPath={useVariantModel && variantModelPath ? variantModelPath : "/lovable-uploads/scene(2).gltf"}
                  isolatedMeshId={useVariantModel ? null : selectedBuildingId}
                />
              </WorkflowWindow>
            </div>
          </div>
        </div>

        {/* Right Panel - AI Chat Panel aligned with map height */}
        <div className="ml-12 w-[300px] flex flex-col h-[600px]">
          <div className="h-full bg-gradient-to-b from-white to-holo-teal rounded-xl flex flex-col p-4">
            {/* Top-right icon buttons */}
            <div className="flex justify-end space-x-3 mb-4">
              <button
                onClick={handleMaterialsDatabaseClick}
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

            {/* Chat Messages with proper spacing */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}}>
                  <div className={max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-holo-coral text-white' 
                      : 'bg-white border border-holo-teal/20'
                  }}>
                    <p className="text-sm font-inter">{message.content}</p>
                    
                    {/* Program Selection Options */}
                    {message.showOptions && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-3">Select Desired Program:</p>
                        <div className="flex flex-wrap gap-2">
                          {programs.map((program) => (
                            <button
                              key={program}
                              onClick={() => handleProgramSelect(program)}
                              className={px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                selectedPrograms.includes(program)
                                  ? 'bg-holo-coral text-white'
                                  : 'bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white'
                              }}
                            >
                              {program}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Proceed with Programs Button */}
                    {message.showProceedButton && selectedPrograms.length >= 1 && (
                      <div className="mt-4">
                        <button
                          onClick={handleProceedWithPrograms}
                          className="w-full py-2 bg-gradient-teal-coral text-white rounded-lg font-medium hover:bg-gradient-coral-teal transition-all duration-200"
                        >
                          Proceed with Selection
                        </button>
                      </div>
                    )}

                    {/* Constraints Options */}
                    {message.showConstraints && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Volume and Height:</p>
                          <div className="flex flex-wrap gap-2">
                            {['<2m & <3m areas', 'All <2m', 'All ≥2m'].map((option) => (
                              <button
                                key={option}
                                onClick={() => handleVolumeHeightSelect(option)}
                                className={px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                  selectedVolumeHeight === option
                                    ? 'bg-holo-teal text-white'
                                    : 'bg-white border border-holo-teal text-holo-black hover:bg-holo-teal hover:text-white'
                                }}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Space Preferences:</p>
                          <div className="flex gap-4">
                            {['Separate', 'Connected'].map((option) => (
                              <button
                                key={option}
                                onClick={() => handleSpacePreferenceSelect(option)}
                                className={px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                  selectedSpacePreference === option
                                    ? 'bg-holo-coral text-white'
                                    : 'bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white'
                                }}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Shading Preferences:</p>
                          <div className="flex flex-wrap gap-2">
                            {['Full Coverage', 'No Coverage', '½ Coverage'].map((option) => (
                              <button
                                key={option}
                                onClick={() => handleShadingSelect(option)}
                                className={px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                  selectedShading === option
                                    ? 'bg-holo-coral text-white'
                                    : 'bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white'
                                }}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                         {selectedVolumeHeight && selectedSpacePreference && selectedShading && (
                           <button
                             onClick={() => {
                               // When generating design options, switch to variant model for mesh_448
                               if (selectedBuildingId === 'mesh_448') {
                                 // Randomly choose between mesh448_1 and mesh448_2 models
                                 const variantPaths = [
                                   '/lovable-uploads/structure example.gltf',
                                   '/lovable-uploads/test to upload to three,js 2.gltf'
                                 ];
                                 const randomVariant = variantPaths[Math.floor(Math.random() * variantPaths.length)];
                                 setVariantModelPath(randomVariant);
                                 setUseVariantModel(true);
                               }
                               handleConstraintsComplete();
                             }}
                             className="w-full mt-4 py-2 bg-gradient-teal-coral text-white rounded-lg font-medium hover:bg-gradient-coral-teal transition-all duration-200"
                           >
                             Generate Design Options
                           </button>
                         )}
                      </div>
                    )}

                    {/* Furniture Question */}
                    {message.showFurnitureQuestion && (
                      <div className="mt-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleFurnitureResponse(true)}
                            className="px-4 py-2 bg-holo-teal text-white rounded-lg font-medium hover:bg-holo-teal/80 transition-colors duration-200"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleFurnitureResponse(false)}
                            className="px-4 py-2 bg-holo-coral text-white rounded-lg font-medium hover:bg-holo-coral/80 transition-colors duration-200"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Furniture Type Options with Images */}
                    {message.showFurnitureOptions && (
                      <div className="mt-4">
                        <div className="space-y-3">
                          {/* Large Pipe Furniture Option */}
                          <div 
                            className="cursor-pointer border-2 border-holo-teal rounded-lg p-3 hover:border-holo-coral transition-colors duration-200"
                            onClick={() => handleFurnitureTypeSelect('Large Pipe Furniture')}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src="/lovable-uploads/4b661a27-70df-483a-8ff3-cb00c4b8fc18.png" 
                                alt="Large Pipe Furniture" 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-holo-black">Large Pipe Furniture</p>
                                <p className="text-xs text-gray-600">Structural elements with furniture integration</p>
                              </div>
                            </div>
                          </div>

                          {/* Small Pipe Furniture Option */}
                          <div 
                            className="cursor-pointer border-2 border-holo-teal rounded-lg p-3 hover:border-holo-coral transition-colors duration-200"
                            onClick={() => handleFurnitureTypeSelect('Small Pipe Furniture')}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src="/lovable-uploads/5ba08a5c-46f4-46b8-8205-3607d9f75e28.png" 
                                alt="Small Pipe Furniture" 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-holo-black">Small Pipe Furniture</p>
                                <p className="text-xs text-gray-600">Compact and modular furniture pieces</p>
                              </div>
                            </div>
                          </div>

                          {/* Fabric Furniture Option */}
                          <div 
                            className="cursor-pointer border-2 border-holo-teal rounded-lg p-3 hover:border-holo-coral transition-colors duration-200"
                            onClick={() => handleFurnitureTypeSelect('Fabric Furniture')}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src="/lovable-uploads/74d4b984-a513-478e-bc0e-3490532fd4ce.png" 
                                alt="Fabric Furniture" 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-holo-black">Fabric Furniture</p>
                                <p className="text-xs text-gray-600">Soft furnishings and textile elements</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Design Variants Options */}
                    {message.showVariants && (
                      <div className="mt-4 space-y-3">
                        {[1, 2, 3].map((variant) => (
                          <div 
                            key={variant}
                            className="cursor-pointer border-2 border-holo-teal rounded-lg p-3 hover:border-holo-coral transition-colors duration-200"
                            onClick={() => handleVariantSelect(variant)}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={variant === 1 
                                  ? "/lovable-uploads/9314f380-b21c-4c51-a78a-f6dbb787aec5.png"
                                  : variant === 2 
                                  ? "/lovable-uploads/7b775965-3c91-4858-a229-22200248f865.png"
                                  : "/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png"
                                } 
                                alt={Design Option ${variant}} 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-holo-black">Option {variant}</p>
                                <p className="text-xs text-gray-600">
                                  {variant === 1 && "285 PVC + 20 steel pipes, 45 joints"}
                                  {variant === 2 && "310 PVC + 15 steel pipes, 52 joints"}
                                  {variant === 3 && "270 PVC + 25 steel pipes, 38 joints"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Loading Animation */}
                    {isGenerating && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-holo-coral rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-holo-coral rounded-full animate-pulse delay-100"></div>
                        <div className="w-3 h-3 bg-holo-coral rounded-full animate-pulse delay-200"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type additional requirements..."
                className="flex-1 p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-holo-coral text-white rounded-lg hover:bg-holo-coral/80 transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Proceed Button */}
            {canProceed && (
              <button
                onClick={handleProceed}
                className="w-full mt-4 py-3 bg-gradient-teal-coral hover:bg-gradient-coral-teal text-white rounded-lg font-semibold transition-all duration-300"
              >
                Proceed to Design Output
              </button>
            )}
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