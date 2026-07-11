'use client';
import { X } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';
import { useActivityStore } from '@/lib/activityStore';

export default function EditActivityModal({ activity, onClose }: any) {
  const { updateActivity } = useActivityStore();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      title: activity.title || '',
      description: activity.description || '',
    },
    validationSchema: {
      title: [validators.required, validators.minLength(5)]
    },
    onSubmit: async (data) => {
      await updateActivity(activity.id, data);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Edit Activity</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Activity Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title ? errors.title : undefined}
            placeholder="e.g., Initial call with client"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
              placeholder="Add details about this activity..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
