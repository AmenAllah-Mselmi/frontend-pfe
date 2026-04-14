'use client';
import {
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useState } from 'react';

export default function RepresentativesGrid({ representatives, onViewDetails, onEdit, onDelete }: any) {
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Active': 'bg-green-100 text-green-700',
      'Probation': 'bg-yellow-100 text-yellow-700',
      'Inactive': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getQuotaColor = (attainment: number) => {
    if (attainment >= 100) return 'text-green-600';
    if (attainment >= 80) return 'text-blue-600';
    if (attainment >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {representatives.map((rep: any) => (
        <div
          key={rep.id}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group relative"
          onClick={() => onViewDetails(rep)}
        >
          {/* Header with Avatar */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {(rep.name || 'U')[0].toUpperCase()}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{rep.name}</h3>
                <p className="text-sm text-gray-500">{rep.role}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor('Active')}`}>
                  Active
                </span>
              </div>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === rep.id ? null : rep.id);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                <MoreHorizontal size={18} className="text-gray-500" />
              </button>

              {menuOpen === rep.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(rep);
                        setMenuOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(rep);
                        setMenuOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Team & Region */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              N/A
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              N/A
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4 text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <Mail size={14} className="text-gray-400" /> {rep.email}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="text-gray-400" /> N/A
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} className="text-gray-400" /> Joined {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Deals</p>
              <p className="text-lg font-bold text-gray-900">0</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Revenue</p>
              <p className="text-lg font-bold text-gray-900">0M</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Conv.</p>
              <p className="text-lg font-bold text-gray-900">0%</p>
            </div>
          </div>

          {/* Quota Progress */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-500">Quota Attainment</span>
              <span className={`font-bold ${getQuotaColor(0)}`}>
                0%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-red-500`}
                style={{ width: `0%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}