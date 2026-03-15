export default function AmortizationTable({ schedule }) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Amortization Schedule</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-white sticky top-0 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Month</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">EMI (₹)</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Principal (₹)</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Interest (₹)</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Balance (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {schedule.map((row) => (
              <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-900 font-medium">{row.month}</td>
                <td className="px-6 py-3 text-gray-600">{row.emi.toLocaleString()}</td>
                <td className="px-6 py-3 text-green-600">{row.principalPayment.toLocaleString()}</td>
                <td className="px-6 py-3 text-orange-500">{row.interestPayment.toLocaleString()}</td>
                <td className="px-6 py-3 text-blue-600 font-medium">{row.remainingBalance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}