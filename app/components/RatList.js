'use client'
import { useState, useEffect, useRef } from 'react';
import { COMPOUNDS } from '../types/types';
import { ABILITY_TARGETS } from '../constants/abilities';

// Add these constants at the top of the file, after the imports
const SCALE_ROWS = 6;
const SCALES_PER_ROW = 8;
const SCALE_SIZE = 8;

const CompoundAbilities = ({ compound, activeRat }) => {
  // Check if the compound exists in ABILITY_TARGETS
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
                  ? <span className="text-green-400">(Active)</span>
                  : <span className="text-yellow-400">({ability.description})</span>
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

export default function RatList({ rats }) {
  const [activeRat, setActiveRat] = useState(null);
  const previewCanvasRef = useRef(null);
  const compoundCanvasRef = useRef(null);

  // Helper function to safely format numbers
  const safeFormat = (value, decimals = 1) => {
    return typeof value === 'number' ? value.toFixed(decimals) : '0';
  };

  // Draw rat preview when modal is open
  useEffect(() => {
    if (activeRat && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
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

      // Draw rat
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const ratSize = 20;
      
      ctx.save();
      const ratColor = activeRat.originalCompound === 'POLYJUICE_POTION' 
        ? COMPOUNDS['POLYJUICE_POTION'].color 
        : COMPOUNDS[activeRat.compound]?.color || '#ffffff';
      ctx.fillStyle = ratColor;
      ctx.strokeStyle = ratColor;

      const headAngle = 0; // Fixed angle for preview
      const bodyLength = ratSize * 2;
      const bodyWidth = ratSize * 1.2;

      // Draw tail
      ctx.strokeStyle = ratColor;
      ctx.lineWidth = ratSize * 0.3;
      const tailLength = ratSize * 4;
      const tailStart = {
        x: centerX - Math.cos(headAngle) * bodyLength,
        y: centerY - Math.sin(headAngle) * bodyLength
      };
      
      ctx.beginPath();
      ctx.moveTo(tailStart.x, tailStart.y);
      
      // Create a wavy tail effect
      const segments = 12;
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const tx = tailStart.x - Math.cos(headAngle) * (tailLength * t);
        const ty = tailStart.y - Math.sin(headAngle) * (tailLength * t);
        const wave = Math.sin(t * Math.PI * 2 + Date.now() / 200) * ratSize * 0.3;
        
        ctx.lineTo(
          tx + Math.cos(headAngle + Math.PI/2) * wave,
          ty + Math.sin(headAngle + Math.PI/2) * wave
        );
      }
      ctx.stroke();

      // Draw body segments
      for (let i = 0; i < 8; i++) {
        const offset = i * (bodyLength / 8);
        ctx.beginPath();
        ctx.arc(
          centerX - Math.cos(headAngle) * offset,
          centerY - Math.sin(headAngle) * offset,
          bodyWidth - (offset / bodyLength) * (bodyWidth / 2),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Draw eyes
      const headX = centerX + Math.cos(headAngle) * bodyLength * 0.6;
      const headY = centerY + Math.sin(headAngle) * bodyLength * 0.6;
      const eyeOffset = ratSize * 0.4;

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(
        headX + Math.cos(headAngle - Math.PI/6) * eyeOffset,
        headY + Math.sin(headAngle - Math.PI/6) * eyeOffset,
        ratSize * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        headX + Math.cos(headAngle + Math.PI/6) * eyeOffset,
        headY + Math.sin(headAngle + Math.PI/6) * eyeOffset,
        ratSize * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw whiskers
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = ratSize * 0.05;
      const whiskerLength = ratSize * 0.8;
      const whiskerSpread = Math.PI / 6;
      const whiskerCount = 3;

      for (let i = 0; i < whiskerCount; i++) {
        const whiskerAngle = whiskerSpread * ((i / (whiskerCount - 1)) - 0.5);
        
        // Left whiskers
        ctx.beginPath();
        ctx.moveTo(
          headX + Math.cos(headAngle - Math.PI/4) * ratSize * 0.3,
          headY + Math.sin(headAngle - Math.PI/4) * ratSize * 0.3
        );
        ctx.lineTo(
          headX + Math.cos(headAngle - Math.PI/4 + whiskerAngle) * whiskerLength,
          headY + Math.sin(headAngle - Math.PI/4 + whiskerAngle) * whiskerLength
        );
        ctx.stroke();

        // Right whiskers
        ctx.beginPath();
        ctx.moveTo(
          headX + Math.cos(headAngle + Math.PI/4) * ratSize * 0.3,
          headY + Math.sin(headAngle + Math.PI/4) * ratSize * 0.3
        );
        ctx.lineTo(
          headX + Math.cos(headAngle + Math.PI/4 - whiskerAngle) * whiskerLength,
          headY + Math.sin(headAngle + Math.PI/4 - whiskerAngle) * whiskerLength
        );
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [activeRat]);

  // Draw compound preview
  useEffect(() => {
    if (activeRat && compoundCanvasRef.current) {
      const canvas = compoundCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      function animate() {
        // Clear canvas
        ctx.fillStyle = '#1a0044';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid and scanlines (previous code remains the same)
        
        const compound = activeRat.originalCompound === 'POLYJUICE_POTION'
          ? COMPOUNDS['POLYJUICE_POTION']
          : COMPOUNDS[activeRat.compound];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const time = Date.now() / 1000;
        
        ctx.save();
        ctx.strokeStyle = compound.color;
        ctx.fillStyle = compound.color;
        
        switch(activeRat.originalCompound === 'POLYJUICE_POTION' ? 'POLYJUICE_POTION' : activeRat.compound) {
          case 'VENOM_SYMBIOTE':
            // Symbiote tendrils
            const tendrilCount = 12;
            for (let i = 0; i < tendrilCount; i++) {
              const angle = (i / tendrilCount) * Math.PI * 2;
              const length = 40 + Math.sin(time * 2 + i) * 20;
              
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

          case 'QUANTUM_UNCERTAINTY':
            // Quantum probability fields
            const fieldCount = 3;
            for (let field = 0; field < fieldCount; field++) {
              ctx.beginPath();
              const points = 50;
              const baseRadius = 30;
              
              for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const noise = Math.sin(angle * 4 + time * 2 + field * Math.PI/2);
                const radius = baseRadius + noise * 15;
                
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.globalAlpha = 0.3;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            
            // Add quantum particles
            for (let i = 0; i < 8; i++) {
              const angle = time * 2 + (i * Math.PI / 4);
              const x = centerX + Math.cos(angle) * 20;
              const y = centerY + Math.sin(angle) * 20;
              
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, Math.PI * 2);
              ctx.fill();
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
            const pulseSize = Math.sin(time * 3) * 10 + 20;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff40';
            ctx.fill();
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

          case 'LIZARD_SERUM':
            // Reptilian scales effect
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
                  ctx.strokeStyle = `${compound.color}${Math.floor(Math.sin(time + node) * 128 + 127).toString(16).padStart(2, '0')}`;
                  ctx.stroke();
                  ctx.strokeStyle = compound.color; // Reset stroke style
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
            ctx.fillStyle = `${compound.color}80`; // Semi-transparent
            ctx.fill();
            ctx.fillStyle = compound.color; // Reset fill style
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

          case 'GAMMA_RADIATION':
            // Radiation symbol with pulsing waves
            const outerRadius = 40;
            const bladeCount = 3;
            const centerRadius = 10;
            
            // Draw center circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw blades
            for (let i = 0; i < bladeCount; i++) {
              const angle = (i / bladeCount) * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(
                centerX + Math.cos(angle) * centerRadius,
                centerY + Math.sin(angle) * centerRadius
              );
              
              // Create curved blade shape
              for (let t = 0; t <= 1; t += 0.1) {
                const bladeCurve = Math.sin(t * Math.PI) * 20;
                const r = centerRadius + t * (outerRadius - centerRadius);
                const x = centerX + Math.cos(angle + bladeCurve/100) * r;
                const y = centerY + Math.sin(angle + bladeCurve/100) * r;
                ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
            }
            
            // Add pulsing radiation waves
            for (let i = 0; i < 3; i++) {
              const waveRadius = outerRadius + 10 + Math.sin(time * 2 + i) * 5;
              ctx.beginPath();
              ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `${compound.color}${Math.floor((1 - i/3) * 255).toString(16).padStart(2, '0')}`;
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

          case 'MIRAKURU':
            // Swirling dark energy with lightning
            const darkRadius = 35;
            const spiralArms = 4;
            
            for (let arm = 0; arm < spiralArms; arm++) {
              ctx.beginPath();
              for (let i = 0; i <= 50; i++) {
                const t = i / 50;
                const spiral = t * 4 * Math.PI + (arm * Math.PI * 2 / spiralArms) + time;
                const radius = t * darkRadius;
                const x = centerX + Math.cos(spiral) * radius;
                const y = centerY + Math.sin(spiral) * radius;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.strokeStyle = `${compound.color}${Math.floor(Math.sin(time + arm) * 64 + 191).toString(16).padStart(2, '0')}`;
              ctx.stroke();
            }
            
            // Add lightning effects
            for (let i = 0; i < 3; i++) {
              const angle = time * 2 + (i * Math.PI * 2 / 3);
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              
              let x = centerX;
              let y = centerY;
              for (let j = 0; j < 3; j++) {
                const nextX = centerX + Math.cos(angle + Math.sin(time + i) * 0.5) * darkRadius * (j + 1) / 3;
                const nextY = centerY + Math.sin(angle + Math.sin(time + i) * 0.5) * darkRadius * (j + 1) / 3;
                ctx.lineTo(nextX + Math.random() * 5, nextY + Math.random() * 5);
                x = nextX;
                y = nextY;
              }
              ctx.strokeStyle = `${compound.color}`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            break;

          case 'OZ_FORMULA':
            // Swirling green formula with goblin masks
            const maskCount = 3;
            const formulaRadius = 30;
            
            // Draw swirling formula
            ctx.beginPath();
            for (let i = 0; i <= 100; i++) {
              const t = i / 100;
              const angle = t * Math.PI * 8 + time;
              const radius = formulaRadius * Math.sin(t * Math.PI);
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = compound.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw goblin masks
            for (let i = 0; i < maskCount; i++) {
              const angle = (i / maskCount) * Math.PI * 2 + time;
              const x = centerX + Math.cos(angle) * formulaRadius;
              const y = centerY + Math.sin(angle) * formulaRadius;
              
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(angle + Math.PI);
              
              // Draw mask shape
              ctx.beginPath();
              ctx.moveTo(-8, -5);
              ctx.lineTo(8, -5);
              ctx.lineTo(5, 5);
              ctx.lineTo(-5, 5);
              ctx.closePath();
              ctx.fill();
              
              // Draw eyes
              ctx.fillStyle = '#000';
              ctx.fillRect(-4, -3, 2, 2);
              ctx.fillRect(2, -3, 2, 2);
              
              ctx.restore();
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
        requestAnimationFrame(animate);
      }
      
      animate();
    }
  }, [activeRat]);

  return (
    <div className="bg-[#1a0033]/80 rounded-lg border border-purple-700/20 
                  shadow-[0_0_30px_rgba(88,28,135,0.2)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-700/20">
        <span className="w-2 h-2 bg-purple-500 rounded-full" />
        <h2 className="text-purple-300 font-mono text-xl tracking-wider">
          [EXPERIMENTAL_SUBJECTS]
        </h2>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-700/20 
                  scrollbar-track-transparent">
        <div className="grid grid-rows-2 auto-cols-[calc(25%-20px)] grid-flow-col gap-3 p-3">
          {rats.map((rat, index) => (
            <button
              key={rat.id}
              onClick={() => setActiveRat(rat)}
              className={`min-w-[250px] text-left p-4 
                        border border-purple-700/20 rounded-lg bg-black/40 
                        hover:bg-purple-900/20 transition-all space-y-2
                        ${activeRat?.id === rat.id ? 'border-purple-500' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-purple-400 font-mono">RAT_{rat.id + 1}</span>
                <span className="text-purple-500 text-sm">
                  {safeFormat(rat.health * 100)}% HEALTH
                </span>
              </div>
              <div className="text-purple-300 font-mono">
                {rat.originalCompound === 'POLYJUICE_POTION' 
                  ? COMPOUNDS['POLYJUICE_POTION'].name
                  : COMPOUNDS[rat.compound]?.name || 'UNKNOWN'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rat Details Modal */}
      {activeRat && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveRat(null);
            }
          }}
        >
          <div className="modal-content bg-gradient-to-b from-purple-950/95 to-[#1a0033]/95 
                       border border-purple-700/20 rounded-lg shadow-[0_0_60px_rgba(88,28,135,0.2)] 
                       p-8 max-w-4xl w-full mx-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-purple-400 font-mono tracking-widest">
                RAT_{activeRat.id + 1}_ANALYSIS.dat
              </h2>
              <button onClick={() => setActiveRat(null)}
                      className="text-purple-500 hover:text-purple-400 hover:bg-purple-900/40 
                               px-3 py-1 rounded transition-all border border-purple-700/30 
                               hover:border-purple-700/60 font-mono">
                [TERMINATE]
              </button>
            </div>

            {activeRat.active ? (
              <div className="mb-6 p-3 border-2 border-green-500/20 rounded-lg 
                            bg-green-900/20 text-center relative
                            animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.2)]
                            before:absolute before:inset-0 before:rounded-lg
                            before:shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]">
                <div className="text-green-500 font-mono relative">
                  [ACTIVE_SUBJECT] - Currently under experimental observation
                </div>
              </div>
            ) : (
              <div className="mb-6 p-3 border-2 border-dashed border-purple-700/20 rounded-lg 
                            bg-purple-900/20 text-center relative
                            animate-pulse shadow-[0_0_15px_rgba(147,51,234,0.2)]
                            before:absolute before:inset-0 before:rounded-lg
                            before:shadow-[inset_0_0_15px_rgba(147,51,234,0.2)]">
                <div className="text-purple-500 font-mono relative">
                  [INACTIVE_SUBJECT] - Awaiting for Phase 2
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
                  <div className="text-purple-500 text-sm mb-2">SUBJECT_STATUS</div>
                  <div className="text-purple-400 font-mono space-y-2">
                    <div>ID: {activeRat.id + 1}</div>
                    <div>Health: {safeFormat(activeRat.health * 100)}%</div>
                    <div>Age: {safeFormat(activeRat.age)} cycles</div>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-purple-700/20">
                  <div className="text-purple-500 text-sm mb-2">COMPOUND_DATA</div>
                  <div className="text-purple-400 font-mono space-y-2">
                    <div>Name: {activeRat.originalCompound === 'POLYJUICE_POTION' 
                      ? COMPOUNDS['POLYJUICE_POTION'].name 
                      : COMPOUNDS[activeRat.compound]?.name || 'UNKNOWN'}</div>
                    <div>Origin: {activeRat.originalCompound === 'POLYJUICE_POTION'
                      ? COMPOUNDS['POLYJUICE_POTION'].origin
                      : COMPOUNDS[activeRat.compound]?.origin || 'UNKNOWN'}</div>
                    <div>Potency: {activeRat.originalCompound === 'POLYJUICE_POTION'
                      ? safeFormat(COMPOUNDS['POLYJUICE_POTION'].potency, 2)
                      : safeFormat(COMPOUNDS[activeRat.compound]?.potency, 2) || 'N/A'}</div>
                    <div className="pt-2 border-t border-purple-700/20">
                      {activeRat.compound && (
                        <CompoundAbilities 
                          compound={activeRat.compound} 
                          activeRat={activeRat}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-purple-500 text-sm mb-2 text-center">SUBJECT_PREVIEW</div>
                  <div className="aspect-square bg-black/40 rounded-lg border border-purple-700/20 p-4">
                    <canvas
                      ref={previewCanvasRef}
                      className="w-full h-full"
                      width={300}
                      height={300}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-purple-500 text-sm mb-2 text-center">COMPOUND_VISUALIZATION</div>
                  <div className="aspect-square bg-black/40 rounded-lg border border-purple-700/20 p-4">
                    <canvas
                      ref={compoundCanvasRef}
                      className="w-full h-full"
                      width={300}
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 