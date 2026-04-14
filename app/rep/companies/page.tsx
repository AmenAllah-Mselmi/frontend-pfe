'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Building2, Users, Upload, Edit, Trash2, Download } from 'lucide-react';
import CompaniesTable from './components/CompaniesTable';
import CompaniesGrid from './components/CompaniesGrid';
import CreateCompanyModal from './components/CreateCompanyModal';
import EditCompanyModal from './components/EditCompanyModal';
import DeleteCompanyModal from './components/DeleteCompanyModal';
import CSVImportWizard from '@/components/CSVImportWizard';
import CompaniesFilters from './components/CompaniesFilters';
import CompaniesStats from './components/CompaniesStats';
import { useCompanyStore } from '@/lib/companyStore';
import { exportToCSV } from '@/lib/exportCsv';

export default function CompaniesPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const { companies, loadCompanies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let filtered = [...companies];

    if (search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.companyIndustry.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.status) {
      // Assuming 'status' filter might map to some derived status or be removed
      // For now, let's keep it as a placeholder or remove if not applicable to new data
      // filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.companySize) {
      filtered = filtered.filter(c => c.companySize === filters.companySize);
    }

    if (filters.industries && filters.industries.length > 0) {
      filtered = filtered.filter(c => filters.industries.includes(c.companyIndustry));
    }

    // Revenue, leads, deals filters are removed as they are not in the new mock data structure
    // if (filters.minRevenue) {
    //   filtered = filtered.filter(c => c.revenue >= filters.minRevenue * 1000000);
    // }

    // if (filters.maxRevenue) {
    //   filtered = filtered.filter(c => c.revenue <= filters.maxRevenue * 1000000);
    // }

    // if (filters.minLeads) {
    //   filtered = filtered.filter(c => c.leads >= filters.minLeads);
    // }

    setFilteredCompanies(filtered);
  }, [search, filters, companies]);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleEditCompany = (company: any) => {
    setSelectedCompany(company);
    setShowEdit(true);
  };

  const handleDeleteCompany = (company: any) => {
    setSelectedCompany(company);
    setShowDelete(true);
  };

  const handleUpdateCompany = async (companyId: number, updatedData: any) => {
    await updateCompany(companyId, updatedData);
    setShowEdit(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompanyConfirm = async (companyId: number) => {
    await deleteCompany(companyId);
    setShowDelete(false);
    setSelectedCompany(null);
  };

  const handleCreateCompany = async (data: any) => {
    await addCompany(data);
    setShowCreate(false);
  };

  const handleImport = async (importedCompanies: any[]) => {
    for (const company of importedCompanies) {
      await addCompany(company);
    }
    setShowImport(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-600 rounded-lg blur opacity-20" />
              <div className="relative bg-emerald-600 rounded-lg p-2">
                <Building2 size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Companies
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Users size={14} />Manage your customer accounts
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportToCSV(filteredCompanies, 'rep_companies')} className="relative group">
              <div className="absolute inset-0 bg-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl">
                <Download size={18} /><span className="text-sm font-medium">Export</span>
              </div>
            </button>
            <button onClick={() => setShowImport(true)} className="relative group">
              <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
                <Upload size={18} /><span className="text-sm font-medium">Import</span>
              </div>
            </button>
            <button onClick={() => setShowCreate(true)} className="relative group">
              <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
                <Plus size={18} /><span className="text-sm font-medium">New Company</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <CompaniesStats companies={filteredCompanies} />

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg">
            <span className="text-xs text-emerald-700 font-medium">Active filters:</span>
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Status: {filters.status}
                <button onClick={() => setFilters({ ...filters, status: undefined })}>×</button>
              </span>
            )}
            {filters.size && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Size: {filters.size}
                <button onClick={() => setFilters({ ...filters, size: undefined })}>×</button>
              </span>
            )}
            {filters.industries?.map((ind: string) => (
              <span key={ind} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                {ind}
                <button onClick={() => setFilters({ ...filters, industries: filters.industries.filter((i: string) => i !== ind) })}>×</button>
              </span>
            ))}
            <button
              onClick={() => setFilters({})}
              className="text-xs text-emerald-600 hover:text-emerald-800 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl border">
              <div className="flex gap-1">
                <button onClick={() => setView('table')}
                  className={`p-2 rounded-lg ${view === 'table' ? 'bg-emerald-500 text-white' : 'text-gray-500'}`}>
                  <Building2 size={18} />
                </button>
                <button onClick={() => setView('grid')}
                  className={`p-2 rounded-lg ${view === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-500'}`}>
                  <Users size={18} />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="pl-10 pr-4 py-2 border rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => setFilters({})}
                className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-xl flex items-center gap-2 ${Object.keys(filters).length > 0 ? 'bg-emerald-500 text-white' : 'bg-white'}`}
            >
              <Filter size={16} />Filters{Object.keys(filters).length > 0 && ` (${Object.keys(filters).length})`}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <CompaniesFilters
              onClose={() => setShowFilters(false)}
              onApply={handleApplyFilters}
              initialFilters={filters}
            />
          </div>
        )}

        {/* Companies View */}
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
          {view === 'table' ?
            <CompaniesTable
              companies={filteredCompanies}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
            /> :
            <CompaniesGrid
              companies={filteredCompanies}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
            />
          }
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateCompanyModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateCompany}
        />
      )}

      {showEdit && selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowEdit(false);
            setSelectedCompany(null);
          }}
          onSave={handleUpdateCompany}
        />
      )}

      {showDelete && selectedCompany && (
        <DeleteCompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowDelete(false);
            setSelectedCompany(null);
          }}
          onConfirm={handleDeleteCompanyConfirm}
        />
      )}

      {showImport && (
        <CSVImportWizard
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            loadCompanies();
          }}
          title="Import Companies"
          endpoint="/companies/import-bulk"
          fields={[
            { key: 'name', label: 'Company Name', required: true },
            { key: 'industry', label: 'Industry' },
            { key: 'size', label: 'Size', type: 'string' },
            { key: 'revenue', label: 'Revenue', type: 'number' },
            { key: 'status', label: 'Status' }
          ]}
        />
      )}
    </div>
  );
}