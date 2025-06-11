
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import WorkflowWindow from '@/components/WorkflowWindow';
import { Download } from 'lucide-react';

const DesignerFinalOutput = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  useEffect(() => {
    // Simulate loading final design
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowInfoPanel(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinalize = () => {
    // Simulate API call
    fetch('/api/projects/123/finalize', { method: 'POST' });
    alert('Project saved! You can access it under Dashboard → My Projects.');
  };

  const handleBackToEdit = () => {
    navigate('/designer/customization');
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative overflow-hidden">
      <ProgressBar currentStep={4} />
      
      {/* Back Button aligned with progress bar */}
      <BackButton onClick={() => navigate('/designer/customization')} />
      
      {/* Title positioned after back button */}
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black z-10">
        YOUR DESIGN OUTPUT
      </h1>

      <div className="px-8 pt-16 pb-8">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Center Column: Final Rendering Window */}
          <div className="flex-1 flex flex-col items-center px-6 py-8">
            <WorkflowWindow>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-white/40">
                  <h2 className="text-[24px] font-bold text-holo-coral animate-pulse">LOADING</h2>
                  <p className="mt-4 text-[16px] font-normal text-[#333333]">
                    Finalizing your design…
                  </p>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="w-48 h-32 bg-gradient-to-r from-holo-coral/30 to-holo-teal/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-holo-coral/50">
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 12 }, (_, i) => (
                          <div key={i} className="w-2 h-8 bg-holo-coral/60 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <p className="font-inter text-lg text-holo-black">Final Design Rendering</p>
                    <p className="font-inter text-sm text-gray-500 mt-1">Gym + Bar Configuration</p>
                  </div>
                  
                  {/* 3D Controls Overlay */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <button className="p-2 bg-holo-white/20 text-gray-600 rounded-lg hover:bg-holo-white/30 transition-colors duration-200">
                      <span className="text-xs font-inter">Orbit</span>
                    </button>
                    <button className="px-3 py-2 bg-gradient-teal-coral text-holo-white rounded-lg hover:bg-gradient-coral-teal transition-all duration-200 flex items-center gap-2">
                      <Download size={16} />
                      <span className="text-xs font-inter">GLTF</span>
                    </button>
                  </div>
                </div>
              )}
            </WorkflowWindow>
          </div>

          {/* Right Column: Info Panel */}
          <div className={`w-[360px] bg-white bg-opacity-90 h-[500px] flex flex-col transition-transform duration-300 ${
            showInfoPanel ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Design Summary Card */}
            <div className="p-6">
              <div className="bg-white rounded-xl p-4 mb-6 shadow-lg border border-holo-teal/20">
                <h2 className="text-[16px] font-semibold text-holo-black mb-4">
                  Design Summary
                </h2>
                <div className="space-y-2 text-[14px] text-[#333333]">
                  <div><span className="font-medium">Program:</span> Gym + Bar</div>
                  <div><span className="font-medium">Total Height Zones:</span> &lt;2m: 60 m²; &lt;3m: 80 m²</div>
                  <div><span className="font-medium">Material Usage:</span> PVC: 85 pipes (120 ft); Steel: 20 pipes (50 ft); Copper: 12 pipes (30 ft)</div>
                  <div><span className="font-medium">Joints:</span> 45 custom 3D-printed connectors</div>
                  <div><span className="font-medium">Build Time:</span> ~120 hrs</div>
                  <div><span className="font-medium text-holo-coral">CO₂ Saved:</span> <span className="font-semibold text-holo-coral">1.35 t</span></div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-holo-teal/20 mb-4">
                {[
                  { id: 'materials', label: 'Materials' },
                  { id: 'joints', label: 'Joints' },
                  { id: 'manual', label: 'Manual' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className="flex-1 px-2 py-3 text-xs font-inter font-medium text-holo-black border-b-2 border-holo-coral"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content - Materials List */}
              <div className="mb-6">
                <div className="space-y-2">
                  {[
                    { type: 'PVC', qty: 85, diameter: 50, reuse: 95 },
                    { type: 'Steel', qty: 20, diameter: 75, reuse: 88 },
                    { type: 'Copper', qty: 12, diameter: 25, reuse: 82 }
                  ].map((material, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-holo-coral/5 rounded text-xs">
                      <span className="font-medium">{material.type}</span>
                      <span>Qty: {material.qty}</span>
                      <span>Ø {material.diameter}mm</span>
                      <span className="text-holo-coral font-semibold">{material.reuse}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download CTAs */}
              <div className="space-y-3 mb-6">
                <button className="w-full h-12 bg-gradient-teal-coral text-white text-[16px] font-semibold rounded-xl shadow-md hover:bg-gradient-coral-teal transition-all duration-300">
                  Download GLTF
                </button>
                <button className="w-full h-12 bg-holo-coral text-white text-[16px] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  Download PDF
                </button>
                <button className="w-full h-12 bg-holo-teal/20 text-holo-black text-[16px] font-medium rounded-xl hover:bg-holo-teal/30 transition-colors duration-200">
                  Download CSV
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto p-6 space-y-3">
              <button
                onClick={handleBackToEdit}
                className="w-full py-3 text-[16px] font-normal text-holo-coral border-2 border-holo-coral rounded-xl hover:bg-holo-coral hover:text-white transition-all duration-200"
              >
                Go Back to Edit
              </button>
              <button
                onClick={handleFinalize}
                className="w-full py-3 bg-gradient-teal-coral text-white text-[16px] font-semibold rounded-xl shadow-md hover:bg-gradient-coral-teal hover:scale-105 transition-all duration-300"
              >
                Finalize & Save Project
              </button>
            </div>
          </div>
        </div>

        {/* Proceed Button - Right below the main panels */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleFinalize}
            className="w-60 h-12 bg-gradient-teal-coral text-white rounded-xl font-inter font-semibold text-[16px] hover:bg-gradient-coral-teal hover:scale-105 transition-all duration-300 shadow-md"
          >
            Finalize & Export Project
          </button>
        </div>
      </div>

      {/* Bottom-Right Six-Dot Emblem */}
      <div className="fixed bottom-4 right-4 z-10">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default DesignerFinalOutput;
