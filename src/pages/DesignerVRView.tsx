
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import HoloLogo from '@/components/HoloLogo';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const DesignerVRView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-holo-teal/50 to-holo-white font-inter relative">
      <BackButton to="/designer/output" />
      
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black">
        VR STRUCTURE VIEW
      </h1>

      {/* Top Right Logo */}
      <div className="absolute top-0 right-10 z-1 p-0 py-0 px-0">
        <HoloLogo variant="top-right" className="w-24 h-24" />
      </div>

      <div className="flex items-center justify-center min-h-screen px-8 pt-16">
        <div className="flex items-start gap-8 max-w-6xl w-full mx-0 px-[175px]">
          {/* VR Viewport - Left Side */}
          <div className="w-96 h-96 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center border-4 border-holo-coral/50 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-64 h-64 bg-gradient-to-r from-holo-coral/30 to-holo-teal/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-holo-coral/50 relative">
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({
                    length: 16
                  }, (_, i) => <div key={i} className="w-3 h-12 bg-holo-coral/60 rounded-full animate-pulse"></div>)}
                  </div>
                  {/* Corner connectors */}
                  <div className="absolute top-2 left-2 w-4 h-4 bg-holo-teal rounded-full animate-pulse"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 bg-holo-teal rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 bg-holo-teal rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-holo-teal rounded-full animate-pulse"></div>
                </div>
                <p className="font-inter text-lg">VR Structure View</p>
                <p className="font-inter text-sm text-gray-300 mt-1">Gym + Bar Configuration</p>
              </div>
            </div>

            {/* VR Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="p-2 bg-holo-white/20 text-white rounded-lg hover:bg-holo-white/30 transition-colors duration-200 flex items-center gap-2">
                <img src="/lovable-uploads/d0f60bab-a377-402c-8b80-2ee218ce6789.png" alt="VR Goggles" className="w-4 h-4" />
                <span className="text-xs font-inter">VR Mode</span>
              </button>
            </div>

            {/* VR viewing indicators */}
            <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-holo-coral animate-pulse"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-holo-coral animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-holo-coral animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-holo-coral animate-pulse"></div>
          </div>

          {/* VR Controls Panel - Right Side */}
          <div className="bg-holo-white border border-holo-teal/20 rounded-lg p-6 shadow-lg w-96 py-[61px]">
            <h2 className="text-xl font-inter font-bold text-holo-black mb-4 flex items-center gap-3">
              <img src="/lovable-uploads/d0f60bab-a377-402c-8b80-2ee218ce6789.png" alt="VR Goggles" className="w-6 h-6" />
              VR Controls
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <button className="p-3 bg-holo-teal/20 text-holo-black rounded-lg hover:bg-holo-teal/30 transition-colors duration-200 flex items-center gap-2">
                  <RotateCcw size={18} />
                  <span className="text-sm font-inter">Reset View</span>
                </button>
              </div>
              
              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 bg-holo-coral/20 text-holo-black rounded-full hover:bg-holo-coral/30 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn size={18} />
                </button>
                <button className="w-12 h-12 bg-holo-coral/20 text-holo-black rounded-full hover:bg-holo-coral/30 transition-colors duration-200 flex items-center justify-center">
                  <ZoomOut size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-holo-teal/10 rounded-lg py-[14px]">
              <p className="text-sm font-inter text-gray-700 text-center">
                Use VR headset for immersive 3D viewing experience of your parametric structure design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerVRView;
