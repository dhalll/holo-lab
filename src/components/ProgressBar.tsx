
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
  variant?: 'designer' | 'supplier';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 4,
  stepLabels = ['Experience', 'Location', 'Customize', 'Finalize'],
  variant = 'designer'
}) => {
  // Default supplier steps
  const supplierLabels = ['Start', 'Upload', 'Results'];
  const supplierTotalSteps = 3;
  
  const labels = variant === 'supplier' ? supplierLabels : stepLabels;
  const steps = variant === 'supplier' ? supplierTotalSteps : totalSteps;

  return (
    <>
      {/* Desktop Progress Bar - Vertical on left side */}
      <div className="fixed left-6 top-20 bottom-20 z-10 hidden md:flex flex-col justify-start w-[200px]">
        <div className="flex flex-col py-8">
          {Array.from({ length: steps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="relative flex items-center mb-16">
                {/* Step Circle */}
                <div className="relative flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-holo-black border-holo-black' 
                      : isActive 
                        ? 'bg-holo-black border-holo-black' 
                        : 'bg-transparent border-holo-teal'
                  }`}>
                    {/* Current step highlight ring */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full border-2 border-holo-coral animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <span className={`ml-4 text-sm font-inter font-medium transition-colors duration-300 ${
                    isCurrent 
                      ? 'text-holo-coral' 
                      : isActive 
                        ? 'text-holo-black' 
                        : 'text-gray-500'
                  }`}>
                    {labels[index]}
                  </span>
                </div>
                
                {/* Connecting dotted line */}
                {index < steps - 1 && (
                  <div className="absolute left-3 top-6 flex flex-col space-y-1">
                    {Array.from({ length: 8 }, (_, dotIndex) => (
                      <div 
                        key={dotIndex} 
                        className={`w-0.5 h-0.5 rounded-full transition-all duration-300 ${
                          stepNumber < currentStep ? 'bg-holo-black' : 'bg-holo-teal'
                        }`} 
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar - Horizontal at top */}
      <div className="fixed top-4 left-4 right-4 z-10 md:hidden bg-holo-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          {Array.from({ length: steps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 mb-1 ${
                  isCurrent 
                    ? 'bg-holo-black border-holo-black' 
                    : isActive 
                      ? 'bg-holo-black border-holo-black' 
                      : 'bg-transparent border-holo-teal'
                }`}>
                  {isCurrent && (
                    <div className="absolute w-5 h-5 rounded-full border-2 border-holo-coral animate-pulse"></div>
                  )}
                </div>
                
                <span className={`text-xs font-inter font-medium ${
                  isCurrent 
                    ? 'text-holo-coral' 
                    : isActive 
                      ? 'text-holo-black' 
                      : 'text-gray-500'
                }`}>
                  {labels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
