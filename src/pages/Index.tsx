
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
    <div className="min-h-screen bg-holo-white font-inter flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Pixel Gradient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-holo-teal/20 via-transparent to-holo-coral/20 animate-pulse"></div>
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(165, 193, 200, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(245, 123, 78, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(165, 193, 200, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 90% 20%, rgba(245, 123, 78, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(0, 0, 0, 0.03) 0%, transparent 30%)
            `,
            backgroundSize: '400px 400px, 300px 300px, 500px 500px, 200px 200px, 350px 350px',
            animation: 'float 20s ease-in-out infinite, drift 30s linear infinite'
          }}
        ></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 60% 40%, rgba(245, 123, 78, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 30% 60%, rgba(165, 193, 200, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 70% 90%, rgba(0, 0, 0, 0.02) 0%, transparent 35%)
            `,
            backgroundSize: '250px 250px, 180px 180px, 400px 400px',
            animation: 'float 25s ease-in-out infinite reverse, drift 40s linear infinite reverse'
          }}
        ></div>
      </div>

      {/* Logo - centered, no progress bar or six-dot emblem on landing */}
      <HoloLogo variant="full" isLanding={true} />

      {/* Login Form */}
      <div className="w-full max-w-md mt-12 relative z-10">
        {/* Outer wrapper for faint image + gradient */}
        <div className="relative rounded-[32px] overflow-hidden">
          {/* 1. Faint Pipes Background */}
          <img
            src="/lovable-uploads/13200af4-8cd6-4bb6-94e8-72e38dbf1f56.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.15 }}
          />

          {/* 2. Animated Gradient Overlay */}
          <div 
            className="relative p-8 bg-holo-gradient bg-[length:200%_200%] animate-gradient-slide backdrop-blur-sm shadow-lg"
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your Email or Username *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-6 rounded-[32px] border-2 border-white bg-white/80 text-holo-black placeholder:text-gray-600 font-inter text-base focus:outline-none focus:ring-2 focus:ring-holo-coral transition-all duration-200 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Enter your Password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-6 rounded-[32px] border-2 border-white bg-white/80 text-holo-black placeholder:text-gray-600 font-inter text-base focus:outline-none focus:ring-2 focus:ring-holo-coral transition-all duration-200 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="flex justify-between text-sm pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-gray-800 hover:text-holo-coral hover:underline font-inter font-medium transition-colors duration-200"
                >
                  Create an Account
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-gray-800 hover:text-holo-coral hover:underline font-inter font-medium transition-colors duration-200"
                >
                  Forgot Password
                </button>
              </div>

              <div className="pt-4">
                {/* 3. Restored Gradient "Log in" Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-holo-teal to-holo-coral text-white font-inter font-semibold text-base rounded-[32px] shadow-inner hover:scale-105 transition-transform duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
