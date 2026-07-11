'use client';
import { useEffect, useState } from 'react';
import CompaniesHeader from './components/CompaniesHeader';
import CompaniesTable from './components/CompaniesTable';
import CompaniesFilter from './components/CompaniesFilter';
import CompanyDetailsModal from './components/CompanyDetailsModal';
import AddButton from '../components/AddButton';
import CompanyFormModal from './components/CompanyFormModal';
import EditCompanyModal from './components/EditCompanyModal';
import DeleteCompanyModal from './components/DeleteCompanyModal';
import CSVImportWizard from '@/components/CSVImportWizard';
import { useCompanyStore, Company } from '@/lib/companyStore';
import { exportToCSV } from '@/lib/exportCsv';
import Pagination from '@/components/Pagination';
import { Search } from 'lucide-react';

export default function CompaniesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [filters, setFilters] = useState<any[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showDeleteCompany, setShowDeleteCompany] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<any>(null);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { companies, totalItems, loadCompanies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  
  useEffect(() => {
    loadCompanies(currentPage, itemsPerPage, searchQuery);
  }, [loadCompanies, currentPage, itemsPerPage, searchQuery]);

  // Normalize companies into a typed array in case API returns a wrapper
  const companyList: Company[] = Array.isArray(companies)
    ? companies
    : Array.isArray((companies as unknown as { data?: Company[] })?.data)
    ? (companies as unknown as { data: Company[] }).data
    : [];

  const selectedCompanyData = selectedCompany !== null
    ? companyList.find(c => c.id === selectedCompany)
    : null;
 
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companyList);
 
  useEffect(() => {
    let filtered = [...companyList];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        (c.name || '').toLowerCase().includes(q) || 
        (c.companyIndustry || '').toLowerCase().includes(q)
      );
    }
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  // Handlers
  const handleEditCompany = (company: any) => {
    setCompanyToEdit(company);
    setShowEditCompany(true);
  };

  const handleDeleteCompany = (company: any) => {
    setCompanyToDelete(company);
    setShowDeleteCompany(true);
  };

  const handleUpdateCompany = (companyId: number, updatedData: any) => {
    updateCompany(companyId, updatedData);
    setShowEditCompany(false);
    setCompanyToEdit(null);
  };

  const handleDeleteCompanyConfirm = (companyId: number) => {
    deleteCompany(companyId);
    setShowDeleteCompany(false);
    setCompanyToDelete(null);
    if (selectedCompany === companyId) {
      setSelectedCompany(null);
    }
  };

  const handleCreateCompany = (data: any) => {
    addCompany(data);
    setShowCompanyForm(false);
  };

  const handleImport = (importedCompanies: any[]) => {
    const newCompanies = importedCompanies.map((company, index) => ({
      id: Date.now() + index,
      ...company,
      leads: 0,
      deals: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    }));
    newCompanies.forEach(company => addCompany(company));
    setShowImport(false);
  };

  const handleCloseDetails = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <CompaniesHeader
          totalCompanies={totalItems}
          onFilterClick={() => setShowFilters(!showFilters)}
          onExport={async () => {
            const allCompanies = await useCompanyStore.getState().fetchAllCompanies();
            exportToCSV(allCompanies, 'companies');
          }}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">All Companies</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
              />
            </div>
          </div>
          <AddButton
            onAdd={() => setShowCompanyForm(true)}
            onImport={() => setShowImport(true)}
            type="company"
          />
        </div>

        {showFilters && (
          <div className="mb-6">
            <CompaniesFilter
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border">
          <CompaniesTable
            data={filteredCompanies}
            onCompanyClick={(id) => setSelectedCompany(id)}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
          <div className="border-t px-4 py-3">
             <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCompanyData && (
        <CompanyDetailsModal
          company={selectedCompanyData}
          onClose={handleCloseDetails}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
        />
      )}

      {showCompanyForm && (
        <CompanyFormModal
          onClose={() => setShowCompanyForm(false)}
          onSave={handleCreateCompany}
        />
      )}

      {showEditCompany && companyToEdit && (
        <EditCompanyModal
          company={companyToEdit}
          onClose={() => {
            setShowEditCompany(false);
            setCompanyToEdit(null);
          }}
          onSave={handleUpdateCompany}
        />
      )}

      {showDeleteCompany && companyToDelete && (
        <DeleteCompanyModal
          company={companyToDelete}
          onClose={() => {
            setShowDeleteCompany(false);
            setCompanyToDelete(null);
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