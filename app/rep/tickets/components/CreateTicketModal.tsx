import { useState } from 'react';
import { X, Tag, AlertCircle, User, Search, Building2, Briefcase } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

export default function CreateTicketModal({ onClose, onCreate, leads, contacts, users }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSelector, setActiveSelector] = useState<string | null>(null);
  const [selectedNames, setSelectedNames] = useState<Record<string, string>>({
    lead: '',
    contact: '',
    user: ''
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setValues } = useForm({
    initialValues: {
      title: '',
      description: '',
      leadId: '',
      contactId: '',
      userId: '',
      priority: 'MEDIUM'
    },
    validationSchema: {
      title: [validators.required, validators.minLength(5)],
      userId: [validators.required],
      leadId: [validators.required]
      // contactId is optional
    },
    onSubmit: (data) => {
      onCreate({
        ...data,
        status: 'NEW',
        userId: data.userId ? Number(data.userId) : undefined,
        leadId: data.leadId ? Number(data.leadId) : undefined,
        contactId: data.contactId ? Number(data.contactId) : undefined,
      });
    }
  });

  const getFilteredItems = (type: string) => {
    const q = searchTerm.toLowerCase();
    switch (type) {
      case 'lead':
        return leads?.filter((l: any) => (l.name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q)) || [];
      case 'contact':
        return contacts?.filter((c: any) => (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)) || [];
      case 'user':
        return users?.filter((u: any) => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)) || [];
      default:
        return [];
    }
  };

  const handleSelectItem = (type: string, item: any) => {
    const fieldName = type === 'user' ? 'userId' : `${type}Id`;
    setValues((prev: any) => ({
      ...prev,
      [fieldName]: item.id.toString()
    }));
    setSelectedNames((prev: Record<string, string>) => ({
      ...prev,
      [type]: item.name || item.title || `ID: ${item.id}`
    }));
    setActiveSelector(null);
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Create New Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Ticket Title"
            name="title"
            error={errors.title}
            touched={touched.title}
            icon={AlertCircle}
            required
          >
            <input
              placeholder="e.g. Broken links on homepage"
              value={values.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
            />
          </FormField>

          <FormField
            label="Description"
            name="description"
            error={errors.description}
            touched={touched.description}
          >
            <textarea
              placeholder="Provide more details about the issue..."
              rows={4}
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className="resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Priority"
              name="priority"
              icon={Tag}
            >
              <select
                value={values.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </FormField>

            <FormField
              label="Assigned User"
              name="userId"
              error={errors.userId}
              touched={touched.userId}
              icon={User}
              required
            >
              <div className="relative">
                <div
                  className={`w-full px-4 py-2 bg-gray-50 border rounded-xl cursor-pointer transition-all ${touched.userId && errors.userId ? 'border-red-500' : 'border-gray-200'}`}
                  onClick={() => setActiveSelector(activeSelector === 'user' ? null : 'user')}
                >
                  <span className={selectedNames.user ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedNames.user || 'Select user...'}
                  </span>
                </div>
                
                {activeSelector === 'user' && (
                  <div className="absolute top-full left-0 right-0 mt-2 border border-gray-100 rounded-xl shadow-xl bg-white z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input
                        type="text"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..."
                        className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-sm bg-gray-50 focus:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="py-1">
                      {getFilteredItems('user').length > 0 ? (
                        getFilteredItems('user').map((u: any) => (
                          <div
                            key={u.id}
                            onClick={() => handleSelectItem('user', u)}
                            className="p-3 hover:bg-emerald-50 border-b border-emerald-50 last:border-0 transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-semibold">
                              {u.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{u.name}</p>
                              <p className="text-xs text-gray-500 truncate">{u.role}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400 italic">No users found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Associated Lead"
              name="leadId"
              error={errors.leadId}
              touched={touched.leadId}
              icon={Briefcase}
              required
            >
              <div className="relative">
                <div
                  className={`w-full px-4 py-2 bg-gray-50 border rounded-xl cursor-pointer transition-all ${touched.leadId && errors.leadId ? 'border-red-500' : 'border-gray-200'}`}
                  onClick={() => setActiveSelector(activeSelector === 'lead' ? null : 'lead')}
                >
                  <span className={selectedNames.lead ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedNames.lead || 'Select lead...'}
                  </span>
                </div>
                
                {activeSelector === 'lead' && (
                  <div className="absolute top-full left-0 right-0 mt-2 border border-gray-100 rounded-xl shadow-xl bg-white z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input
                        type="text"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search leads..."
                        className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-sm bg-gray-50 focus:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="py-1">
                      {getFilteredItems('lead').length > 0 ? (
                        getFilteredItems('lead').map((l: any) => (
                          <div
                            key={l.id}
                            onClick={() => handleSelectItem('lead', l)}
                            className="p-3 hover:bg-emerald-50 border-b border-emerald-50 last:border-0 transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-semibold">
                              {l.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{l.name}</p>
                              <p className="text-xs text-gray-500 truncate">{l.email}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400 italic">No leads found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormField>

            <FormField
              label="Associated Contact (Optional)"
              name="contactId"
              error={errors.contactId}
              touched={touched.contactId}
              icon={Building2}
            >
              <div className="relative">
                <div
                  className={`w-full px-4 py-2 bg-gray-50 border rounded-xl cursor-pointer transition-all border-gray-200`}
                  onClick={() => setActiveSelector(activeSelector === 'contact' ? null : 'contact')}
                >
                  <span className={selectedNames.contact ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedNames.contact || 'Select contact...'}
                  </span>
                </div>
                
                {activeSelector === 'contact' && (
                  <div className="absolute top-full left-0 right-0 mt-2 border border-gray-100 rounded-xl shadow-xl bg-white z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input
                        type="text"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search contacts..."
                        className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-sm bg-gray-50 focus:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="py-1">
                      {getFilteredItems('contact').length > 0 ? (
                        getFilteredItems('contact').map((c: any) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectItem('contact', c)}
                            className="p-3 hover:bg-emerald-50 border-b border-emerald-50 last:border-0 transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-semibold">
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{c.name}</p>
                              <p className="text-xs text-gray-500 truncate">{c.email}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400 italic">No contacts found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormField>
          </div>

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
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 font-semibold text-sm"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}