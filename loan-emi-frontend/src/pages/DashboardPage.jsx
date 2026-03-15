import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Home, Car, UserCircle, Briefcase, ArrowRight } from 'lucide-react';

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', type: 'Public Sector', color: 'bg-blue-600', rate: 8.40 },
  { id: 'hdfc', name: 'HDFC Bank', type: 'Private Sector', color: 'bg-indigo-700', rate: 8.50 },
  { id: 'icici', name: 'ICICI Bank', type: 'Private Sector', color: 'bg-orange-600', rate: 8.75 },
  { id: 'axis', name: 'Axis Bank', type: 'Private Sector', color: 'bg-rose-700', rate: 8.75 },
];

const LOAN_TYPES = [
  { id: 'home', name: 'Home Loan', icon: Home, baseRate: 8.5, description: 'For buying a house.' },
  { id: 'auto', name: 'Car Loan', icon: Car, baseRate: 9.2, description: 'For purchasing a vehicle.' },
  { id: 'personal', name: 'Personal Loan', icon: UserCircle, baseRate: 11.5, description: 'Unsecured personal needs.' },
  { id: 'education', name: 'Education Loan', icon: Briefcase, baseRate: 9.8, description: 'For higher education.' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep(2);
  };

  const handleProceedToCalculator = () => {
    if (!selectedLoan) return;
    
    // FIX: Strip the React icon component out before navigating
    // This prevents the "DataCloneError" crash!
    const cleanLoanData = {
      id: selectedLoan.id,
      name: selectedLoan.name,
      baseRate: selectedLoan.baseRate,
      description: selectedLoan.description
    };

    navigate('/calculator', { 
      state: { bank: selectedBank, loanType: cleanLoanData } 
    });
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 overflow-y-auto pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome, {user.name.toUpperCase()}!</h1>
            <p className="text-slate-500">Let's set up your new loan calculation.</p>
          </div>
          <button onClick={() => navigate('/history')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
            View My Active Loans
          </button>
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Select a Lender</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BANKS.map((bank) => (
                <div key={bank.id} onClick={() => handleBankSelect(bank)} className="bg-white p-6 rounded-2xl border-2 border-transparent hover:border-blue-500 hover:shadow-md cursor-pointer transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 ${bank.color}`}>
                    <Building2 />
                  </div>
                  <h3 className="font-bold">{bank.name}</h3>
                  <p className="text-sm text-slate-500">Base Rate: ~{bank.rate}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <button onClick={() => { setStep(1); setSelectedLoan(null); }} className="text-sm text-blue-600 font-medium mb-4 hover:underline">← Back to Banks</button>
            <h2 className="text-xl font-bold text-slate-800 mb-4">2. Select Loan Type with {selectedBank.name}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {LOAN_TYPES.map((loan) => {
                const Icon = loan.icon;
                const isSelected = selectedLoan?.id === loan.id;
                
                return (
                  <div 
                    key={loan.id} 
                    onClick={() => setSelectedLoan(loan)} 
                    className={`bg-white p-6 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 ${isSelected ? 'border-blue-600 shadow-md ring-4 ring-blue-50' : 'border-transparent hover:border-blue-300 shadow-sm'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-none transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      <Icon />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{loan.name}</h3>
                      <p className="text-sm text-slate-500">{loan.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Explicit Continue Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleProceedToCalculator}
                disabled={!selectedLoan}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md"
              >
                Continue to Calculator <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}