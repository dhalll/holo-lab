
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/role-selection');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-20">
        <HoloLogo size="large" />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div 
          className="p-8 rounded-[32px] bg-holo-teal bg-opacity-20 backdrop-blur-sm"
          style={{ boxShadow: '0 8px 32px rgba(165, 193, 200, 0.1)' }}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your Email or Username *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-6 rounded-[32px] border-0 bg-holo-white text-holo-black placeholder:text-gray-500 font-inter text-base focus:outline-none focus:ring-2 focus:ring-holo-coral transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Enter your Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-6 rounded-[32px] border-0 bg-holo-white text-holo-black placeholder:text-gray-500 font-inter text-base focus:outline-none focus:ring-2 focus:ring-holo-coral transition-all duration-200"
                required
              />
            </div>

            <div className="flex justify-between text-sm pt-2">
              <button
                type="button"
                className="text-gray-600 hover:text-holo-coral hover:underline font-inter font-medium transition-colors duration-200"
              >
                Create an Account
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-holo-coral hover:underline font-inter font-medium transition-colors duration-200"
              >
                Forgot Password
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-[32px] bg-gradient-to-r from-holo-coral to-holo-black border-4 border-holo-coral text-holo-white font-inter font-semibold text-base hover:shadow-lg hover:shadow-holo-coral/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  boxShadow: 'inset 0 2px 4px rgba(245, 123, 78, 0.3)' 
                }}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Logo */}
      <div className="fixed bottom-8 right-8">
        <HoloLogo size="small" />
      </div>
    </div>
  );
};

export default Index;
