'use client';
import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface ImportTicketsModalProps {
  onClose: () => void;
  onImport: (data: any[]) => void;
}

export default function ImportTicketsModal({ onClose, onImport }: ImportTicketsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [mapping, setMapping] = useState({
    title: 'title',
    description: 'description',
    status: 'status',
    priority: 'priority',
    category: 'category',
    assignedTo: 'assignedTo',
    dueDate: 'dueDate',
    tags: 'tags'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2);
    }
  };

  const handleImport = () => {
    const importedTickets = [
      {
        title: 'Login issue',
        description: 'Users unable to login',
        status: 'open',
        priority: 'high',
        category: 'technical',
        assignedTo: 'Alex Morgan',
        dueDate: '2024-01-25',
        tags: ['bug', 'auth']
      },
      {
        title: 'Export feature request',
        description: 'Need ability to export reports',
        status: 'open',
        priority: 'medium',
        category: 'feature',
        assignedTo: 'Taylor Swift',
        dueDate: '2024-01-28',
        tags: ['feature', 'export']
      }
    ];
    onImport(importedTickets);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Import Tickets</h2>
          <button onClick={onClose} type="button"><X size={20} /></button>
        </div>

        <div className="p-6">
          {/* Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="text-center py-8">
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  Select File
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <FileText size={16} /> <span>Download template</span>
                <Download size={14} className="text-blue-600" />
              </div>
            </div>
          )}

          {/* Step 2: Mapping */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Map your CSV columns to ticket fields</p>
              {Object.entries(mapping).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium capitalize">{key}</span>
                  <select
                    className="flex-1 p-2 border rounded-lg text-sm"
                    value={value}
                    onChange={(e) => setMapping({...mapping, [key]: e.target.value})}
                  >
                    <option value={key}>Map to: {key}</option>
                    <option value="ignore">Ignore column</option>
                  </select>
                </div>
              ))}
              <div className="bg-blue-50 p-4 rounded-lg flex gap-2 mt-4">
                <AlertCircle size={20} className="text-blue-600" />
                <p className="text-sm text-blue-700">8 tickets ready to import</p>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg flex gap-2">
                <CheckCircle size={20} className="text-green-600" />
                <p className="text-sm text-green-700">All 8 tickets validated!</p>
              </div>
              <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Priority</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">Login issue</td>
                      <td className="px-4 py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">high</span></td>
                      <td className="px-4 py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">open</span></td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Export feature</td>
                      <td className="px-4 py-2"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">medium</span></td>
                      <td className="px-4 py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">open</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <div className="flex gap-2">
            {step > 1 && (
              <button type="button" className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleImport}>
                Import Tickets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}