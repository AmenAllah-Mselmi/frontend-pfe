import React from 'react';
import { Edit, Trash2, X, User, Mail, Phone, MessageSquare } from 'lucide-react';

// Deal Detail Modal (adaptatif)
export default function DealDetailModal({ deal, onClose, onEdit, onDelete }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {deal.companyShort?.charAt(0) || 'D'}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-gray-900 truncate">{deal.name}</h2>
                <p className="text-sm text-gray-500 truncate">{deal.company?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200/50 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Valueur du Deal</p>
              <p className="text-xl font-bold text-gray-900 truncate">{(deal.value || 0).toLocaleString()}€</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200/50 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-indigo-600 mb-1">Probabilité</p>
              <p className="text-xl font-bold text-gray-900">{deal.probability || 0}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200/50 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-orange-600 mb-1">Statut</p>
              <p className="text-xl font-bold text-gray-900 capitalize truncate">{deal.status}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{deal.contact.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{deal.contact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{deal.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Reste du contenu identique... */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Étape</h3>
              <span className="inline-flex px-3 py-1.5 text-sm font-bold rounded-xl bg-blue-100 text-blue-700 border border-blue-200 shadow-sm truncate max-w-full">
                {deal.stage}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Prochaine Action</h3>
              <p className="text-sm text-gray-700 font-medium truncate">{deal.nextAction}</p>
              {deal.nextActionDate && (
                <p className="text-xs text-gray-400 mt-1 font-medium italic">Échéance: {deal.nextActionDate}</p>
              )}
            </div>
          </div>

          {deal.expectedCloseDate && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Expected Close Date</h3>
              <p className="text-sm text-gray-600">{deal.expectedCloseDate}</p>
            </div>
          )}

          {deal.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {deal.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                  {deal.owner.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{deal.owner.name}</p>
                  <p className="text-xs text-gray-500 truncate">{deal.owner.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MessageSquare size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Phone size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

