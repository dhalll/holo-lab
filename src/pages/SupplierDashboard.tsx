import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton'; // Assuming this component exists
import { Search, Filter, Edit, Trash2, ChevronDown } from 'lucide-react';

interface Material {
  id: number;
  type: string;
  diameter: number;
  length: number;
  condition: string;
  quantity: number;
  location: string;
  dateAdded: string;
}

// Function to get the actual images based on material type
const getMaterialImage = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pvc':
      return '/lovable-uploads/7b775965-3c91-4858-a229-22200248f865.png'; // White PVC pipes
    case 'steel':
      return '/lovable-uploads/ec7cfbfd-6402-4896-8b89-d4763dc32534.png'; // Steel tubing
    case 'copper':
      return '/lovable-uploads/5ba08a5c-46f4-46b8-8205-3607d9f75e28.png'; // Copper pipes
    case 'hdpe':
      return '/lovable-uploads/7b775965-3c91-4858-a229-22200248f865.png'; // Use PVC image for HDPE
    case 'cast iron':
      return '/lovable-uploads/ec7cfbfd-6402-4896-8b89-d4763dc32534.png'; // Use steel image for cast iron
    case 'galvanized':
      return '/lovable-uploads/ec7cfbfd-6402-4896-8b89-d4763dc32534.png'; // Use steel image for galvanized
    default:
      return '/lovable-uploads/7b775965-3c91-4858-a229-22200248f865.png'; // Default to PVC image
  }
};

