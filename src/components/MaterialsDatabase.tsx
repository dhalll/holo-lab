
import React, { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';

interface MaterialsDatabaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const MaterialsDatabase: React.FC<MaterialsDatabaseProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const materials = [
    { id: 1, name: 'PVC Pipe', category: 'pipes', stock: 85, co2Impact: 0.8, price: '$2.50' },
    { id: 2, name: 'Steel Pipe', category: 'pipes', stock: 20, co2Impact: 2.1, price: '$8.90' },
    { id: 3, name: '3D Joint Connector', category: 'joints', stock: 45, co2Impact: 0.3, price: '$1.20' },
    { id: 4, name: 'Aluminum Frame', category: 'frames', stock: 12, co2Impact: 1.5, price: '$15.40' },
    { id: 5, name: 'Recycled Plastic Sheet', category: 'panels', stock: 30, co2Impact: 0.4, price: '$6.70' },
    { id: 6, name: 'Solar Panel Mount', category: 'mounts', stock: 8, co2Impact: 3.2, price: '$45.00' }
  ];

  const categories = [
    { id: 'all', label: 'All Materials' },
    { id: 'pipes', label: 'Pipes' },
    { id: 'joints', label: 'Joints' },
    { id: 'frames', label: 'Frames' },
    { id: 'panels', label: 'Panels' },
    { id: 'mounts', label: 'Mounts' }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-holo-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-holo-teal/20 flex justify-between items-center">
          <h2 className="text-xl font-inter font-bold text-holo-black">Materials Database</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-holo-teal/20">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map(material => (
              <div key={material.id} className="bg-white border border-holo-teal/20 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-inter font-semibold text-holo-black">{material.name}</h3>
                  <span className="text-xs bg-holo-teal/20 text-holo-black px-2 py-1 rounded-full">
                    {material.category}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className={`font-medium ${material.stock > 20 ? 'text-green-600' : material.stock > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {material.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CO₂ Impact:</span>
                    <span className="font-medium">{material.co2Impact} kg/unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-holo-coral">{material.price}</span>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-gradient-teal-coral text-white rounded-lg font-medium hover:bg-gradient-coral-teal transition-all duration-200">
                  Select Material
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsDatabase;
