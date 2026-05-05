'use client';

import { X, Building2, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

export default function CreateCompanyModal({ onClose, onCreate }: any) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      companyIndustry: 'TECHNOLOGY',
      companySize: 'SMALL',
      location: '',
      email: '',
      phone: ''
    },
    validationSchema: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.email],
      phone: [validators.phone]
    },
    onSubmit: (data) => {
      onCreate(data);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Create New Company</h2>
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
            label="Location"
            name="location"
            error={errors.location}
            touched={touched.location}
            icon={MapPin}
          >
            <input 
              placeholder="e.g. Paris, France" 
              value={values.location} 
              onChange={(e) => handleChange('location', e.target.value)} 
              onBlur={() => handleBlur('location')}
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
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 font-semibold text-sm"
            >
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}