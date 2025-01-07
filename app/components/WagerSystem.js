'use client'
import { useState, useEffect, useRef } from 'react';
import { COMPOUNDS, Rat } from '../types/types';
import RatCanvas from './RatCanvas';
import { toast } from 'react-hot-toast';
import RatPreviewCanvas from './RatPreviewCanvas';
import CompoundPreviewCanvas from './CompoundPreviewCanvas';
import { ABILITY_TARGETS } from '../constants/abilities';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { transferTokens } from '../utils/tokenTransfer';
import useWagerStore from '../utils/wagerStore';
import WalletWagers from './WalletWagers';
import { useRouter } from 'next/navigation';

// Helper function from RatList
const safeFormat = (value, decimals = 1) => {
  return typeof value === 'number' ? value.toFixed(decimals) : '0';
};

const CompoundAbilities = ({ compound, activeRat }) => {
  const hasAbilities = ABILITY_TARGETS[compound];
  
  return (
    <div className="mt-2">
      <div className="text-purple-500 text-sm mb-1">ABILITIES:</div>
      <div className="pl-2">
        {hasAbilities ? (
          Object.entries(ABILITY_TARGETS[compound]).map(([key, ability]) => (
            <div key={key} className="text-purple-400">
              • {ability.name} {
                ability.target === 0 || activeRat?.unlockedAbilities?.[key === 'STRENGTH' ? 'venomStrength' : key.toLowerCase()]
              }
            </div>
          ))
        ) : (
          <div className="text-yellow-400">Coming in Phase 2</div>
        )}
      </div>
    </div>
  );
};

