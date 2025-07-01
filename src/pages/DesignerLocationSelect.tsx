import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import ThreeScene from '@/components/ThreeScene'; // Ensure this path is correct
import { Building, Sliders, Search } from 'lucide-react';
import * as THREE from 'three'; // Import THREE for type definitions if needed

const DesignerLocationSelect = () => {
  const navigate = useNavigate();
  // State to store the name of the selected building (string)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  // State to store the actual Three.js Mesh object of the selected building
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('wind');
  // State to track if Analysis button was clicked (for styling)
  const [analysisClicked, setAnalysisClicked] = useState(false);
  // State to track if Advanced Controls button was clicked (for styling)
  const [advancedClicked, setAdvancedClicked] = useState(false);

  // Handler for the "Proceed with Selection" button
  const handleProceed = () => {
    navigate('/designer/customization');
  };

  // Handler for the Analysis button click
  const handleAnalysisClick = () => {
    setAnalysisClicked(true);
    setShowAnalysis(true);
  };

  // Handler for the Advanced Controls button click
  const handleAdvancedClick = () => {
    setAdvancedClicked(true);
    setShowAdvanced(true);
  };

  // Callback function passed to ThreeScene to receive clicked building info
  const handleBuildingClick = (buildingName: string | null, mesh?: THREE.Mesh | null) => {
    console.log('3D Building selected:', buildingName);
    setSelectedBuilding(buildingName);
    setSelectedMesh(mesh || null); // Ensure mesh is null if deselected
  };

  // Function to map active analysis tab to a specific image URL
  const getAnalysisImage = () => {
    switch (activeTab) {
      case 'wind':
        return '/lovable-uploads/08f551be-672d-4696-bc73-d4612ed5be59.png';
      case 'sun':
        return '/lovable-uploads/7fb4b427-899d-4734-8b0a-0b1fc61e3595.png';
      case 'visibility':
        return '/lovable-uploads/a31d6a11-be8a-445a-b73b-15a5b9ece219.png';
      default:
        return '/lovable-uploads/08f551be-672d-4696-bc73-d4612ed5be59.png';
    }
  };

  // Console log for debugging component renders
  console.log('DesignerLocationSelect rendered with selectedBuilding:', selectedBuilding);

  return (
    <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative">
      {/* Progress bar at the top */}
      <ProgressBar currentStep={2} />
      
      {/* Back button */}
      <BackButton to="/role-selection" />

      {/* Main page title */}
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black py-[4px] px-[2px]">
        SELECT YOUR BUILDING
      </h1>

      {/* Top Right Logo - Positioned absolutely */}
      <div className="absolute top-0 right-10 z-1 p-0 py-0 px-0">
        <HoloLogo variant="top-right" className="w-24 h-24" />
      </div>

      {/* Main content area, centered */}
      <div className="px-8 pt-16 pb-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        {/* Container for the 3D map and search bar, centered vertically and horizontally */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center bg-transparent rounded-none">
            {/* 3D Map Window (WorkflowWindow is likely a styled container) */}
            <div className="mb-6">
              <WorkflowWindow className="w-[600px] h-[600px]">
                {/* ThreeScene component renders the 3D GLTF model */}
                <ThreeScene 
                  className="w-full h-full" 
                  onBuildingClick={handleBuildingClick} // Pass the click handler
                  modelPath="/lovable-uploads/scene (2).gltf" // Path to your GLTF model
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
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 bg-holo-white border-2 border-holo-teal rounded-[32px] focus:outline-none focus:ring-2 focus:ring-holo-coral placeholder:text-holo-coral" 
                />
              </div>
              
              {/* Proceed Button - Disabled if no building is selected */}
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

        {/* Right Panel - Positioned absolutely to be vertically centered with the GLTF map */}
        <div className="absolute right-[calc(50vw-300px-12rem)] top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6">
          
          {/* Selected Building Preview Section */}
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto rounded-full border-2 border-dashed ${
              selectedBuilding ? 'border-holo-coral bg-holo-coral/10' : 'border-gray-300 bg-gray-50'
            } flex items-center justify-center mb-4 overflow-hidden`}>
              {selectedMesh ? (
                // Displays an orange square if a mesh is selected
                <div className="w-full h-full flex items-center justify-center bg-holo-coral/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-holo-coral to-orange-600 rounded shadow-sm"></div>
                </div>
              ) : selectedBuilding ? (
                // Displays a teal rectangle if a building name is selected but no mesh object (e.g., fallback)
                <div className="w-20 h-12 bg-holo-teal rounded"></div>
              ) : (
                // Message when no building is selected
                <span className="text-gray-400 text-sm font-inter text-center px-4">No Building Selected</span>
              )}
            </div>
            {selectedBuilding && (
              <p className="text-sm font-inter text-gray-600">
                {/* Displays the mesh name if available, otherwise a derived name */}
                {selectedMesh ? selectedMesh.name || `Mesh_${selectedMesh.uuid.slice(0, 8)}` : selectedBuilding.replace('london-building', 'Building ').replace('-', ' ')}
              </p>
            )}
          </div>

          {/* Control Buttons - Analysis and Controls */}
          <div className="flex flex-col gap-6">
            <button 
              onClick={handleAnalysisClick} 
              disabled={!selectedBuilding} // Disabled if no building is selected
              className={`w-32 h-32 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                !selectedBuilding 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' // Disabled state styling
                  : analysisClicked // If clicked, stay orange
                    ? 'bg-holo-coral border-holo-coral text-holo-white' 
                    : 'bg-holo-teal/20 border-holo-teal/30 text-holo-teal/70 hover:bg-holo-coral hover:border-holo-coral hover:text-holo-white hover:shadow-lg' // Default blue, hover orange
              } hover:scale-105`} {/* Hover scale effect */}
            >
              <Building size={48} /> {/* Icon */}
              <span className="text-sm font-inter mt-2">Analysis</span> {/* Text label */}
            </button>

            <button 
              onClick={handleAdvancedClick} 
              disabled={!selectedBuilding} // Disabled if no building is selected
              className={`w-32 h-32 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                !selectedBuilding 
                  ? 'bg-gray-100 border-gray-300 text-gray-400-not-allowed' // Disabled state styling
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

      {/* Building Analysis Modal (conditionally rendered) */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-inter font-bold text-holo-black mb-6">Building Analysis</h2>
              
              {/* Tabs for different analysis types */}
              <div className="flex border-b border-holo-teal/20 mb-6">
                {[
                  { id: 'wind', label: 'Wind Analysis' },
                  { id: 'sun', label: 'Sun Analysis' },
                  { id: 'visibility', label: 'Visibility Analysis' }
                ].map(tab => (
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

              {/* Tab Content with Images */}
              <div className="h-64 bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src={getAnalysisImage()} 
                  alt={`${activeTab} analysis`} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Close button for the modal */}
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

      {/* Advanced Controls Panel (conditionally rendered) */}
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
