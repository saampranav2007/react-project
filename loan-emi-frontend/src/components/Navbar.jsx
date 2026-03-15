import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Calculator, LogOut, User as UserIcon, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
  const dropdownRef = useRef(null);

  // Safe JSON Parse on route change
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Corrupted user data safely caught.");
      setUser(null);
    }
    // Auto-close mobile menu when navigating to a new page
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 fixed top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-6 transition-all">
      
      {/* Left side: Logo */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
            <span className="text-white font-extrabold text-xl leading-none">F</span>
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">FinDash</span>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 h-16">
          <Link to="/calculator" className={`flex items-center gap-2 px-3 h-full border-b-2 text-sm font-medium transition-colors ${isActive('/calculator') ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Calculator size={16} /> Calculator
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={`flex items-center gap-2 px-3 h-full border-b-2 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/history" className={`flex items-center gap-2 px-3 h-full border-b-2 text-sm font-medium transition-colors ${isActive('/history') ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                <History size={16} /> Portfolio
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Right side: Auth, Profile & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-2 md:pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all"
            >
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center text-sm border border-emerald-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start">
                {/* Fixed the name split so it doesn't break UI on long names */}
                <span className="text-sm font-bold text-slate-700 leading-tight">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">CIBIL: {user.cibilScore || 'N/A'}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>

            {/* Desktop Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in-up">
                <Link to="/history" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                  <UserIcon size={16} /> My Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t border-slate-50 pt-2">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2">Sign In</Link>
            <Link to="/login" className="text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm">Get Started</Link>
          </div>
        )}

        {/* The Hamburger Button for Mobile */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg md:hidden flex flex-col p-4 gap-2 animate-fade-in-down">
          <Link to="/calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
            <Calculator size={18} /> Calculator
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/history" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                <History size={18} /> Portfolio
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 font-bold mt-2">
                <LogOut size={18} /> Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 mt-2">
              <Link to="/login" className="p-3 text-center text-slate-700 font-bold bg-slate-50 rounded-lg border border-slate-200">Sign In</Link>
              <Link to="/login" className="p-3 text-center text-white font-bold bg-blue-600 rounded-lg shadow-sm">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}