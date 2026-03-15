import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BreakdownChart({ principal, totalInterest }) {
  const data = [
    { name: 'Principal Amount', value: principal },
    { name: 'Total Interest', value: totalInterest },
  ];

  // Colors for the chart slices
  const COLORS = ['#3b82f6', '#f97316']; // Tailwind blue-500 and orange-500

  return (
    <div className="h-64 w-full mt-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Principal vs Interest Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}