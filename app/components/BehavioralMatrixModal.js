'use client'
import { useRef, useEffect } from 'react';

export default function BehavioralMatrixModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawBehaviorMatrix() {
      ctx.fillStyle = '#1a0044';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;
      const gridSize = 20;
      
      // Draw neural network grid
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const activation = Math.sin((x + y) / 50 + time) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(255, 0, 255, ${activation * 0.3})`;
          ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
          
          // Draw synaptic connections
          if (Math.random() < 0.1) {
            ctx.strokeStyle = `rgba(255, 0, 255, ${activation * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(x + gridSize/2, y + gridSize/2);
            ctx.lineTo(
              x + gridSize/2 + Math.cos(time + x) * gridSize * 2,
              y + gridSize/2 + Math.sin(time + y) * gridSize * 2
            );
            ctx.stroke();
          }
        }
      }

      // Add pulse effect
      const pulseRadius = (time * 100) % (canvas.width * 1.5);
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, pulseRadius
      );
      gradient.addColorStop(0, 'rgba(255, 0, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const animation = requestAnimationFrame(function animate() {
      drawBehaviorMatrix();
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
            BEHAVIORAL_PATTERN_MATRIX.dat
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
              <div className="text-purple-500 text-sm mb-2">NEURAL_DENSITY</div>
              <div className="text-purple-400 font-mono">
                ρ = 4.2 × 10⁶ neurons/mm³
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">SYNAPTIC_PLASTICITY</div>
              <div className="text-purple-400 font-mono">
                τ = 20ms (LTP threshold)
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">LEARNING_RATE</div>
              <div className="text-purple-400 font-mono">
                η = 0.003 (adaptive)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}