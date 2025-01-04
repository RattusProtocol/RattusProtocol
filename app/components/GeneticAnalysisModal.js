'use client'
import { useRef, useEffect } from 'react';

export default function GeneticAnalysisModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawDNAHelix() {
      ctx.fillStyle = '#1a0044';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;
      const centerX = canvas.width / 2;
      const radius = 50;
      
      // Draw DNA double helix
      for (let i = 0; i < canvas.height; i += 10) {
        const offset = i + time * 50;
        const x1 = centerX + Math.sin(offset * 0.05) * radius;
        const x2 = centerX + Math.sin((offset + Math.PI) * 0.05) * radius;
        
        // Draw base pairs
        ctx.beginPath();
        ctx.moveTo(x1, i);
        ctx.lineTo(x2, i);
        ctx.strokeStyle = `hsla(${(i + time * 100) % 360}, 100%, 70%, 0.5)`;
        ctx.stroke();
        
        // Draw nucleotides
        ctx.fillStyle = `hsla(${(i + time * 100) % 360}, 100%, 70%, 0.8)`;
        ctx.beginPath();
        ctx.arc(x1, i, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x2, i, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animation = requestAnimationFrame(function animate() {
      drawDNAHelix();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animation);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-gradient-to-b from-purple-950/95 to-[#1a0033]/95 border border-purple-700/20 rounded-lg 
                    shadow-[0_0_60px_rgba(88,28,135,0.2)] p-8 max-w-4xl w-full mx-4 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-purple-400 font-mono tracking-widest">
            DNA_SEQUENCE_ANALYSIS.dat
          </h2>
          <button onClick={onClose} 
                  className="text-purple-500 hover:text-purple-400 hover:bg-purple-900/40 px-3 py-1 rounded 
                           transition-all border border-purple-700/30 hover:border-purple-700/60 font-mono">
            [TERMINATE]
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <canvas ref={canvasRef} 
                    className="w-full aspect-square bg-black/40 rounded-lg border border-purple-700/20"
                    width={400} height={400} />
          </div>
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">MUTATION_RATE</div>
              <div className="text-purple-400 font-mono">
                Δμ = 3.7 × 10⁻⁵ per nucleotide
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">SEQUENCE_VARIANCE</div>
              <div className="text-purple-400 font-mono">
                σ² = Σ(x - μ)² / N
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">HELIX_STABILITY</div>
              <div className="text-purple-400 font-mono">
                ΔG = -0.8 kcal/mol
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}