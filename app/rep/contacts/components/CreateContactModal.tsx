'use client';

import { X, User, Building2, Mail, Phone, Briefcase } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';
import CompanySelector from '@/components/Form/CompanySelector';

export default function CreateContactModal({ onClose, onCreate }: any) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      companyId: undefined as number | undefined,
      position: '',
      status: 'ACTIVE',
      source: 'Website',
      notes: ''
    },
    validationSchema: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      phone: [validators.phone],
      position: [validators.minLength(2)]
    },
    onSubmit: (data) => {
      onCreate({ 
        ...data, 
        companyId: data.companyId ? Number(data.companyId) : undefined 
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Create New Contact</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Full Name"
            name="name"
            error={errors.name}
            touched={touched.name}
            icon={User}
            required
          >
            <input 
              placeholder="e.g. Alice Johnson" 
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
                placeholder="alice@example.com" 
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
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
              <CompanySelector
                value={values.companyId}
                onChange={(id) => handleChange('companyId', id)}
              />
            </div>

            <FormField
              label="Position"
              name="position"
              error={errors.position}
              touched={touched.position}
              icon={Briefcase}
            >
              <input 
                placeholder="Marketing Manager" 
                value={values.position} 
                onChange={(e) => handleChange('position', e.target.value)} 
                onBlur={() => handleBlur('position')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Status" name="status">
              <select value={values.status} onChange={(e) => handleChange('status', e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </FormField>

            <FormField label="Source" name="source">
              <select value={values.source} onChange={(e) => handleChange('source', e.target.value)}>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Event">Event</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </FormField>
          </div>

          <FormField label="Notes" name="notes" error={errors.notes} touched={touched.notes}>
            <textarea 
              placeholder="Any relevant info..." 
              rows={3} 
              value={values.notes} 
              onChange={(e) => handleChange('notes', e.target.value)} 
              className="resize-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
            <button 
              type="button" 
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? 'Creating...' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}