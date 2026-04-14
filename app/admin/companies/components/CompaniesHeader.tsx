interface CompaniesHeaderProps {
  totalCompanies: number;
  onFilterClick: () => void;
  onExport?: () => void;
}

export default function CompaniesHeader({ totalCompanies, onFilterClick, onExport }: CompaniesHeaderProps) {
  const metrics = [
    { 
      label: 'Total Companies', 
      value: totalCompanies.toString(), 
      change: '+12', 
      icon: '🏢',
      color: 'blue'
    },
    { 
      label: 'Active Accounts', 
      value: '234', 
      change: '+8.2%', 
      icon: '✅',
      color: 'green'
    },
    { 
      label: 'Total Revenue', 
      value: '$12.4M', 
      change: '+23.5%', 
      icon: '💰',
      color: 'purple'
    },
    { 
      label: 'Avg. Company Size', 
      value: '124', 
      change: '+5', 
      icon: '👥',
      color: 'amber'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer accounts</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onFilterClick}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                <p className={`text-xs mt-2 ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} from last month
                </p>
              </div>
              <span className={`text-xl w-10 h-10 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                {metric.icon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}