import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import ThreeScene from '@/components/ThreeScene';
import { Building, Sliders, Search } from 'lucide-react';
import * as THREE from 'three';

const DesignerLocationSelect = () => {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('wind');
  const [analysisClicked, setAnalysisClicked] = useState(false);
  const [advancedClicked, setAdvancedClicked] = useState(false);

  const handleProceed = () => {
    navigate('/designer/customization');
  };

  const handleAnalysisClick = () => {
    setAnalysisClicked(true);
    setShowAnalysis(true);
  };

  const handleAdvancedClick = () => {
    setAdvancedClicked(true);
    setShowAdvanced(true);
  };

  const handleBuildingClick = (buildingName: string, mesh?: THREE.Mesh) => {
    console.log('3D Building selected:', buildingName);
    setSelectedBuilding(buildingName);
    setSelectedMesh(mesh || null);
  };

  // Log component render to help with debugging
  console.log('DesignerLocationSelect rendered with selectedBuilding:', selectedBuilding);

  return (
    <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative">
      <ProgressBar currentStep={2} />
      
      <BackButton to="/role-selection" />

      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black">
        SELECT YOUR BUILDING
      </h1>

      <div className="px-8 pt-16 pb-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        {/* Centered Map */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* 3D Map Window */}
            <div className="mb-6">
              <WorkflowWindow className="w-[600px] h-[600px]">
                <ThreeScene 
                  className="w-full h-full" 
                  onBuildingClick={handleBuildingClick}
                  modelPath="/lovable-uploads/scene (2).gltf"
                />
              </WorkflowWindow>
            </div>
            
            {/* Search Bar with Proceed Button */}
            <div className="w-full max-w-[600px] flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-holo-coral" size={20} />
                <input
                  type="text"
                  placeholder="Search London area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-holo-white border-2 border-holo-teal rounded-[32px] focus:outline-none focus:ring-2 focus:ring-holo-coral placeholder:text-holo-coral"
                />
              </div>
              
              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={!selectedBuilding}
                className={`px-6 py-3 rounded-xl font-inter font-semibold text-[16px] transition-all duration-300 shadow-md whitespace-nowrap ${
                  selectedBuilding
                    ? 'bg-gradient-teal-coral hover:bg-gradient-coral-teal text-holo-white hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed with Selection
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Positioned to be vertically centered with the GLTF map */}
        <div className="absolute right-[calc(50vw-300px-12rem)] top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6">
          
          {/* Selected Building Preview */}
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto rounded-full border-2 border-dashed ${selectedBuilding ? 'border-holo-coral bg-holo-coral/10' : 'border-gray-300 bg-gray-50'} flex items-center justify-center mb-4 overflow-hidden`}>
              {selectedMesh ? (
                // This part displays the orange square for mesh_481 etc.
                <div className="w-full h-full flex items-center justify-center bg-holo-coral/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-holo-coral to-orange-600 rounded shadow-sm"></div>
                </div>
              ) : selectedBuilding ? (
                <div className="w-20 h-12 bg-holo-teal rounded"></div>
              ) : (
                <span className="text-gray-400 text-sm font-inter text-center px-4">No Building Selected</span>
              )}
            </div>
            {selectedBuilding && (
              <p className="text-sm font-inter text-gray-600">
                {selectedMesh ? selectedBuilding : selectedBuilding.replace('london-building', 'Building ').replace('-', ' ')}
              </p>
            )}
          </div>

          {/* Control Buttons - Vertically centered with map */}
          <div className="flex flex-col gap-6">
            <button
              onClick={handleAnalysisClick}
              disabled={!selectedBuilding}
              className={`w-32 h-32 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                !selectedBuilding 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : analysisClicked
                    ? 'bg-holo-coral border-holo-coral text-holo-white'
                    : 'bg-holo-teal/20 border-holo-teal/30 text-holo-teal/70 hover:bg-holo-coral hover:border-holo-coral hover:text-holo-white hover:shadow-lg'
              } hover:scale-105`}
            >
              <Building size={48} />
              <span className="text-sm font-inter mt-2">Analysis</span>
            </button>

            <button
              onClick={handleAdvancedClick}
              disabled={!selectedBuilding}
              className={`w-32 h-32 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                !selectedBuilding 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : advancedClicked
                    ? 'bg-holo-coral border-holo-coral text-holo-white'
                    : 'bg-holo-teal/20 border-holo-teal/30 text-holo-teal/70 hover:bg-holo-coral hover:border-holo-coral hover:text-holo-white hover:shadow-lg'
              } hover:scale-105`}
            >
              <Sliders size={48} />
              <span className="text-sm font-inter mt-2">Controls</span>
            </button>
          </div>
        </div>
      </div>

      {/* Building Analysis Modal */}
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

      {/* Advanced Controls Panel */}
      {showAdvanced && (
        <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-inter font-bold text-holo-black mb-6">Advanced Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                    Specify Area (sqm)
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    placeholder="Approximate area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                    Position
                  </label>
                  <select className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral">
                    <option value="roof">Roof</option>
                    <option value="facade">Facade</option>
                    <option value="ground">Ground</option>
                    <option value="anywhere">Anywhere</option>
                  </select>
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
    </div>
  );
};

export default DesignerLocationSelect;
