
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';
import BackButton from '@/components/BackButton';

const SupplierScanResults = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([
    { id: 1, type: 'PVC', length: 2000, diameter: 100, quantity: 1, condition: 'Good' },
    { id: 2, type: 'Steel', length: 1500, diameter: 75, quantity: 1, condition: 'Excellent' },
  ]);

  const updateMaterial = (id: number, field: string, value: string | number) => {
    setMaterials(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addToInventory = () => {
    // Simulate adding to inventory
    navigate('/supplier/dashboard');
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter relative">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <HoloLogo size="small" variant="full" />
      </div>
      
      <div className="absolute top-6 left-32">
        <BackButton to="/supplier/scan" />
      </div>

      <div className="pl-32 pr-8 pt-20 pb-8">
        <h1 className="text-2xl font-inter font-bold text-holo-black mb-8">
          Scan Results
        </h1>

        <div className="max-w-4xl">
          <p className="text-gray-600 font-inter mb-6">
            Review and adjust the extracted pipe information before adding to your inventory.
          </p>

          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="bg-holo-white border border-holo-teal rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Material Type
                    </label>
                    <select
                      value={material.type}
                      onChange={(e) => updateMaterial(material.id, 'type', e.target.value)}
                      className="w-full p-3 border border-holo-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    >
                      <option value="PVC">PVC</option>
                      <option value="Steel">Steel</option>
                      <option value="Copper">Copper</option>
                      <option value="Cast Iron">Cast Iron</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Length (mm)
                    </label>
                    <input
                      type="number"
                      value={material.length}
                      onChange={(e) => updateMaterial(material.id, 'length', parseInt(e.target.value))}
                      className="w-full p-3 border border-holo-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Diameter (mm)
                    </label>
                    <input
                      type="number"
                      value={material.diameter}
                      onChange={(e) => updateMaterial(material.id, 'diameter', parseInt(e.target.value))}
                      className="w-full p-3 border border-holo-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(material.id, 'quantity', parseInt(e.target.value))}
                      className="w-full p-3 border border-holo-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">
                      Condition
                    </label>
                    <select
                      value={material.condition}
                      onChange={(e) => updateMaterial(material.id, 'condition', e.target.value)}
                      className="w-full p-3 border border-holo-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={addToInventory}
              className="px-8 py-3 bg-gradient-teal-coral hover:bg-gradient-coral-teal text-holo-white rounded-[32px] font-inter font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Add to Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Footer Logo - Six-dot version */}
      <div className="fixed bottom-4 right-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <HoloLogo size="small" variant="dots" />
        </div>
      </div>
    </div>
  );
};

export default SupplierScanResults;
