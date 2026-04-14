'use client';
import { Building2, Users, Mail, Phone, MapPin, Star } from 'lucide-react';

export default function CompaniesGrid({ companies }: any) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {companies.map((c: any) => (
        <div key={c.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                {c.name.charAt(0)}
              </div>
              <div><h3 className="font-semibold">{c.name}</h3><p className="text-xs text-gray-500">{c.companyIndustry}</p></div>
            </div>
          </div>
          <div className="space-y-2 text-sm mb-3">
            <p className="text-gray-600 flex items-center gap-1"><Users size={14} />{c.companySize} employees</p>
            <p className="text-gray-600 flex items-center gap-1"><Mail size={14} />{c.email}</p>
            <p className="text-gray-600 flex items-center gap-1"><Phone size={14} />{c.phone}</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <p className="text-gray-600 flex items-center gap-1 text-xs"><MapPin size={14} />{c.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}