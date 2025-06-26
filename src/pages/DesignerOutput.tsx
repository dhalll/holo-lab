import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import { Download, Package, Wrench, Clock, Leaf } from 'lucide-react';
const DesignerOutput = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('materials');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading 3D model
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const materials = [{
    type: 'PVC',
    qty: 85,
    length: 120,
    diameter: 50,
    condition: 'Excellent',
    source: 'SF Reclaim Co.',
    reuse: 95
  }, {
    type: 'Steel',
    qty: 20,
    length: 50,
    diameter: 75,
    condition: 'Good',
    source: 'Oakland Steel',
    reuse: 88
  }, {
    type: 'Copper',
    qty: 12,
    length: 30,
    diameter: 25,
    condition: 'Fair',
    source: 'Bay Metals',
    reuse: 82
  }];
  const joints = [{
    id: 1,
    name: 'Joint #001',
    type: 'T-Junction',
    image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png'
  }, {
    id: 2,
    name: 'Joint #002',
    type: 'Elbow',
    image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png'
  }, {
    id: 3,
    name: 'Joint #003',
    type: 'Cross',
    image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png'
  }, {
    id: 4,
    name: 'Joint #004',
    type: 'Reducer',
    image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png'
  }, {
    id: 5,
    name: 'Joint #005',
    type: 'Y-Junction',
    image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png'
  }, {
    id: 6,
    name: 'Joint #006',
    type: 'Coupling',
    image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png'
  }];
  const handleFinalize = () => {
    navigate('/designer/final-rendering');
  };
  return <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative">
      <ProgressBar currentStep={4} stepLabels={['Experience', 'Location', 'Customize', 'Finalize']} />
      
      <BackButton to="/designer/customization" />

      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black">
        YOUR DESIGN OUTPUT
      </h1>

      {/* Top Right Logo */}
      <div className="absolute top-6 right-8 z-10">
        <HoloLogo variant="top-right" className="w-20 h-20" />
      </div>

      {/* Main Content Container */}
      <div className="pt-24 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 items-start">
            {/* 3D Viewport - Left side, with proper margin to avoid progress bar overlap */}
            <div className="flex-1 max-w-2xl ml-32">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg relative overflow-hidden h-[500px]">
                {isLoading ? <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-holo-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="font-inter text-lg">Loading 3D Model...</p>
                    </div>
                  </div> : <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-64 h-64 bg-gradient-to-r from-holo-coral/30 to-holo-teal/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-holo-coral/50 relative">
                        <div className="grid grid-cols-4 gap-3">
                          {Array.from({
                        length: 16
                      }, (_, i) => <div key={i} className="w-3 h-12 bg-holo-coral/60 rounded-full"></div>)}
                        </div>
                        {/* Corner connectors */}
                        <div className="absolute top-2 left-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                        <div className="absolute top-2 right-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                      </div>
                      <p className="font-inter text-lg">Parametric Structure Model</p>
                      <p className="font-inter text-sm text-gray-300 mt-1">Gym + Bar Configuration</p>
                    </div>

                    {/* Controls */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <button className="p-2 bg-holo-white/20 text-white rounded-lg hover:bg-holo-white/30 transition-colors duration-200">
                        <span className="text-xs font-inter">Orbit</span>
                      </button>
                      <button className="px-3 py-2 bg-holo-teal text-holo-white rounded-lg hover:bg-holo-teal/80 transition-colors duration-200 flex items-center gap-2">
                        <Download size={16} />
                        <span className="text-xs font-inter">GLTF</span>
                      </button>
                    </div>
                  </div>}
              </div>
            </div>

            {/* Right Info Panel - Positioned below logo with proper spacing */}
            <div className="w-80 flex flex-col space-y-3 mt-24 my-[22px]">
              {/* Design Summary */}
              <div className="bg-holo-white border border-holo-teal/20 p-3 shadow-sm rounded-lg">
                <h3 className="font-inter font-semibold text-holo-black mb-2 text-sm">Design Summary</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Package className="text-holo-coral" size={12} />
                    <div><span className="font-bold">Program:</span> Gym + Bar</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="text-holo-teal mt-0.5" size={12} />
                    <div><span className="font-bold">Total Height Zones:</span> &lt;2m: 60 m²; &lt;3m: 80 m²</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="text-holo-coral mt-0.5" size={12} />
                    <div><span className="font-bold">Material Usage:</span> PVC: 85 pipes (120 ft); Steel: 20 pipes (50 ft); Copper: 12 pipes (30 ft)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="text-holo-teal" size={12} />
                    <div><span className="font-bold">Joints:</span> 45 custom 3D-printed blobs</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-600" size={12} />
                    <div><span className="font-bold">Build Time:</span> ~120 hrs</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-holo-coral/10 rounded-lg">
                    <Leaf className="text-holo-coral" size={12} />
                    <div><span className="font-bold text-holo-coral">CO₂ Saved:</span> <span className="font-bold text-holo-coral text-sm">1.35 t</span></div>
                  </div>
                </div>
              </div>

              {/* Tabs Panel */}
              <div className="bg-holo-white border border-holo-teal/20 rounded-lg shadow-sm overflow-hidden flex-1">
                <div className="flex border-b border-holo-teal/10">
                  {[{
                  id: 'materials',
                  label: 'Materials'
                }, {
                  id: 'joints',
                  label: 'Joints'
                }, {
                  id: 'manual',
                  label: 'Manual'
                }, {
                  id: 'export',
                  label: 'Export'
                }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-2 py-2 text-xs font-inter font-medium transition-colors duration-200 ${activeTab === tab.id ? 'text-holo-coral border-b-2 border-holo-coral bg-holo-coral/5' : 'text-gray-600 hover:text-holo-black hover:bg-gray-50'}`}>
                      {tab.label}
                    </button>)}
                </div>

                <div className="p-3 min-h-[200px]">
                  {activeTab === 'materials' && <div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-holo-teal/10">
                              <th className="text-left py-2 font-inter font-semibold">Type</th>
                              <th className="text-left py-2 font-inter font-semibold">Qty</th>
                              <th className="text-left py-2 font-inter font-semibold">Ø</th>
                              <th className="text-left py-2 font-inter font-semibold">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[{
                          type: 'PVC',
                          qty: 85,
                          diameter: 50,
                          reuse: 95
                        }, {
                          type: 'Steel',
                          qty: 20,
                          diameter: 75,
                          reuse: 88
                        }, {
                          type: 'Copper',
                          qty: 12,
                          diameter: 25,
                          reuse: 82
                        }].map((material, index) => <tr key={index} className={`${index % 2 === 0 ? 'bg-holo-white' : 'bg-holo-coral/5'} hover:bg-holo-coral/10 transition-colors duration-200`}>
                                <td className="py-2 font-inter">{material.type}</td>
                                <td className="py-2 font-inter">{material.qty}</td>
                                <td className="py-2 font-inter">{material.diameter}</td>
                                <td className="py-2 font-inter font-semibold text-holo-coral">{material.reuse}%</td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div>
                      <button className="w-full mt-3 py-2 bg-holo-teal/20 text-holo-black rounded-lg font-inter font-medium text-xs hover:bg-holo-teal/30 transition-colors duration-200">
                        Download CSV
                      </button>
                    </div>}

                  {activeTab === 'joints' && <div className="h-full">
                      <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto">
                        {[{
                      id: 1,
                      name: 'Joint #001',
                      type: 'T-Junction',
                      image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png'
                    }, {
                      id: 2,
                      name: 'Joint #002',
                      type: 'Elbow',
                      image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png'
                    }, {
                      id: 3,
                      name: 'Joint #003',
                      type: 'Cross',
                      image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png'
                    }, {
                      id: 4,
                      name: 'Joint #004',
                      type: 'Reducer',
                      image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png'
                    }, {
                      id: 5,
                      name: 'Joint #005',
                      type: 'Y-Junction',
                      image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png'
                    }, {
                      id: 6,
                      name: 'Joint #006',
                      type: 'Coupling',
                      image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png'
                    }].map(joint => <div key={joint.id} className="border border-holo-teal/20 rounded-lg p-2 hover:shadow-md transition-shadow duration-200">
                            <div className="w-full h-12 bg-white rounded mb-1 flex items-center justify-center overflow-hidden">
                              <img src={joint.image} alt={joint.name} className="w-full h-full object-cover rounded" />
                            </div>
                            <p className="text-xs font-inter font-medium text-holo-black mb-1">{joint.name}</p>
                            <p className="text-xs font-inter text-gray-600 mb-1">{joint.type}</p>
                            <button className="w-full py-1 bg-holo-coral text-holo-white rounded text-xs font-inter font-medium hover:shadow-md hover:shadow-holo-coral/30 transition-all duration-200">
                              Download STL
                            </button>
                          </div>)}
                      </div>
                    </div>}

                  {activeTab === 'manual' && <div className="text-center">
                      <div className="w-20 h-24 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <div className="text-gray-400 text-xs">PDF Preview</div>
                      </div>
                      <button className="w-full py-2 bg-holo-teal/20 text-holo-black rounded-lg font-inter font-medium text-xs hover:bg-holo-teal/30 transition-colors duration-200">
                        Download PDF
                      </button>
                    </div>}

                  {activeTab === 'export' && <div className="text-center">
                      <button className="w-full py-2 bg-holo-coral text-holo-white rounded-lg font-inter font-medium text-xs hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300 mb-2">
                        Download JSON
                      </button>
                      <p className="text-xs font-inter text-gray-600">
                        Use this file to train custom ML models for future designs.
                      </p>
                    </div>}
                </div>
              </div>
            </div>
          </div>

          {/* Centered buttons below the main content */}
          <div className="flex justify-center gap-8 mt-12 ml-16 mx-[400px]">
            <button onClick={() => window.history.back()} className="px-12 py-4 bg-holo-white border-2 border-holo-teal text-holo-black rounded-[32px] font-inter font-medium text-lg hover:bg-holo-teal/10 transition-colors duration-200 min-w-[250px]">
              Go Back to Edit
            </button>
            <button onClick={handleFinalize} className="px-12 py-4 bg-holo-coral text-holo-white rounded-[32px] font-inter font-semibold text-lg hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300 min-w-[250px]">
              Finalize & Save
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default DesignerOutput;