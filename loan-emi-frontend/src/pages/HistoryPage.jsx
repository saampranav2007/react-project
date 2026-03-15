import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local user data (for CIBIL score)
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    // Fetch live loans from MongoDB backend
    const fetchLoans = async () => {
      try {
        const { data } = await api.get('/loans');
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handlePayEmi = async (loanId, emiAmount) => {
    try {
      // Send payment to backend
      await api.post(`/loans/${loanId}/pay`, {
        amountPaid: emiAmount,
        principalCovered: emiAmount * 0.4, // Rough mock split for UI purposes
        interestCovered: emiAmount * 0.6
      });
      
      alert('Payment Successful!');
      
      // Refresh the loans to show updated remaining balance
      const { data } = await api.get('/loans');
      setLoans(data);
    } catch (error) {
      alert('Payment failed. Is your backend running?');
    }
  };

  if (loading) return <div className="p-10 text-center font-bold animate-pulse">Loading secure data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & CIBIL Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Portfolio</h1>
            <p className="text-slate-500">Manage your active loans and track your payments.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white border border-emerald-200 shadow-sm px-6 py-3 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center text-emerald-600 font-bold">
                {user?.cibilScore || '---'}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">CIBIL Score</span>
                <span className="font-medium text-slate-800">Excellent Standing</span>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-md">
              + New Loan
            </button>
          </div>
        </div>

        {/* Loan Cards Grid */}
        {loans.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No active loans found.</h3>
            <p className="text-slate-500">Head over to the terminal to calculate and apply for a new loan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map((loan) => {
              const progress = (loan.amountPaidSoFar / loan.totalPayable) * 100;
              const isPaidOff = loan.remainingBalance <= 0;

              return (
                <div key={loan._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
                  {/* Status Ribbon */}
                  <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl font-bold text-xs text-white ${isPaidOff ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                    {isPaidOff ? 'CLOSED' : 'ACTIVE'}
                  </div>

                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">{loan.bankName}</h3>
                    <p className="text-slate-500 text-sm">₹{loan.principalAmount.toLocaleString()} at {loan.interestRate}% for {loan.tenureMonths} mo</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase font-bold">EMI</span>
                      <span className="text-xl font-extrabold text-slate-800">₹{loan.monthlyEmi.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 uppercase font-bold">Remaining</span>
                      <span className="text-xl font-extrabold text-orange-500">₹{Math.max(0, loan.remainingBalance).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Repayment Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePayEmi(loan._id, loan.monthlyEmi)}
                    disabled={isPaidOff}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                  >
                    {isPaidOff ? 'Loan Fully Paid' : 'Pay Next EMI'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}