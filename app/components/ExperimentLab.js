'use client'
import { useState, useEffect, useRef } from 'react';
import { COMPOUNDS, Rat } from '../types/types';
import RatCanvas from './RatCanvas';
import AnalysisButtons from './AnalysisButtons';
import RatList from './RatList';
import StatusPanel from './StatusPanel';
import { useMarketCap } from '../hooks/useMarketCap';
import ProjectPhases from './ProjectPhases';
import BetaWarningModal from './BetaWarningModal';

const SIMULATED_MARKET_CAP = {
  value: 1000000000,
  lastUpdate: Date.now()
};

export default function ExperimentLab() {
  const [rats, setRats] = useState([]);
  const [analysisData, setAnalysisData] = useState({
    compound: {
      reactionKinetics: 0,
      molecularStability: 0,
      bindingAffinity: 0
    },
    genetic: {
      mutationRate: 0,
      dnaStability: 0,
      geneExpression: 0
    },
    quantum: {
      coherenceTime: 0,
      entanglementStrength: 0,
      waveFunction: 0
    },
    behavioral: {
      synapticDensity: 0,
      neuralActivity: 0,
      learningRate: 0
    },
    market: {
      marketCap: 0,
      lastUpdate: Date.now()
    }
  });

  const { marketCap, isLoading, highestMarketCap } = useMarketCap();
  const prevMarketCapRef = useRef(0);
  const [showBetaWarning, setShowBetaWarning] = useState(true);

  // Initialize rats with compounds
  useEffect(() => {
    const compounds = Object.keys(COMPOUNDS);
    const initialRats = compounds.map((compound, i) => {
      const rat = new Rat(i);
      rat.compound = compound;
      // Set only certain compounds as active initially
      rat.active = ['SUPER_SOLDIER_SERUM', 'COMPOUND_V', 'VENOM_SYMBIOTE', 'TITAN_SERUM', 'POLYJUICE_POTION', 'LIZARD_SERUM', 'THE_GRASSES'].includes(compound);
      return rat;
    });
    setRats(initialRats);
  }, []);

  // Simulate analysis data updates - but preserve market cap
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setAnalysisData(prev => ({
        ...prev,
        compound: {
          reactionKinetics: oscillateValue(prev.compound.reactionKinetics, 0.8, 1.2),
          molecularStability: oscillateValue(prev.compound.molecularStability, 0.7, 1.0),
          bindingAffinity: oscillateValue(prev.compound.bindingAffinity, 0.5, 0.9)
        },
        genetic: {
          mutationRate: oscillateValue(prev.genetic.mutationRate, 0.001, 0.005),
          dnaStability: oscillateValue(prev.genetic.dnaStability, 0.85, 0.98),
          geneExpression: oscillateValue(prev.genetic.geneExpression, 0.6, 1.0)
        },
        quantum: {
          coherenceTime: oscillateValue(prev.quantum.coherenceTime, 20, 50),
          entanglementStrength: oscillateValue(prev.quantum.entanglementStrength, 0.7, 0.95),
          waveFunction: oscillateValue(prev.quantum.waveFunction, 0.3, 0.8)
        },
        behavioral: {
          synapticDensity: oscillateValue(prev.behavioral.synapticDensity, 0.4, 0.9),
          neuralActivity: oscillateValue(prev.behavioral.neuralActivity, 10, 30),
          learningRate: oscillateValue(prev.behavioral.learningRate, 0.001, 0.01)
        },
        // Preserve market data
        market: prev.market
      }));
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // Handle market cap updates separately
  useEffect(() => {
    if (!isLoading) {
      const validMarketCap = marketCap > 0 ? marketCap : prevMarketCapRef.current;

      if (validMarketCap > 0) {
        prevMarketCapRef.current = validMarketCap;

        setAnalysisData(prev => ({
          ...prev,
          market: {
            marketCap: validMarketCap,
            lastUpdate: Date.now()
          }
        }));

        setRats(prev => {
          const updatedRats = prev.map(rat => {
            const updatedRat = Rat.fromState(rat, {
              marketCap: validMarketCap,
              highestMarketCap: highestMarketCap
            });
            updatedRat.update(prev);
            return updatedRat;
          });
          return updatedRats;
        });
      }
    }
  }, [marketCap, highestMarketCap, isLoading]);

  // Helper function for smooth value oscillation
  const oscillateValue = (current, min, max) => {
    const range = max - min;
    const step = range * 0.1;
    const newValue = current + (Math.random() - 0.5) * step;
    return Math.max(min, Math.min(max, newValue));
  };

  // Add this effect to show the modal on component mount
  useEffect(() => {
    setShowBetaWarning(true);
  }, []);

  return (
    <div className="min-h-screen grid-background relative p-4 md:p-6 lg:p-8">
      <BetaWarningModal 
        isOpen={showBetaWarning} 
        onClose={() => setShowBetaWarning(false)} 
      />
      <div className="max-w-[98%] mx-auto p-3 space-y-4">
        {/* Analysis Tools Section */}
        <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 
                      shadow-[0_0_30px_rgba(88,28,135,0.2)]">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-700/20">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            <h2 className="text-purple-300 font-mono text-xl tracking-wider">
              [ANALYSIS_TOOLS]
            </h2>
          </div>
          <AnalysisButtons />
          <RatList rats={rats} />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RatCanvas rats={rats.filter(rat => rat.active)} />
          </div>
          <div className="space-y-4">
            <StatusPanel analysisData={analysisData} />
          </div>
        </div>

        {/* Project Phases Section */}
        <ProjectPhases />
      </div>
    </div>
  );
} 