export default function BetaWarningModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a0033] border border-purple-700/20 rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <h2 className="text-yellow-300 font-mono text-xl tracking-wider">
            [BETA_WARNING]
          </h2>
        </div>
        
        <p className="text-purple-200 mb-6">
          This experimental laboratory is currently in beta testing phase. Visual anomalies and unexpected behavior may occur during the observation, please if you notice any issues, refresh the page.
        </p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-700/20 hover:bg-purple-700/40 
                     text-purple-300 rounded border border-purple-700/40
                     transition-colors font-mono"
          >
            [ACKNOWLEDGE]
          </button>
        </div>
      </div>
    </div>
  );
} 