
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import ThreeScene from '@/components/ThreeScene';
import { Database, Building, Send } from 'lucide-react';

interface ChatMessage {
  type: string;
  content: string;
  showOptions?: boolean;
  showConstraints?: boolean;
  showVariants?: boolean;
}

const DesignerCustomization = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      content: 'Hi there! How can we customize your space?',
      showOptions: true
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const programs = ['Gym', 'Meeting Space', 'Bar', 'Greenhouse', 'Workspace'];

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
            content: `Great choice! You can select one more program to combine with ${program}, or we can proceed with just this one.`,
            showOptions: false
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

  const handleConstraintsComplete = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: 'Analyzing your requirements and available materials...', showOptions: false },
        { 
          type: 'bot', 
          content: 'I\'ve generated 3 design options for you. Option 1 uses 85 PVC pipes + 20 steel pipes, with 45 3D-printable joints. Estimated CO₂ savings: 1.2 tonnes.',
          showVariants: true
        }
      ]);
      setIsGenerating(false);
      setCanProceed(true);
    }, 3000);
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

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={3} />
      
      {/* Header */}
      <HoloLogo size="small" variant="full" />
      <BackButton to="/designer/location" />

      {/* Title - aligned with header */}
      <h1 className="absolute top-6 left-[148px] text-[20px] font-semibold text-holo-black">
        CUSTOMIZE
      </h1>

      <div className="flex flex-col items-center px-8 pt-16 pb-8 min-h-screen">
        {/* Two-Column Layout with proper responsive behavior */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8 w-full max-w-7xl">
          
          {/* Left Column: 3D Preview - 2/3 width on desktop */}
          <div className="w-full lg:w-2/3">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-holo-teal bg-gradient-to-br from-gray-900 to-gray-700">
              <ThreeScene />
            </div>
          </div>

          {/* Right Column: AI Chat Panel - 1/3 width on desktop */}
          <div className="w-full lg:w-1/3 bg-gradient-white-teal rounded-xl py-8 px-6 flex flex-col">
            
            {/* Top-right icon buttons */}
            <div className="flex justify-end space-x-3 mb-4">
              <button
                onClick={() => navigate('/materials')}
                className="w-10 h-10 bg-holo-black border-2 border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral hover:text-white transition-colors duration-200"
              >
                <Database size={20} />
              </button>
              <button
                onClick={() => navigate('/environmental-analysis')}
                className="w-10 h-10 bg-holo-black border-2 border-holo-coral rounded-full flex items-center justify-center hover:bg-holo-coral hover:text-white transition-colors duration-200"
              >
                <Building size={20} />
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

                    {/* Constraints Options */}
                    {message.showConstraints && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Volume and Height:</p>
                          <div className="flex flex-wrap gap-2">
                            {['<2m & <3m areas', 'All <2m', 'All ≥2m'].map((option) => (
                              <button
                                key={option}
                                className="px-3 py-2 rounded-full text-xs font-medium bg-white border border-holo-teal text-holo-black hover:bg-holo-teal hover:text-white transition-colors duration-200"
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
                              <label key={option} className="flex items-center space-x-2">
                                <input type="radio" name="space" className="text-holo-coral" />
                                <span className="text-xs">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Shading Preferences:</p>
                          <div className="flex flex-wrap gap-2">
                            {['Full Coverage', 'No Coverage', '½ Coverage'].map((option) => (
                              <button
                                key={option}
                                className="px-3 py-2 rounded-full text-xs font-medium bg-white border border-holo-coral text-holo-coral hover:bg-holo-coral hover:text-white transition-colors duration-200"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleConstraintsComplete}
                          className="w-full mt-4 py-2 bg-gradient-teal-coral text-white rounded-lg font-medium hover:bg-gradient-coral-teal transition-all duration-200"
                        >
                          Generate Design Options
                        </button>
                      </div>
                    )}

                    {/* Design Variants */}
                    {message.showVariants && (
                      <div className="mt-4">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[1, 2, 3].map((variant) => (
                            <div
                              key={variant}
                              className="aspect-square bg-gray-100 rounded-lg border-2 border-holo-teal cursor-pointer hover:border-holo-coral transition-colors duration-200 flex items-center justify-center"
                            >
                              <span className="text-xs text-gray-600">Option {variant}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setCanProceed(true)}
                          className="w-full py-2 bg-holo-coral text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Select Option 1
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking Animation */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white border border-holo-teal/20 p-4 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-holo-coral rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-holo-coral rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-holo-coral rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input with proper positioning */}
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter goals for your space, or select from above options..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full h-14 bg-white rounded-full px-4 border-2 border-holo-teal focus:outline-none focus:ring-2 focus:ring-holo-coral placeholder:text-holo-teal text-[#333333]"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-holo-coral text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed Button - Positioned below columns to prevent overlap */}
        <div className="flex justify-center mt-6 w-full">
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`w-60 h-12 rounded-xl font-inter font-semibold text-[16px] transition-all duration-300 shadow-md ${
              canProceed
                ? 'bg-gradient-teal-coral hover:bg-gradient-coral-teal text-holo-white hover:scale-105'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed with Selection
          </button>
        </div>
      </div>

      {/* Footer Logo - Six-dot version */}
      <div className="fixed bottom-4 right-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default DesignerCustomization;
