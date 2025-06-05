
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import { Building, Sliders, Search } from 'lucide-react';

const DesignerLocationSelect = () => {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('wind');

  const handleProceed = () => {
    navigate('/designer/customization');
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={2} stepLabels={['Select Experience', 'Location', 'Customize', 'Generate', 'Export', 'Complete']} />
      
      {/* Header */}
      <div className="absolute top-8 left-20">
        <BackButton to="/role-selection" />
      </div>

      <div className="pl-20 pr-8 pt-16 pb-8">
        <h1 className="text-2xl font-inter font-bold text-holo-black mb-8">
          SELECT YOUR BUILDING
        </h1>

        <div className="flex gap-8 h-[calc(100vh-200px)]">
          {/* Map Area */}
          <div className="flex-1 bg-gray-100 rounded-lg border-2 border-dashed border-holo-teal relative overflow-hidden">
            {/* Placeholder Map */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200">
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Building size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 font-inter">Interactive map will appear here</p>
                <p className="text-sm text-gray-400 mt-2">Click on building footprints to select</p>
              </div>

              {/* Mock building footprints */}
              <div className="absolute top-1/3 left-1/4 w-16 h-12 bg-holo-teal/30 border-2 border-holo-teal rounded cursor-pointer hover:bg-holo-coral/30 hover:border-holo-coral transition-colors duration-200"
                   onClick={() => setSelectedBuilding('building1')}>
              </div>
              <div className="absolute top-1/2 right-1/3 w-20 h-16 bg-holo-teal/30 border-2 border-holo-teal rounded cursor-pointer hover:bg-holo-coral/30 hover:border-holo-coral transition-colors duration-200"
                   onClick={() => setSelectedBuilding('building2')}>
              </div>
            </div>

            {/* Search Bar */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-holo-coral" size={20} />
                <input
                  type="text"
                  placeholder="Type Location Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-holo-white border border-holo-teal rounded-[32px] focus:outline-none focus:ring-2 focus:ring-holo-coral placeholder:text-holo-coral"
                />
              </div>
            </div>
          </div>

          {/* Selection Panel */}
          <div className="w-80 flex flex-col space-y-6">
            {/* Selected Building Preview */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full border-2 border-dashed ${selectedBuilding ? 'border-holo-teal bg-holo-teal/20' : 'border-gray-300 bg-gray-50'} flex items-center justify-center mb-4`}>
                {selectedBuilding ? (
                  <div className="w-12 h-8 bg-holo-teal rounded"></div>
                ) : (
                  <span className="text-gray-400 text-sm font-inter">No Building Selected</span>
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setShowAnalysis(true)}
                disabled={!selectedBuilding}
                className={`w-20 h-20 mx-auto flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  selectedBuilding 
                    ? 'bg-holo-black border-holo-coral text-holo-teal hover:scale-105' 
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Building size={24} />
                <span className="text-xs font-inter mt-1">Analysis</span>
              </button>

              <button
                onClick={() => setShowAdvanced(true)}
                disabled={!selectedBuilding}
                className={`w-20 h-20 mx-auto flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  selectedBuilding 
                    ? 'bg-holo-black border-holo-coral text-holo-teal hover:scale-105' 
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sliders size={24} />
                <span className="text-xs font-inter mt-1">Controls</span>
              </button>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={!selectedBuilding}
              className={`w-full py-4 rounded-[32px] font-inter font-semibold transition-all duration-300 ${
                selectedBuilding
                  ? 'bg-holo-coral text-holo-white hover:shadow-lg hover:shadow-holo-coral/30'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed with Selection
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
                  {activeTab === 'wind' && 'Wind vector visualization will appear here'}
                  {activeTab === 'sun' && 'Sun path diagram will appear here'}
                  {activeTab === 'visibility' && 'Line-of-sight analysis will appear here'}
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
                      placeholder="37.7749"
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
                      placeholder="-122.4194"
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
                  className="px-6 py-2 bg-holo-coral text-holo-white rounded-lg font-inter font-semibold hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300"
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
