import React from 'react';

interface HoloLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'full' | 'dots' | 'top-right';
  isLanding?: boolean;
}

const HoloLogo: React.FC<HoloLogoProps> = ({ 
  size = 'medium', 
  className = '', 
  variant = 'full',
  isLanding = false
}) => {
  // Top-right corner logo variant - standardized size and positioning
  if (variant === 'top-right') {
    return (
      <img 
        src="/lovable-uploads/cbd5629b-35d4-4351-8070-3528ec5cec35.png" 
        alt="HoloLab Logo" 
        className={`w-16 h-16 object-contain ${className}`}
      />
    );
  }

  if (variant === 'dots') {
    // Six-dot logo for bottom-right corner
    const sizeClasses = {
      small: 'w-12 h-12',
      medium: 'w-12 h-16',
      large: 'w-20 h-24'
    };

    const circleSize = {
      small: 'w-2.5 h-2.5',
      medium: 'w-3.5 h-3.5',
      large: 'w-5 h-5'
    };

    return (
      <div className={`${sizeClasses[size]} ${className} flex flex-col justify-between items-center`}>
        {/* Top row - Black circles */}
        <div className="flex gap-1">
          <div className={`${circleSize[size]} bg-holo-black rounded-full`}></div>
          <div className={`${circleSize[size]} bg-holo-black rounded-full`}></div>
        </div>
        
        {/* Middle row - Teal circles */}
        <div className="flex gap-1">
          <div className={`${circleSize[size]} bg-holo-teal rounded-full`}></div>
          <div className={`${circleSize[size]} bg-holo-teal rounded-full`}></div>
        </div>
        
        {/* Bottom row - Black circles */}
        <div className="flex gap-1">
          <div className={`${circleSize[size]} bg-holo-black rounded-full`}></div>
          <div className={`${circleSize[size]} bg-holo-black rounded-full`}></div>
        </div>
      </div>
    );
  }

  // Full HoloLab logo using the uploaded image
  if (isLanding) {
    return (
      <img 
        src="/lovable-uploads/cbd5629b-35d4-4351-8070-3528ec5cec35.png" 
        alt="HoloLab Logo" 
        className="w-40 mx-auto mt-20 h-auto"
      />
    );
  }

  // For non-landing pages, return null since we don't want the top logo
  return null;
};

export default HoloLogo;
