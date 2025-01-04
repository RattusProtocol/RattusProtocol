export default function StatusPanel({ analysisData }) {
  const formatMarketCap = (value) => {
    const marketCapValue = value > 0 ? value : analysisData?.market?.marketCap;
    
    if (!marketCapValue || marketCapValue <= 0) {
      return '--';
    }
    
    if (marketCapValue >= 1_000_000_000) {
      return `${(marketCapValue / 1_000_000_000).toFixed(2)}B`;
    } else if (marketCapValue >= 1_000_000) {
      return `${(marketCapValue / 1_000_000).toFixed(2)}M`;
    } else if (marketCapValue >= 1_000) {
      return `${(marketCapValue / 1_000).toFixed(2)}K`;
    }
    return marketCapValue.toFixed(2);
  };

  return (
    <div className="bg-[#1a0033]/80 p-6 rounded-lg border border-purple-700/20 
                  shadow-[0_0_30px_rgba(88,28,135,0.2),inset_0_0_20px_rgba(88,28,135,0.2)]">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-1 bg-purple-700" />
        <h2 className="text-xl text-purple-400 font-mono tracking-wider">[ANALYSIS_STATUS]</h2>
      </div>

      <div className="space-y-6">
        {/* Market Analysis */}
        <div className="space-y-2">
          <div className="text-sm text-purple-500 font-mono">[MARKET_METRICS]</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">MARKET_CAP</div>
              <div className="text-purple-300 font-mono">
                ${formatMarketCap(analysisData?.market?.marketCap)}
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">LAST_UPDATE</div>
              <div className="text-purple-300 font-mono">
                {analysisData?.market?.lastUpdate ? new Date(analysisData.market.lastUpdate).toLocaleTimeString() : '--:--:--'}
              </div>
            </div>
          </div>
        </div>

        {/* Compound Analysis */}
        <div className="space-y-2">
          <div className="text-sm text-purple-500 font-mono">[COMPOUND_METRICS]</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">KINETICS</div>
              <div className="text-purple-300 font-mono">
                {analysisData.compound.reactionKinetics.toFixed(3)} k/s
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">STABILITY</div>
              <div className="text-purple-300 font-mono">
                {(analysisData.compound.molecularStability * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Genetic Analysis */}
        <div className="space-y-2">
          <div className="text-sm text-purple-500 font-mono">[GENETIC_METRICS]</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">DNA_STABILITY</div>
              <div className="text-purple-300 font-mono">
                {(analysisData.genetic.dnaStability * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">MUTATION_RATE</div>
              <div className="text-purple-300 font-mono">
                {analysisData.genetic.mutationRate.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Analysis */}
        <div className="space-y-2">
          <div className="text-sm text-purple-500 font-mono">[QUANTUM_METRICS]</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">COHERENCE</div>
              <div className="text-purple-300 font-mono">
                {analysisData.quantum.coherenceTime.toFixed(1)} μs
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">ENTANGLEMENT</div>
              <div className="text-purple-300 font-mono">
                {(analysisData.quantum.entanglementStrength * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Behavioral Analysis */}
        <div className="space-y-2">
          <div className="text-sm text-purple-500 font-mono">[BEHAVIORAL_METRICS]</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">NEURAL_ACTIVITY</div>
              <div className="text-purple-300 font-mono">
                {analysisData.behavioral.neuralActivity.toFixed(1)} Hz
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-purple-700/20">
              <div className="text-purple-400/70 text-xs mb-1">LEARNING_RATE</div>
              <div className="text-purple-300 font-mono">
                {analysisData.behavioral.learningRate.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}