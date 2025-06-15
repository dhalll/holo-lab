
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
    <div className="min-h-screen bg-gradient-to-br from-holo-white via-holo-white to-holo-coral/5 font-inter relative">
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-24 left-16 w-36 h-36 border-2 border-holo-teal rounded-full"></div>
        <div className="absolute top-32 right-20 w-28 h-28 border-2 border-holo-coral rounded-full"></div>
        <div className="absolute bottom-24 left-1/4 w-20 h-20 border-2 border-holo-teal rotate-45"></div>
        <div className="absolute bottom-32 right-1/4 w-24 h-24 border-2 border-holo-coral rotate-12"></div>
        <div className="absolute top-1/3 left-12 w-12 h-12 border-2 border-holo-teal"></div>
        <div className="absolute top-2/3 right-16 w-16 h-16 border-2 border-holo-coral"></div>
      </div>

      <ProgressBar currentStep={1} />
      
      {/* Back Button aligned with progress bar */}
      <BackButton to="/" />

      {/* Title positioned after back button */}
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black tracking-wide">
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
              
              {/* Inner circle with gradient */}
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-holo-black to-holo-black/80 flex items-center justify-center relative z-10 group-hover:from-holo-coral group-hover:to-holo-coral/80 transition-all duration-300 backdrop-blur-sm">
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
              className="w-40 h-16 mx-8 opacity-80"
            />
          </div>

          {/* Supplier Option */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleRoleSelect('supplier')}>
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-teal absolute inset-0 group-hover:animate-pulse-ring"></div>
              
              {/* Middle ring */}
              <div className="w-48 h-48 rounded-full border-8 border-holo-coral absolute inset-2 group-hover:scale-105 transition-transform duration-300"></div>
              
              {/* Inner circle with gradient */}
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-holo-black to-holo-black/80 flex items-center justify-center relative z-10 group-hover:from-holo-coral group-hover:to-holo-coral/80 transition-all duration-300 backdrop-blur-sm">
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
