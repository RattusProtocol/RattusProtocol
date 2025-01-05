import useWagerStore from '../utils/wagerStore';
import { useWallet } from '@solana/wallet-adapter-react';

export default function WalletWagers() {
  const wallet = useWallet();
  const getWalletWagers = useWagerStore(state => state.getWalletWagers);
  const getWalletTotal = useWagerStore(state => state.getWalletTotal);

  if (!wallet.connected) return null;

  const walletWagers = getWalletWagers(wallet.publicKey.toString());
  const total = getWalletTotal(wallet.publicKey.toString());

  return (
    <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 p-4">
      <h2 className="text-xl font-mono text-purple-400 mb-4">YOUR WAGERS</h2>
      <div className="space-y-2">
        {Object.entries(walletWagers).map(([ratId, amount]) => (
          <div key={ratId} className="flex justify-between text-purple-300 font-mono">
            <span>RAT_{Number(ratId) + 1}</span>
            <span>{amount} $RAT</span>
          </div>
        ))}
        <div className="pt-2 border-t border-purple-700/20 flex justify-between text-purple-400 font-mono">
          <span>TOTAL</span>
          <span>{total} $RAT</span>
        </div>
      </div>
    </div>
  );
} 