
import React from 'react';

const MaterialsPanel = () => {
  const materials = [
    { type: 'PVC', qty: 85, diameter: 50, reuse: 95 },
    { type: 'Steel', qty: 20, diameter: 75, reuse: 88 },
    { type: 'Copper', qty: 12, diameter: 25, reuse: 82 }
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-holo-teal/10">
              <th className="text-left py-2 font-inter font-semibold">Type</th>
              <th className="text-left py-2 font-inter font-semibold">Qty</th>
              <th className="text-left py-2 font-inter font-semibold">Ø</th>
              <th className="text-left py-2 font-inter font-semibold">%</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-holo-white' : 'bg-holo-coral/5'
                } hover:bg-holo-coral/10 transition-colors duration-200`}
              >
                <td className="py-2 font-inter">{material.type}</td>
                <td className="py-2 font-inter">{material.qty}</td>
                <td className="py-2 font-inter">{material.diameter}</td>
                <td className="py-2 font-inter font-semibold text-holo-coral">{material.reuse}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="w-full mt-3 py-2 bg-holo-teal/20 text-holo-black rounded-lg font-inter font-medium text-xs hover:bg-holo-teal/30 transition-colors duration-200">
        Download CSV
      </button>
    </div>
  );
};

export default MaterialsPanel;
