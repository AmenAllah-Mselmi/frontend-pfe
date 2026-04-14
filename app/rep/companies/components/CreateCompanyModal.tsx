'use client';
import { useState } from 'react';
import { X, Building2, Users, Mail, Phone, Globe, DollarSign } from 'lucide-react';

export default function CreateCompanyModal({ onClose, onCreate }: any) {
  const [form, setForm] = useState({ name: '', companyIndustry: 'TECHNOLOGY', companySize: 'SMALL', location: '', email: '', phone: '' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Create New Company</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onCreate(form); onClose(); }} className="p-6 space-y-4">
          <div className="relative"><Building2 size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Company Name *" required className="w-full pl-9 p-3 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select className="w-full p-3 border rounded-lg" value={form.companyIndustry} onChange={(e) => setForm({ ...form, companyIndustry: e.target.value })}>
                <option value="TECHNOLOGY">Technology</option><option value="HEALTHCARE">Healthcare</option><option value="FINANCE">Finance</option><option value="EDUCATION">Education</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select className="w-full p-3 border rounded-lg" value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                <option value="SMALL">Small (1-50)</option><option value="MEDIUM">Medium (51-200)</option><option value="LARGE">Large (200+)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative"><Mail size={16} className="absolute left-3 top-3 text-gray-400" /><input type="email" placeholder="Email" className="w-full pl-9 p-3 border rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="relative"><Phone size={16} className="absolute left-3 top-3 text-gray-400" /><input placeholder="Phone" className="w-full pl-9 p-3 border rounded-lg" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div>
            <input placeholder="Location" className="w-full p-3 border rounded-lg" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Create Company</button>
          </div>
        </form>
      </div>
    </div>
  );
}