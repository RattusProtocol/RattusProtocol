'use client'
import { useEffect, useRef } from 'react';
import { COMPOUNDS } from '../types/types';

// Add these constants at the top of the file, after the imports
const SCALE_ROWS = 6;
const SCALES_PER_ROW = 8;
const SCALE_SIZE = 8;

export default function CompoundPreviewCanvas({ compound }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (compound && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      
      function animate() {
        // Clear canvas
        ctx.fillStyle = '#1a0044';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add grid effect
        ctx.strokeStyle = '#4a008850';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        
        // Add scanlines
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillStyle = '#00000015';
          ctx.fillRect(0, y, canvas.width, 2);
        }

        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        const time = Date.now() / 1000;
        
        // Scale down all sizes
        const baseScale = 0.6;
        
        const compoundColor = COMPOUNDS[compound].color;
        ctx.save();
        ctx.strokeStyle = compoundColor;
        ctx.fillStyle = compoundColor;
        
        switch(compound) {
          case 'VENOM_SYMBIOTE':
            // Symbiote tendrils
            const tendrilCount = 12;
            for (let i = 0; i < tendrilCount; i++) {
              const angle = (i / tendrilCount) * Math.PI * 2;
              const length = (40 * baseScale) + Math.sin(time * 2 + i) * (20 * baseScale);
              
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              
              // Create organic, flowing tendrils
              const points = 5;
              for (let j = 1; j <= points; j++) {
                const t = j / points;
                const radius = length * t;
                const waveX = Math.cos(time * 3 + i + t * 10) * (10 * (1 - t));
                const waveY = Math.sin(time * 2 + i + t * 10) * (10 * (1 - t));
                
                const x = centerX + Math.cos(angle) * radius + waveX;
                const y = centerY + Math.sin(angle) * radius + waveY;
                
                ctx.lineTo(x, y);
              }
              ctx.lineWidth = 3;
              ctx.stroke();
            }
            break;

          case 'SUPER_SOLDIER_SERUM':
            // Draw rotating shield rings
            const ringCount = 3;
            const maxRadius = 60;
            const rotationSpeed = time;
            
            // Draw concentric rings with American colors
            for (let i = 0; i < ringCount; i++) {
              const radius = maxRadius * (1 - i * 0.25);
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              
              // Red, white, blue pattern
              const colors = ['#bf0a30', '#ffffff', '#0a369d'];
              ctx.fillStyle = colors[i];
              ctx.fill();
            }
            
            // Draw rotating stars
            const starCount = 13; // Patriotic 13 stars
            for (let i = 0; i < starCount; i++) {
              const angle = (i / starCount) * Math.PI * 2 + rotationSpeed;
              const orbitRadius = maxRadius * 0.6;
              const x = centerX + Math.cos(angle) * orbitRadius;
              const y = centerY + Math.sin(angle) * orbitRadius;
              
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(angle + time);
              
              // Draw 5-pointed star
              ctx.beginPath();
              for (let j = 0; j < 5; j++) {
                const starAngle = (j * 2 * Math.PI / 5) - Math.PI / 2;
                const starRadius = 8;
                const innerRadius = starRadius * 0.4;
                
                const outerX = Math.cos(starAngle) * starRadius;
                const outerY = Math.sin(starAngle) * starRadius;
                const innerX = Math.cos(starAngle + Math.PI/5) * innerRadius;
                const innerY = Math.sin(starAngle + Math.PI/5) * innerRadius;
                
                if (j === 0) ctx.moveTo(outerX, outerY);
                else ctx.lineTo(outerX, outerY);
                ctx.lineTo(innerX, innerY);
              }
              ctx.closePath();
              ctx.fillStyle = '#ffffff';
              ctx.fill();
              ctx.restore();
            }
            
            // Add pulsing energy effect
            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.sin(time * 3) * 10 + 20 , 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff40';
            ctx.fill();
            break;
            

          case 'LIZARD_SERUM':
            // Reptilian scales effect
            
            centerX = canvas.width / 3;
            centerY = canvas.height / 2.5;
            for (let row = 0; row < SCALE_ROWS; row++) {
              for (let col = 0; col < SCALES_PER_ROW; col++) {
                const offset = row % 2 ? SCALE_SIZE : 0;
                const x = centerX - (SCALES_PER_ROW * SCALE_SIZE) / 2 + col * SCALE_SIZE * 2 + offset;
                const y = centerY - (SCALE_ROWS * SCALE_SIZE) / 2 + row * SCALE_SIZE * 1.5;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + SCALE_SIZE, y + SCALE_SIZE);
                ctx.lineTo(x, y + SCALE_SIZE * 2);
                ctx.lineTo(x - SCALE_SIZE, y + SCALE_SIZE);
                ctx.closePath();
                
                const pulse = Math.sin(time * 2 + row + col) * 0.2 + 0.8;
                ctx.fillStyle = `rgba(42, 92, 60, ${pulse})`;
                ctx.fill();
              }
            }
            break;

          case 'POLYJUICE_POTION':
            // Swirling transformation effect
            const bubbleCount = 15;
            const potionRadius = 40;
            
            // Draw swirling potion base
            for (let i = 0; i < 360; i += 5) {
              const angle = (i * Math.PI / 180) + time * 2;
              const radius = potionRadius * Math.sin(i / 30 + time);
              
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(139, 93, 199, ${0.5 + Math.sin(i / 20 + time) * 0.5})`;
              ctx.fill();
            }
            
            // Floating transformation bubbles
            for (let i = 0; i < bubbleCount; i++) {
              const t = time + i;
              const angle = (i / bubbleCount) * Math.PI * 2;
              const floatRadius = 20 + Math.sin(t * 2) * 10;
              
              const x = centerX + Math.cos(angle + t) * floatRadius;
              const y = centerY + Math.sin(angle + t) * floatRadius;
              
              // Draw bubble with morphing shape
              ctx.beginPath();
              const bubblePoints = 5;
              for (let j = 0; j <= bubblePoints; j++) {
                const bubbleAngle = (j / bubblePoints) * Math.PI * 2;
                const bubbleRadius = 5 + Math.sin(t * 3 + i + j) * 2;
                
                const px = x + Math.cos(bubbleAngle) * bubbleRadius;
                const py = y + Math.sin(bubbleAngle) * bubbleRadius;
                
                if (j === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fillStyle = `rgba(139, 93, 199, ${0.3 + Math.sin(t + i) * 0.2})`;
              ctx.fill();
              
              // Add connecting strands
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(x, y);
              ctx.strokeStyle = `rgba(139, 93, 199, ${0.2 + Math.sin(t + i) * 0.1})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            break;

          case 'PLASMID':
            // Futuristic circular plasmid with energy nodes
            const plasmidRings = 3;
            const nodeCount = 8;
            const plasmidRadius = 40;
            
            // Draw multiple rotating rings
            for (let ring = 0; ring < plasmidRings; ring++) {
              const ringRadius = plasmidRadius * ((ring + 1) / plasmidRings);
              const rotation = time * (ring % 2 ? 1 : -1); // Alternate rotation direction
              
              // Draw the ring
              ctx.beginPath();
              ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
              ctx.stroke();
              
              // Draw nodes on each ring
              for (let node = 0; node < nodeCount; node++) {
                const angle = rotation + (node / nodeCount) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * ringRadius;
                const y = centerY + Math.sin(angle) * ringRadius;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw energy connections between nodes
                if (ring < plasmidRings - 1) {
                  const nextRingRadius = plasmidRadius * ((ring + 2) / plasmidRings);
                  const nextAngle = -rotation + (node / nodeCount) * Math.PI * 2;
                  const nextX = centerX + Math.cos(nextAngle) * nextRingRadius;
                  const nextY = centerY + Math.sin(nextAngle) * nextRingRadius;
                  
                  // Curved energy connection
                  ctx.beginPath();
                  ctx.moveTo(x, y);
                  const controlX = centerX + Math.cos((angle + nextAngle) / 2) * (ringRadius + 10);
                  const controlY = centerY + Math.sin((angle + nextAngle) / 2) * (ringRadius + 10);
                  ctx.quadraticCurveTo(controlX, controlY, nextX, nextY);
                  ctx.strokeStyle = `${compoundColor}${Math.floor(Math.sin(time + node) * 128 + 127).toString(16).padStart(2, '0')}`;
                  ctx.stroke();
                  ctx.strokeStyle = compoundColor; // Reset stroke style
                }
              }
            }
            
            // Central energy core
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Pulsing energy effect
            const plasmidPulse = Math.sin(time * 3) * 2 + 4;
            ctx.beginPath();
            ctx.arc(centerX, centerY, plasmidPulse, 0, Math.PI * 2);
            ctx.fillStyle = `${compoundColor}80`; // Semi-transparent
            ctx.fill();
            ctx.fillStyle = compoundColor; // Reset fill style
            break;

          case 'T_VIRUS':
            // Viral capsid structure with spikes
            const radius = 40;
            const spikeCount = 12;
            const spikeLength = 15;
            const innerRadius = 25;
            
            // Draw outer capsid
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw viral spikes
            for (let i = 0; i < spikeCount; i++) {
              const angle = (i / spikeCount) * Math.PI * 2;
              const startX = centerX + Math.cos(angle) * radius;
              const startY = centerY + Math.sin(angle) * radius;
              const endX = centerX + Math.cos(angle) * (radius + spikeLength);
              const endY = centerY + Math.sin(angle) * (radius + spikeLength);
              
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();
              
              // Add spike heads
              ctx.beginPath();
              ctx.arc(endX, endY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Inner structure
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
            ctx.stroke();
            break;

          case 'COMPOUND_V':
            // Energetic V pattern with lightning
            ctx.beginPath();
            ctx.moveTo(centerX - 20, centerY + 25);
            ctx.lineTo(centerX, centerY - 25);
            ctx.lineTo(centerX + 20, centerY + 25);
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Lightning effects
            for (let i = 0; i < 8; i++) {
              const angle = (i / 8) * Math.PI * 2 + time * 3;
              const radius = 35 + Math.sin(time * 5 + i) * 5;
              
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              // Create jagged lightning
              for (let j = 0; j < 3; j++) {
                const t = j / 2;
                const jitterX = (Math.random() - 0.5) * 10;
                const jitterY = (Math.random() - 0.5) * 10;
                ctx.lineTo(
                  centerX + (x - centerX) * t + jitterX,
                  centerY + (y - centerY) * t + jitterY
                );
              }
              ctx.lineTo(x, y);
              
              ctx.strokeStyle = '#ff000080';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            break;

          case 'EXTREMIS_VIRUS':
            // Glowing orange-red energy patterns
            const energyNodes = 6;
            const energyRadius = 40;
            
            for (let i = 0; i < energyNodes; i++) {
              const angle = (i / energyNodes) * Math.PI * 2 + time;
              const x = centerX + Math.cos(angle) * energyRadius;
              const y = centerY + Math.sin(angle) * energyRadius;
              
              // Draw energy nodes
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, Math.PI * 2);
              ctx.fill();
              
              // Draw connecting energy lines
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(x, y);
              ctx.lineWidth = 2 + Math.sin(time * 3 + i) * 2;
              ctx.stroke();
              
              // Add pulsing glow
              const glowSize = 15 + Math.sin(time * 4 + i) * 5;
              ctx.globalAlpha = 0.3;
              ctx.beginPath();
              ctx.arc(x, y, glowSize, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            break;

        case 'THE_GRASSES':
            // Witcher signs rotating wheel
            const signCount = 5;
            const baseRadius = 30;
            
            for (let i = 0; i < signCount; i++) {
            const angle = (i / signCount) * Math.PI * 2 + time;
            const x = centerX + Math.cos(angle) * baseRadius;
            const y = centerY + Math.sin(angle) * baseRadius;
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = ['#00ffff', '#ff4500', '#800080', '#ffd700', '#008000'][i];
            ctx.fill();
            
            // Connecting lines with glow
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = ['#00ffff50', '#ff450050', '#80008050', '#ffd70050', '#00800050'][i];
            ctx.lineWidth = 4;
            ctx.stroke();
            }
            break;

          default:
            // DNA double helix
            const rotations = 2;
            const height = 60;
            const width = 30;
            
            for (let i = 0; i < 100; i++) {
              const t = i / 100;
              const y = centerY - height/2 + height * t;
              
              // Double helix strands
              const x1 = centerX + Math.cos(t * Math.PI * rotations * 2 + ( Date.now() / 1000 ) * 2) * width;
              const x2 = centerX + Math.cos(t * Math.PI * rotations * 2 + ( Date.now() / 1000 ) * 2 + Math.PI) * width;
              
              ctx.beginPath();
              ctx.arc(x1, y, 3, 0, Math.PI * 2);
              ctx.arc(x2, y, 3, 0, Math.PI * 2);
              ctx.fill();
              
              // Connecting lines
              if (i % 10 === 0) {
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
              }
            }
        }
        
        ctx.restore();
        animationFrameId = requestAnimationFrame(animate);
      }
      
      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    }
  }, [compound]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-terminal rounded-lg border border-foreground/20"
      width={150}
      height={100}
    />
  );
} 