
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';
import BackButton from '@/components/BackButton';
import { Camera } from 'lucide-react';

const SupplierScan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setCameraError('Camera access denied. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setShowReview(true);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowReview(false);
  };

  const usePhoto = () => {
    // Simulate scan processing and redirect
    navigate('/supplier/scan-results');
  };

  return (
    <div className="min-h-screen bg-holo-black font-inter relative">
      {/* Header */}
      <div className="absolute top-6 left-6 z-20">
        <HoloLogo size="small" variant="full" />
      </div>
      
      <div className="absolute top-6 left-20 z-20">
        <BackButton to="/supplier/start" />
      </div>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-xl font-inter font-bold text-holo-white">Scan Materials</h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Instructions */}
        <div className="max-w-2xl text-center mb-8">
          <p className="font-inter text-base text-holo-white">
            Use your camera to scan materials. We'll extract dimensions automatically.
          </p>
        </div>

        {/* Camera Preview Area with iOS-style viewfinder */}
        {cameraError ? (
          <div className="w-full max-w-2xl h-96 bg-gray-100 rounded-2xl border-2 border-dashed border-holo-teal flex items-center justify-center">
            <p className="text-gray-600 font-inter">{cameraError}</p>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl h-96 bg-black rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* iOS Camera Viewfinder Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-8 left-8 w-6 h-6 border-l-2 border-t-2 border-white"></div>
              <div className="absolute top-8 right-8 w-6 h-6 border-r-2 border-t-2 border-white"></div>
              <div className="absolute bottom-8 left-8 w-6 h-6 border-l-2 border-b-2 border-white"></div>
              <div className="absolute bottom-8 right-8 w-6 h-6 border-r-2 border-b-2 border-white"></div>
              
              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border border-white border-opacity-60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Grid lines */}
              <div className="absolute inset-8 grid grid-cols-3 grid-rows-3 gap-0">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white border-opacity-20"></div>
                ))}
              </div>
              
              {/* Level indicator */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <div className="w-1 h-12 bg-white bg-opacity-40 rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                </div>
              </div>
              
              {/* Focus zone */}
              <div className="absolute inset-12 border-2 border-holo-coral border-dashed rounded-lg opacity-80">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-holo-coral text-sm font-inter bg-black bg-opacity-60 px-2 py-1 rounded">
                  Position pipe here
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capture Button */}
        {!cameraError && (
          <button
            onClick={capturePhoto}
            className="mt-8 w-16 h-16 bg-holo-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg border-4 border-gray-300"
          >
            <div className="w-12 h-12 bg-holo-coral rounded-full flex items-center justify-center">
              <Camera size={24} className="text-holo-white" />
            </div>
          </button>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Review Modal */}
      {showReview && capturedImage && (
        <div className="fixed inset-0 bg-holo-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-lg font-inter font-bold text-holo-black mb-4">Review Capture</h2>
            
            <img 
              src={capturedImage} 
              alt="Captured pipe" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <div className="flex justify-between">
              <button
                onClick={retakePhoto}
                className="text-gray-600 hover:text-holo-coral font-inter font-medium"
              >
                Retake
              </button>
              <button
                onClick={usePhoto}
                className="px-6 py-2 bg-gradient-teal-coral hover:bg-gradient-coral-teal text-holo-white rounded-lg font-inter font-semibold transition-all duration-300"
              >
                Use Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Logo - Six-dot version */}
      <div className="fixed bottom-4 right-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default SupplierScan;
