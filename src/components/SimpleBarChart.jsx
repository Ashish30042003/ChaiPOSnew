import React from 'react';

const SimpleBarChart = ({ data, color = 'orange' }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32 pt-4 pb-2 border-b border-stone-100">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full rounded-t-sm overflow-hidden h-full flex items-end bg-stone-50">
            <div
              className={`w-full bg-${color}-500 transition-all duration-500 group-hover:bg-${color}-600`}
              style={{ height: `${(d.value / max) * 100}%` }}
            ></div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
              {d.value} Orders
            </div>
          </div>
          <span className="text-[9px] md:text-[10px] text-stone-400 font-mono">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SimpleBarChart;
