import { Building2, TrendingUp, DollarSign, Users, Download } from 'lucide-react';

export default function CompaniesStats({ companies }: any) {
  const total = companies.length;
  const techSector = companies.filter((c: any) => c.companyIndustry === 'TECHNOLOGY').length;
  const healthcareSector = companies.filter((c: any) => c.companyIndustry === 'HEALTHCARE').length;
  const largeSize = companies.filter((c: any) => c.companySize === 'LARGE').length;
  const newlyAdded = companies.filter((c: any) => new Date(c.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  const stats = [
    { label: 'Total Companies', value: total, icon: Building2, color: 'purple', change: `+${newlyAdded} this week` },
    { label: 'Tech Sector', value: techSector, icon: TrendingUp, color: 'blue', change: 'Active' },
    { label: 'Healthcare Sector', value: healthcareSector, icon: DollarSign, color: 'green', change: 'Active' },
    { label: 'Large Enterprises', value: largeSize, icon: Users, color: 'orange', change: 'Key accounts' },
    { label: 'Newly Added', value: newlyAdded, icon: Download, color: 'pink', change: 'This week' },
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