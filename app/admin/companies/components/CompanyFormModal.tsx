'use client';

import { X, Building2, MapPin, Phone, Mail, DollarSign, Briefcase, User } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

interface CompanyFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CompanyFormModal({ onClose, onSave }: CompanyFormModalProps) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      companyIndustry: 'TECHNOLOGY',
      companySize: 'SMALL',
      location: '',
      phone: '',
      email: '',
      revenue: 0
    },
    validationSchema: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      revenue: [validators.minValue(0)],
      phone: [validators.phone],
      location: [validators.minLength(2)]
    },
    onSubmit: (data) => onSave(data)
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Create New Company</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Company Name"
            name="name"
            error={errors.name}
            touched={touched.name}
            icon={Building2}
            required
          >
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Industry"
              name="companyIndustry"
              icon={Briefcase}
            >
              <select
                value={values.companyIndustry}
                onChange={(e) => handleChange('companyIndustry', e.target.value)}
                onBlur={() => handleBlur('companyIndustry')}
                className="appearance-none"
              >
                <option value="TECHNOLOGY">Technology</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="FINANCE">Finance</option>
                <option value="EDUCATION">Education</option>
                <option value="OTHER">Other</option>
              </select>
            </FormField>

            <FormField
              label="Company Size"
              name="companySize"
              icon={User}
            >
              <select
                value={values.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                onBlur={() => handleBlur('companySize')}
                className="appearance-none"
              >
                <option value="SMALL">Small (1-50)</option>
                <option value="MEDIUM">Medium (51-200)</option>
                <option value="LARGE">Large (200+)</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Location"
            name="location"
            error={errors.location}
            touched={touched.location}
            icon={MapPin}
          >
            <input
              type="text"
              placeholder="City, Country"
              value={values.location}
              onChange={(e) => handleChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
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
                placeholder="contact@company.com"
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

          <FormField
            label="Annual Revenue ($)"
            name="revenue"
            error={errors.revenue}
            touched={touched.revenue}
            icon={DollarSign}
          >
            <input
              type="number"
              placeholder="0"
              value={values.revenue}
              onChange={(e) => handleChange('revenue', Number(e.target.value))}
              onBlur={() => handleBlur('revenue')}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 font-semibold text-sm"
            >
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}