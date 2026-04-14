'use client';
import { useState } from 'react';
import { X, User, Building2, Mail, Phone, Globe, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateLeadModal({ onClose, onCreate }: any) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'NEW', dealValue: 0, probability: 20 });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Create New Lead</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (!form.name.trim()) {
            toast.error("Le nom entier est obligatoire");
            return;
          }
          if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error("Format d'email invalide");
            return;
          }
          if (form.dealValue < 0) {
            toast.error("La valeur de l'opportunité ne peut pas être négative");
            return;
          }
          onCreate(form); 
          onClose(); 
        }} className="p-6 space-y-4">
          <div className="relative"><User size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Full Name *" required className="w-full pl-9 p-3 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative"><Mail size={16} className="absolute left-3 top-3 text-gray-400" /><input type="email" placeholder="Email" className="w-full pl-9 p-3 border rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="relative"><Phone size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Phone" className="w-full pl-9 p-3 border rounded-lg" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 border rounded-lg" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="LOST">Lost</option>
            </select>
            <div className="relative"><DollarSign size={16} className="absolute left-3 top-3 text-gray-400" /><input type="number" placeholder="Lead Value (€)" className="w-full pl-9 p-3 border rounded-lg" value={form.dealValue} onChange={(e) => setForm({ ...form, dealValue: Number(e.target.value) })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Create Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}