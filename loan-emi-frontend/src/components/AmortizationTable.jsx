import React from 'react';

export default function AmortizationTable({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return <div className="p-6 text-center text-slate-400">No schedule generated yet.</div>;
  }

  return (
    // The overflow-x-auto is the magic class for mobile!
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
          <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            <th className="p-4 font-bold">Month</th>
            <th className="p-4 font-bold text-slate-600">Principal Paid</th>
            <th className="p-4 font-bold text-orange-500">Interest Paid</th>
            <th className="p-4 font-bold text-blue-700">Closing Balance</th>
          </tr>
        </thead>
        <tbody className="text-sm bg-white">
          {schedule.map((row, index) => (
            <tr key={index} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
              <td className="p-4 font-bold text-slate-700">
                {row.month}
              </td>
              <td className="p-4 text-slate-600 font-medium">
                ₹{Math.round(row.principalPayment).toLocaleString('en-IN')}
              </td>
              <td className="p-4 text-orange-500 font-medium">
                ₹{Math.round(row.interestPayment).toLocaleString('en-IN')}
              </td>
              <td className="p-4 text-slate-900 font-bold">
                ₹{Math.round(row.remainingBalance).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}