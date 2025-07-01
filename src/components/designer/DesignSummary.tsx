
import React from 'react';
import { Package, Wrench, Clock, Leaf } from 'lucide-react';

const DesignSummary = () => {
  return (
    <div className="bg-holo-white border border-holo-teal/20 p-3 shadow-sm rounded-lg">
      <h3 className="font-inter font-semibold text-holo-black mb-2 text-sm">Design Summary</h3>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <Package className="text-holo-coral" size={12} />
          <div><span className="font-bold">Program:</span> Gym + Bar</div>
        </div>
        <div className="flex items-start gap-2">
          <Wrench className="text-holo-teal mt-0.5" size={12} />
          <div><span className="font-bold">Total Height Zones:</span> &lt;2m: 60 m²; &lt;3m: 80 m²</div>
        </div>
        <div className="flex items-start gap-2">
          <Package className="text-holo-coral mt-0.5" size={12} />
          <div><span className="font-bold">Material Usage:</span> PVC: 85 pipes (120 ft); Steel: 20 pipes (50 ft); Copper: 12 pipes (30 ft)</div>
        </div>
        <div className="flex items-center gap-2">
          <Wrench className="text-holo-teal" size={12} />
          <div><span className="font-bold">Joints:</span> 45 custom 3D-printed blobs</div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-gray-600" size={12} />
          <div><span className="font-bold">Build Time:</span> ~120 hrs</div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-holo-coral/10 rounded-lg">
          <Leaf className="text-holo-coral" size={12} />
          <div><span className="font-bold text-holo-coral">CO₂ Saved:</span> <span className="font-bold text-holo-coral text-sm">1.35 t</span></div>
        </div>
      </div>
    </div>
  );
};

export default DesignSummary;
