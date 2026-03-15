// src/services/bankApi.js

// Realistic data structure simulating a backend database response
const BANK_DATABASE = [
  { id: 'sbi', name: 'State Bank of India', shortName: 'SBI', rate: 8.40, type: 'Public', color: 'bg-blue-600' },
  { id: 'hdfc', name: 'HDFC Bank', shortName: 'HDFC', rate: 8.50, type: 'Private', color: 'bg-indigo-700' },
  { id: 'icici', name: 'ICICI Bank', shortName: 'ICICI', rate: 8.75, type: 'Private', color: 'bg-orange-600' },
  { id: 'axis', name: 'Axis Bank', shortName: 'Axis', rate: 8.75, type: 'Private', color: 'bg-rose-700' },
  { id: 'kotak', name: 'Kotak Mahindra', shortName: 'Kotak', rate: 8.85, type: 'Private', color: 'bg-red-600' },
  { id: 'pnb', name: 'Punjab National Bank', shortName: 'PNB', rate: 8.45, type: 'Public', color: 'bg-yellow-500' },
];

/**
 * Simulates a network fetch request with a 800ms delay
 */
export const fetchLiveBankRates = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort by lowest interest rate by default before returning
      const sortedBanks = [...BANK_DATABASE].sort((a, b) => a.rate - b.rate);
      resolve(sortedBanks);
    }, 800);
  });
};