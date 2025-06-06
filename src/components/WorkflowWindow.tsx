
import React from 'react';

interface WorkflowWindowProps {
  children: React.ReactNode;
  className?: string;
}

const WorkflowWindow: React.FC<WorkflowWindowProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-[800px] h-[500px] rounded-xl overflow-hidden border-2 border-holo-teal bg-[#F8F9FA] ${className}`}>
      {children}
    </div>
  );
};

export default WorkflowWindow;
