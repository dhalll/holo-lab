
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import DesignSummary from '@/components/designer/DesignSummary';
import TabsPanel from '@/components/designer/TabsPanel';
import ActionButtons from '@/components/designer/ActionButtons';
import { Download } from 'lucide-react';

const DesignerOutput = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('materials');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFinalize = () => {
    navigate('/designer/final-rendering');
  };

  const handleDownloadRendering = () => {
    navigate('/designer/final-rendering');
  };

  const handleViewInVR = () => {
    navigate('/designer/vr-view');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative">
      <ProgressBar currentStep={4} stepLabels={['Experience', 'Location', 'Customize', 'Finalize']} />
      
      <BackButton to="/designer/customization" />

      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black">
        YOUR DESIGN OUTPUT
      </h1>

      <div className="absolute top-0 right-10 z-1 p-0 py-0 px-0">
        <HoloLogo variant="top-right" className="w-24 h-24" />
      </div>

      <div className="pt-24 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 items-start">
            {/* 3D Viewport */}
            <div className="flex-1 max-w-2xl ml-32">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg relative overflow-hidden h-[500px]">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-holo-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="font-inter text-lg">Loading 3D Model...</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <video 
                      className="w-full h-full object-cover rounded-lg"
                      controls
                      autoPlay
                      muted
                      loop
                    >
                      <source src="/lovable-uploads/structureflythrough.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <div className="absolute top-4 right-4 space-y-2">
                      <button className="p-2 bg-holo-white/20 text-white rounded-lg hover:bg-holo-white/30 transition-colors duration-200">
                        <span className="text-xs font-inter">Orbit</span>
                      </button>
                      <button className="px-3 py-2 bg-holo-teal text-holo-white rounded-lg hover:bg-holo-teal/80 transition-colors duration-200 flex items-center gap-2">
                        <Download size={16} />
                        <span className="text-xs font-inter">GLTF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Info Panel */}
            <div className="w-80 flex flex-col space-y-3">
              <DesignSummary />
              <TabsPanel activeTab={activeTab} setActiveTab={setActiveTab} />
              <ActionButtons 
                onViewInVR={handleViewInVR}
                onFinalize={handleFinalize}
                onDownloadRendering={handleDownloadRendering}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerOutput;
