'use client';
import {
  X, Mail, Phone, Calendar, TrendingUp, DollarSign,
  Target, Star, Award, Globe, Users, Briefcase, Edit,
  MessageSquare, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

export default function RepresentativeDetailsModal({ representative, onClose, onEdit }: any) {
  const getQuotaColor = (attainment: number) => {
    if (attainment >= 100) return 'text-green-600';
    if (attainment >= 80) return 'text-blue-600';
    if (attainment >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(representative.name || 'U')[0].toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{representative.name}</h2>
                <p className="text-gray-500">{representative.role || 'REP'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-700`}>
                    Active
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    N/A
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(representative)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit size={18} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500 mt-1">+12 this quarter</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <p className="text-xs text-green-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">0.0M€</p>
              <p className="text-xs text-gray-500 mt-1">+15.3% vs target</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
              <p className="text-xs text-gray-500 mt-1">+5.2% vs team avg</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <p className="text-xs text-orange-600 mb-1">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">0€</p>
              <p className="text-xs text-gray-500 mt-1">+8% vs last month</p>
            </div>
          </div>

          {/* Quota Progress */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Quota Attainment</h3>
              <span className={`text-2xl font-bold ${getQuotaColor(0)}`}>
                0%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full bg-red-500`}
                style={{ width: `0%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress: 0.0M€ / 0.0M€</span>
              <span className="text-gray-500">0% achieved</span>
            </div>
          </div>

          {/* Contact & Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Contact Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{representative.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">N/A</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Joined: {representative.createdAt ? new Date(representative.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-600">Last active: N/A</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Skills & Languages</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {['Sales', 'Negotiation'].map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'French'].map((lang: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={12} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Closed deal: Stark Industries - 250K€</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare size={12} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Meeting with prospect: Oscorp</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={12} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Quota update: 90% achieved</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}