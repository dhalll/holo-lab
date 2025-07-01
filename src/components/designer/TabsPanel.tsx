
import React from 'react';
import MaterialsPanel from './MaterialsPanel';
import JointsPanel from './JointsPanel';
import ExportPanel from './ExportPanel';

interface TabsPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsPanel: React.FC<TabsPanelProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'materials', label: 'Materials' },
    { id: 'joints', label: 'Joints' },
    { id: 'export', label: 'Export' }
  ];

  return (
    <div className="bg-holo-white border border-holo-teal/20 rounded-lg shadow-sm overflow-hidden flex-1">
      <div className="flex border-b border-holo-teal/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-2 text-xs font-inter font-medium transition-colors duration-200 ${
              activeTab === tab.id 
                ? 'text-holo-coral border-b-2 border-holo-coral bg-holo-coral/5' 
                : 'text-gray-600 hover:text-holo-black hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 min-h-[200px]">
        {activeTab === 'materials' && <MaterialsPanel />}
        {activeTab === 'joints' && <JointsPanel />}
        {activeTab === 'export' && <ExportPanel />}
      </div>
    </div>
  );
};

export default TabsPanel;
