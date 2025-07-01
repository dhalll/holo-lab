
import React from 'react';

const JointsPanel = () => {
  const joints = [
    { id: 1, name: 'Joint #001', type: 'T-Junction', image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png' },
    { id: 2, name: 'Joint #002', type: 'Elbow', image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png' },
    { id: 3, name: 'Joint #003', type: 'Cross', image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png' },
    { id: 4, name: 'Joint #004', type: 'Reducer', image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png' },
    { id: 5, name: 'Joint #005', type: 'Y-Junction', image: '/lovable-uploads/7dffaa5f-35a0-4e14-9f80-61311c383ecb.png' },
    { id: 6, name: 'Joint #006', type: 'Coupling', image: '/lovable-uploads/7cc5f26e-912a-4253-a548-dcac010939d0.png' }
  ];

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto">
        {joints.map((joint) => (
          <div
            key={joint.id}
            className="border border-holo-teal/20 rounded-lg p-2 hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-full h-12 bg-white rounded mb-1 flex items-center justify-center overflow-hidden">
              <img src={joint.image} alt={joint.name} className="w-full h-full object-cover rounded" />
            </div>
            <p className="text-xs font-inter font-medium text-holo-black mb-1">{joint.name}</p>
            <p className="text-xs font-inter text-gray-600 mb-1">{joint.type}</p>
            <button className="w-full py-1 bg-holo-coral text-holo-white rounded text-xs font-inter font-medium hover:shadow-md hover:shadow-holo-coral/30 transition-all duration-200">
              Download STL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JointsPanel;
