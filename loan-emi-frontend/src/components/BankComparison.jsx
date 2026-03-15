import { useState, useEffect } from 'react';
import { fetchLiveBankRates } from '../services/bankApi';
import { calculateEMI, generateAmortizationSchedule } from '../utils/emiMath';

export default function BankComparison({ principal, tenure }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRates = async () => {
      setLoading(true);
      const data = await fetchLiveBankRates();
      setBanks(data);
      setLoading(false);
    };
    getRates();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 mt-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-200 rounded-full animate-bounce mb-4"></div>
          <span className="text-gray-400 font-medium">Fetching live bank rates...</span>
        </div>
      </div>
    );
  }

  // Calculate stats for the absolute best bank to compare others against
  const bestBank = banks[0];
  const bestEmi = calculateEMI(principal, bestBank.rate, tenure);
  const bestTotalInterest = (bestEmi * tenure) - principal;

  return (
    <div className="mt-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Live Market Comparison</h2>
          <p className="text-sm text-gray-500 mt-1">Comparing EMI for ₹{principal.toLocaleString()} over {tenure} months</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Real-time Match
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banks.map((bank, index) => {
          const emi = calculateEMI(principal, bank.rate, tenure);
          const totalInterest = (emi * tenure) - principal;
          const isBest = index === 0;
          
          // Calculate how much MORE you pay compared to the best option
          const extraInterest = totalInterest - bestTotalInterest;

          return (
            <div 
              key={bank.id} 
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
                isBest ? 'border-emerald-400 bg-emerald-50/30' : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              {isBest && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                  TOP PICK
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${bank.color}`}>
                  {bank.shortName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{bank.shortName}</h3>
                  <span className="text-xs text-gray-500">{bank.type} Sector</span>
                </div>
                <div className="ml-auto text-right">
                  <span className="block text-xl font-extrabold text-blue-600">{bank.rate}%</span>
                  <span className="text-xs text-gray-400">p.a.</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100/60">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Monthly EMI</span>
                  <span className="font-bold text-gray-800">₹{emi.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Interest</span>
                  <span className="font-semibold text-orange-500">₹{totalInterest.toLocaleString()}</span>
                </div>
              </div>

              {!isBest && extraInterest > 0 && (
                <div className="mt-4 bg-red-50 text-red-700 text-xs font-medium p-2 rounded-lg text-center">
                  Pay ₹{extraInterest.toLocaleString()} more in interest
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}