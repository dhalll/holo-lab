
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';
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
      {/* Header */}
      <div className="absolute top-6 left-6">
        <HoloLogo size="small" variant="full" />
      </div>
      
      <div className="absolute top-6 left-32">
        <BackButton to="/role-selection" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <h1 className="text-2xl font-inter font-bold text-holo-black mb-16 tracking-wide">
          HOW WOULD YOU LIKE TO PROCEED?
        </h1>

        {/* Option Cards */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          {/* Browse Materials Option */}
          <div 
            className="w-80 h-64 bg-holo-white border-2 border-holo-teal rounded-2xl shadow-lg hover:border-holo-coral hover:shadow-xl transition-all duration-300 cursor-pointer group p-8 flex flex-col items-center justify-center"
            onClick={() => handleOptionSelect('browse')}
          >
            <div className="w-16 h-16 bg-holo-black rounded-full flex items-center justify-center mb-6 group-hover:bg-holo-coral transition-colors duration-300">
              <FolderOpen size={32} className="text-holo-white" />
            </div>
            
            <h2 className="text-xl font-inter font-bold text-holo-black mb-2">Browse Materials</h2>
            <p className="text-sm font-inter text-gray-600 text-center">
              View & Manage Existing Inventory
            </p>
          </div>

          {/* Scan Materials Option */}
          <div 
            className="w-80 h-64 bg-holo-white border-2 border-holo-teal rounded-2xl shadow-lg hover:border-holo-coral hover:shadow-xl transition-all duration-300 cursor-pointer group p-8 flex flex-col items-center justify-center"
            onClick={() => handleOptionSelect('scan')}
          >
            <div className="w-16 h-16 bg-holo-black rounded-full flex items-center justify-center mb-6 group-hover:bg-holo-coral transition-colors duration-300">
              <Camera size={32} className="text-holo-white" />
            </div>
            
            <h2 className="text-xl font-inter font-bold text-holo-black mb-2">Scan Materials</h2>
            <p className="text-sm font-inter text-gray-600 text-center">
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
