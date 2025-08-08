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
  
  // Get the selected building ID from navigation state
  const selectedBuildingId = location.state?.selectedBuildingId || null;
  
  // State to track the current model path - switches to mesh448_1.gltf after design generation for mesh_448
  const [currentModelPath, setCurrentModelPath] = useState("/lovable-uploads/scene(2).gltf");
  
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
          { type: 'user', content: `Selected: ${program}`, showOptions: false },
          { 
            type: 'bot', 
            content: `Great choice! You can select one more program to combine with ${program}, or proceed with just this one.`,
            showOptions: false,
            showProceedButton: true
          }
        ]);
      } else if (newPrograms.length === 2) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { type: 'user', content: `Selected: ${newPrograms.join(' + ')}`, showOptions: false },
            { 
              type: 'bot', 
              content: `Thanks! Excited to design your ${newPrograms.join(' and ').toLowerCase()}. Let's gather some more info:`,
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
        { type: 'user', content: `Proceed with: ${selectedPrograms.join(' + ')}`, showOptions: false },
        { 
          type: 'bot', 
          content: `Perfect! Let's design your ${programText}. Let's gather some more info:`,
          showConstraints: true
        }
      ]);
    }
  };

  const handleVolumeHeightSelect = (option: string) => {
    setSelectedVolumeHeight(option);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: `Volume & Height: ${option}`, showOptions: false }
    ]);
  };

  const handleSpacePreferenceSelect = (option: string) => {
    setSelectedSpacePreference(option);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: `Space Preference: ${option}`, showOptions: false }
    ]);
  };

  const handleShadingSelect = (option: string) => {
    setSelectedShading(option);
    setMessages(prev => [
      ...prev,
      { type: 'user', content: `Shading: ${option}`, showOptions: false }
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
      { type: 'user', content: `Selected: ${furnitureType}`, showOptions: false }
    ]);
    startGeneration();
  };

  const startGeneration = () => {
    setIsGenerating(true);
    
    // If mesh_448 was selected, switch to mesh448_1.gltf after generation
    if (selectedBuildingId === 'mesh_448') {
      setCurrentModelPath("/lovable-uploads/mesh448_1.gltf");
    }
    
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
      { type: 'user', content: `Selected Option ${variant}`, showOptions: false },
      { type: 'bot', content: `Perfect! Option ${variant} has been selected. You can now proceed with your customized design.`, showOptions: false }
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
            {/* 3D Map Window */}
            <div className="mb-6">
              <WorkflowWindow className="w-[600px] h-[600px]">
                <ThreeScene 
                  className="w-full h-full" 
                  modelPath={currentModelPath}
                  isolatedMeshId={selectedBuildingId}
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
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-holo-coral text-white' 
                      : 'bg-white border border-holo-teal/20'
                  }`}>
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
                              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                selectedPrograms.includes(program)
                                  ? 'bg-holo-coral text-white'
                                  : 'bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white'
                              }`}
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
                                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                  selectedVolumeHeight === option
                                    ? 'bg-holo-teal text-white'
                                    : 'bg-white border border-holo-teal text-holo-black hover:bg-holo-teal hover:text-white'
                                }`}
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
                                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                  selectedSpacePreference === option
                                    ? 'bg-holo-coral text-white'
                                    : 'bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white'
                                }`}
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
                                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                  selectedShading === option
                                    ? 'bg-holo-coral text-white'
                                    : 'bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedVolumeHeight && selectedSpacePreference && selectedShading && (
                          <button
                            onClick={handleConstraintsComplete}
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

                          {/* Small Elements Option */}
                          <div 
                            className="cursor-pointer border-2 border-holo-teal rounded-lg p-3 hover:border-holo-coral transition-colors duration-200"
                            onClick={() => handleFurnitureTypeSelect('Small Elements')}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src="/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png" 
                                alt="Small Elements" 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-holo-black">Small Elements</p>
                                <p className="text-xs text-gray-600">Modular furniture components</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Design Variants */}
                    {message.showVariants && (
                      <div className="mt-4">
                        <div className="space-y-3">
                          {[1, 2, 3].map((variant) => (
                            <div 
                              key={variant}
                              className="cursor-pointer border-2 border-holo-teal rounded-lg p-3 hover:border-holo-coral transition-colors duration-200"
                              onClick={() => handleVariantSelect(variant)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-holo-teal to-holo-coral rounded flex items-center justify-center text-white font-bold">
                                  {variant}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-holo-black">Option {variant}</p>
                                  <p className="text-xs text-gray-600">
                                    {variant === 1 && 'Most sustainable - 285 PVC pipes + 20 steel pipes'}
                                    {variant === 2 && 'Balanced design - 200 PVC pipes + 40 steel pipes'}
                                    {variant === 3 && 'Premium materials - 150 PVC pipes + 60 steel pipes'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white border border-holo-teal/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-holo-teal rounded-full animate-pulse"></div>
                      <p className="text-sm font-inter text-gray-600">Generating designs...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="border-t border-holo-teal/20 pt-4 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
              
              {/* Proceed Button */}
              {canProceed && (
                <button
                  onClick={handleProceed}
                  className="w-full mt-4 py-3 bg-gradient-teal-coral text-white rounded-lg font-medium hover:bg-gradient-coral-teal transition-all duration-300"
                >
                  Proceed to Final Design
                </button>
              )}
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