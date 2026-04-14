interface Filter {
  field: string;
  operator: string;
  value: string;
}

interface CompaniesFilterProps {
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  onClose: () => void;
}

export default function CompaniesFilter({ filters, setFilters, onClose }: CompaniesFilterProps) {
  const addFilter = () => {
    setFilters([...filters, { field: 'name', operator: 'contains', value: '' }]);
  };

  const updateFilter = (index: number, key: keyof Filter, value: string) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filter Companies</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {filters.map((filter, i) => (
          <div key={i} className="flex items-center gap-3">
            <select 
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.field}
              onChange={(e) => updateFilter(i, 'field', e.target.value)}
            >
              <option value="name">Company Name</option>
              <option value="industry">Industry</option>
              <option value="size">Company Size</option>
              <option value="revenue">Revenue</option>
              <option value="status">Status</option>
              <option value="leads">Lead Count</option>
            </select>
            
            <select 
              className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.operator}
              onChange={(e) => updateFilter(i, 'operator', e.target.value)}
            >
              <option value="equals">equals</option>
              <option value="contains">contains</option>
              <option value="gt">greater than</option>
              <option value="lt">less than</option>
            </select>
            
            <input 
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
              value={filter.value}
              onChange={(e) => updateFilter(i, 'value', e.target.value)}
            />
            
            <button 
              className="text-gray-400 hover:text-red-500 transition"
              onClick={() => removeFilter(i)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          onClick={addFilter}
        >
          + Add Filter
        </button>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Clear
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}