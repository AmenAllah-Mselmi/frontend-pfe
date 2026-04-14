'use client';
import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, GripVertical, DollarSign, Calendar } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  WON: 'Won',
  LOST: 'Lost',
  CLOSED: 'Closed',
  ON_HOLD: 'On Hold',
};

const stageColors: Record<string, { bg: string; dot: string; dragOver: string }> = {
  PENDING: { bg: 'bg-gray-50', dot: 'bg-gray-500', dragOver: 'ring-2 ring-gray-400 bg-gray-100' },
  ACTIVE: { bg: 'bg-blue-50', dot: 'bg-blue-500', dragOver: 'ring-2 ring-blue-400 bg-blue-100' },
  WON: { bg: 'bg-green-50', dot: 'bg-green-500', dragOver: 'ring-2 ring-green-400 bg-green-100' },
  LOST: { bg: 'bg-red-50', dot: 'bg-red-500', dragOver: 'ring-2 ring-red-400 bg-red-100' },
  CLOSED: { bg: 'bg-blue-50', dot: 'bg-blue-600', dragOver: 'ring-2 ring-blue-400 bg-blue-100' },
  ON_HOLD: { bg: 'bg-orange-50', dot: 'bg-orange-500', dragOver: 'ring-2 ring-orange-400 bg-orange-100' },
};

const getProbabilityColor = (prob: number) => {
  if (prob >= 70) return 'bg-green-100 text-green-700';
  if (prob >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

interface Stage {
  id: string;
  name: string;
  color: string;
  deals: any[];
}

interface PipelineBoardProps {
  stages: Stage[];
  onDragEnd: (dealId: number, sourceStage: string, targetStage: string) => void;
  onEdit: (deal: any) => void;
  onDelete: (deal: any) => void;
}

export default function PipelineBoard({ stages, onDragEnd, onEdit, onDelete }: PipelineBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<any>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, deal: any) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageName: string) => {
    e.preventDefault();
    setDragOverStage(stageName);
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.status !== targetStage) {
      onDragEnd(draggedDeal.id, draggedDeal.status, targetStage);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  return (
    <div ref={containerRef} className="w-full overflow-x-auto pb-4" style={{ minHeight: '600px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4" style={{ minWidth: 'min(100%, 900px)' }}>
        {stages.map((stage) => {
          const colors = stageColors[stage.name] || { bg: 'bg-gray-50', dot: 'bg-gray-500', dragOver: 'ring-2 ring-gray-400 bg-gray-100' };
          const isDragOver = dragOverStage === stage.name;
          const stageTotal = stage.deals.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

          return (
            <div
              key={stage.id}
              className={`transition-all duration-200 rounded-xl ${isDragOver ? colors.dragOver : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.name)}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{STATUS_LABELS[stage.name] || stage.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{stage.deals.length}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stageTotal.toLocaleString()}€</span>
              </div>

              {/* Deals */}
              <div className={`${colors.bg} rounded-xl p-3 min-h-[500px] space-y-3`}>
                {stage.deals.map((deal: any) => (
                  <div
                    key={deal.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative ${draggedDeal?.id === deal.id ? 'opacity-50 scale-95' : ''
                      }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                      <GripVertical size={16} className="text-gray-400" />
                    </div>

                    <div className="ml-5">
                      <h4 className="font-semibold text-gray-900 truncate mb-1">{deal.name}</h4>

                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1 text-lg font-bold text-gray-900">
                          <DollarSign size={14} className="text-gray-400" />
                          {(deal.amount || 0).toLocaleString()}€
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getProbabilityColor(deal.probability || 0)}`}>
                          {deal.probability || 0}%
                        </span>
                      </div>

                      {deal.expectedCloseDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                          <Calendar size={11} />
                          {new Date(deal.expectedCloseDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${deal.probability || 0}%` }} />
                      </div>

                      <div className="flex items-center justify-end gap-1 mt-4 border-t pt-3">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(deal); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-600 text-xs font-bold transition">
                          <Edit size={14} /> Modifier
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(deal); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 text-xs font-bold transition">
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {stage.deals.length === 0 && (
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center ${isDragOver ? 'border-blue-400 bg-white' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-400">No deals</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
