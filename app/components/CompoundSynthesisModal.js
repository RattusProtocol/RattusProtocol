'use client'
import { useRef, useEffect } from 'react';

export default function CompoundSynthesisModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawMolecularStructure() {
      ctx.fillStyle = '#1a0044';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw molecular bonds
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time;
        const x1 = centerX + Math.cos(angle) * 100;
        const y1 = centerY + Math.sin(angle) * 100;
        
        ctx.strokeStyle = `hsla(${(i * 60 + time * 50) % 360}, 100%, 70%, 0.5)`;
        ctx.lineWidth = 2;
        
        // Draw bonds between atoms
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        
        // Draw atoms
        ctx.fillStyle = `hsla(${(i * 60 + time * 50) % 360}, 100%, 70%, 0.8)`;
        ctx.beginPath();
        ctx.arc(x1, y1, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw central atom
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    const animation = requestAnimationFrame(function animate() {
      drawMolecularStructure();
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
            MOLECULAR_SYNTHESIS.dat
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
              <div className="text-purple-500 text-sm mb-2">REACTION_KINETICS</div>
              <div className="text-purple-400 font-mono">
                k = 1.2 × 10⁻³ M⁻¹s⁻¹
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">GIBBS_FREE_ENERGY</div>
              <div className="text-purple-400 font-mono">
                ΔG = -42.5 kJ/mol
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">ACTIVATION_ENERGY</div>
              <div className="text-purple-400 font-mono">
                Ea = 78.3 kJ/mol
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}