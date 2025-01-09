'use client'
import { useState } from 'react';
import HowItWorksModal from './HowItWorksModal';
import Phase2Modal from './Phase2Modal';

export default function Header() {
  const [copied, setCopied] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isPhase2Open, setIsPhase2Open] = useState(false);
  const contractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <header className="border-b border-purple-700/20 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Project Name */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <h1 className="text-purple-300 font-mono text-xl tracking-wider">
              [RATTUS_PROTOCOL]
            </h1>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Info Buttons */}
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How It Works
            </button>

            <button
              onClick={() => setIsPhase2Open(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white flex items-center gap-2 animate-pulse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Phase 2 ?
            </button>

            {/* Contract Address */}
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-900/40 hover:bg-purple-900/60 rounded border border-purple-700/40 text-purple-300 font-mono text-sm flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              {copied ? 'Copied!' : contractAddress?.slice(0, 4) + '...' + contractAddress?.slice(-4)}
            </button>

            {/* Social Links */}
            <a
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-purple-900/20 rounded"
            >
              <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>

            <a
              href="https://github.com/RattusProtocol/RattusProtocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-purple-900/20 rounded"
            >
              <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>

            {/* GitBook Link */}
            <a
              href="https://docs.rattus.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-purple-900/20 rounded"
            >
              <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.802 17.77a.703.703 0 11-.002 1.406.703.703 0 01.002-1.406m11.024-4.347a.703.703 0 11.001-1.406.703.703 0 01-.001 1.406m0-2.876a2.176 2.176 0 00-2.174 2.174c0 .233.039.465.115.691l-7.181 3.823a2.165 2.165 0 00-1.784-.937c-.829 0-1.584.475-1.95 1.216l-6.451-3.402c-.682-.358-1.192-1.48-1.138-2.502.028-.533.212-.947.493-1.107.178-.1.392-.092.62.027l.042.023c1.71.9 7.304 3.847 7.54 3.956.363.169.565.237 1.185-.057l11.564-6.014c.17-.064.368-.227.368-.474 0-.342-.354-.477-.355-.477-.658-.315-1.669-.788-2.655-1.25-2.108-.987-4.497-2.105-5.546-2.655-.906-.474-1.635-.074-1.765.006l-.252.125C7.78 6.048 1.46 9.178 1.1 9.397.457 9.789.058 10.57.006 11.539c-.08 1.537.703 3.14 1.824 3.727l6.822 3.518a2.175 2.175 0 002.15 1.862 2.177 2.177 0 002.173-2.14l7.514-4.073c.38.298.853.461 1.337.461A2.176 2.176 0 0024 12.72a2.176 2.176 0 00-2.174-2.174"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <HowItWorksModal 
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
      <Phase2Modal
        isOpen={isPhase2Open}
        onClose={() => setIsPhase2Open(false)}
      />
    </header>
  );
} 