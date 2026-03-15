import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Calculator, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check auth status whenever the route changes
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // Helper to determine active route styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 fixed top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 transition-all">
      
      {/* Left side: Logo & Primary Nav */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/calculator')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
            <span className="text-white font-extrabold text-xl leading-none">F</span>
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">FinDash</span>
        </div>
        
        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-1 h-16">
          <Link 
            to="/calculator" 
            className={`flex items-center gap-2 px-3 h-full border-b-2 text-sm font-medium transition-colors ${isActive('/calculator') ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
          >
            <Calculator size={16} />
            Terminal
          </Link>
          
          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-3 h-full border-b-2 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link 
                to="/history" 
                className={`flex items-center gap-2 px-3 h-full border-b-2 text-sm font-medium transition-colors ${isActive('/history') ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              >
                <History size={16} />
                Portfolio
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Right side: Auth & Profile */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all focus:outline-none"
            >
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center text-sm border border-emerald-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-slate-700 leading-tight">{user.name}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">CIBIL: {user.cibilScore}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in-up origin-top-right">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-sm text-slate-500 font-medium">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                </div>
                
                <Link to="/history" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <UserIcon size={16} />
                  My Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-slate-50 pt-2"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/login" 
              className="text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}