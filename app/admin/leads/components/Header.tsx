interface HeaderProps {
  totalLeads: number;
  pipelineValue?: number;
  conversionRate?: string;
  avgDealSize?: number;
  onFilterClick: () => void;
  onExport?: () => void;
}

export default function Header({ totalLeads, pipelineValue = 0, conversionRate = "0.0", avgDealSize = 0, onFilterClick, onExport }: HeaderProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'K';
    return '$' + val.toFixed(0);
  };

  const metrics = [
    { label: 'Pipeline Value', value: formatCurrency(pipelineValue), change: 'Calculé en temps réel', icon: '💰' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: 'Calculé en temps réel', icon: '📈' },
    { label: 'Total Leads', value: totalLeads.toString(), change: 'Calculé en temps réel', icon: '👥' },
    { label: 'Avg. Deal Size', value: formatCurrency(avgDealSize), change: 'Calculé en temps réel', icon: '📊' }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Lead Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your sales pipeline</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={onFilterClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          <button
            onClick={onExport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-200 transition">
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
              <span className="text-2xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}