const mockMaterials: Material[] = [
  { id: 1, type: 'PVC', diameter: 50, length: 3000, condition: 'Excellent', quantity: 25, location: 'San Francisco, CA', dateAdded: '2024-01-15' },
  { id: 2, type: 'Steel', diameter: 75, length: 2500, condition: 'Good', quantity: 15, location: 'Oakland, CA', dateAdded: '2024-01-14' },
  { id: 3, type: 'Copper', diameter: 25, length: 1500, condition: 'Fair', quantity: 30, location: 'Berkeley, CA', dateAdded: '2024-01-13' },
  { id: 4, type: 'HDPE', diameter: 26, length: 1000, condition: 'Excellent', quantity: 50, location: 'South London, UK', dateAdded: '2025-09-18' },
  { id: 5, type: 'Steel', diameter: 50.8, length: 2000, condition: 'Good', quantity: 226, location: 'Manchester, UK', dateAdded: '2025-01-10' },
  { id: 6, type: 'PVC', diameter: 25, length: 1200, condition: 'Fair', quantity: 62, location: 'Hampstead, UK', dateAdded: '2025-02-06' },
  { id: 7, type: 'Steel', diameter: 152.4, length: 3500, condition: 'Excellent', quantity: 52, location: 'Leeds, UK', dateAdded: '2024-11-28' },
  { id: 8, type: 'Copper', diameter: 100, length: 1500, condition: 'Excellent', quantity: 115, location: 'Surrey, UK', dateAdded: '2025-08-12' },
];

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCondition, setSelectedCondition] = useState('');
  const [diameterRange, setDiameterRange] = useState({ min: '', max: '' });
  const [dateFilter, setDateFilter] = useState('');

  const [newMaterial, setNewMaterial] = useState({
    type: 'PVC',
    diameter: '',
    length: '',
    condition: 'Excellent',
    quantity: '',
    location: ''
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const material: Material = {
      id: materials.length + 1,
      type: newMaterial.type,
      diameter: parseFloat(newMaterial.diameter),
      length: parseInt(newMaterial.length),
      condition: newMaterial.condition,
      quantity: parseInt(newMaterial.quantity),
      location: newMaterial.location,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setMaterials([material, ...materials]);
    setShowUploadModal(false);
    setNewMaterial({
      type: 'PVC',
      diameter: '',
      length: '',
      condition: 'Excellent',
      quantity: '',
      location: ''
    });
  };

  const handleDelete = (id: number) => {
    // In a real app, you'd send a DELETE request to your backend here
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };

  const handleEdit = (material: Material) => {
    // In a real app, you'd likely open an edit modal pre-filled with this material's data
    // For now, we'll just log it.
    alert(`Editing material ID: ${material.id} (${material.type} - ${material.diameter}mm)`);
    console.log('Edit material:', material);
    // You would typically set state to show an edit modal here and pass the material data
    // setShowEditModal(true);
    // setEditingMaterial(material);
  };


  const clearFilters = () => {
    setSelectedCondition('');
    setDiameterRange({ min: '', max: '' });
    setDateFilter('');
  };

  const filteredMaterials = materials.filter(material => {
    // Search filter
    const matchesSearch = material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.diameter.toString().includes(searchTerm); // Search by diameter too

    // Condition filter
    const matchesCondition = !selectedCondition || material.condition === selectedCondition;

    // Diameter filter
    const matchesDiameter = (!diameterRange.min || material.diameter >= parseFloat(diameterRange.min)) &&
      (!diameterRange.max || material.diameter <= parseFloat(diameterRange.max));

    // Date filter - Format dateAdded for consistent comparison
    const matchesDate = !dateFilter || new Date(material.dateAdded) >= new Date(dateFilter);

    return matchesSearch && matchesCondition && matchesDiameter && matchesDate;
  });

  return (
    <div className="min-h-screen bg-holo-white font-inter overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-holo-white border-b border-holo-teal/20 z-10">
        <div className="flex items-center justify-between px-12 py-6">
          <div className="flex items-center gap-4">
            <BackButton to="/role-selection" />
            <h1 className="text-[20px] font-semibold text-holo-black ml-12 tracking-wide">MATERIAL DASHBOARD</h1>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-holo-coral text-holo-white rounded-[32px] font-inter font-semibold hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300"
          >
            Upload New Material
          </button>
        </div>
      </div>

      {/* Removed the "Pipe Database:" and "Selected Pipes: 0/566 needed" section here */}

      {/* Search and Filter Bar */}
      <div className="px-12 py-6 bg-gray-50 border-b border-holo-teal/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by type, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-holo-white border border-holo-teal/30 rounded-[32px] focus:outline-none focus:ring-2 focus:ring-holo-coral text-holo-black"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-holo-white border border-holo-teal rounded-lg hover:bg-holo-teal/10 transition-colors duration-200"
          >
            <Filter size={20} className="text-holo-black" />
            <span className="text-holo-black font-inter">Filters</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-holo-white border border-holo-teal/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-inter font-medium text-holo-black mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full p-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                >
                  <option value="">All Conditions</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Diameter Range Filter */}
              <div>
                <label className="block text-sm font-inter font-medium text-holo-black mb-2">Diameter (mm)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={diameterRange.min}
                    onChange={(e) => setDiameterRange({...diameterRange, min: e.target.value})}
                    className="w-full p-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={diameterRange.max}
                    onChange={(e) => setDiameterRange({...diameterRange, max: e.target.value})}
                    className="w-full p-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                  />
                </div>
              </div>

              {/* Date Added Filter */}
              <div>
                <label className="block text-sm font-inter font-medium text-holo-black mb-2">Date Added (From)</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Materials Display as Cards */}
      <div className="px-12 py-6 overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Adjusted height calculation for removed header */}
        <div className="grid gap-4">
          {filteredMaterials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No materials found matching your filters.
            </div>
          )}
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between bg-holo-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-holo-coral transition-colors duration-200"
            >
              <div className="flex items-center flex-grow">
                {/* Image or Icon - Left side */}
                <img
                  src={getMaterialImage(material.type)}
                  alt={material.type}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                
                <div className="flex flex-col flex-grow">
                  {/* Material Type and Diameter */}
                  <h3 className="text-lg font-semibold text-holo-black">
                    Material Type: {material.diameter} cm {material.type} {material.type === 'Steel' ? 'Tubing' : 'Pipes'}
                  </h3>
                  {/* Quantity */}
                  <p className="text-gray-600 text-sm mt-1">Quantity: {material.quantity} pcs</p>
                </div>
              </div>

              {/* Middle section - Date and Location */}
              <div className="flex flex-col items-end text-right mr-4"> {/* Added mr-4 for spacing */}
                <span className="text-sm text-gray-500">Date Added: {new Date(material.dateAdded).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span className="text-sm text-gray-500 mt-1">Recycled From: {material.location}</span>
              </div>

              {/* Actions - Edit and Delete Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(material)} // Pass the whole material object for editing
                  className="p-2 text-holo-teal hover:text-holo-coral transition-colors duration-200"
                  title="Edit Material"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Delete Material"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Upload Modal - Remains the same */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-holo-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-holo-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-inter font-bold text-holo-black mb-6">Upload Reclaimed Pipes</h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">Material Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}
                    className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                  >
                    <option value="PVC">PVC</option>
                    <option value="Steel">Steel</option>
                    <option value="Copper">Copper</option>
                    <option value="Cast Iron">Cast Iron</option>
                    <option value="Galvanized">Galvanized</option>
                    <option value="HDPE">HDPE</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">Length (mm)</label>
                    <input
                      type="number"
                      value={newMaterial.length}
                      onChange={(e) => setNewMaterial({...newMaterial, length: e.target.value})}
                      className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-inter font-medium text-holo-black mb-2">Diameter (mm)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMaterial.diameter}
                      onChange={(e) => setNewMaterial({...newMaterial, diameter: e.target.value})}
                      className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-3">Condition Rating</label>
                  <div className="space-y-2">
                    {['Excellent', 'Good', 'Fair', 'Poor'].map((condition) => (
                      <label key={condition} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="condition"
                          value={condition}
                          checked={newMaterial.condition === condition}
                          onChange={(e) => setNewMaterial({...newMaterial, condition: e.target.value})}
                          className="mr-3 w-4 h-4 text-holo-coral border-gray-300 focus:ring-holo-coral"
                        />
                        <span className="text-sm font-inter text-holo-black">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                    className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-inter font-medium text-holo-black mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={newMaterial.location}
                    onChange={(e) => setNewMaterial({...newMaterial, location: e.target.value})}
                    className="w-full p-3 border border-holo-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-holo-coral"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-holo-black transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-holo-coral text-holo-white rounded-lg font-inter font-semibold hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
