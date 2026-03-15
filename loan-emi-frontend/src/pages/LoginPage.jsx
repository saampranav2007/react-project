import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react'; 
import api from '../services/api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // 1. ADDED PHONE TO STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', 
    password: '',
    monthlyIncome: '',
    panCard: '', 
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  // Real-world validation logic
  const validateForm = () => {
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      return "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    
    // Validation exclusively for Sign Up
    if (!isLogin) {
      // Phone Number Validation (Exactly 10 digits)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        return "Please enter a valid 10-digit mobile number.";
      }

      if (formData.monthlyIncome < 10000) {
        return "Minimum monthly income of ₹10,000 required for FinDash.";
      }
      
      // Basic Indian PAN Card Regex (5 Letters, 4 Numbers, 1 Letter)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.panCard.toUpperCase())) {
        return "Please enter a valid PAN Card number (e.g., ABCDE1234F).";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check frontend validation first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      
      // Ensure PAN is uppercase before sending
      const payload = { ...formData, panCard: formData.panCard.toUpperCase() };
      const { data } = await api.post(endpoint, payload);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        cibilScore: data.cibilScore || Math.floor(Math.random() * (850 - 650) + 650) 
      }));

      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 py-12 relative overflow-y-auto">
      
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md z-10 my-auto transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">FinDash</h1>
          <p className="text-slate-400 mt-2">
            {isLogin ? 'Welcome back to your financial hub.' : 'Start optimizing your loans today.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start gap-2 font-medium animate-fade-in-up">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {!isLogin && (
            <div className="animate-fade-in-up">
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="animate-fade-in-up">
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" required value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* 2. ADDED PHONE INPUT FIELD HERE */}
          {!isLogin && (
            <div className="animate-fade-in-up">
              <label className="block text-sm font-medium text-slate-300 mb-1">Mobile Number</label>
              <input 
                type="tel" required value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all"
                placeholder="9876543210" maxLength="10"
              />
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Income (₹)</label>
                <input 
                  type="number" required value={formData.monthlyIncome}
                  onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                  className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">PAN Card</label>
                <input 
                  type="text" required value={formData.panCard}
                  onChange={(e) => setFormData({...formData, panCard: e.target.value})}
                  className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white uppercase transition-all"
                  placeholder="ABCDE1234F" maxLength="10"
                />
              </div>
            </div>
          )}

          <div className="animate-fade-in-up">
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 mt-6 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
            ) : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { 
              setIsLogin(!isLogin); 
              setError(''); 
              // Clear sensitive fields when toggling forms
              setFormData({...formData, password: '', panCard: ''}); 
            }}
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}