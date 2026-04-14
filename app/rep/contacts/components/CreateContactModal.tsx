'use client';
import { useState } from 'react';
import { X, User, Building2, Mail, Phone, Briefcase } from 'lucide-react';

export default function CreateContactModal({ onClose, onCreate, companies }: any) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', companyId: '', position: '',
    status: 'ACTIVE', source: 'Website', notes: ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Create New Contact</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onCreate({ ...form, companyId: form.companyId ? Number(form.companyId) : undefined });
        }} className="p-6 space-y-4">
          <div className="relative"><User size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Full Name *" required className="w-full pl-9 p-3 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative"><Mail size={16} className="absolute left-3 top-3 text-gray-400" /><input type="email" placeholder="Email" className="w-full pl-9 p-3 border rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="relative"><Phone size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Phone" className="w-full pl-9 p-3 border rounded-lg" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
              <select className="w-full pl-9 p-3 border rounded-lg appearance-none" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                <option value="">Select Company (Optional)</option>
                {companies?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="relative"><Briefcase size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Position" className="w-full pl-9 p-3 border rounded-lg" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 border rounded-lg" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <select className="p-3 border rounded-lg" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              <option>Website</option><option>Referral</option><option>Event</option><option>LinkedIn</option>
            </select>
          </div>

          <textarea placeholder="Notes (optional)" rows={3} className="w-full p-3 border rounded-lg" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Create Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
}