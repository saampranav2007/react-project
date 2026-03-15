export default function SliderInput({ label, value, min, max, step, onChange, symbol = '', suffix = '' }) {
  // Calculate percentage for slider track coloring
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
          <span className="text-blue-600 font-medium mr-1">{symbol}</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 bg-transparent outline-none text-right font-bold text-slate-800"
            min={min}
            max={max}
          />
          <span className="text-gray-500 text-sm ml-1">{suffix}</span>
        </div>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
        <span>{symbol}{min.toLocaleString()} {suffix}</span>
        <span>{symbol}{max.toLocaleString()} {suffix}</span>
      </div>
    </div>
  );
}