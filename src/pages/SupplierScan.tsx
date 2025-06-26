import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import { Camera, Lightbulb, Layers, Tag } from 'lucide-react';

const SupplierScan = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanComplete = () => {
    setIsScanning(true);
    
    // Simulate processing time
    setTimeout(() => {
      navigate('/supplier/scan-results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter">
      <ProgressBar currentStep={2} variant="supplier" />
      
      <BackButton to="/supplier/start" />
      
      {/* Title positioned same as other pages */}
      <h1 className="absolute top-6 left-20 text-[20px] font-semibold text-holo-black tracking-wide">
        SCAN MATERIALS
      </h1>

      <div className="flex items-center justify-center min-h-screen px-8 pt-16">
        {!isScanning ? (
          <div className="flex items-start justify-center gap-12 max-w-6xl mx-auto w-full">
            {/* Camera View - Left Side */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl mb-8 flex items-center justify-center border-4 border-dashed border-holo-teal/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <Camera size={80} className="text-holo-teal opacity-60" />
                </div>
                <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-holo-coral"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-holo-coral"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-holo-coral"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-holo-coral"></div>
              </div>
              
              <button
                onClick={handleScanComplete}
                className="w-64 h-14 bg-gradient-teal-coral text-white rounded-[32px] font-inter font-bold text-lg hover:bg-gradient-coral-teal hover:scale-105 transition-all duration-300 shadow-lg"
              >
                START SCANNING
              </button>
            </div>

            {/* Instructions - Right Side */}
            <div className="w-96">
              <div className="bg-gradient-to-br from-holo-teal/10 to-holo-teal/20 rounded-2xl p-8 border border-holo-teal/30 shadow-lg h-96 flex flex-col">
                <h2 className="text-2xl font-inter font-bold text-holo-black mb-4 flex items-center gap-3">
                  <Camera className="text-holo-teal" size={28} />
                  Position Your Materials
                </h2>
                <p className="text-gray-700 font-inter mb-8">
                  Place the reclaimed materials within the viewfinder. Make sure they are well-lit and clearly visible. 
                  Holo AI will automatically detect and catalog the materials, noting their quality.
                </p>
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-holo-teal to-holo-teal/80 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-inter text-gray-700">Ensure good lighting conditions</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-holo-teal to-holo-teal/80 rounded-full flex items-center justify-center flex-shrink-0">
                      <Layers size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-inter text-gray-700">Keep materials separated for better detection</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-holo-teal to-holo-teal/80 rounded-full flex items-center justify-center flex-shrink-0">
                      <Tag size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-inter text-gray-700">Include any visible markings or labels</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
            <div className="w-80 h-80 bg-gradient-to-br from-holo-teal/20 to-holo-coral/20 rounded-2xl mb-8 flex items-center justify-center border-4 border-holo-coral relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-holo-coral/30 to-holo-teal/30 animate-pulse"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-inter font-semibold">Analyzing...</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-inter font-bold text-holo-black mb-4">Processing Your Materials</h2>
            <p className="text-gray-600 font-inter">
              Our AI is analyzing the scanned materials and extracting specifications...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierScan;
