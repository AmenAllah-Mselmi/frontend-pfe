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
  const { companies, loadCompanies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // Normalize companies into a typed array in case API returns a wrapper
  const companyList: Company[] = Array.isArray(companies)
    ? companies
    : Array.isArray((companies as unknown as { companies?: Company[] })?.companies)
    ? (companies as unknown as { companies: Company[] }).companies
    : [];

  const selectedCompanyData = selectedCompany !== null
    ? companyList.find(c => c.id === selectedCompany)
    : null;

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
          totalCompanies={companyList.length}
          onFilterClick={() => setShowFilters(!showFilters)}
          onExport={() => exportToCSV(companyList, 'companies')}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">All Companies</h2>
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
            data={companyList}
            onCompanyClick={(id) => setSelectedCompany(id)}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
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