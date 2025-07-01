
import React from 'react';

const ExportPanel = () => {
  return (
    <div className="text-center">
      <button className="w-full py-2 bg-holo-coral text-holo-white rounded-lg font-inter font-medium text-xs hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300 mb-2">
        Download JSON
      </button>
      <p className="text-xs font-inter text-gray-600">
        Use this file to train custom ML models for future designs.
      </p>
    </div>
  );
};

export default ExportPanel;
