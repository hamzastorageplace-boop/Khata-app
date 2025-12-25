import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { signIn, signUp } from '../services/storage';

interface AuthProps {
  onAuthenticated: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) throw new Error("Please fill in all fields");
        
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw new Error(error);
        
        onAuthenticated();
      } else {
        if (!formData.email || !formData.password || !formData.name) throw new Error("Please fill in all fields");
        if (formData.password.length < 6) throw new Error("Password must be at least 6 characters");
        if (formData.password !== formData.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        
        const { session, error } = await signUp(formData.email, formData.password, formData.name);
        if (error) throw new Error(error);
        
        // If session exists (Local fallback or Supabase with auto-confirm), log them in.
        // If session is null (Supabase default), show confirmation message.
        if (session) {
            onAuthenticated();
        } else {
            setIsSignupSuccess(true);
        }
      }
    } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
    } finally {
        setLoading(false);
    }
  };

  if (isSignupSuccess) {
    return (
        <div className="min-h-screen bg-[#1a0b2e] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="z-10 w-full max-w-md animate-fade-in-up">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
                        <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                    <p className="text-white/70 mb-8">
                        We have sent a confirmation email to <span className="text-purple-300 font-semibold">{formData.email}</span>. 
                        Please check your inbox and confirm your account before logging in.
                    </p>
                    <button 
                        onClick={() => {
                            setIsSignupSuccess(false);
                            setIsLogin(true);
                            setError('');
                        }}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0b2e] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-2">
                Easy Khata
            </h1>
            <p className="text-purple-300/70">
                {isLogin ? 'Welcome back! Please login to continue.' : 'Create your digital ledger account.'}
            </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Field (Signup Only) */}
                {!isLogin && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50 group-focus-within:text-purple-300 transition-colors" size={18} />
                            <input 
                                name="name"
                                type="text" 
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50 group-focus-within:text-purple-300 transition-colors" size={18} />
                        <input 
                            name="email"
                            type="email" 
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50 group-focus-within:text-purple-300 transition-colors" size={18} />
                        <input 
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/30 hover:text-purple-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password (Signup Only) */}
                {!isLogin && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider ml-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50 group-focus-within:text-purple-300 transition-colors" size={18} />
                            <input 
                                name="confirmPassword"
                                type="password" 
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-pulse">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-lg shadow-purple-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
                <p className="text-purple-200/60 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                        }}
                        className="ml-2 text-purple-300 font-semibold hover:text-white transition-colors underline decoration-purple-500/30 hover:decoration-purple-300 underline-offset-4"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;