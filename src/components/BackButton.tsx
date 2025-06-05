
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 rounded-full bg-holo-black text-holo-white flex items-center justify-center hover:ring-2 hover:ring-holo-coral transition-all duration-200 ${className}`}
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackButton;
