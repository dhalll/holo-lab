
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps = 6, 
  stepLabels = [] 
}) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
      <div className="flex flex-col items-center space-y-8">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-holo-black border-holo-black'
                      : 'bg-transparent border-holo-teal'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-holo-black animate-pulse-ring"></div>
                  )}
                </div>
                
                {/* Connecting line */}
                {index < totalSteps - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-8 transition-all duration-300 ${
                      stepNumber < currentStep
                        ? 'bg-holo-black'
                        : 'bg-holo-teal'
                    }`}
                  ></div>
                )}
              </div>
              
              {stepLabels[index] && (
                <span className="text-xs font-inter font-medium text-holo-black mt-2 writing-mode-vertical text-center max-w-4">
                  {stepLabels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
