import React from 'react';

export default function SliderInput({ label, value, min, max, step, onChange, symbol = '', suffix = '' }) {
  // Helper to format Indian currency for the display bubble
  const formattedValue = Number(value).toLocaleString('en-IN');
  const formattedMin = Number(min).toLocaleString('en-IN');
  const formattedMax = Number(max).toLocaleString('en-IN');

  return (
    <div className="w-full relative group">
      {/* Label and Dynamic Value Display */}
      <div className="flex justify-between items-end mb-3">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-extrabold text-blue-700 shadow-sm transition-colors group-hover:border-blue-300">
          {symbol}{formattedValue}{suffix}
        </div>
      </div>
      
      {/* The Custom Slider */}
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow"
      />
      
      {/* Min/Max Helper Text */}
      <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
        <span>{symbol}{formattedMin}{suffix}</span>
        <span>{symbol}{formattedMax}{suffix}</span>
      </div>
    </div>
  );
}