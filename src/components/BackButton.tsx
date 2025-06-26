
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
      className={`absolute top-6 left-6 w-10 h-10 rounded-full bg-holo-black text-holo-white flex items-center justify-center hover:border-2 hover:border-holo-coral hover:w-11 hover:h-11 transition-all duration-100 ${className}`}
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackButton;
