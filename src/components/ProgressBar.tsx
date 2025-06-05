
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps = 4, 
  stepLabels = ['Experience', 'Location', 'Customize', 'Finalize'] 
}) => {
  return (
    <>
      {/* Desktop Progress Bar */}
      <div className="fixed left-6 top-20 bottom-20 z-10 hidden md:flex flex-col justify-start w-[100px]">
        <div className="flex flex-col">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="flex items-center mb-12">
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-holo-black border-holo-black'
                        : 'bg-transparent border-holo-teal'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full border-2 border-holo-coral animate-pulse-ring"></div>
                    )}
                  </div>
                  
                  {/* Connecting dotted line */}
                  {index < totalSteps - 1 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-12 flex flex-col justify-between items-center">
                      {Array.from({ length: 6 }, (_, dotIndex) => (
                        <div
                          key={dotIndex}
                          className={`w-1 h-1 rounded-full transition-all duration-300 ${
                            stepNumber < currentStep
                              ? 'bg-holo-black'
                              : 'bg-holo-teal'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {stepLabels[index] && (
                  <span className={`ml-4 text-[16px] font-semibold transition-colors duration-300 ${
                    isCurrent ? 'text-holo-coral' : isActive ? 'text-holo-black' : 'text-gray-600'
                  }`}>
                    {stepLabels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="fixed top-4 left-4 right-4 z-10 md:hidden bg-holo-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 mb-1 ${
                    isActive
                      ? 'bg-holo-black border-holo-black'
                      : 'bg-transparent border-holo-teal'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute w-5 h-5 rounded-full border-2 border-holo-coral animate-pulse-ring"></div>
                  )}
                </div>
                
                {stepLabels[index] && (
                  <span className={`text-xs font-inter font-medium ${
                    isCurrent ? 'text-holo-coral' : isActive ? 'text-holo-black' : 'text-gray-600'
                  }`}>
                    {stepLabels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
