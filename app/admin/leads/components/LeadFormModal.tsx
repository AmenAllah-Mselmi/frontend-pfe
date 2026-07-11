'use client';

import { X, User, Mail, Phone, DollarSign, Tag } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';
import CompanySelector from '@/components/Form/CompanySelector';

interface LeadFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function LeadFormModal({ onClose, onSave }: LeadFormModalProps) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      dealValue: 0,
      status: 'NEW',
      probability: 20,
      companyId: undefined as number | undefined
    },
    validationSchema: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      dealValue: [validators.minValue(0)],
      phone: [validators.phone]
    },
    onSubmit: (data) => onSave(data)
  });

  // Fonction pour gérer le clic en dehors du modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Lead</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Contact Person"
            name="name"
            error={errors.name}
            touched={touched.name}
            icon={User}
            required
          >
            <input
              type="text"
              placeholder="Full Name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Email"
              name="email"
              error={errors.email}
              touched={touched.email}
              icon={Mail}
              required
            >
              <input
                type="email"
                placeholder="email@example.com"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
            </FormField>

            <FormField
              label="Phone"
              name="phone"
              error={errors.phone}
              touched={touched.phone}
              icon={Phone}
            >
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Deal Value (€)"
              name="dealValue"
              error={errors.dealValue}
              touched={touched.dealValue}
              icon={DollarSign}
            >
              <input
                type="number"
                placeholder="0"
                value={values.dealValue}
                onChange={(e) => handleChange('dealValue', Number(e.target.value))}
                onBlur={() => handleBlur('dealValue')}
              />
            </FormField>

            <FormField
              label="Status"
              name="status"
              error={errors.status}
              touched={touched.status}
              icon={Tag}
            >
              <select
                value={values.status}
                onChange={(e) => handleChange('status', e.target.value)}
                onBlur={() => handleBlur('status')}
                className="appearance-none"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="NEGOCIATION">Negociation</option>
                <option value="PROPOSITION">Proposition</option>
                <option value="LOST">Lost</option>
              </select>
            </FormField>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
            <CompanySelector
              value={values.companyId}
              onChange={(id) => handleChange('companyId', id)}
            />
          </div>

          <FormField
            label="Probability (%)"
            name="probability"
            error={errors.probability}
            touched={touched.probability}
          >
            <select
              value={values.probability}
              onChange={(e) => handleChange('probability', Number(e.target.value))}
              onBlur={() => handleBlur('probability')}
            >
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
                <option key={p} value={p}>{p}%</option>
              ))}
            </select>
          </FormField>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}