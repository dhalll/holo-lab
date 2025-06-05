
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import ThreeScene from '@/components/ThreeScene';
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
      {/* Background rendering image with overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300"></div>
        <div
          className={`absolute inset-0 bg-white transition-opacity duration-500 ${
            isLoading ? 'opacity-40' : 'opacity-0'
          }`}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
          <h2 className="text-[24px] font-bold text-holo-coral animate-pulse">LOADING</h2>
          <p className="mt-4 text-[16px] font-normal text-[#333333]">
            Finalizing your design…
          </p>
        </div>
      )}

      {/* Header */}
      <HoloLogo size="small" variant="full" />
      <BackButton onClick={() => navigate('/designer/customization')} />
      
      {/* Title - aligned with header */}
      <h1 className="absolute top-6 left-[148px] text-[20px] font-semibold text-holo-black z-10">
        YOUR DESIGN OUTPUT
      </h1>

      {/* Left Progress Bar (Step 4 active) */}
      <ProgressBar currentStep={4} />

      {/* Main Content (shown once loaded) */}
      {!isLoading && (
        <div className="absolute top-16 left-[148px] right-0 bottom-0 flex">
          {/* Three.js Viewer Area (70% width) */}
          <div className="flex-1 relative">
            <ThreeScene className="w-full h-full" />
            
            {/* 3D Controls Overlay */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="p-2 bg-holo-white/20 text-white rounded-lg hover:bg-holo-white/30 transition-colors duration-200">
                <span className="text-xs font-inter">Orbit</span>
              </button>
              <button className="px-3 py-2 bg-gradient-teal-coral text-holo-white rounded-lg hover:bg-gradient-coral-teal transition-all duration-200 flex items-center gap-2">
                <Download size={16} />
                <span className="text-xs font-inter">GLTF</span>
              </button>
            </div>
          </div>

          {/* Info Panel (slide-in) */}
          <div className={`w-[360px] bg-white bg-opacity-90 h-full flex flex-col transition-transform duration-300 ${
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
      )}

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
