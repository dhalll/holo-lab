
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import { Database, Building, ArrowUp } from 'lucide-react';

const DesignerCustomization = () => {
  const navigate = useNavigate();
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [volumeConstraint, setVolumeConstraint] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [shading, setShading] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      content: 'Hi there! How can we customize your space?',
      showOptions: true
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const programs = ['Gym', 'Meeting Space', 'Bar', 'Greenhouse', 'Workspace'];
  const volumeOptions = ['<2 m & <3 m areas', 'All <2 m', 'All ≥2 m'];
  const spaceOptions = ['Separate', 'Connected'];
  const shadingOptions = ['Full Coverage', 'No Coverage', '½ Coverage'];

  const handleProgramSelect = (program: string) => {
    setSelectedPrograms(prev => 
      prev.includes(program) 
        ? prev.filter(p => p !== program)
        : [...prev, program]
    );
  };

  const handleSendMessage = () => {
    if (!userInput.trim() && selectedPrograms.length === 0) return;

    // Add user message
    const newMessage = {
      type: 'user',
      content: userInput || `Selected: ${selectedPrograms.join(', ')}`
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      setIsThinking(false);
      if (selectedPrograms.length > 0) {
        setChatMessages(prev => [...prev, {
          type: 'bot',
          content: `Thanks! Excited to design your ${selectedPrograms.join(' and ')}. Let's find out some more info:`,
          showConstraints: true
        }]);
      }
    }, 2000);
  };

  const handleGenerateDesigns = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setShowVariants(true);
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: 'Great! I\'ve generated 3 design options for you. Option 1 uses 85 PVC + 20 Steel + 12 Copper pipes; 45 joints; CO₂ saved: 1.2 t; SunlightScore: 0.87; WindScore: 0.65',
        showVariants: true
      }]);
    }, 3000);
  };

  const handleProceed = () => {
    navigate('/designer/output');
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={3} stepLabels={['Select Experience', 'Location', 'Customize', 'Generate', 'Export', 'Complete']} />
      
      <div className="pl-20 pr-8 pt-8 pb-8 h-screen flex">
        {/* 3D Viewport */}
        <div className="flex-1 mr-8">
          <div className="h-full border-2 border-dashed border-holo-teal rounded-lg bg-gray-50 relative overflow-hidden">
            {showVariants ? (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-holo-coral/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-holo-coral rounded"></div>
                  </div>
                  <p className="font-inter text-lg">3D Model Preview</p>
                  <p className="font-inter text-sm text-gray-300 mt-2">Variant 1 Selected</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Building size={32} />
                  </div>
                  <p className="font-inter">3D viewport placeholder</p>
                  <p className="font-inter text-sm mt-2">Your design will appear here</p>
                </div>
              </div>
            )}
            
            {/* Variant Thumbnails */}
            {showVariants && (
              <div className="absolute top-4 right-4 space-y-2">
                {[1, 2, 3].map((variant) => (
                  <div key={variant} className="w-16 h-12 bg-holo-white/20 rounded border border-holo-teal cursor-pointer hover:bg-holo-white/30 transition-colors duration-200 flex items-center justify-center">
                    <span className="text-white text-xs font-inter">Opt {variant}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-96 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-holo-teal to-holo-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <HoloLogo size="small" />
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-holo-black border border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral transition-colors duration-200">
                  <Database size={16} className="text-holo-white" />
                </button>
                <button className="w-8 h-8 bg-holo-black border border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral transition-colors duration-200">
                  <Building size={16} className="text-holo-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-holo-white border-x border-holo-teal/20 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((message, index) => (
              <div key={index}>
                {message.type === 'bot' ? (
                  <div className="bg-holo-white border border-holo-teal rounded-3xl p-4">
                    <p className="font-inter text-sm text-holo-black font-medium mb-3">
                      {message.content}
                    </p>
                    
                    {message.showOptions && (
                      <div>
                        <p className="font-inter text-xs text-gray-600 mb-2">Select Desired Program:</p>
                        <div className="flex flex-wrap gap-2">
                          {programs.map((program) => (
                            <button
                              key={program}
                              onClick={() => handleProgramSelect(program)}
                              className={`px-3 py-1 rounded-2xl text-xs font-inter border transition-all duration-200 ${
                                selectedPrograms.includes(program)
                                  ? 'bg-holo-coral text-holo-white border-holo-coral'
                                  : 'bg-holo-white text-holo-black border-holo-coral hover:bg-holo-coral/10'
                              }`}
                            >
                              {program}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.showConstraints && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <p className="font-inter text-sm font-medium text-holo-black mb-2">Volume and Height:</p>
                          <div className="flex flex-wrap gap-2">
                            {volumeOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => setVolumeConstraint(option)}
                                className={`px-3 py-1 rounded-lg text-xs font-inter border transition-all duration-200 ${
                                  volumeConstraint === option
                                    ? 'bg-holo-teal text-holo-white border-holo-teal'
                                    : 'bg-holo-white text-holo-black border-holo-teal hover:bg-holo-teal/10'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-inter text-sm font-medium text-holo-black mb-2">Space Preferences:</p>
                          <div className="flex gap-4">
                            {spaceOptions.map((option) => (
                              <label key={option} className="flex items-center">
                                <input
                                  type="radio"
                                  name="spaceType"
                                  value={option}
                                  checked={spaceType === option}
                                  onChange={(e) => setSpaceType(e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm font-inter text-holo-black">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-inter text-sm font-medium text-holo-black mb-2">Shading Preferences:</p>
                          <div className="flex flex-wrap gap-2">
                            {shadingOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => setShading(option)}
                                className={`px-3 py-1 rounded-2xl text-xs font-inter border transition-all duration-200 ${
                                  shading === option
                                    ? 'bg-holo-coral text-holo-white border-holo-coral'
                                    : 'bg-holo-white text-holo-black border-holo-coral hover:bg-holo-coral/10'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleGenerateDesigns}
                          disabled={!volumeConstraint || !spaceType || !shading}
                          className={`w-full py-2 rounded-lg font-inter font-medium transition-all duration-300 ${
                            volumeConstraint && spaceType && shading
                              ? 'bg-holo-coral text-holo-white hover:shadow-lg hover:shadow-holo-coral/30'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Generate Designs
                        </button>
                      </div>
                    )}

                    {message.showVariants && (
                      <div className="mt-4">
                        <button
                          onClick={handleProceed}
                          className="w-full py-2 bg-holo-coral text-holo-white rounded-lg font-inter font-medium hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300"
                        >
                          Select this design
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-holo-teal/10 rounded-3xl p-3 ml-8">
                    <p className="font-inter text-sm text-holo-black">{message.content}</p>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="bg-holo-white border border-holo-teal rounded-3xl p-4">
                <div className="flex items-center gap-2">
                  <span className="font-inter text-sm text-holo-black">Thinking</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-holo-coral rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-holo-coral rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-holo-coral rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-holo-white border border-holo-teal/20 rounded-b-lg p-4">
            <div className="flex gap-2">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter goals for your space, or select from above options..."
                className="flex-1 p-3 border border-holo-teal/30 rounded-2xl resize-none h-12 focus:outline-none focus:ring-2 focus:ring-holo-coral placeholder:text-holo-teal text-sm font-inter"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() && selectedPrograms.length === 0}
                className={`w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center ${
                  userInput.trim() || selectedPrograms.length > 0
                    ? 'bg-holo-coral border-holo-coral text-holo-white hover:shadow-lg'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Proceed Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleProceed}
          disabled={!showVariants}
          className={`px-8 py-3 rounded-[32px] font-inter font-semibold transition-all duration-300 ${
            showVariants
              ? 'bg-holo-coral text-holo-white hover:shadow-lg hover:shadow-holo-coral/30'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed with Selection
        </button>
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-20">
        <BackButton to="/designer/location" />
      </div>
    </div>
  );
};

export default DesignerCustomization;
