import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { UserCheck, GraduationCap, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import TypingEffect from './TypingEffect';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<'teacher' | 'student'>('student');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isRegistering) {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      const res = await api.register(name, email, password, activeRole);
      if (res.success && res.user) {
        onLogin(res.user);
      } else {
        setError(res.message || 'Registration failed');
      }
    } else {
      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }
      const res = await api.login(email, password);
      if (res.success && res.user) {
        if (res.user.role !== activeRole) {
           setError(`Please switch to the ${res.user.role} tab to login.`);
        } else {
           onLogin(res.user);
        }
      } else {
        setError(res.message || 'Login failed');
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-neutral-400 mb-4">
            {isRegistering ? 'Join TutorTrack to manage assignments.' : 'Sign in to access your dashboard.'}
          </p>
          <div className="h-6 flex items-center justify-center">
             <div className="bg-brand-900/10 border border-brand-500/10 px-3 py-1 rounded-full">
                <div className="text-xs font-bold">
                    <TypingEffect words={["Architectured by Priyansh", "Secure & Fast", "Empowering Students"]} />
                </div>
             </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2 mb-8 flex">
          <button
            type="button"
            onClick={() => setActiveRole('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeRole === 'student'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('teacher')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeRole === 'teacher'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            Teacher
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
          
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-300 ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-neutral-600"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-neutral-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-neutral-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isRegistering ? 'Create Account' : 'Sign In'}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-500 text-sm">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={toggleMode}
              className="ml-2 text-brand-500 hover:text-brand-400 font-medium hover:underline focus:outline-none"
            >
              {isRegistering ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
