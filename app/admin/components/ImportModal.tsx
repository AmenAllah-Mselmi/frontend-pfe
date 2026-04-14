'use client';
import { useState } from 'react';

interface ImportModalProps {
  onClose: () => void;
  onImport: (data: any) => void;
  type: 'lead' | 'company';
}

export default function ImportModal({ onClose, onImport, type }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState({
    column1: '',
    column2: '',
    column3: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImport({ file, mapping });
  };

  // Fermer quand on clique sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTitle = () => type === 'lead' ? 'Import Leads' : 'Import Companies';
  const getDescription = () => type === 'lead' 
    ? 'Upload a CSV file with your leads data' 
    : 'Upload a CSV file with your companies data';

  const getSampleHeaders = () => type === 'lead'
    ? 'company,contact,email,value,stage'
    : 'name,industry,size,revenue,status';

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
              <p className="text-sm text-gray-500 mt-1">{getDescription()}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload - CORRIGÉ: ajout de "relative" */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">CSV files only (max 10MB)</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Column Mapping */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Column Mapping</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs text-gray-500">Column A</span>
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={mapping.column1}
                  onChange={(e) => setMapping({...mapping, column1: e.target.value})}
                >
                  <option value="">Select field</option>
                  {type === 'lead' ? (
                    <>
                      <option value="company">Company Name</option>
                      <option value="contact">Contact Person</option>
                      <option value="email">Email</option>
                      <option value="value">Deal Value</option>
                      <option value="stage">Stage</option>
                    </>
                  ) : (
                    <>
                      <option value="name">Company Name</option>
                      <option value="industry">Industry</option>
                      <option value="size">Company Size</option>
                      <option value="revenue">Revenue</option>
                      <option value="status">Status</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs text-gray-500">Column B</span>
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={mapping.column2}
                  onChange={(e) => setMapping({...mapping, column2: e.target.value})}
                >
                  <option value="">Select field</option>
                  {type === 'lead' ? (
                    <>
                      <option value="company">Company Name</option>
                      <option value="contact">Contact Person</option>
                      <option value="email">Email</option>
                      <option value="value">Deal Value</option>
                      <option value="stage">Stage</option>
                    </>
                  ) : (
                    <>
                      <option value="name">Company Name</option>
                      <option value="industry">Industry</option>
                      <option value="size">Company Size</option>
                      <option value="revenue">Revenue</option>
                      <option value="status">Status</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs text-gray-500">Column C</span>
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={mapping.column3}
                  onChange={(e) => setMapping({...mapping, column3: e.target.value})}
                >
                  <option value="">Select field</option>
                  {type === 'lead' ? (
                    <>
                      <option value="company">Company Name</option>
                      <option value="contact">Contact Person</option>
                      <option value="email">Email</option>
                      <option value="value">Deal Value</option>
                      <option value="stage">Stage</option>
                    </>
                  ) : (
                    <>
                      <option value="name">Company Name</option>
                      <option value="industry">Industry</option>
                      <option value="size">Company Size</option>
                      <option value="revenue">Revenue</option>
                      <option value="status">Status</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Sample CSV */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Sample CSV format:</p>
            <code className="text-xs text-gray-600">{getSampleHeaders()}</code>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {type === 'lead' ? 'Leads' : 'Companies'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}