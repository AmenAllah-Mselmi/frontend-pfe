'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePipelineModalProps {
  onClose: () => void;
  onCreatePipeline: (pipeline: any) => void;
}

const STAGES = [
  { value: 'NOUVEAU', label: 'Nouveau' },
  { value: 'CONTACTE', label: 'Contacté' },
  { value: 'QUALIFIE', label: 'Qualifié' },
  { value: 'PROPOSITION', label: 'Proposition' },
  { value: 'NEGOCIATION', label: 'Négociation' },
  { value: 'GAGNE', label: 'Gagné' },
  { value: 'PERDU', label: 'Perdu' },
];

export default function CreatePipelineModal({ onClose, onCreatePipeline }: CreatePipelineModalProps) {
  const [name, setName] = useState('');
  const [stage, setStage] = useState('NOUVEAU');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePipeline({ name, stage });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create New Pipeline</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase text-[10px] tracking-wider">Nom du Pipeline <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pipeline de Ventes"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase text-[10px] tracking-wider">Étape</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            >
              {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">Créer le Pipeline</button>
          </div>
        </form>
      </div>
    </div>
  );
}