'use client';

import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import CompanySelector from './Form/CompanySelector';

export interface FieldDef {
  key: string;
  label: string;
  required?: boolean;
  type?: 'string' | 'number' | 'date';
}

interface CSVImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  fields: FieldDef[];
  endpoint: string;
}

export default function CSVImportWizard({
  isOpen,
  onClose,
  onSuccess,
  title,
  fields,
  endpoint,
}: CSVImportWizardProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  
  // mapping: fields[key] -> CSV header name
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  const [validData, setValidData] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ row: number; error: string }[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [globalCompanyId, setGlobalCompanyId] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const resetState = () => {
    setStep(1);
    setFile(null);
    setHeaders([]);
    setRawData([]);
    setMapping({});
    setValidData([]);
    setErrors([]);
    setIsImporting(false);
    setGlobalCompanyId(undefined);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type to prevent importing .xlsx or other binary files
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please upload a valid CSV file. Excel (.xlsx) files are not currently supported.');
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
      
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setHeaders(results.meta.fields);
            setRawData(results.data);
            
            // Auto-map based on similar names
            const initialMapping: Record<string, string> = {};
            fields.forEach(field => {
              const match = results.meta.fields?.find(
                h => h.toLowerCase() === field.key.toLowerCase() || 
                     h.toLowerCase() === field.label.toLowerCase() ||
                     h.toLowerCase().replace(/[^a-z]/g, '') === field.key.toLowerCase()
              );
              if (match) {
                initialMapping[field.key] = match;
              }
            });
            setMapping(initialMapping);
            setStep(2);
          }
        },
        error: (err) => {
          toast.error('Failed to parse CSV: ' + err.message);
        }
      });
    }
  };

  const handleValidate = () => {
    const valid: any[] = [];
    const errs: { row: number; error: string }[] = [];

    rawData.forEach((row, index) => {
      const item: any = {};
      let hasError = false;

      for (const field of fields) {
        const csvHeader = mapping[field.key];
        let val = csvHeader ? row[csvHeader] : undefined;
        
        if (val !== undefined && val !== null) {
          if (typeof val === 'string') val = val.trim();
          if (val === '') val = undefined;
        }

        // Required check
        if (field.required && val === undefined) {
          errs.push({ row: index + 2, error: `Missing required field: ${field.label}` });
          hasError = true;
          continue;
        }

        if (val !== undefined) {
          // Type casting
          if (field.type === 'number') {
            const numVal = Number(val);
            if (isNaN(numVal)) {
              errs.push({ row: index + 2, error: `Invalid number for ${field.label}: ${val}` });
              hasError = true;
            } else {
              item[field.key] = numVal;
            }
          } else {
            item[field.key] = val;
          }
        }
      }

      // Merge global company ID if selected and not provided in CSV
      if (globalCompanyId && !item.companyId) {
        item.companyId = globalCompanyId;
      }

      if (!hasError) {
        valid.push(item);
      }
    });

    setValidData(valid);
    setErrors(errs);
    setStep(3);
  };

  const handleImport = async () => {
    if (validData.length === 0) return;
    
    setIsImporting(true);
    setImportProgress({ current: 0, total: validData.length });
    
    const CHUNK_SIZE = 500;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    try {
      let totalAdded = 0;
      let totalUpdated = 0;
      let totalUnchanged = 0;

      for (let i = 0; i < validData.length; i += CHUNK_SIZE) {
        const chunk = validData.slice(i, i + CHUNK_SIZE);
        
        const res = await fetch(`${base}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(chunk)
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Import failed at chunk ' + (i/CHUNK_SIZE + 1));
        }
        
        const chunkData = await res.json();
        totalAdded += chunkData.added || 0;
        totalUpdated += chunkData.updated || 0;
        totalUnchanged += chunkData.unchanged || 0;

        setImportProgress(prev => ({ ...prev, current: Math.min(prev.current + CHUNK_SIZE, prev.total) }));
      }
      
      if (totalAdded === 0 && totalUpdated === 0 && totalUnchanged > 0) {
        toast(`Tous les éléments existent déjà (${totalUnchanged} ignorés)`, { icon: 'ℹ️' });
      } else {
        toast.success(`Import terminé : ${totalAdded} ajoutés, ${totalUpdated} mis à jour`);
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error('Error during import: ' + err.message);
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col scale-in">
        {/* Header */}
        <div className="p-6 border-b flex justify-between shrink-0">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto grow">
          {/* Steps indicator */}
          <div className="flex items-center justify-between mb-8 px-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-0.5 sm:h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="text-center py-12">
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-500 transition cursor-pointer">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
                <p className="text-sm text-gray-500 mb-6">or click to browse</p>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isImporting}
                />
                <button type="button" className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-200 transition">
                  Select File
                </button>
              </div>

              <div className="mt-8 text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">?</span>
                  <h3>Assign to a Company? (Optional)</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4 italic">
                  Select a company to assign to ALL imported records. If a record already has a company in the CSV, that will take priority.
                </p>
                <CompanySelector 
                  value={globalCompanyId} 
                  onChange={setGlobalCompanyId} 
                />
              </div>
            </div>
          )}

          {/* Step 2: Mapping */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800">
                <FileText className="shrink-0" />
                <div>
                  <p className="font-medium">File loaded: {file?.name}</p>
                  <p className="text-sm opacity-80">Found {rawData.length} rows and {headers.length} columns.</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-4 text-gray-800">Map fields</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map(field => (
                    <div key={field.key} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{field.label}</span>
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <select 
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={mapping[field.key] || ""}
                        onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                      >
                        <option value="">-- Ignore --</option>
                        {headers.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verification & Import */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 bg-green-50 p-4 rounded-lg flex items-start gap-3 border border-green-100">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-green-900">Valid Rows</h4>
                    <p className="text-2xl font-bold text-green-700 mt-1">{validData.length}</p>
                    <p className="text-sm text-green-800 mt-1">Ready to import</p>
                  </div>
                </div>
                
                <div className="flex-1 bg-red-50 p-4 rounded-lg flex items-start gap-3 border border-red-100">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-red-900">Errors</h4>
                    <p className="text-2xl font-bold text-red-700 mt-1">{errors.length}</p>
                    <p className="text-sm text-red-800 mt-1">Rows with issues will be skipped</p>
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="border border-red-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 px-4 py-2 border-b border-red-200 font-medium text-red-800 text-sm">
                    First 5 errors
                  </div>
                  <ul className="divide-y divide-red-100 max-h-48 overflow-y-auto">
                    {errors.slice(0, 5).map((err, i) => (
                      <li key={i} className="px-4 py-2 text-sm text-gray-700">
                        <span className="font-medium text-red-600">Row {err.row}:</span> {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {isImporting && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1 text-gray-600">
                    <span>Importing...</span>
                    <span>{importProgress.current} / {importProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between shrink-0 rounded-b-xl">
          <button 
            type="button"
            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition" 
            onClick={handleClose}
            disabled={isImporting}
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            {step === 2 && (
              <>
                <button 
                  type="button"
                  className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition" 
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  type="button"
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
                  onClick={handleValidate}
                >
                  Validate Data
                </button>
              </>
            )}
            
            {step === 3 && (
              <>
                <button 
                  type="button"
                  className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition" 
                  onClick={() => setStep(2)}
                  disabled={isImporting}
                >
                  Edit Mapping
                </button>
                <button 
                  type="button"
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed" 
                  onClick={handleImport}
                  disabled={validData.length === 0 || isImporting}
                >
                  {isImporting && <Loader2 className="animate-spin" size={18} />}
                  {isImporting ? 'Importing...' : 'Confirm Import'}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
