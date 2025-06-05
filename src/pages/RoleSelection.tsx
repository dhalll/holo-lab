
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
      
      {/* Logo */}
      <HoloLogo size="small" variant="full" />
      
      {/* Header */}
      <BackButton to="/" />

      {/* Title - aligned with header */}
      <h1 className="absolute top-6 left-[148px] text-[20px] font-semibold text-holo-black tracking-wide">
        SELECT YOUR EXPERIENCE
      </h1>

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

          {/* Connecting Curve */}
          <div className="hidden md:block">
            <svg width="120" height="60" className="text-holo-teal">
              <path
                d="M 10 30 Q 60 10 110 30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
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

      {/* Footer Logo - Six-dot version */}
      <div className="fixed bottom-4 right-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
