'use client';
import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function DateRangePicker({ value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const ranges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last 12 months', value: '12m' },
    { label: 'Custom Range', value: 'custom' }
  ];

  const selectedRange = ranges.find(r => r.value === value)?.label || 'Select range';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
      >
        <Calendar size={18} className="text-gray-500" />
        <span className="text-sm text-gray-700">{selectedRange}</span>
        <ChevronDown size={16} className={`text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  onChange(range.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition ${
                  value === range.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
            
            {value === 'custom' && (
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex gap-2 mb-2">
                  <input type="date" className="w-1/2 p-2 border rounded-lg text-xs" />
                  <input type="date" className="w-1/2 p-2 border rounded-lg text-xs" />
                </div>
                <button className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                  Apply
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}