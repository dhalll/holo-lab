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

// Function to get a placeholder image based on material type
const getMaterialImage = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pvc':
      return 'https://via.placeholder.com/150/ADD8E6/000000?text=PVC'; // Light blue
    case 'steel':
      return 'https://via.placeholder.com/150/B0C4DE/000000?text=Steel'; // Light steel blue
    case 'copper':
      return 'https://via.placeholder.com/150/CD7F32/FFFFFF?text=Copper'; // Bronze
    case 'hdpe': // Added for your Figma example
      return 'https://via.placeholder.com/150/A9A9A9/FFFFFF?text=HDPE'; // Dark gray
    case 'cast iron':
      return 'https://via.placeholder.com/150/505050/FFFFFF?text=CI'; // Dark gray
    case 'galvanized':
      return 'https://via.placeholder.com/150/C0C0C0/000000?text=Galv'; // Silver
    default:
      return 'https://via.placeholder.com/150/E0E0E0/000000?text=Material'; // Light gray default
  }
};


const mockMaterials: Material[] = [
  { id: 1, type: 'PVC', diameter: 50, length: 3000, condition: 'Excellent', quantity: 25, location: 'San Francisco, CA', dateAdded: '2024-01-15' },
  { id: 2, type: 'Steel', diameter: 75, length: 2500, condition: 'Good', quantity: 15, location: 'Oakland, CA', dateAdded: '2024-01-14' },
  { id: 3, type: 'Copper', diameter: 25, length: 1500, condition: 'Fair', quantity: 30, location: 'Berkeley, CA', dateAdded: '2024-01-13' },
  // Adding more mock data to better resemble your Figma
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
      diameter: parseFloat(newMaterial.diameter), // Use parseFloat for decimal diameters
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
    <div className="min-h-screen bg-holo-white font-inter overflow-hidden"> {/* Added overflow-hidden to main div */}
      {/* Header */}
      <div className="sticky top-0 bg-holo-white border-b border-holo-teal/20 z-10">
        <div className="flex items-center justify-between px-12 py-6"> {/* Reverted to px-12 for better fit with new design */}
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

      {/* New Header Bar with Pipe Database and Selected Pipes */}
      <div className="bg-holo-white py-4 px-12 border-b border-gray-200 flex justify-between items-center z-5">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 rounded-full px-5 py-2 font-semibold text-gray-800 text-lg">Pipe Database:</div>
        </div>
        <div className="flex items-center gap-2 bg-holo-coral/10 text-holo-coral rounded-full px-5 py-2 cursor-pointer border border-holo-coral">
          <span className="font-semibold text-lg">Selected Pipes:</span>
          <span className="text-lg">0/566 needed</span>
          <ChevronDown size={20} className="ml-2" />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-12 py-6 bg-gray-50 border-b border-holo-teal/10"> {/* Reverted to px-12 */}
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
      {/* This is the main section that changes from table to cards */}
      <div className="px-12 py-6 overflow-y-auto max-h-[calc(100vh-250px)]"> {/* Adjusted height to account for fixed headers */}
        <div className="grid gap-4"> {/* Use grid for a clean stacked layout */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No materials found matching your filters.
            </div>
          )}
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between bg-holo-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-holo-coral transition-colors duration-200 cursor-pointer"
              // Add a border for selected items if you implement selection later
              // className={`... ${selectedMaterialId === material.id ? 'border-holo-coral border-2' : ''}`}
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

              {/* Right side - Date and Location */}
              <div className="flex flex-col items-end text-right ml-4">
                <span className="text-sm text-gray-500">Date Added: {new Date(material.dateAdded).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span className="text-sm text-gray-500 mt-1">Recycled From: {material.location}</span>
              </div>

              {/* Action/Selection Icon - Your Figma shows a scrollbar, but if these were selectable,
                  you might place an icon here similar to the "Selected Pipes" chevron.
                  For now, let's keep it simple or add a placeholder.
              */}
              {/* This is where you might add a checkbox or a selection indicator if you're building out selection */}
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
                    <option value="HDPE">HDPE</option> {/* Added HDPE option */}
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
                      step="0.01" // Allow decimal for diameter
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