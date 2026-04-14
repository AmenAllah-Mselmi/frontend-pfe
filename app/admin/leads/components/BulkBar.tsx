interface BulkBarProps {
  count: number;
  onClear: () => void;
}

export default function BulkBar({ count, onClear }: BulkBarProps) {
  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md bg-opacity-95 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
              {count}
            </span>
            <span className="text-sm font-medium hidden sm:inline text-gray-300">leads sélectionnés</span>
            <span className="text-sm font-medium sm:hidden text-gray-300">Sélect.</span>
          </div>
          
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <select className="flex-1 min-w-[100px] bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option className="bg-gray-900">Assigner à...</option>
              <option className="bg-gray-900">Alex Morgan</option>
              <option className="bg-gray-900">Jordan Lee</option>
              <option className="bg-gray-900">Taylor Swift</option>
            </select>
            
            <select className="flex-1 min-w-[120px] bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option className="bg-gray-900">Changer étape...</option>
              <option className="bg-gray-900">Discovery</option>
              <option className="bg-gray-900">Proposal</option>
              <option className="bg-gray-900">Negotiation</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition font-medium">
              Supprimer
            </button>
            <div className="h-4 w-px bg-white/10" />
            <button 
              onClick={onClear}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}