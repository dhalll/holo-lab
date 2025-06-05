
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
    <div className="min-h-screen bg-holo-white font-inter relative">
      {/* Header */}
      <div className="absolute top-6 left-6 z-20">
        <HoloLogo size="small" variant="full" />
      </div>
      
      <div className="absolute top-6 left-32 z-20">
        <BackButton to="/supplier/start" />
      </div>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-xl font-inter font-bold text-holo-black">Scan Materials</h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Instructions */}
        <div className="max-w-2xl text-center mb-8">
          <p className="font-inter text-base text-gray-700">
            Allow camera access to photograph reclaimed pipes. We'll extract dimensions automatically.
          </p>
        </div>

        {/* Camera Preview Area */}
        {cameraError ? (
          <div className="w-full max-w-2xl h-96 bg-gray-100 rounded-2xl border-2 border-dashed border-holo-teal flex items-center justify-center">
            <p className="text-gray-600 font-inter">{cameraError}</p>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl h-96 bg-gray-100 rounded-2xl overflow-hidden border-2 border-holo-teal">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Overlay guide */}
            <div className="absolute inset-8 border-2 border-holo-coral border-dashed rounded-lg pointer-events-none opacity-60">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-holo-coral text-sm font-inter bg-holo-white px-2 py-1 rounded">
                Position pipe here
              </div>
            </div>
          </div>
        )}

        {/* Capture Button */}
        {!cameraError && (
          <button
            onClick={capturePhoto}
            className="mt-8 w-16 h-16 bg-holo-coral rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
          >
            <Camera size={32} className="text-holo-white" />
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
