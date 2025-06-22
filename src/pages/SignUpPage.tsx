
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoloLogo from '@/components/HoloLogo';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || password !== confirmPassword) {
      alert('Please enter valid email and matching passwords.');
      return;
    }
    
    // TODO: Call backend API: POST /api/auth/signup
    // For now, simulate success:
    alert('Account created! Please log in.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-holo-white font-inter flex flex-col items-center pt-20 px-4">
      <HoloLogo size="medium" variant="full" />
      
      <h2 className="text-[24px] font-semibold text-holo-black mb-6 mt-8">
        Create Your Account
      </h2>
      
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md flex flex-col space-y-4"
      >
        <input
          type="email"
          placeholder="Email *"
          className="h-12 w-full rounded-full border-2 border-holo-teal px-4 focus:outline-none focus:ring-2 focus:ring-holo-coral"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password *"
          className="h-12 w-full rounded-full border-2 border-holo-teal px-4 focus:outline-none focus:ring-2 focus:ring-holo-coral"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password *"
          className="h-12 w-full rounded-full border-2 border-holo-teal px-4 focus:outline-none focus:ring-2 focus:ring-holo-coral"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full h-12 bg-gradient-teal-coral text-white font-semibold rounded-xl shadow-md hover:bg-gradient-coral-teal transition-transform duration-150 hover:scale-105"
        >
          Sign Up
        </button>
        <button
          type="button"
          className="mt-2 text-[14px] font-medium text-holo-teal hover:underline self-center"
          onClick={() => navigate('/')}
        >
          Already have an account? Log In
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
