'use client';

import { X, User, Mail, Phone, DollarSign, Tag } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';
import CompanySelector from '@/components/Form/CompanySelector';

interface EditLeadModalProps {
  onClose: () => void;
  onSave: (leadId: number, data: any) => void;
  lead: any;
}

export default function EditLeadModal({ onClose, onSave, lead }: EditLeadModalProps) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      dealValue: lead.dealValue || 0,
      status: lead.status || 'NEW',
      companyId: lead.companyId || undefined as number | undefined
    },
    validationSchema: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.email],
      phone: [validators.phone],
      dealValue: [validators.minValue(0)]
    },
    onSubmit: (data) => {
      onSave(lead.id, data);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Edit Lead</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Contact Manager"
            name="name"
            error={errors.name}
            touched={touched.name}
            icon={User}
            required
          >
            <input 
              placeholder="e.g. John Smith" 
              value={values.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              onBlur={() => handleBlur('name')}
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
                placeholder="john@example.com" 
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
              label="Current Status"
              name="status"
              icon={Tag}
            >
              <select 
                value={values.status} 
                onChange={(e) => handleChange('status', e.target.value)}
                className="appearance-none"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}