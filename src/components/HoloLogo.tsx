
import React from 'react';

interface HoloLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'full' | 'dots';
}

const HoloLogo: React.FC<HoloLogoProps> = ({ 
  size = 'medium', 
  className = '', 
  variant = 'full' 
}) => {
  if (variant === 'dots') {
    // Six-dot logo for bottom-right corner
    const sizeClasses = {
      small: 'w-8 h-12',
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

  // Full HoloLab logo
  const sizeClasses = {
    small: 'w-20',
    medium: 'w-40',
    large: 'w-40'
  };

  return (
    <img 
      src="/lovable-uploads/0e268fdf-0bc5-4d6a-9fd8-e2d25676be8c.png" 
      alt="HoloLab Logo" 
      className={`${sizeClasses[size]} h-auto ${className}`}
    />
  );
};

export default HoloLogo;
