'use client';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
  accentColor?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  accentColor = 'blue'
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const colorMap: Record<string, { active: string; hover: string; ring: string; text: string }> = {
    blue: { active: 'bg-blue-600 text-white shadow-md shadow-blue-200', hover: 'hover:bg-blue-50 hover:text-blue-700', ring: 'focus:ring-blue-500/30', text: 'text-blue-600' },
    emerald: { active: 'bg-emerald-600 text-white shadow-md shadow-emerald-200', hover: 'hover:bg-emerald-50 hover:text-emerald-700', ring: 'focus:ring-emerald-500/30', text: 'text-emerald-600' },
    indigo: { active: 'bg-indigo-600 text-white shadow-md shadow-indigo-200', hover: 'hover:bg-indigo-50 hover:text-indigo-700', ring: 'focus:ring-indigo-500/30', text: 'text-indigo-600' },
    green: { active: 'bg-green-600 text-white shadow-md shadow-green-200', hover: 'hover:bg-green-50 hover:text-green-700', ring: 'focus:ring-green-500/30', text: 'text-green-600' },
  };
  const c = colorMap[accentColor] || colorMap.blue;

  if (totalItems <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t bg-gray-50/50">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          Showing <span className={`font-semibold ${c.text}`}>{startItem}</span>–<span className={`font-semibold ${c.text}`}>{endItem}</span> of <span className="font-semibold text-gray-700">{totalItems}</span>
        </span>
        {onItemsPerPageChange && (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className={`px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 ${c.ring} cursor-pointer`}
          >
            {[5, 10, 15, 20, 25, 50].map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}
          className={`p-1.5 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${c.hover}`}>
          <ChevronsLeft size={16} />
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          className={`p-1.5 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${c.hover}`}>
          <ChevronLeft size={16} />
        </button>
        {getVisiblePages().map((page, idx) =>
          typeof page === 'string' ? (
            <span key={`dots-${idx}`} className="px-1 text-gray-400 text-xs">•••</span>
          ) : (
            <button key={page} onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page ? c.active : `text-gray-600 ${c.hover}`}`}>
              {page}
            </button>
          )
        )}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className={`p-1.5 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${c.hover}`}>
          <ChevronRight size={16} />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}
          className={`p-1.5 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${c.hover}`}>
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
