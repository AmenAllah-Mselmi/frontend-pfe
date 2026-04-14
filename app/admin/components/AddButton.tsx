'use client';
import { useState, useRef, useEffect } from 'react';

interface AddButtonProps {
  onAdd: () => void;
  onImport: () => void; 
  type: 'lead' | 'company' | 'contact' | 'ticket';
}

export default function AddButton({ onAdd, onImport, type }: AddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabels = () => {
    return {
      add: type === 'lead' ? 'New Lead' : type === 'contact' ? 'New Contact' : type === 'ticket' ? 'New Ticket' : 'New Company',
      import: type === 'lead' ? 'Import Leads' : type === 'contact' ? 'Import Contacts' : 'Import Data',
      export: type === 'lead' ? 'Export Leads' : type === 'contact' ? 'Export Contacts' : 'Export Data'
    };
  };

  const labels = getLabels();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => {
              onAdd();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{labels.add}</p>
              <p className="text-xs text-gray-500">Create manually with form</p>
            </div>
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={() => {
              onImport();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{labels.import}</p>
              <p className="text-xs text-gray-500">Bulk upload from CSV</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}