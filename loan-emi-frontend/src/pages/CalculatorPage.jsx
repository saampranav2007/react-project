import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { calculateEMI, generateAmortizationSchedule } from '../utils/emiMath';
import SliderInput from '../components/SliderInput';
// Note: Ensure these paths match EXACTLY where your files are located!
import BreakdownChart from '../components/BreakdownChart'; 
import AmortizationTable from '../components/AmortizationTable';

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', rate: 8.40, color: 'bg-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'hdfc', name: 'HDFC Bank', rate: 8.50, color: 'bg-indigo-700', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  { id: 'icici', name: 'ICICI Bank', rate: 8.75, color: 'bg-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'axis', name: 'Axis Bank', rate: 8.75, color: 'bg-rose-700', text: 'text-rose-700', bg: 'bg-rose-50' },
  { id: 'kotak', name: 'Kotak Mahindra', rate: 8.85, color: 'bg-red-600', text: 'text-red-600', bg: 'bg-red-50' },
  { id: 'pnb', name: 'Punjab National', rate: 8.45, color: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' },
];

export default function CalculatorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Catch the data passed from the Dashboard wizard!
  const initialBank = location.state?.bank || BANKS[0];
  const initialLoanType = location.state?.loanType || null;

  const [selectedBank, setSelectedBank] = useState(BANKS.find(b => b.name === initialBank.name) || BANKS[0]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dynamically set defaults based on the Loan Type chosen in the Dashboard
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

  // Push the final calculation to MongoDB!
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
      // On success, redirect to the History page to see it
      navigate('/history');
    } catch (err) {
      alert('Error saving loan. Please ensure your Node.js backend server is running!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 p-4 flex flex-col font-sans">
      <header className="flex-none mb-4 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">FinDash Terminal</h1>
          <p className="text-slate-500 text-sm">Professional EMI & Amortization Engine</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-blue-600 hover:underline">
          ← Back to Dashboard
        </button>
      </header>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-1/5 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex-none">
            <h2 className="font-bold text-slate-800">Lender Market</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {BANKS.map((bank) => (
              <div key={bank.id} onClick={() => handleBankSelect(bank)} className={`p-3 rounded-xl cursor-pointer border-2 ${selectedBank.id === bank.id ? `border-${bank.color.split('-')[1]}-500 ${bank.bg}` : 'border-transparent hover:bg-slate-50'}`}>
                <h3 className="font-bold text-sm">{bank.name}</h3>
                <span className={`font-extrabold text-sm ${bank.text}`}>{bank.rate}% p.a.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[30%] bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="font-bold mb-6">
            {initialLoanType ? `${initialLoanType.name} Parameters` : 'Loan Parameters'}
          </h2>
          <SliderInput label="Principal Amount" value={formData.principal} min={100000} max={20000000} step={100000} onChange={(val) => setFormData({...formData, principal: val})} symbol="₹" />
          <SliderInput label="Custom Rate" value={formData.interestRate} min={1} max={20} step={0.1} onChange={(val) => setFormData({...formData, interestRate: val})} suffix="%" />
          <SliderInput label="Tenure" value={formData.tenure} min={12} max={360} step={12} onChange={(val) => setFormData({...formData, tenure: val})} suffix="mo" />
          
          <div className="mt-auto pt-4">
            <button onClick={saveToProfile} disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md">
              {isSaving ? 'Saving to Database...' : 'Apply & Save to Profile'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="h-[45%] flex gap-4">
            <div className="flex-1 bg-slate-900 rounded-2xl shadow-lg p-5 flex flex-col justify-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
              <span className="text-slate-400 text-xs z-10">Monthly EMI</span>
              <div className="text-3xl font-bold mb-4 z-10">₹{results?.emi.toLocaleString()}</div>
              <span className="text-slate-400 text-xs z-10">Total Interest</span>
              <div className="text-2xl font-bold text-orange-400 z-10">₹{results?.actualInterest.toLocaleString()}</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border flex items-center justify-center">
               {results && <BreakdownChart principal={formData.principal} totalInterest={results.actualInterest} />}
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden">
             {results && (
               <div className="h-full overflow-y-auto custom-scrollbar">
                 <AmortizationTable schedule={results.schedule} />
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}