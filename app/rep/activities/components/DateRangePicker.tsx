'use client';
import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const ranges = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' }
];

export default function DateRangePicker({ value, onChange }: any) {
  const [open, setOpen] = useState(false);
  const selected = ranges.find(r => r.value === value)?.label || 'Last 30 days';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
      >
        <Calendar size={18} className="text-gray-500" />
        <span className="text-sm text-gray-700">{selected}</span>
        <ChevronDown size={16} className={`text-gray-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => { onChange(r.value); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition ${
                  value === r.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}