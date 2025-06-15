
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import { FolderOpen, Camera } from 'lucide-react';

const SupplierStart = () => {
  const navigate = useNavigate();

  const handleOptionSelect = (option: 'browse' | 'scan') => {
    if (option === 'browse') {
      navigate('/supplier/dashboard');
    } else {
      navigate('/supplier/scan');
    }
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={1} variant="supplier" />
      
      {/* Header */}
      <div className="absolute top-6 left-6">
        <HoloLogo size="small" variant="full" />
      </div>
      
      <BackButton to="/role-selection" />

      {/* Title positioned same as designer pages */}
      <h1 className="absolute top-6 left-32 text-[20px] font-semibold text-holo-black tracking-wide">
        HOW WOULD YOU LIKE TO PROCEED?
      </h1>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 md:pt-0">
        {/* Option Cards - Same animation style as role selection */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-16">
          {/* Upload Materials Option */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleOptionSelect('browse')}>
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-teal absolute inset-0 group-hover:animate-pulse-ring"></div>
              
              {/* Middle ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-coral absolute inset-2 group-hover:scale-105 transition-transform duration-300"></div>
              
              {/* Inner circle - White background */}
              <div className="w-48 h-48 rounded-full bg-holo-white flex items-center justify-center relative z-10 group-hover:bg-holo-coral transition-colors duration-300 shadow-lg">
                <FolderOpen size={48} className="text-holo-black group-hover:text-holo-white transition-colors duration-300" />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <h2 className="text-lg font-inter font-semibold text-holo-black mb-2">UPLOAD MATERIALS</h2>
              <p className="text-sm font-inter text-gray-600">Manage and Upload Inventory Manually</p>
            </div>
          </div>

          {/* Arrow Image - Flipped horizontally to point upward */}
          <div className="hidden md:block">
            <img 
              src="/lovable-uploads/812f4522-3587-4914-8f42-e1f6190abb47.png" 
              alt="Arrow" 
              className="w-40 h-16 mx-8 transform scale-x-[-1]"
            />
          </div>

          {/* Scan Materials Option */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleOptionSelect('scan')}>
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-teal absolute inset-0 group-hover:animate-pulse-ring"></div>
              
              {/* Middle ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-coral absolute inset-2 group-hover:scale-105 transition-transform duration-300"></div>
              
              {/* Inner circle - White background */}
              <div className="w-48 h-48 rounded-full bg-holo-white flex items-center justify-center relative z-10 group-hover:bg-holo-coral transition-colors duration-300 shadow-lg">
                <Camera size={48} className="text-holo-black group-hover:text-holo-white transition-colors duration-300" />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <h2 className="text-lg font-inter font-semibold text-holo-black mb-2">SCAN MATERIALS</h2>
              <p className="text-sm font-inter text-gray-600">Use Your Camera to Upload Pipe Images</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Logo - Six-dot version */}
      <div className="fixed bottom-4 right-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default SupplierStart;
