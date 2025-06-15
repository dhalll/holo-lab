
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
        {/* Option Cards - Circular style like designer/supplier selection */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          {/* Upload Materials Option */}
          <div 
            className="w-64 h-64 bg-holo-white border-2 border-holo-teal rounded-full shadow-lg hover:border-holo-coral hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center"
            onClick={() => handleOptionSelect('browse')}
          >
            <div className="w-16 h-16 bg-holo-black rounded-full flex items-center justify-center mb-4 group-hover:bg-holo-coral transition-colors duration-300">
              <FolderOpen size={32} className="text-holo-white" />
            </div>
            
            <h2 className="text-xl font-inter font-bold text-holo-black mb-2 text-center">Upload Materials</h2>
            <p className="text-sm font-inter text-gray-600 text-center px-4">
              View & Manage Existing Inventory
            </p>
          </div>

          {/* Scan Materials Option */}
          <div 
            className="w-64 h-64 bg-holo-white border-2 border-holo-teal rounded-full shadow-lg hover:border-holo-coral hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center"
            onClick={() => handleOptionSelect('scan')}
          >
            <div className="w-16 h-16 bg-holo-black rounded-full flex items-center justify-center mb-4 group-hover:bg-holo-coral transition-colors duration-300">
              <Camera size={32} className="text-holo-white" />
            </div>
            
            <h2 className="text-xl font-inter font-bold text-holo-black mb-2 text-center">Scan Materials</h2>
            <p className="text-sm font-inter text-gray-600 text-center px-4">
              Use Your Camera to Upload Pipe Images
            </p>
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
