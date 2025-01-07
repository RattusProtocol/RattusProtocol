'use client'
import { useState, useEffect } from 'react';
import { COMPOUNDS, Rat } from '../types/types';
import RatPreviewCanvas from './RatPreviewCanvas';
import useWagerStore from '../utils/wagerStore';
import WalletWagers from './WalletWagers';
import Header from './Header';

export default function TournamentBracket() {
  const [activeRats, setActiveRats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [totalWagered, setTotalWagered] = useState(0);
  const [resultsTimeLeft, setResultsTimeLeft] = useState('');
  
  const getRatWagers = useWagerStore(state => state.getRatWagers);
  const getTotalWagered = useWagerStore(state => state.getTotalWagered);

  // Add countdown timer for results
  useEffect(() => {
    const resultsTimestamp = Number(process.env.NEXT_PUBLIC_BATTLE_TIMESTAMP) + (5 * 60 * 1000); // Add 5 minutes
    
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = resultsTimestamp - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setResultsTimeLeft('RESULTS READY');
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setResultsTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = useWagerStore.subscribe(
      (state) => {
        setTotalWagered(state.totalWagered);
      }
    );
    
    setTotalWagered(useWagerStore.getState().totalWagered);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load active rats
    const rats = Object.keys(COMPOUNDS)
      .filter(compound => ['SUPER_SOLDIER_SERUM', 'COMPOUND_V', 'VENOM_SYMBIOTE', 
                          'TITAN_SERUM', 'POLYJUICE_POTION', 'LIZARD_SERUM', 
                          'THE_GRASSES'].includes(compound))
      .map((compound, i) => {
        const rat = new Rat(i);
        rat.compound = compound;
        rat.active = true;
        return rat;
      });
    setActiveRats(rats);

    // Generate only quarter-final matches
    const quarterFinals = [];
    for (let i = 0; i < Math.min(rats.length, 8); i += 2) {
      quarterFinals.push({
        round: 'quarter',
        id: quarterFinals.length,
        rat1: rats[i],
        rat2: rats[i + 1] || null,
        winner: null
      });
    }

    setMatches(quarterFinals);
  }, []);

  const MatchBox = ({ match }) => (
    <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 p-4 w-[300px]
                    shadow-[0_0_30px_rgba(88,28,135,0.2)]">
      <div className="text-purple-400 text-sm mb-3 font-mono">FIGHT_{match.id + 1}</div>
      
      {/* Rat 1 */}
      <div className="mb-4">
        {match.rat1 ? (
          <div className="space-y-2">
            <div className="bg-black/40 p-2 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-xs mb-1">RAT PREVIEW</div>
              <div className="aspect-square w-full bg-black/40 rounded-lg border border-purple-700/20 p-2">
                <RatPreviewCanvas rat={match.rat1} />
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded border border-purple-700/20">
              <div className="text-purple-300 font-mono">RAT_{match.rat1.id + 1}</div>
              <div className="text-purple-400 text-sm">{COMPOUNDS[match.rat1.compound]?.name}</div>
            </div>
            <div className="text-center text-purple-500 text-sm font-mono bg-black/40 p-2 rounded border border-purple-700/20">
              WAGERED: {getRatWagers(match.rat1.id)} $RAT
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-purple-500 font-mono">WINNER FROM FIGHT_3</div>
        )}
      </div>

      {/* VS Divider */}
      <div className="text-red-500 text-center my-4 font-mono font-bold">VS</div>

      {/* Rat 2 */}
      <div>
        {match.rat2 ? (
          <div className="space-y-2">
            <div className="bg-black/40 p-2 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-xs mb-1">RAT PREVIEW</div>
              <div className="aspect-square w-full bg-black/40 rounded-lg border border-purple-700/20 p-2">
                <RatPreviewCanvas rat={match.rat2} />
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded border border-purple-700/20">
              <div className="text-purple-300 font-mono">RAT_{match.rat2.id + 1}</div>
              <div className="text-purple-400 text-sm">{COMPOUNDS[match.rat2.compound]?.name}</div>
            </div>
            <div className="text-center text-purple-500 text-sm font-mono bg-black/40 p-2 rounded border border-purple-700/20">
              WAGERED: {getRatWagers(match.rat2.id)} $RAT
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-purple-500 font-mono">WINNER FROM FIGHT_3</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid-background relative bg-[#1a0033]/80">
      <Header />
      <div className="">
        <div className="mx-auto space-y-4">
          {/* Tournament Section */}
          <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 
                        shadow-[0_0_30px_rgba(88,28,135,0.2)]">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-700/20">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              <h2 className="text-purple-300 font-mono text-xl tracking-wider">
                [TOURNAMENT_BRACKET]
              </h2>
            </div>

            <div className="p-6">
              {/* Results Timer */}
              <div className="bg-[#1a0033]/80 rounded-lg border border-red-700/20 p-4 mb-8
                            shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <div className="text-center">
                  <h2 className="text-2xl font-mono text-red-400 mb-2">ROUND RESULTS IN</h2>
                  <div className="text-4xl font-bold text-red-500 animate-pulse">{resultsTimeLeft}</div>
                </div>
              </div>

              {/* Total Wagered */}
              <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 p-4 mb-8
                            shadow-[0_0_30px_rgba(88,28,135,0.2)]">
                <div className="text-center">
                  <h2 className="text-xl font-mono text-purple-400 mb-2">TOTAL WAGERED</h2>
                  <div className="text-3xl font-bold text-purple-500">{totalWagered} $RAT</div>
                </div>
              </div>

              {/* Tournament Matches */}
              <div className="space-y-8">
                {[0, 2].map((startIdx) => (
                  <div key={startIdx} className="flex justify-around gap-8">
                    {matches.slice(startIdx, startIdx + 2).map((match) => (
                      <MatchBox key={match.id} match={match} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 