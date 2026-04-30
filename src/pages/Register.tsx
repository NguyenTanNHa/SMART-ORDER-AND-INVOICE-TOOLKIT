import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] relative overflow-hidden font-sans">
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* subtle shine effect */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent blur-2xl rounded-full"></div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 bg-gradient-to-bl from-emerald-400 to-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Join the Cloud</h1>
            <p className="text-slate-400 text-sm">Create a new toolkit account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white/10 transition-all outline-none"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white/10 transition-all outline-none"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white/10 transition-all outline-none"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