export default function WagerSystem({ battleTimestamp }) {
  const [activeRats, setActiveRats] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [wagerAmounts, setWagerAmounts] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalWagered, setTotalWagered] = useState(0);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const wallet = useWallet();
  const router = useRouter();

  const addWager = useWagerStore(state => state.addWager);
  const getWalletWagers = useWagerStore(state => state.getWalletWagers);
  const getRatWagers = useWagerStore(state => state.getRatWagers);
  const getWalletTotal = useWagerStore(state => state.getWalletTotal);
  const getTotalWagered = useWagerStore(state => state.getTotalWagered);

  // Add this effect to update total wagered
  useEffect(() => {
    const unsubscribe = useWagerStore.subscribe(
      (state) => {
        setTotalWagered(state.totalWagered);
      }
    );
    
    // Set initial value
    setTotalWagered(useWagerStore.getState().totalWagered);

    return () => unsubscribe();
  }, []);

  // Load active rats
  useEffect(() => {
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
    
    // Initialize wager amounts for each rat
    const initialWagerAmounts = {};
    rats.forEach(rat => {
      initialWagerAmounts[rat.id] = '';
    });
    setWagerAmounts(initialWagerAmounts);
  }, []);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = battleTimestamp - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('BATTLE STARTING');
        setIsBattleStarted(true);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [battleTimestamp]);

  const placeWager = async (ratId) => {
    if (!wallet.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = wagerAmounts[ratId];
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid wager amount');
      return;
    }

    setIsProcessing(true);
    try {
      const success = await transferTokens(
        wallet,
        process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
        process.env.NEXT_PUBLIC_HOUSE_WALLET_ADDRESS,
        Number(amount)
      );

      if (success) {
        addWager(wallet.publicKey.toString(), ratId, Number(amount));
        
        setWagerAmounts(prev => ({
          ...prev,
          [ratId]: ''
        }));
        toast.success(`Wager placed on RAT_${ratId + 1}`);
      }
    } catch (error) {
      toast.error('Failed to place wager: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWagerAmountChange = (ratId, value) => {
    setWagerAmounts(prev => ({
      ...prev,
      [ratId]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-[#1a0033]/80 rounded-lg border border-red-700/20 p-4
                        shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <div className="text-center">
              <h2 className="text-2xl font-mono text-red-400 mb-2">BATTLE COUNTDOWN</h2>
              <div className="text-4xl font-bold text-red-500 animate-pulse mb-4">{timeLeft}</div>
              {isBattleStarted && (
                <button
                  onClick={() => router.push('/tournament')}
                  className="bg-red-600 hover:bg-red-700 text-white font-mono px-6 py-2 rounded-lg
                           border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]
                           transition-all duration-200"
                >
                  VIEW TOURNAMENT
                </button>
              )}
            </div>
          </div>
        </div>
        <WalletWagers />
      </div>

      {/* Total Wagered */}
      <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 p-4">
        <div className="text-center">
          <h2 className="text-xl font-mono text-purple-400 mb-2">TOTAL WAGERED</h2>
          <div className="text-3xl font-bold text-purple-500">{totalWagered} $RAT</div>
        </div>
      </div>

      {/* Rat Grid - Only show if battle hasn't started */}
      {!isBattleStarted && (
        <div className="grid grid-cols-2 gap-6">
          {activeRats.map(rat => (
            <div key={rat.id} className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 
                                       shadow-[0_0_30px_rgba(88,28,135,0.2)]">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-mono text-purple-400">RAT_{rat.id + 1}</h3>
                  <span className="text-purple-300">{COMPOUNDS[rat.compound]?.name || 'UNKNOWN'}</span>
                </div>
                
                {/* Preview Grid */}
                <div className="flex gap-4 mb-4">
                  {/* Stacked Previews */}
                  <div className="w-1/3 space-y-2">
                    {/* Rat Preview */}
                    <div className="bg-black/40 p-2 rounded-lg border border-purple-700/20">
                      <div className="text-purple-500 text-xs mb-1">RAT PREVIEW</div>
                      <div className="aspect-[3/2] bg-black/40 rounded-lg border border-purple-700/20 p-2">
                        <RatPreviewCanvas rat={rat} />
                      </div>
                    </div>
                    
                    {/* Compound Preview */}
                    <div className="bg-black/40 p-2 rounded-lg border border-purple-700/20">
                      <div className="text-purple-500 text-xs mb-1">COMPOUND</div>
                      <div className="aspect-[3/2] bg-black/40 rounded-lg border border-purple-700/20 p-2">
                        <CompoundPreviewCanvas compound={rat.compound} />
                      </div>
                    </div>
                  </div>

                  {/* Rat Details */}
                  <div className="w-2/3 space-y-4">
                    {/* Status Section */}
                    <div className="bg-black/40 p-3 rounded-lg border border-purple-700/20">
                      <div className="text-purple-500 text-sm mb-2">SUBJECT_STATUS</div>
                      <div className="text-purple-400 font-mono space-y-2">
                        <div>ID: {rat.id + 1}</div>
                        <div>Health: {safeFormat(rat.health * 100)}%</div>
                      </div>
                    </div>

                    {/* Compound Data Section */}
                    <div className="bg-black/40 p-3 rounded-lg border border-purple-700/20">
                      <div className="text-purple-500 text-sm mb-2">COMPOUND_DATA</div>
                      <div className="text-purple-400 font-mono space-y-2">
                        <div>Name: {rat.originalCompound === 'POLYJUICE_POTION' 
                          ? COMPOUNDS['POLYJUICE_POTION'].name 
                          : COMPOUNDS[rat.compound]?.name || 'UNKNOWN'}</div>
                        <div>Origin: {rat.originalCompound === 'POLYJUICE_POTION'
                          ? COMPOUNDS['POLYJUICE_POTION'].origin
                          : COMPOUNDS[rat.compound]?.origin || 'UNKNOWN'}</div>
                        <div className="pt-2 border-t border-purple-700/20">
                          <CompoundAbilities 
                            compound={rat.compound} 
                            activeRat={rat}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wager Controls */}
                <div className="flex items-center gap-4">
                  {!wallet.connected ? (
                    <div className="flex items-center gap-4 w-full">
                      <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 rounded-lg 
                        text-white font-mono px-4 py-2 transition-all" />
                      <div className="ml-auto text-right">
                        <div className="text-sm text-purple-400">Current Wagers</div>
                        <div className="text-xl font-bold text-purple-500">
                          {getRatWagers(rat.id)} $RAT
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={wagerAmounts[rat.id] || ''}
                        onChange={(e) => handleWagerAmountChange(rat.id, e.target.value)}
                        disabled={isProcessing}
                        className="bg-black/40 border border-purple-700/20 rounded px-3 py-2 
                                 text-purple-300 placeholder-purple-700/50 w-32 font-mono"
                      />
                      <button
                        onClick={() => placeWager(rat.id)}
                        disabled={isProcessing || isBattleStarted}
                        className={`px-4 py-2 rounded text-white font-mono ${
                          isProcessing || isBattleStarted
                            ? 'bg-purple-800 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {isProcessing ? 'Processing...' : isBattleStarted ? 'Battle Started' : 'Place Wager'}
                      </button>
                      <div className="ml-auto text-right">
                        <div className="text-sm text-purple-400">Current Wagers</div>
                        <div className="text-xl font-bold text-purple-500">
                          {getRatWagers(rat.id)} $RAT
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 