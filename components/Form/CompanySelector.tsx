'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, X, Check, ChevronDown } from 'lucide-react';
import { useCompanyStore } from '@/lib/companyStore';

interface CompanySelectorProps {
  value?: number;
  onChange: (companyId?: number) => void;
  error?: string;
  touched?: boolean;
}

export default function CompanySelector({ value, onChange, error, touched }: CompanySelectorProps) {
  const { companies, loadCompanies, loading } = useCompanyStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCompanies(1, 100); // Load a good batch of companies
  }, [loadCompanies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCompany = companies.find(c => c.id === value);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all ${
          isOpen ? 'ring-2 ring-emerald-500/20 border-emerald-500 shadow-sm' : 
          touched && error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Building2 className={`w-5 h-5 ${touched && error ? 'text-red-400' : 'text-gray-400'}`} />
        <div className="flex-1 truncate">
          {selectedCompany ? (
            <span className="text-gray-900 font-medium">{selectedCompany.name}</span>
          ) : (
            <span className="text-gray-400">Sélectionner une entreprise (optionnel)</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
                setSearchTerm('');
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[70] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-2 border-b border-gray-50 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Rechercher une entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-[240px] overflow-y-auto p-1 custom-scrollbar">
            {loading && companies.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">Chargement...</div>
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => {
                    onChange(company.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    value === company.id ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{company.name}</span>
                    <span className="text-[11px] opacity-70">{company.location}</span>
                  </div>
                  {value === company.id && <Check size={14} className="text-emerald-600" />}
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">Aucune entreprise trouvée</p>
                <p className="text-[11px] text-gray-400 mt-1">Essayez un autre mot-clé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
