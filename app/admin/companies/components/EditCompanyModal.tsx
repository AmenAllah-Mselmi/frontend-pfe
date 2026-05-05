'use client';

import { X, Building2, Users, Mail, Phone, Globe, DollarSign, MapPin } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

interface EditCompanyModalProps {
  company: any;
  onClose: () => void;
  onSave: (companyId: number, data: any) => void;
}

export default function EditCompanyModal({ company, onClose, onSave }: EditCompanyModalProps) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: company.name || '',
      companyIndustry: company.companyIndustry || 'TECHNOLOGY',
      companySize: company.companySize || 'SMALL',
      location: company.location || '',
      email: company.email || '',
      phone: company.phone || '',
      revenue: company.revenue || 0,
    },
    validationSchema: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.email],
      phone: [validators.phone],
      revenue: [validators.minValue(0)]
    },
    onSubmit: (data) => {
      onSave(company.id, data);
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Edit Company</h2>
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
            >
              <select 
                value={values.companyIndustry} 
                onChange={(e) => handleChange('companyIndustry', e.target.value)}
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
              icon={Users}
            >
              <select 
                value={values.companySize} 
                onChange={(e) => handleChange('companySize', e.target.value)}
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
              placeholder="e.g. San Francisco, CA" 
              value={values.location} 
              onChange={(e) => handleChange('location', e.target.value)} 
              onBlur={() => handleBlur('location')}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Email Address"
              name="email"
              error={errors.email}
              touched={touched.email}
              icon={Mail}
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
              label="Phone Number"
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
            label="Annual Revenue (€)"
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
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium text-sm" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 font-semibold text-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}