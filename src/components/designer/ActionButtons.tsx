
import React from 'react';
import { Download, Save } from 'lucide-react';

interface ActionButtonsProps {
  onViewInVR: () => void;
  onFinalize: () => void;
  onDownloadRendering: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onViewInVR, onFinalize, onDownloadRendering }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button 
        onClick={onViewInVR} 
        className="w-16 h-16 bg-holo-coral text-holo-white rounded-full font-inter font-medium hover:bg-holo-coral/80 transition-colors duration-200 flex items-center justify-center"
        title="View in VR"
      >
        <img src="/lovable-uploads/d0f60bab-a377-402c-8b80-2ee218ce6789.png" alt="VR Goggles" className="w-6 h-6" />
      </button>
      <button 
        onClick={onFinalize} 
        className="w-16 h-16 bg-holo-coral text-holo-white rounded-full font-inter font-semibold hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300 flex items-center justify-center"
        title="Save"
      >
        <Save size={24} />
      </button>
      <button 
        onClick={onDownloadRendering} 
        className="w-16 h-16 bg-holo-coral text-holo-white rounded-full font-inter font-medium hover:bg-holo-coral/80 transition-colors duration-200 flex items-center justify-center"
        title="Download"
      >
        <Download size={24} />
      </button>
    </div>
  );
};

export default ActionButtons;
