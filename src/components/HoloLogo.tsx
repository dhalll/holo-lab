
import React from 'react';

interface HoloLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const HoloLogo: React.FC<HoloLogoProps> = ({ size = 'medium', className = '' }) => {
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
};

export default HoloLogo;
