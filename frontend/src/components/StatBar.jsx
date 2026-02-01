import React from 'react';

function StatBar({ label, value, max, color = 'bg-cyan-500' }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold text-sm">{label}</span>
        <span className="text-gray-400 text-sm">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default StatBar;
