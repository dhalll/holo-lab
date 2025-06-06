import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import { Building, Sliders, Search } from 'lucide-react';

const DesignerLocationSelect = () => {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('wind');

  const handleProceed = () => {
    navigate('/designer/customization');
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={2} />
      
      {/* Back Button only (no top logo) */}
      <BackButton to="/role-selection" />

      {/* Title - aligned with header */}
      <h1 className="absolute top-6 left-[148px] text-[20px] font-semibold text-holo-black">
        SELECT YOUR BUILDING
      </h1>

      <div className="flex flex-col lg:flex-row px-8 pt-16 pb-8 min-h-screen">
        {/* Center Column: Map Window */}
        <div className="flex-1 flex flex-col items-center px-6 py-8">
          <WorkflowWindow>
            <img
              src="/lovable-uploads/74d4b984-a513-478e-bc0e-3490532fd4ce.png"
              alt="London Building Map"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay building footprints as clickable elements */}
            <div className="absolute top-1/3 left-1/4 w-16 h-12 bg-holo-teal/30 border-2 border-holo-teal rounded cursor-pointer hover:bg-holo-coral/30 hover:border-holo-coral transition-colors duration-200"
                 onClick={() => setSelectedBuilding('london-building1')}>
              <div className="text-xs text-center pt-2 text-gray-600">Shoreditch</div>
            </div>
            <div className="absolute top-1/2 right-1/3 w-20 h-16 bg-holo-teal/30 border-2 border-holo-teal rounded cursor-pointer hover:bg-holo-coral/30 hover:border-holo-coral transition-colors duration-200"
                 onClick={() => setSelectedBuilding('london-building2')}>
              <div className="text-xs text-center pt-4 text-gray-600">Camden</div>
            </div>
            <div className="absolute bottom-1/3 left-1/2 w-14 h-18 bg-holo-teal/30 border-2 border-holo-teal rounded cursor-pointer hover:bg-holo-coral/30 hover:border-holo-coral transition-colors duration-200"
                 onClick={() => setSelectedBuilding('london-building3')}>
              <div className="text-xs text-center pt-6 text-gray-600">Westminster</div>
            </div>
          </WorkflowWindow>
          
          {/* Search Bar */}
          <div className="w-full max-w-[800px] mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-holo-coral" size={20} />
              <input
                type="text"
                placeholder="Search London area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-holo-white border-2 border-holo-teal rounded-[32px] focus:outline-none focus:ring-2 focus:ring-holo-coral placeholder:text-holo-coral"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Controls */}
        <div className="w-[200px] flex flex-col items-center px-4 py-8 space-y-6">
          {/* Selected Building Preview */}
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto rounded-full border-2 border-dashed ${selectedBuilding ? 'border-holo-teal bg-holo-teal/20' : 'border-gray-300 bg-gray-50'} flex items-center justify-center mb-4`}>
              {selectedBuilding ? (
                <div className="w-12 h-8 bg-holo-teal rounded"></div>
              ) : (
                <span className="text-gray-400 text-xs font-inter text-center px-2">No Building Selected</span>
              )}
            </div>
            {selectedBuilding && (
              <p className="text-sm font-inter text-gray-600 capitalize">
                {selectedBuilding.replace('london-building', 'Building ')}
              </p>
            )}
          </div>

          {/* Control Buttons - stacked vertically */}
          <div className="flex flex-col items-center space-y-8">
            <button
              onClick={() => setShowAnalysis(true)}
              disabled={!selectedBuilding}
              className={`w-20 h-20 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                selectedBuilding 
                  ? 'bg-holo-black border-holo-coral text-holo-white hover:scale-105' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Building size={36} className="text-white" />
              <span className="text-xs font-inter mt-1">Analysis</span>
            </button>

            <button
              onClick={() => setShowAdvanced(true)}
              disabled={!selectedBuilding}
              className={`w-20 h-20 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                selectedBuilding 
                  ? 'bg-holo-black border-holo-coral text-holo-white hover:scale-105' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sliders size={36} className="text-white" />
              <span className="text-xs font-inter mt-1">Controls</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proceed Button - Below all columns */}
      <div className="flex justify-center py-8">
        <button
          onClick={handleProceed}
          disabled={!selectedBuilding}
          className={`w-[240px] h-[48px] rounded-xl font-inter font-semibold text-[16px] transition-all duration-300 shadow-md ${
            selectedBuilding
              ? 'bg-gradient-teal-coral hover:bg-gradient-coral-teal text-holo-white hover:scale-105'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed with Selection
        </button>
      </div>

      {/* Building Analysis Modal - keep existing code for modals */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-inter font-bold text-holo-black mb-6">Building Analysis</h2>
              
              {/* Tabs */}
              <div className="flex border-b border-holo-teal/20 mb-6">
                {[
                  { id: 'wind', label: 'Wind Analysis' },
                  { id: 'sun', label: 'Sun Analysis' },
                  { id: 'visibility', label: 'Visibility Analysis' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-inter font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-holo-coral border-b-2 border-holo-coral'
                        : 'text-gray-600 hover:text-holo-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-inter">
                  {activeTab === 'wind' && 'Wind patterns for London location will appear here'}
                  {activeTab === 'sun' && 'Solar analysis for selected building will appear here'}
                  {activeTab === 'visibility' && 'Visibility analysis from street level will appear here'}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="px-6 py-2 bg-holo-teal/20 border border-holo-teal text-holo-black rounded-lg font-inter font-medium hover:bg-holo-teal/30 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Controls Panel - keep existing code for modals */}
      {showAdvanced && (
        <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-inter font-bold text-holo-black mb-6">Advanced Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                    Approx. Area Override (sq m)
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    placeholder="Optional override"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                      placeholder="51.5074"
                      defaultValue="51.5074"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                      placeholder="-0.1278"
                      defaultValue="-0.1278"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                    Building Type
                  </label>
                  <select className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed-Use</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="px-4 py-2 text-gray-600 hover:text-holo-black transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="px-6 py-2 bg-gradient-teal-coral hover:bg-gradient-coral-teal text-holo-white rounded-lg font-inter font-semibold transition-all duration-300"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Logo - Six-dot version */}
      <div className="fixed bottom-4 right-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default DesignerLocationSelect;
