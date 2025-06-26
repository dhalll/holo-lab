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
     <div className="absolute top-0 right-10 z-1 p-0 py-0 px-0"> {/* Increased right margin, added padding */}
        <HoloLogo variant="top-right" className="w-24 h-24" /> {/* Added custom width/height */}
      </div>

      {/* Added padding-top to create space between header and content */}
      <div className="pl-32 pr-8 pt-24 pb-8">
        <div className="flex gap-6 h-[calc(100vh-250px)]">
          {/* 3D Viewport - Takes remaining space */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg relative overflow-hidden mx-[88px]">
            {isLoading ? <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-holo-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-inter text-lg">Loading 3D Model...</p>
                </div>
              </div> : <div className="absolute inset-0 mx-[16px] my-[13px]">
                {/* Mock 3D Scene - Perfectly centered */}
                <div className="absolute inset-0 flex items-center justify-center mx-[115px]">
                  <div className="text-center text-white">
                    <div className="w-64 h-64 bg-gradient-to-r from-holo-coral/30 to-holo-teal/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-holo-coral/50 relative">
                      <div className="grid grid-cols-4 gap-3">
                        {Array.from({
                      length: 16
                    }, (_, i) => <div key={i} className="w-3 h-12 bg-holo-coral/60 rounded-full"></div>)}
                      </div>
                      {/* Corner connectors to make it look more structural */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 bg-holo-teal rounded-full"></div>
                    </div>
                    <p className="font-inter text-lg">Parametric Structure Model</p>
                    <p className="font-inter text-sm text-gray-300 mt-1">Gym + Bar Configuration</p>
                  </div>
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

          {/* Info Panel - Fixed width, hugs the right side */}
          <div className="w-80 flex flex-col space-y-6">
            {/* Design Summary */}
            <div className="bg-holo-white border border-holo-teal/20 p-6 shadow-sm py-[9px] rounded-md px-[16px]">
              <h3 className="font-inter font-semibold text-holo-black mb-4 text-lg py-0 my-[8px]">Design Summary</h3>
              <div className="space-y-4 text-sm my-0 py-0">
                <div className="flex items-center gap-3">
                  <Package className="text-holo-coral" size={16} />
                  <div><span className="font-bold">Program:</span> Gym + Bar</div>
                </div>
                <div className="flex items-start gap-3">
                  <Wrench className="text-holo-teal mt-0.5" size={16} />
                  <div><span className="font-bold">Total Height Zones:</span> &lt;2m: 60 m²; &lt;3m: 80 m²</div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="text-holo-coral mt-0.5" size={16} />
                  <div><span className="font-bold">Material Usage:</span> PVC: 85 pipes (120 ft); Steel: 20 pipes (50 ft); Copper: 12 pipes (30 ft)</div>
                </div>
                <div className="flex items-center gap-3">
                  <Wrench className="text-holo-teal" size={16} />
                  <div><span className="font-bold">Joints:</span> 45 custom 3D-printed blobs</div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-gray-600" size={16} />
                  <div><span className="font-bold">Build Time:</span> ~120 hrs</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-holo-coral/10 rounded-lg">
                  <Leaf className="text-holo-coral" size={16} />
                  <div><span className="font-bold text-holo-coral">CO₂ Saved:</span> <span className="font-bold text-holo-coral text-lg">1.35 t</span></div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-holo-white border border-holo-teal/20 rounded-2xl shadow-sm overflow-hidden flex-1">
              <div className="flex border-b border-holo-teal/10">
                {[{
                id: 'materials',
                label: 'Materials List'
              }, {
                id: 'joints',
                label: 'Joints & Connectors'
              }, {
                id: 'manual',
                label: 'Assembly Manual'
              }, {
                id: 'export',
                label: 'Export Data'
              }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-3 text-xs font-inter font-medium transition-colors duration-200 ${activeTab === tab.id ? 'text-holo-coral border-b-2 border-holo-coral bg-holo-coral/5' : 'text-gray-600 hover:text-holo-black hover:bg-gray-50'}`}>
                    {tab.label}
                  </button>)}
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                {activeTab === 'materials' && <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-holo-teal/10">
                            <th className="text-left py-2 font-inter font-semibold">Type</th>
                            <th className="text-left py-2 font-inter font-semibold">Qty</th>
                            <th className="text-left py-2 font-inter font-semibold">Ø (mm)</th>
                            <th className="text-left py-2 font-inter font-semibold">Reuse %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materials.map((material, index) => <tr key={index} className={`${index % 2 === 0 ? 'bg-holo-white' : 'bg-holo-coral/5'} hover:bg-holo-coral/10 transition-colors duration-200`}>
                              <td className="py-3 font-inter">{material.type}</td>
                              <td className="py-3 font-inter">{material.qty}</td>
                              <td className="py-3 font-inter">{material.diameter}</td>
                              <td className="py-3 font-inter font-semibold text-holo-coral">{material.reuse}%</td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                    <button className="w-full mt-4 py-2 bg-holo-teal/20 text-holo-black rounded-lg font-inter font-medium hover:bg-holo-teal/30 transition-colors duration-200">
                      Download CSV
                    </button>
                  </div>}

                {activeTab === 'joints' && <div className="h-full">
                    <div className="grid grid-cols-2 gap-3 max-h-full overflow-y-auto">
                      {joints.map(joint => <div key={joint.id} className="border border-holo-teal/20 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                          <div className="w-full h-16 bg-white rounded mb-2 flex items-center justify-center overflow-hidden">
                            <img src={joint.image} alt={joint.name} className="w-full h-full object-cover rounded" />
                          </div>
                          <p className="text-xs font-inter font-medium text-holo-black">{joint.name}</p>
                          <p className="text-xs font-inter text-gray-600 mb-2">{joint.type}</p>
                          <button className="w-full py-1 bg-holo-coral text-holo-white rounded text-xs font-inter font-medium hover:shadow-md hover:shadow-holo-coral/30 transition-all duration-200">
                            Download STL
                          </button>
                        </div>)}
                    </div>
                  </div>}

                {activeTab === 'manual' && <div className="text-center">
                    <div className="w-32 h-40 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-gray-400 text-xs">PDF Preview</div>
                    </div>
                    <button className="w-full py-2 bg-holo-teal/20 text-holo-black rounded-lg font-inter font-medium hover:bg-holo-teal/30 transition-colors duration-200">
                      Download PDF
                    </button>
                  </div>}

                {activeTab === 'export' && <div className="text-center">
                    <button className="w-full py-3 bg-holo-coral text-holo-white rounded-lg font-inter font-medium hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300 mb-4">
                      Download JSON
                    </button>
                    <p className="text-xs font-inter text-gray-600">
                      Use this file to train custom ML models for future designs.
                    </p>
                  </div>}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 my-0 py-0">
              <button onClick={() => window.history.back()} className="flex-1 py-3 bg-holo-white border border-holo-teal text-holo-black rounded-[32px] font-inter font-medium hover:bg-holo-teal/10 transition-colors duration-200">
                Go Back to Edit
              </button>
              <button onClick={handleFinalize} className="flex-1 py-3 bg-holo-coral text-holo-white rounded-[32px] font-inter font-semibold hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300">
                Finalize & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default DesignerOutput;