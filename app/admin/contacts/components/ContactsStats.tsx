import { Users, UserPlus, Building2, Calendar, Download } from 'lucide-react';

export default function ContactsStats({ contacts }: any) {
  const total = contacts.length;
  const active = contacts.filter((c: any) => c.status === 'Active').length;
  const leads = contacts.filter((c: any) => c.status === 'Lead').length;
  const companies = [...new Set(contacts.map((c: any) => c.company))].length;
  const imported = contacts.filter((c: any) => c.source === 'Import').length;

  const stats = [
    { label: 'Total Contacts', value: total, icon: Users, color: 'purple', change: `+${imported}` },
    { label: 'Active', value: active, icon: UserPlus, color: 'green', change: '+8' },
    { label: 'Leads', value: leads, icon: Building2, color: 'blue', change: '+3' },
    { label: 'Companies', value: companies, icon: Building2, color: 'orange', change: '+2' },
    { label: 'Imported', value: imported, icon: Download, color: 'pink', change: 'this month' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border hover:shadow-md transition">
          <div className="flex justify-between mb-2">
            <div className={`p-2 bg-${s.color}-50 rounded-lg`}><s.icon size={16} className={`text-${s.color}-600`} /></div>
            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{s.change}</span>
          </div>
          <p className="text-xl font-bold">{s.value}</p>
          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}