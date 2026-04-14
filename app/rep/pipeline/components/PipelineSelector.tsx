'use client';
import { useState } from 'react';
import { Star, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';

export default function PipelineSelector({ pipelines, selected, onSelect, onCreate, onEdit, onDelete }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleMenuClick = (e: React.MouseEvent, pipeline: any) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    setMenuOpen(true);
    // Stocker temporairement le pipeline sélectionné pour le menu
    onSelect(pipeline.id);
  };

  return (
    <div className="bg-white rounded-xl border p-2 mb-4 relative">
      <div className="flex items-center gap-2 overflow-x-auto">
        {pipelines.map((p: any) => (
          <div key={p.id} className="relative group flex-shrink-0">
            <button
              onClick={() => onSelect(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${selected === p.id
                  ? `bg-${p.color}-50 text-${p.color}-700 border-2 border-${p.color}-200`
                  : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                }`}
            >
              {p.favorite && <Star size={14} className="text-yellow-400 fill-current" />}
              {p.name}
              <span className="text-xs text-gray-400 ml-1">({p.dealsCount})</span>
            </button>

            {/* Bouton menu */}
            {selected === p.id && (
              <button
                onClick={(e) => handleMenuClick(e, p)}
                className="absolute -right-2 -top-2 p-1 bg-white border border-emerald-200 rounded-full shadow-md hover:bg-gray-50 text-emerald-600 transition"
              >
                <MoreHorizontal size={14} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={onCreate}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Menu contextuel */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48"
            style={{
              top: menuPosition.top,
              left: menuPosition.left
            }}
          >
            {pipelines.filter((p: any) => p.id === selected).map((pipeline: any) => (
              <div key={pipeline.id}>
                <button
                  onClick={() => {
                    onEdit(pipeline);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(pipeline);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}