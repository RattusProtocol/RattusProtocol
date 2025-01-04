'use client'
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [copied, setCopied] = useState(false);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
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
            {/* Contract Address */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 
                       border border-purple-700/30 rounded-md hover:bg-purple-900/30 
                       transition-all group"
            >
              <span className="font-mono text-sm text-purple-300">
                {contractAddress ? 
                  `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}` :
                  'Loading...'}
              </span>
              <span className="text-purple-400 text-xs">
                {copied ? '[COPIED]' : '[COPY]'}
              </span>
            </button>

            {/* Twitter Button */}
            <a
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 
                       border border-purple-700/30 rounded-md hover:bg-purple-900/30 
                       transition-all"
            >
              <Image
                src="/twitter.svg"
                alt="Twitter"
                width={16}
                height={16}
                className="invert opacity-70"
              />
              <span className="font-mono text-sm text-purple-300">[FOLLOW]</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
} 