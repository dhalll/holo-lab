
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share, RotateCcw } from 'lucide-react';
import BackButton from '@/components/BackButton';

const FinalRendering = () => {
  const navigate = useNavigate();

  const handleStartOver = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-holo-black flex flex-col font-inter">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-6 bg-holo-black/90 backdrop-blur-sm z-10 bg-white">
        <BackButton to="/designer/output" />
        
        <h1 className="absolute left-1/2 transform -translate-x-1/2 top-6 text-[20px] font-semibold text-holo-black z-10">
          FINAL DESIGN RENDERING
        </h1>
        
        <div className="flex items-center gap-4 ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-holo-teal text-holo-white rounded-lg hover:bg-holo-teal/80 transition-all duration-200">
            <Share size={16} />
            <span className="font-inter text-sm">Share</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-holo-coral text-holo-white rounded-lg hover:bg-holo-coral/80 transition-all duration-200">
            <Download size={16} />
            <span className="font-inter text-sm">Download</span>
          </button>
          <button onClick={handleStartOver} className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-holo-white rounded-lg hover:bg-zinc-800 transition-all duration-200">
            <RotateCcw size={16} />
            <span className="font-inter text-sm">Start Over</span>
          </button>
        </div>
      </div>

      {/* Full-screen rendering */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full h-full max-w-7xl max-h-full flex items-center justify-center">
          <img alt="Final Design Rendering" src="/lovable-uploads/07498333-9bd4-4584-8fdd-16dd7d976a90.jpg" className="min-h-full rounded-lg shadow-2xl object-scale-down" />
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
