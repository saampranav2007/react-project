import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { calculateEMI, generateAmortizationSchedule } from '../utils/emiMath';
import SliderInput from '../components/SliderInput';
import BreakdownChart from '../components/BreakdownChart'; 
import AmortizationTable from '../components/AmortizationTable';
import { Landmark, ArrowRight } from 'lucide-react';

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', rate: 8.40, bgIcon: 'bg-blue-600', text: 'text-blue-700', activeRing: 'ring-blue-100 border-blue-600' },
  { id: 'hdfc', name: 'HDFC Bank', rate: 8.50, bgIcon: 'bg-indigo-700', text: 'text-indigo-700', activeRing: 'ring-indigo-100 border-indigo-600' },
  { id: 'icici', name: 'ICICI Bank', rate: 8.75, bgIcon: 'bg-orange-600', text: 'text-orange-700', activeRing: 'ring-orange-100 border-orange-600' },
  { id: 'axis', name: 'Axis Bank', rate: 8.75, bgIcon: 'bg-rose-700', text: 'text-rose-700', activeRing: 'ring-rose-100 border-rose-600' },
  { id: 'kotak', name: 'Kotak Mahindra', rate: 8.85, bgIcon: 'bg-red-600', text: 'text-red-700', activeRing: 'ring-red-100 border-red-600' },
  { id: 'pnb', name: 'Punjab National', rate: 8.45, bgIcon: 'bg-yellow-500', text: 'text-yellow-700', activeRing: 'ring-yellow-100 border-yellow-500' },
];

export default function CalculatorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialBank = location.state?.bank || BANKS[0];
  const initialLoanType = location.state?.loanType || null;

  const [selectedBank, setSelectedBank] = useState(BANKS.find(b => b.name === initialBank.name) || BANKS[0]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    principal: initialLoanType?.id === 'home' ? 5000000 : initialLoanType?.id === 'auto' ? 800000 : 500000,
    interestRate: initialLoanType?.baseRate || initialBank.rate,
    tenure: initialLoanType?.id === 'home' ? 240 : 60,
    extraPayment: 0,
  });
  
  const [results, setResults] = useState(null);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setFormData(prev => ({ ...prev, interestRate: bank.rate }));
  };

  useEffect(() => {
    const emi = calculateEMI(formData.principal, formData.interestRate, formData.tenure);
    const baseSchedule = generateAmortizationSchedule(formData.principal, formData.interestRate, formData.tenure, emi, 0);
    const advancedSchedule = generateAmortizationSchedule(formData.principal, formData.interestRate, formData.tenure, emi, formData.extraPayment);
    
    setResults({ 
      emi, 
      actualInterest: advancedSchedule.totalInterestPaid,
      interestSaved: baseSchedule.totalInterestPaid - advancedSchedule.totalInterestPaid,
      monthsSaved: formData.tenure - advancedSchedule.actualMonths,
      schedule: advancedSchedule.schedule 
    });
  }, [formData]);

  const saveToProfile = async () => {
    setIsSaving(true);
    try {
      await api.post('/loans', {
        bankName: selectedBank.name,
        principalAmount: formData.principal,
        interestRate: formData.interestRate,
        tenureMonths: formData.tenure,
        monthlyEmi: results.emi,
        totalPayable: formData.principal + results.actualInterest
      });
      navigate('/history');
    } catch (err) {
      alert('Error saving loan. Please ensure your Node.js backend server is running!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Replaced rigid h-screen with fluid min-h-screen for scrolling
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FinDash Terminal</h1>
            <p className="text-slate-500 font-medium mt-1">Professional EMI & Amortization Engine</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
            ← Back to Dashboard
          </button>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Lender Market (Spans 3/12 on Desktop) */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Landmark size={20} className="text-slate-600" />
              <h2 className="font-bold text-slate-800">Lender Market</h2>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
              {BANKS.map((bank) => {
                const isSelected = selectedBank.id === bank.id;
                return (
                  <div 
                    key={bank.id} onClick={() => handleBankSelect(bank)} 
                    // Fixed the Tailwind purge bug by using explicit classes defined in the BANKS array
                    className={`p-4 rounded-2xl cursor-pointer transition-all border-2 flex flex-col gap-1 ${isSelected ? `bg-white shadow-md ring-4 ${bank.activeRing}` : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:border-slate-200'}`}
                  >
                    <h3 className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{bank.name}</h3>
                    <span className={`font-extrabold ${isSelected ? bank.text : 'text-slate-500'}`}>{bank.rate}% p.a.</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Column 2: Parameters (Spans 4/12 on Desktop) */}
          <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                {initialLoanType ? `${initialLoanType.name} Config` : 'Loan Configuration'}
              </h2>
              <div className="space-y-6">
                <SliderInput label="Principal Amount" value={formData.principal} min={100000} max={20000000} step={100000} onChange={(val) => setFormData({...formData, principal: val})} symbol="₹" />
                <SliderInput label="Custom Rate" value={formData.interestRate} min={1} max={20} step={0.1} onChange={(val) => setFormData({...formData, interestRate: val})} suffix="%" />
                <SliderInput label="Tenure" value={formData.tenure} min={12} max={360} step={12} onChange={(val) => setFormData({...formData, tenure: val})} suffix="mo" />
              </div>
            </div>
            
            <div className="pt-8 mt-6 border-t border-slate-100">
              <button 
                onClick={saveToProfile} disabled={isSaving} 
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl hover:shadow-blue-600/30 flex justify-center items-center gap-2"
              >
                {isSaving ? 'Synchronizing...' : 'Save to Portfolio'} <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Column 3: Results & Chart (Spans 5/12 on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Quick Metrics */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-8 flex flex-col justify-center text-white relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Monthly EMI</span>
                <div className="text-5xl font-extrabold mt-2 mb-6 text-white drop-shadow-md">₹{results?.emi.toLocaleString('en-IN')}</div>
                
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="text-slate-300 text-sm font-medium">Total Interest Payable</span>
                  <div className="text-2xl font-bold text-orange-400 mt-1">₹{results?.actualInterest.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex items-center justify-center min-h-[250px]">
               {results ? <BreakdownChart principal={formData.principal} totalInterest={results.actualInterest} /> : <p className="text-slate-400">Loading chart...</p>}
            </div>
          </div>

        </div>

        {/* Amortization Table Section - Full Width */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Complete Amortization Schedule</h2>
            <p className="text-sm text-slate-500 mt-1">Month-by-month breakdown of your principal and interest payments.</p>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
             {results && <AmortizationTable schedule={results.schedule} />}
          </div>
        </div>

      </div>
    </div>
  );
}