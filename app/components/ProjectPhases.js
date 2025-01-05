'use client'
import { useState } from 'react';

export default function ProjectPhases() {
  const [activePhase, setActivePhase] = useState(1);

  const phases = [
    {
      number: 1,
      name: "INITIAL_EXPERIMENTATION",
      status: "ACTIVE",
      description: "Current phase focusing on compound testing and rat mutations",
      features: [
        "7 Active Compounds",
        "Real-time Market Analysis",
        "Mutation Tracking",
        "Ability Unlocks"
      ]
    },
    {
      number: 2,
      name: "BATTLE_ARENA",
      status: "PENDING",
      description: "Enhanced rats enter life-or-death arena battles",
      features: [
        "Champion Selection",
        "Wagering System",
        "Prize Pool Distribution",
      ]
    },
    {
      number: 3,
      name: "EVOLUTION_EXPANSION",
      status: "PLANNED",
      description: "Advanced mutations and compound combinations",
      features: [
        "New Compounds",
        "Cross-Mutations",
        "Enhanced Abilities",
        "Community Governance"
      ]
    }
  ];

  return (
    <div className="bg-[#1a0033]/80 p-6 rounded-lg border border-purple-700/20 
                    shadow-[0_0_30px_rgba(88,28,135,0.2),inset_0_0_20px_rgba(88,28,135,0.2)]">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-1 bg-purple-700" />
        <h2 className="text-xl text-purple-400 font-mono tracking-wider">[PROJECT_PHASES]</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((phase) => (
          <div
            key={phase.number}
            className={`p-4 rounded-lg border ${
              phase.status === 'ACTIVE'
                ? 'border-green-500/30 bg-green-900/20'
                : 'border-purple-700/20 bg-black/40'
            } cursor-pointer transition-all hover:border-purple-700/50`}
            onClick={() => setActivePhase(phase.number)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-purple-400 font-mono">PHASE_{phase.number}</div>
              <div className={`text-xs font-mono px-2 py-1 rounded ${
                phase.status === 'ACTIVE'
                  ? 'bg-green-900/40 text-green-400'
                  : 'bg-purple-900/40 text-purple-400'
              }`}>
                [{phase.status}]
              </div>
            </div>
            
            <div className="text-purple-300 font-mono mb-3">{phase.name}</div>
            
            <div className="text-purple-400/70 text-sm mb-3">{phase.description}</div>
            
            <div className="space-y-1">
              {phase.features.map((feature, index) => (
                <div key={index} className="text-purple-400/60 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple-500/50" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 