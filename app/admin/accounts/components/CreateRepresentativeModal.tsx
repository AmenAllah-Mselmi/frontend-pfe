'use client';

import { X, User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

export default function CreateRepresentativeModal({ onClose, onCreate }: any) {
  const user = useAuthStore((state) => state.user);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'REP',
      managerId: user?.id,
      company: user?.company 
    },
    validationSchema: {
      name: [validators.required, validators.minLength(3)],
      email: [validators.required, validators.email],
      password: [validators.required, validators.password]
    },
    onSubmit: (data) => {
      onCreate(data);
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Add Sales Representative</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Full Name"
              name="name"
              error={errors.name}
              touched={touched.name}
              icon={User}
              required
            >
              <input
                placeholder="e.g. Jean Dupont"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
              />
            </FormField>

            <FormField
              label="Email Address"
              name="email"
              error={errors.email}
              touched={touched.email}
              icon={Mail}
              required
            >
              <input
                type="email"
                placeholder="jean@example.com"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
            </FormField>
          </div>

          <FormField
            label="Password"
            name="password"
            error={errors.password}
            touched={touched.password}
            icon={Lock}
            required
            helpText="Must be 8+ chars, with a capital letter, a number, and a special character."
          >
            <input
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? 'Creating...' : 'Create Representative'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}