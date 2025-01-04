import { useRef, useEffect } from 'react';

export default function QuantumAnalysisModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawQuantumWaves() {
      ctx.fillStyle = '#1a0044';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;
      const centerY = canvas.height / 2;

      // Draw quantum probability waves
      for (let wave = 0; wave < 3; wave++) {
        const frequency = (wave + 1) * 2;
        const amplitude = 50 / (wave + 1);
        const phaseShift = wave * Math.PI / 3;

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${wave * 120}, 100%, 70%, 0.5)`;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x += 2) {
          const y = centerY + 
            Math.sin(x * 0.02 * frequency + time * 2 + phaseShift) * amplitude * 
            Math.exp(-Math.pow((x - canvas.width/2) / 100, 2));
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw interference patterns
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          const interference = Math.sin(i * 0.1 + time) * Math.cos(j * 0.1 + time);
          ctx.fillStyle = `rgba(255, 0, 255, ${Math.abs(interference) * 0.2})`;
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }

    const animation = requestAnimationFrame(function animate() {
      drawQuantumWaves();
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
            QUANTUM_WAVE_ANALYSIS.dat
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
              <div className="text-purple-500 text-sm mb-2">WAVE_FUNCTION</div>
              <div className="text-purple-400 font-mono">
                ψ(x,t) = Ae^(ikx-iωt)
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">UNCERTAINTY</div>
              <div className="text-purple-400 font-mono">
                ΔxΔp ≥ ℏ/2
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
              <div className="text-purple-500 text-sm mb-2">COHERENCE_TIME</div>
              <div className="text-purple-400 font-mono">
                τ = 42.3 μs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}