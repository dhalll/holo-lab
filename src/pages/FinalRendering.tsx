import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share, RotateCcw } from 'lucide-react';
import HoloLogo from '@/components/HoloLogo';

const FinalRendering = () => {
  const navigate = useNavigate();

  const handleStartOver = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-holo-black flex flex-col">
      {/* Top-right HoloLab Logo */}
      <HoloLogo size="small" variant="dots" position="top-right" />
      
      {/* Header with controls */}
      <div className="flex items-center justify-between p-6 bg-holo-black/90 backdrop-blur-sm z-10">
        <button
          onClick={() => navigate('/designer/output')}
          className="flex items-center gap-2 text-holo-white hover:text-holo-coral transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-inter text-sm">Back to Project</span>
        </button>
        
        <h1 className="text-holo-white text-xl font-inter font-semibold">
          Final Design Rendering
        </h1>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-holo-teal text-holo-white rounded-lg hover:bg-holo-teal/80 transition-all duration-200">
            <Share size={16} />
            <span className="font-inter text-sm">Share</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-holo-coral text-holo-white rounded-lg hover:bg-holo-coral/80 transition-all duration-200">
            <Download size={16} />
            <span className="font-inter text-sm">Download</span>
          </button>
          <button 
            onClick={handleStartOver}
            className="flex items-center gap-2 px-4 py-2 bg-holo-white/20 text-holo-white rounded-lg hover:bg-holo-white/30 transition-all duration-200"
          >
            <RotateCcw size={16} />
            <span className="font-inter text-sm">Start Over</span>
          </button>
        </div>
      </div>

      {/* Full-screen rendering */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full h-full max-w-7xl max-h-full flex items-center justify-center">
          <img
            src="/lovable-uploads/309fccb1-7beb-4ac3-ac02-5f3aefd631be.png"
            alt="Final Design Rendering"
            className="w-full h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="bg-holo-black/90 backdrop-blur-sm p-4 border-t border-holo-white/10">
        <div className="flex items-center justify-center text-holo-white/70 text-sm font-inter">
          <span>Gym + Bar Configuration • 1.35t CO₂ Saved • Build Time: ~120 hrs</span>
        </div>
      </div>
    </div>
  );
};

export default FinalRendering;
