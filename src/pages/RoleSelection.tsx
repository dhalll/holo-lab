
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import { Building, Database } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'designer' | 'supplier') => {
    if (role === 'designer') {
      navigate('/designer/location');
    } else {
      navigate('/supplier/start');
    }
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      <ProgressBar currentStep={1} />
      
      {/* Back Button aligned with progress bar */}
      <BackButton to="/" />

      {/* Title positioned with better integration */}
      <div className="absolute top-6 left-20 right-20 flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-holo-black tracking-wide bg-gradient-to-r from-holo-teal to-holo-coral bg-clip-text text-transparent">
          SELECT YOUR EXPERIENCE
        </h1>
        <HoloLogo size="small" variant="dots" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 md:pt-0">
        {/* Role Options */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-16">
          {/* Designer Option */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleRoleSelect('designer')}>
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-teal absolute inset-0 group-hover:animate-pulse-ring"></div>
              
              {/* Middle ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-coral absolute inset-2 group-hover:scale-105 transition-transform duration-300"></div>
              
              {/* Inner circle */}
              <div className="w-48 h-48 rounded-full bg-holo-black flex items-center justify-center relative z-10 group-hover:bg-holo-coral transition-colors duration-300">
                <Building size={48} className="text-holo-white" />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <h2 className="text-lg font-inter font-semibold text-holo-black mb-2">DESIGNER</h2>
              <p className="text-sm font-inter text-gray-600">Begin Customization</p>
            </div>
          </div>

          {/* Arrow Image */}
          <div className="hidden md:block">
            <img 
              src="/lovable-uploads/812f4522-3587-4914-8f42-e1f6190abb47.png" 
              alt="Arrow" 
              className="w-40 h-16 mx-8"
            />
          </div>

          {/* Supplier Option */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleRoleSelect('supplier')}>
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-teal absolute inset-0 group-hover:animate-pulse-ring"></div>
              
              {/* Middle ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-coral absolute inset-2 group-hover:scale-105 transition-transform duration-300"></div>
              
              {/* Inner circle */}
              <div className="w-48 h-48 rounded-full bg-holo-black flex items-center justify-center relative z-10 group-hover:bg-holo-coral transition-colors duration-300">
                <Database size={48} className="text-holo-white" />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <h2 className="text-lg font-inter font-semibold text-holo-black mb-2">SUPPLIER</h2>
              <p className="text-sm font-inter text-gray-600">Upload Materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
