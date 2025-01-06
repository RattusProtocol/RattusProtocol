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

            {/* GitHub Button */}
            <a
              href="https://github.com/RattusProtocol/RattusProtocol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 
                       border border-purple-700/30 rounded-md hover:bg-purple-900/30 
                       transition-all"
            >
              <svg className="w-4 h-4 opacity-70 invert" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-sm text-purple-300">[GITHUB]</span>
            </a>

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