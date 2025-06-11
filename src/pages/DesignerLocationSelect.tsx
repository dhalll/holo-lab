
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Source, Layer } from 'react-map-gl';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import { Building, Sliders, Search } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const DesignerLocationSelect = () => {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('wind');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const [viewState, setViewState] = useState({
    longitude: -0.1278,
    latitude: 51.5074,
    zoom: 14.5,
    pitch: 45,
    bearing: -17
  });

  const handleProceed = () => {
    navigate('/designer/customization');
  };

  const handleBuildingClick = (buildingId: string, event: any) => {
    event.stopPropagation();
    setSelectedBuilding(buildingId);
  };

  if (showTokenInput && !mapboxToken) {
    return (
      <div className="min-h-screen bg-holo-white font-inter relative flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border-2 border-holo-teal shadow-lg max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-holo-black mb-4">Mapbox Configuration</h2>
          <p className="text-gray-600 mb-4">
            To display the interactive map, please enter your Mapbox public token. 
            You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-holo-coral hover:underline">mapbox.com</a>
          </p>
          <input
            type="text"
            placeholder="pk.your_mapbox_token_here"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral mb-4"
          />
          <button
            onClick={() => setShowTokenInput(false)}
            disabled={!mapboxToken}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              mapboxToken
                ? 'bg-gradient-teal-coral hover:bg-gradient-coral-teal text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={2} />
      
      {/* Back Button aligned with progress bar */}
      <BackButton to="/role-selection" />

      {/* Title positioned after back button */}
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black">
        SELECT YOUR BUILDING
      </h1>

      <div className="px-8 pt-16 pb-8">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Center Column: Map Window */}
          <div className="flex-1 flex flex-col items-center px-6 py-8">
            <WorkflowWindow>
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/light-v10"
                mapboxAccessToken={mapboxToken}
              >
                {/* 3D Buildings Layer */}
                <Source id="composite" type="vector" url="mapbox://mapbox.mapbox-streets-v8">
                  <Layer
                    id="3d-buildings"
                    source="composite"
                    source-layer="building"
                    filter={['==', 'extrude', 'true']}
                    type="fill-extrusion"
                    paint={{
                      'fill-extrusion-color': '#A5C1C8',
                      'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                      ],
                      'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                      ],
                      'fill-extrusion-opacity': 0.6
                    }}
                  />
                </Source>

                {/* Interactive Building Markers */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '33%',
                    left: '25%',
                    width: '64px',
                    height: '48px',
                    backgroundColor: selectedBuilding === 'london-building1' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(165, 193, 200, 0.3)',
                    border: `2px solid ${selectedBuilding === 'london-building1' ? '#FF6B6B' : '#A5C1C8'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666',
                    transition: 'all 0.2s'
                  }}
                  onClick={(e) => handleBuildingClick('london-building1', e)}
                >
                  Shoreditch
                </div>
                
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '33%',
                    width: '80px',
                    height: '64px',
                    backgroundColor: selectedBuilding === 'london-building2' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(165, 193, 200, 0.3)',
                    border: `2px solid ${selectedBuilding === 'london-building2' ? '#FF6B6B' : '#A5C1C8'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666',
                    transition: 'all 0.2s'
                  }}
                  onClick={(e) => handleBuildingClick('london-building2', e)}
                >
                  Camden
                </div>
                
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '33%',
                    left: '50%',
                    width: '56px',
                    height: '72px',
                    backgroundColor: selectedBuilding === 'london-building3' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(165, 193, 200, 0.3)',
                    border: `2px solid ${selectedBuilding === 'london-building3' ? '#FF6B6B' : '#A5C1C8'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666',
                    transition: 'all 0.2s'
                  }}
                  onClick={(e) => handleBuildingClick('london-building3', e)}
                >
                  Westminster
                </div>
              </Map>
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

        {/* Proceed Button - Right below the main panels */}
        <div className="flex justify-center mt-8">
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
      </div>

      {/* Building Analysis Modal - keep existing code for modals */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-inter font-bold text-holo-black mb-6">Building Analysis</h2>
              
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
