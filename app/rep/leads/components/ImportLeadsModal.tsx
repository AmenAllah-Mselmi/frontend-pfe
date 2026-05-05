'use client';

import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download, ArrowRight, ChevronLeft } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import FormField from '@/components/Form/FormField';

export default function ImportLeadsModal({ onClose, onImport }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);

  const form = useForm({
    initialValues: {
      name: 'name',
      company: 'company',
      email: 'email',
      phone: 'phone',
      value: 'value',
      status: 'status',
      source: 'source'
    },
    validationSchema: {}, // No strict validation needed for mapping
    onSubmit: (data) => {
      // Simulation d'import
      const importedLeads = [
        { name: 'Peter Parker', company: 'Daily Bugle', email: 'peter@bugle.com', phone: '+1 234-567-8910', value: 150000, status: 'Warm', source: 'Import' },
        { name: 'Stephen Strange', company: 'Kamar-Taj', email: 'strange@kamar.com', phone: '+1 234-567-8911', value: 450000, status: 'Hot', source: 'Import' },
      ];
      onImport(importedLeads);
      onClose();
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const steps = [
    { id: 1, name: 'Upload', description: 'Select CSV file' },
    { id: 2, name: 'Mapping', description: 'Sync columns' },
    { id: 3, name: 'Preview', description: 'Review data' }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl mx-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Import Leads</h2>
            <p className="text-gray-400 text-sm mt-1">Bulk upload your leads into the CRM</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${
                    step >= s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.id ? <CheckCircle size={20} /> : s.id}
                  </div>
                  <span className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {s.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${step > s.id ? 'bg-emerald-600' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="min-h-[300px]">
            {/* Step 1: Upload */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center hover:border-emerald-300 hover:bg-emerald-50/10 transition-all group cursor-pointer">
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Upload size={40} className="text-emerald-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 mb-2">Drop your CSV data here</p>
                  <p className="text-gray-400 mb-6 max-w-xs mx-auto">Upload a clean CSV file to start the automated import process.</p>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm group-hover:shadow-md transition-all">
                    Browse Files
                  </div>
                </div>
                <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 tracking-tight">Need a guide?</p>
                      <p className="text-xs text-gray-400">Download our sample CSV template.</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all group">
                    Template <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Mapping */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <AlertCircle size={20} className="text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-800 font-medium">Headers detected. Match columns below to ensure accurate data sync.</p>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(form.values).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4 bg-white p-2 border border-gray-50 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/5 transition-all group">
                      <div className="w-24 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600 transition-colors">
                        {key}
                      </div>
                      <ArrowRight size={14} className="text-gray-300" />
                      <FormField name={key} className="flex-1 !mb-0">
                        <select 
                          className="w-full bg-white transition-all shadow-sm !py-2.5 !text-sm" 
                          value={value as string} 
                          onChange={(e) => form.handleChange(key, e.target.value)}
                        >
                          <option value={key}>Sync with: {key}</option>
                          <option value="ignore">Skip column</option>
                        </select>
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-emerald-500 p-6 rounded-3xl text-white mb-6 shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                  <CheckCircle size={100} className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Validation Successful</h3>
                      <p className="text-emerald-100 text-xs">25 new leads are ready for import. Review the preview below.</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50/50">
                      <tr>
                        {['Name', 'Company', 'Email', 'Value', 'Status'].map(h => (
                          <th key={h} className="px-5 py-4 text-left font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: 'Peter Parker', company: 'Daily Bugle', email: 'peter@bugle.com', value: '150K€', status: 'Warm', color: 'bg-orange-100 text-orange-600' },
                        { name: 'Stephen Strange', company: 'Kamar-Taj', email: 'strange@kamar.com', value: '450K€', status: 'Hot', color: 'bg-rose-100 text-rose-600' },
                        { name: 'Bruce Wayne', company: 'Wayne Ent.', email: 'bruce@wayne.com', value: '1.2M€', status: 'Enterprise', color: 'bg-emerald-100 text-emerald-600' },
                      ].map((lead, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 font-bold text-gray-800">{lead.name}</td>
                          <td className="px-5 py-4 text-gray-500 font-medium">{lead.company || 'N/A'}</td>
                          <td className="px-5 py-4 text-gray-400">{lead.email}</td>
                          <td className="px-5 py-4 font-black text-blue-600">{lead.value}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${lead.color}`}>
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <button 
            type="button"
            className="px-6 py-2.5 text-gray-500 hover:text-gray-800 font-bold text-sm transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="flex gap-4">
            {step > 1 && (
              <button 
                type="button"
                className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold shadow-sm hover:border-gray-300 transition-all" 
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
              </button>
            )}
            {step < 3 ? (
              <button 
                type="button"
                disabled={step === 1 && !file}
                className="group flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none" 
                onClick={() => setStep(step + 1)}
              >
                Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                type="button"
                className="group flex items-center gap-2 px-10 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all" 
                onClick={form.handleSubmit}
              >
                Confirm Import <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}