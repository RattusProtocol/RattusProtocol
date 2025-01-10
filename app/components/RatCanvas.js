import { useEffect, useRef } from 'react';
import { COMPOUNDS } from '../types/types';

// Cache trigonometric calculations
const cosCache = new Float32Array(360);
const sinCache = new Float32Array(360);
for (let i = 0; i < 360; i++) {
  const angle = (i * Math.PI) / 180;
  cosCache[i] = Math.cos(angle);
  sinCache[i] = Math.sin(angle);
}

// Use cached values in drawing functions
const getTrig = (angle) => {
  const index = Math.floor((angle * 180) / Math.PI) % 360;
  return {
    cos: cosCache[index],
    sin: sinCache[index]
  };
};

export default function RatCanvas({ rats }) {
  const canvasRef = useRef(null);

  const drawRat = (ctx, rat) => {// Increase velocity by a factor (e.g., 1.5 for 50% faster)
    ctx.save();
    
    const ratColor = rat.compound ? COMPOUNDS[rat.compound].color : '#ffffff';
    ctx.fillStyle = ratColor;
    ctx.strokeStyle = ratColor;
    
    const headAngle = Math.atan2(rat.velocity.y, rat.velocity.x);
    const bodyLength = rat.size * 2;
    const bodyWidth = rat.size * 1.2;
    
    // Calculate head position early
    const headX = rat.position.x + Math.cos(headAngle) * bodyLength * 0.6;
    const headY = rat.position.y + Math.sin(headAngle) * bodyLength * 0.6;
    
    // Special rendering for Venom Symbiote rat
    if (rat.compound === 'VENOM_SYMBIOTE') {
      // Draw web line if web-slinging
      if (rat.webPoint) {
        ctx.strokeStyle = '#ffffff80';
        ctx.lineWidth = rat.size * 0.1;
        ctx.beginPath();
        
        // Calculate web start points from the sides
        const sideOffset = rat.size * 1.2;
        const webStartX = rat.position.x + Math.cos(headAngle + Math.PI/2) * sideOffset;
        const webStartY = rat.position.y + Math.sin(headAngle + Math.PI/2) * sideOffset;
        
        // Draw web from right side if target is on right, left side if target is on left
        const isRightSide = (rat.webPoint.x - rat.position.x) > 0;
        const finalWebStartX = isRightSide ? webStartX : rat.position.x + Math.cos(headAngle - Math.PI/2) * sideOffset;
        const finalWebStartY = isRightSide ? webStartY : rat.position.y + Math.sin(headAngle - Math.PI/2) * sideOffset;
        
        ctx.moveTo(finalWebStartX, finalWebStartY);
        ctx.lineTo(rat.webPoint.x, rat.webPoint.y);
        ctx.stroke();
      }

      // Normal rat body drawing
      for (let i = 0; i < 8; i++) {
        const offset = i * (bodyLength / 8);
        ctx.beginPath();
        ctx.arc(
          rat.position.x - Math.cos(headAngle) * offset,
          rat.position.y - Math.sin(headAngle) * offset,
          bodyWidth - (offset / bodyLength) * (bodyWidth / 2),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Draw spider symbol
      ctx.fillStyle = '#ffffff';
      const symbolSize = rat.size * 3;
      const symbolX = rat.position.x;
      const symbolY = rat.position.y;
      
      // Draw spider body
      ctx.beginPath();
      // Main body (triangular shape)
      ctx.moveTo(symbolX, symbolY - symbolSize * 0.4);
      ctx.lineTo(symbolX + symbolSize * 0.15, symbolY);
      ctx.lineTo(symbolX, symbolY + symbolSize * 0.4);
      ctx.lineTo(symbolX - symbolSize * 0.15, symbolY);
      ctx.closePath();
      ctx.fill();

      // Spider legs
      ctx.beginPath();
      ctx.lineWidth = symbolSize * 0.15;

      // Top legs (pointing up and out)
      ctx.moveTo(symbolX, symbolY - symbolSize * 0.2);
      ctx.lineTo(symbolX + symbolSize * 0.4, symbolY - symbolSize * 0.5);
      ctx.moveTo(symbolX, symbolY - symbolSize * 0.2);
      ctx.lineTo(symbolX - symbolSize * 0.4, symbolY - symbolSize * 0.5);

      // Upper middle legs (pointing up-out)
      ctx.moveTo(symbolX + symbolSize * 0.1, symbolY - symbolSize * 0.1);
      ctx.lineTo(symbolX + symbolSize * 0.5, symbolY - symbolSize * 0.2);
      ctx.moveTo(symbolX - symbolSize * 0.1, symbolY - symbolSize * 0.1);
      ctx.lineTo(symbolX - symbolSize * 0.5, symbolY - symbolSize * 0.2);

      // Lower middle legs (pointing down-out)
      ctx.moveTo(symbolX + symbolSize * 0.1, symbolY + symbolSize * 0.1);
      ctx.lineTo(symbolX + symbolSize * 0.5, symbolY + symbolSize * 0.2);
      ctx.moveTo(symbolX - symbolSize * 0.1, symbolY + symbolSize * 0.1);
      ctx.lineTo(symbolX - symbolSize * 0.5, symbolY + symbolSize * 0.2);

      // Bottom legs (pointing down and out)
      ctx.moveTo(symbolX, symbolY + symbolSize * 0.2);
      ctx.lineTo(symbolX + symbolSize * 0.4, symbolY + symbolSize * 0.5);
      ctx.moveTo(symbolX, symbolY + symbolSize * 0.2);
      ctx.lineTo(symbolX - symbolSize * 0.4, symbolY + symbolSize * 0.5);

      ctx.stroke();

      // Draw head (without spider symbol)
      ctx.fillStyle = ratColor;
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(
        headX + Math.cos(headAngle + Math.PI/2) * rat.size * 0.6,
        headY + Math.sin(headAngle + Math.PI/2) * rat.size * 0.6
      );
      ctx.lineTo(
        headX + Math.cos(headAngle) * rat.size,
        headY + Math.sin(headAngle) * rat.size
      );
      ctx.lineTo(
        headX + Math.cos(headAngle - Math.PI/2) * rat.size * 0.6,
        headY + Math.sin(headAngle - Math.PI/2) * rat.size * 0.6
      );
      ctx.closePath();
      ctx.fill();

      // Draw tongue if ability is unlocked
      if (rat.compound === 'VENOM_SYMBIOTE' && rat.unlockedAbilities.tongue) {
        const tongueWave = Math.sin(Date.now() / 100) * rat.size * 0.3;
        const tongueLength = Math.min(rat.size * (1 + rat.tongueLength), rat.size * 4);
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = rat.size * 0.2;
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        
        // Create wavy tongue effect
        for (let i = 1; i <= 10; i++) {
          const t = i / 10;
          const tx = headX + Math.cos(headAngle) * (tongueLength * t);
          const ty = headY + Math.sin(headAngle) * (tongueLength * t);
          const wave = Math.sin(t * Math.PI * 4 + Date.now() / 100) * tongueWave;
          
          ctx.lineTo(
            tx + Math.cos(headAngle + Math.PI/2) * wave,
            ty + Math.sin(headAngle + Math.PI/2) * wave
          );
        }
        ctx.stroke();
      }
    } else {
      // Original rat body drawing for other compounds
      for (let i = 0; i < 8; i++) {
        const offset = i * (bodyLength / 8);
        ctx.beginPath();
        ctx.arc(
          rat.position.x - Math.cos(headAngle) * offset,
          rat.position.y - Math.sin(headAngle) * offset,
          bodyWidth - (offset / bodyLength) * (bodyWidth / 2),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Ears (triangular)
    const earSize = rat.size * 0.5;
    const earOffset = rat.size * 0.4;
    
    // Left ear
    ctx.beginPath();
    const leftEarX = headX - Math.cos(headAngle) * earOffset;
    const leftEarY = headY - Math.sin(headAngle) * earOffset;
    ctx.moveTo(leftEarX, leftEarY);
    ctx.lineTo(
      leftEarX + Math.cos(headAngle - Math.PI/3) * earSize,
      leftEarY + Math.sin(headAngle - Math.PI/3) * earSize
    );
    ctx.lineTo(
      leftEarX + Math.cos(headAngle - Math.PI/6) * earSize,
      leftEarY + Math.sin(headAngle - Math.PI/6) * earSize
    );
    ctx.closePath();
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    const rightEarX = headX - Math.cos(headAngle) * earOffset;
    const rightEarY = headY - Math.sin(headAngle) * earOffset;
    ctx.moveTo(rightEarX, rightEarY);
    ctx.lineTo(
      rightEarX + Math.cos(headAngle + Math.PI/3) * earSize,
      rightEarY + Math.sin(headAngle + Math.PI/3) * earSize
    );
    ctx.lineTo(
      rightEarX + Math.cos(headAngle + Math.PI/6) * earSize,
      rightEarY + Math.sin(headAngle + Math.PI/6) * earSize
    );
    ctx.closePath();
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    const eyeOffset = rat.size * 0.3;
    ctx.beginPath();
    ctx.arc(
      headX + Math.cos(headAngle - Math.PI/6) * eyeOffset,
      headY + Math.sin(headAngle - Math.PI/6) * eyeOffset,
      rat.size * 0.15,
      0,
      Math.PI * 2
    );
    ctx.arc(
      headX + Math.cos(headAngle + Math.PI/6) * eyeOffset,
      headY + Math.sin(headAngle + Math.PI/6) * eyeOffset,
      rat.size * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = rat.size * 0.05;
    const whiskerLength = rat.size * 0.8;
    const whiskerSpread = Math.PI / 6;
    const whiskerCount = 3;
    
    for (let i = 0; i < whiskerCount; i++) {
      const whiskerAngle = whiskerSpread * ((i / (whiskerCount - 1)) - 0.5);
      
      // Left whiskers
      ctx.beginPath();
      ctx.moveTo(
        headX + Math.cos(headAngle - Math.PI/4) * rat.size * 0.3,
        headY + Math.sin(headAngle - Math.PI/4) * rat.size * 0.3
      );
      ctx.lineTo(
        headX + Math.cos(headAngle - Math.PI/4 + whiskerAngle) * whiskerLength,
        headY + Math.sin(headAngle - Math.PI/4 + whiskerAngle) * whiskerLength
      );
      ctx.stroke();
      
      // Right whiskers
      ctx.beginPath();
      ctx.moveTo(
        headX + Math.cos(headAngle + Math.PI/4) * rat.size * 0.3,
        headY + Math.sin(headAngle + Math.PI/4) * rat.size * 0.3
      );
      ctx.lineTo(
        headX + Math.cos(headAngle + Math.PI/4 + whiskerAngle) * whiskerLength,
        headY + Math.sin(headAngle + Math.PI/4 + whiskerAngle) * whiskerLength
      );
      ctx.stroke();
    }
    
    // Tail (curved and segmented)
    ctx.strokeStyle = ratColor;
    ctx.lineWidth = rat.size * 0.3;
    const tailLength = rat.size * 4;
    const tailStart = {
      x: rat.position.x - Math.cos(headAngle) * bodyLength,
      y: rat.position.y - Math.sin(headAngle) * bodyLength
    };
    
    ctx.beginPath();
    ctx.moveTo(tailStart.x, tailStart.y);
    
    // Create a wavy tail effect
    const segments = 12;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const tx = tailStart.x - Math.cos(headAngle) * (tailLength * t);
      const ty = tailStart.y - Math.sin(headAngle) * (tailLength * t);
      const wave = Math.sin(t * Math.PI * 2) * rat.size * 0.3;
      
      ctx.lineTo(
        tx + Math.cos(headAngle + Math.PI/2) * wave,
        ty + Math.sin(headAngle + Math.PI/2) * wave
      );
    }
    ctx.stroke();
    
    // Name tag
    ctx.fillStyle = '#00ff9d';
    ctx.font = '10px "Geist Mono"';
    ctx.textAlign = 'center';
    ctx.fillText(rat.name, rat.position.x, rat.position.y - rat.size * 2.5);
    
    if (rat.compound === 'COMPOUND_V') {
      // Draw cape
      const capeLength = rat.size * 3;
      const capeWidth = rat.size * 2;
      
      // Cape anchor points on shoulders
      const leftShoulderX = rat.position.x + Math.cos(headAngle + Math.PI/2) * bodyWidth;
      const leftShoulderY = rat.position.y + Math.sin(headAngle + Math.PI/2) * bodyWidth;
      const rightShoulderX = rat.position.x + Math.cos(headAngle - Math.PI/2) * bodyWidth;
      const rightShoulderY = rat.position.y + Math.sin(headAngle - Math.PI/2) * bodyWidth;
      
      // Cape end points with wave effect
      const capeEndX = rat.position.x + Math.cos(rat.capeAngle) * capeLength;
      const capeEndY = rat.position.y + Math.sin(rat.capeAngle) * capeLength;
      
      // Draw base cape (dark blue)
      ctx.fillStyle = '#002868'; // American flag blue
      ctx.beginPath();
      ctx.moveTo(leftShoulderX, leftShoulderY);
      ctx.quadraticCurveTo(
        capeEndX, capeEndY,
        rightShoulderX, rightShoulderY
      );
      ctx.closePath();
      ctx.fill();

      // Draw stripes
      const stripeCount = 7;
      const stripeSpacing = capeLength / stripeCount;
      ctx.fillStyle = '#bf0a30'; // American flag red

      for (let i = 0; i < stripeCount; i++) {
        if (i % 2 === 0) { // Draw only on even indices for alternating stripes
          const stripeDistance = i * stripeSpacing;
          const stripeAngle = rat.capeAngle + Math.sin(Date.now() / 300 + i * 0.5) * 0.1;
          
          ctx.beginPath();
          ctx.moveTo(leftShoulderX, leftShoulderY);
          
          // Calculate stripe end points
          const stripeEndX = rat.position.x + Math.cos(stripeAngle) * (capeLength - stripeDistance);
          const stripeEndY = rat.position.y + Math.sin(stripeAngle) * (capeLength - stripeDistance);
          
          // Draw curved stripe
          ctx.quadraticCurveTo(
            stripeEndX, stripeEndY,
            rightShoulderX, rightShoulderY
          );
          
          // Make stripe thinner
          const innerStripeEndX = rat.position.x + Math.cos(stripeAngle) * (capeLength - stripeDistance - stripeSpacing * 0.8);
          const innerStripeEndY = rat.position.y + Math.sin(stripeAngle) * (capeLength - stripeDistance - stripeSpacing * 0.8);
          
          ctx.quadraticCurveTo(
            innerStripeEndX, innerStripeEndY,
            leftShoulderX, leftShoulderY
          );
          
          ctx.closePath();
          ctx.fill();
        }
      }

      // Draw stars section (blue canton with white stars)
      const starSectionSize = capeWidth * 0.4;
      ctx.fillStyle = '#ffffff';
      
      // Draw 5 small stars in a pentagon formation
      const starRadius = rat.size * 0.15;
      const starCenterX = leftShoulderX + bodyWidth * 0.3;
      const starCenterY = leftShoulderY + bodyWidth * 0.3;
      
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) + Math.sin(Date.now() / 1000) * 0.1;
        const x = starCenterX + Math.cos(angle) * starRadius * 2;
        const y = starCenterY + Math.sin(angle) * starRadius * 2;
        
        // Draw 5-pointed star
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const starAngle = (j * 2 * Math.PI / 5) - Math.PI / 2;
          const px = x + Math.cos(starAngle) * starRadius * (j % 2 ? 0.5 : 1);
          const py = y + Math.sin(starAngle) * starRadius * (j % 2 ? 0.5 : 1);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }

      if (rat.isFireingLaser) {
        const laserLength = 1000; // Long enough to reach screen edges
        const laserWidth = rat.size * 0.2;
        const eyeOffset = rat.size * 0.3;
        
        // Laser gradient
        const gradient = ctx.createLinearGradient(
          headX, headY,
          headX + Math.cos(headAngle) * laserLength,
          headY + Math.sin(headAngle) * laserLength
        );
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        // Draw laser from each eye
        ctx.strokeStyle = gradient;
        ctx.lineWidth = laserWidth;
        ctx.lineCap = 'round';
        
        // Left eye laser
        ctx.beginPath();
        ctx.moveTo(
          headX + Math.cos(headAngle - Math.PI/6) * eyeOffset,
          headY + Math.sin(headAngle - Math.PI/6) * eyeOffset
        );
        ctx.lineTo(
          headX + Math.cos(headAngle) * laserLength,
          headY + Math.sin(headAngle) * laserLength
        );
        ctx.stroke();
        
        // Right eye laser
        ctx.beginPath();
        ctx.moveTo(
          headX + Math.cos(headAngle + Math.PI/6) * eyeOffset,
          headY + Math.sin(headAngle + Math.PI/6) * eyeOffset
        );
        ctx.lineTo(
          headX + Math.cos(headAngle) * laserLength,
          headY + Math.sin(headAngle) * laserLength
        );
        ctx.stroke();
      }

      if (rat.isAuraActive) {
        // Draw electric aura
        const auraRadius = rat.size * 3;
        const boltCount = 12;
        const innerRadius = rat.size * 1.5;
        
        // Create lightning gradient
        const auraGradient = ctx.createRadialGradient(
          rat.position.x, rat.position.y, innerRadius,
          rat.position.x, rat.position.y, auraRadius
        );
        auraGradient.addColorStop(0, 'rgba(0, 128, 255, 0.4)');
        auraGradient.addColorStop(1, 'rgba(0, 128, 255, 0)');
        
        // Draw base aura glow
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(rat.position.x, rat.position.y, auraRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw lightning bolts
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = rat.size * 0.1;
        
        for (let i = 0; i < boltCount; i++) {
          const angle = (i / boltCount) * Math.PI * 2 + Date.now() / 200;
          const segments = 4;
          
          ctx.beginPath();
          let x = rat.position.x + Math.cos(angle) * innerRadius;
          let y = rat.position.y + Math.sin(angle) * innerRadius;
          ctx.moveTo(x, y);
          
          // Create jagged lightning effect
          for (let j = 1; j <= segments; j++) {
            const t = j / segments;
            const radius = innerRadius + (auraRadius - innerRadius) * t;
            const jitterAmount = rat.size * (1 - t) * 0.5;
            const segmentAngle = angle + (Math.random() - 0.5) * 0.5;
            
            x = rat.position.x + Math.cos(segmentAngle) * radius + (Math.random() - 0.5) * jitterAmount;
            y = rat.position.y + Math.sin(segmentAngle) * radius + (Math.random() - 0.5) * jitterAmount;
            
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      if (rat.isFireAuraActive) {
        const auraRadius = rat.size * 3;
        const flameCount = 16;
        const innerRadius = rat.size * 1.2;
        
        // Add base fire aura
        const baseAuraGradient = ctx.createRadialGradient(
          rat.position.x, rat.position.y, innerRadius,
          rat.position.x, rat.position.y, auraRadius * 1.2
        );
        baseAuraGradient.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
        baseAuraGradient.addColorStop(0.6, 'rgba(255, 60, 0, 0.2)');
        baseAuraGradient.addColorStop(1, 'rgba(255, 30, 0, 0)');
        
        ctx.fillStyle = baseAuraGradient;
        ctx.beginPath();
        ctx.arc(rat.position.x, rat.position.y, auraRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw flames
        for (let i = 0; i < flameCount; i++) {
          const baseAngle = (i / flameCount) * Math.PI * 2;
          const time = Date.now() / 150;
          const waveOffset = Math.sin(time + i) * 0.3;
          const angle = baseAngle + waveOffset;
          
          // Start at base of flame
          const startX = rat.position.x + Math.cos(angle) * innerRadius;
          const startY = rat.position.y + Math.sin(angle) * innerRadius;
          
          // Calculate dynamic flame properties
          const flameHeight = auraRadius * (1.2 + Math.sin(time + i * 0.7) * 0.4);
          
          // Create multiple control points for more organic shape
          const cp1Distance = flameHeight * 0.3;
          const cp2Distance = flameHeight * 0.6;
          
          // Calculate control points with spiral effect
          const spiralTightness = 0.8;
          const cp1x = startX + Math.cos(angle - spiralTightness) * cp1Distance;
          const cp1y = startY + Math.sin(angle - spiralTightness) * cp1Distance;
          const cp2x = startX + Math.cos(angle + spiralTightness) * cp2Distance;
          const cp2y = startY + Math.sin(angle + spiralTightness) * cp2Distance;
          const tipX = startX + Math.cos(angle) * flameHeight;
          const tipY = startY + Math.sin(angle) * flameHeight;
          
          // Create flame path
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
          
          // Create gradient for individual flame
          const flameGradient = ctx.createLinearGradient(startX, startY, tipX, tipY);
          flameGradient.addColorStop(0, 'rgba(255, 50, 0, 0.9)');
          flameGradient.addColorStop(0.4, 'rgba(255, 120, 0, 0.7)');
          flameGradient.addColorStop(0.7, 'rgba(255, 200, 0, 0.5)');
          flameGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
          
          ctx.strokeStyle = flameGradient;
          ctx.lineWidth = rat.size * 0.3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        
        // Add inner glow
        const innerGlow = ctx.createRadialGradient(
          rat.position.x, rat.position.y, 0,
          rat.position.x, rat.position.y, innerRadius
        );
        innerGlow.addColorStop(0, 'rgba(255, 50, 0, 0.6)');
        innerGlow.addColorStop(1, 'rgba(255, 120, 0, 0)');
        
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(rat.position.x, rat.position.y, innerRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (rat.compound === 'LIZARD_SERUM') {
      // Draw lizard body (thicker at center, tapering at ends)
      for (let i = 0; i < 8; i++) {
        const offset = i * (bodyLength / 8);
        const t = offset / bodyLength;
        // Modified width calculation for lizard-like shape
        const width = bodyWidth * (1 - Math.pow(t - 0.5, 2) * 1.5);
        
        ctx.beginPath();
        ctx.arc(
          rat.position.x - Math.cos(headAngle) * offset,
          rat.position.y - Math.sin(headAngle) * offset,
          width,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Draw lizard tail with spikes
      const tailStart = {
        x: rat.position.x - Math.cos(headAngle) * bodyLength,
        y: rat.position.y - Math.sin(headAngle) * bodyLength
      };

      const tailLength = rat.size * 4;
      const mainSegments = 15;
      const time = Date.now() / 600; // Slower movement for reptilian feel

      // Draw main tail body
      ctx.beginPath();
      ctx.moveTo(tailStart.x, tailStart.y);

      // Create base tail path with minimal wave
      for (let i = 1; i <= mainSegments; i++) {
        const t = i / mainSegments;
        // Sharp taper for lizard tail
        const width = bodyWidth * Math.pow(1 - t, 1.2);
        const x = tailStart.x - Math.cos(headAngle) * (tailLength * t);
        const y = tailStart.y - Math.sin(headAngle) * (tailLength * t);
        
        // Very subtle wave for rigid appearance
        const wave = Math.sin(t * Math.PI + time) * rat.size * 0.05;
        
        ctx.lineTo(
          x + Math.cos(headAngle + Math.PI/2) * wave,
          y + Math.sin(headAngle + Math.PI/2) * wave
        );
      }

      ctx.strokeStyle = '#2a5c3c';
      ctx.lineWidth = bodyWidth * 0.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw spikes along the tail
      const spikeCount = 8;
      for (let i = 0; i < spikeCount; i++) {
        const t = i / spikeCount;
        const baseX = tailStart.x - Math.cos(headAngle) * (tailLength * t);
        const baseY = tailStart.y - Math.sin(headAngle) * (tailLength * t);
        
        // Calculate spike size (larger near base, smaller at tip)
        const spikeSize = rat.size * 0.5 * (1 - t * 0.7);
        
        // Alternate spikes up and down
        const sideAngle = headAngle + (i % 2 ? Math.PI/2 : -Math.PI/2);
        
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(
          baseX + Math.cos(sideAngle) * spikeSize,
          baseY + Math.sin(sideAngle) * spikeSize
        );
        
        ctx.strokeStyle = '#2a5c3c';
        ctx.lineWidth = rat.size * 0.2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    } else {
      // Original tail code for other compounds
      ctx.strokeStyle = ratColor;
      ctx.lineWidth = rat.size * 0.3;
      const tailLength = rat.size * 4;
      const tailStart = {
        x: rat.position.x - Math.cos(headAngle) * bodyLength,
        y: rat.position.y - Math.sin(headAngle) * bodyLength
      };
      
      ctx.beginPath();
      ctx.moveTo(tailStart.x, tailStart.y);
      
      // Create a wavy tail effect
      const segments = 12;
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const tx = tailStart.x - Math.cos(headAngle) * (tailLength * t);
        const ty = tailStart.y - Math.sin(headAngle) * (tailLength * t);
        const wave = Math.sin(t * Math.PI * 2) * rat.size * 0.3;
        
        ctx.lineTo(
          tx + Math.cos(headAngle + Math.PI/2) * wave,
          ty + Math.sin(headAngle + Math.PI/2) * wave
        );
      }
      ctx.stroke();
    }
    
    if (rat.compound === 'SUPER_SOLDIER_SERUM' && rat.isThrowingShield) {
      // Draw shield
      const shieldSize = rat.size * 0.8;
      ctx.beginPath();
      ctx.arc(rat.shieldPosition.x, rat.shieldPosition.y, shieldSize, 0, Math.PI * 2);
      ctx.fillStyle = '#cc0000'; // Red
      ctx.fill();
      ctx.strokeStyle = '#ffffff'; // White
      ctx.lineWidth = shieldSize * 0.2;
      ctx.stroke();
      
      // Draw star
      const starSize = shieldSize * 0.5;
      ctx.save();
      ctx.translate(rat.shieldPosition.x, rat.shieldPosition.y);
      ctx.rotate(rat.shieldReturnProgress * Math.PI * 4); // Spin shield
      drawStar(ctx, 0, 0, 5, starSize, starSize * 0.4);
      ctx.restore();
    }
    
    if (rat.compound === 'SUPER_SOLDIER_SERUM') {
      // Draw star on back
      const starCenterX = rat.position.x - Math.cos(headAngle) * (bodyLength * 0.3);
      const starCenterY = rat.position.y - Math.sin(headAngle) * (bodyLength * 0.3);
      const starRadius = rat.size * 0.8;

      // Draw white circle background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(starCenterX, starCenterY, starRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw red circle
      ctx.fillStyle = '#bf0a30'; // American flag red
      ctx.beginPath();
      ctx.arc(starCenterX, starCenterY, starRadius * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Draw white star
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        const outerX = starCenterX + Math.cos(angle) * starRadius * 0.8;
        const outerY = starCenterY + Math.sin(angle) * starRadius * 0.8;
        const innerX = starCenterX + Math.cos(angle + Math.PI/5) * starRadius * 0.3;
        const innerY = starCenterY + Math.sin(angle + Math.PI/5) * starRadius * 0.3;
        
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    if (rat.compound === 'THE_GRASSES' && rat.isSignActive) {
      const signSize = rat.size * 2;
      ctx.save();
      ctx.translate(rat.signPosition.x, rat.signPosition.y);
      ctx.rotate(rat.signRotation);
      ctx.scale(rat.signScale, rat.signScale);
      
      switch(rat.currentSign) {
        case 0: // Aard - Blue force wave
          ctx.fillStyle = '#00ffff80';
          ctx.beginPath();
          ctx.arc(0, 0, signSize * 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 1: // Igni - Red fire stream
          ctx.fillStyle = '#ff450080';
          drawFireEffect(ctx, 0, 0, signSize * 2);
          break;
        case 2: // Yrden - Purple magic circle
          ctx.strokeStyle = '#80008080';
          ctx.lineWidth = 3;
          drawMagicCircle(ctx, 0, 0, signSize);
          break;
        case 3: // Quen - Golden shield
          ctx.fillStyle = '#ffd70080';
          drawShieldEffect(ctx, 0, 0, signSize);
          break;
        case 4: // Axii - Green mind control waves
          ctx.strokeStyle = '#00800080';
          drawMindControlEffect(ctx, 0, 0, signSize);
          break;
      }
      ctx.restore();
      
      // Draw witcher eyes
      const eyeSize = rat.size * 0.3;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(headX - Math.cos(headAngle + Math.PI/4) * eyeSize, 
              headY - Math.sin(headAngle + Math.PI/4) * eyeSize, 
              eyeSize/2, 0, Math.PI * 2);
      ctx.arc(headX - Math.cos(headAngle - Math.PI/4) * eyeSize, 
              headY - Math.sin(headAngle - Math.PI/4) * eyeSize, 
              eyeSize/2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#4a008850';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Combine vertical lines
    for (let i = 0; i < width; i += 20) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
    }
    
    // Combine horizontal lines
    for (let i = 0; i < height; i += 20) {
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
    }
    ctx.stroke();
  };

  const drawScanlines = (ctx, height) => {
    ctx.fillStyle = '#00000015';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, ctx.canvas.width, 2);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Get initial canvas size
    const updateCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    updateCanvasSize();
    
    function animate() {
      // Clear canvas
      ctx.fillStyle = '#1a0044';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid and scanlines
      drawGrid(ctx, canvas.width, canvas.height);
      drawScanlines(ctx, canvas.height);
      
      // Draw rats with adjusted speed
      rats.forEach(rat => {
        if (rat.update) {
          // Calculate full rat dimensions including body length and width
          const bodyLength = rat.size * 2;
          const bodyWidth = rat.size * 1.2;
          const padding = Math.max(bodyLength, bodyWidth);
          const rightPadding = padding * 14; // Double padding for right and bottom
          const bottomPadding = padding * 8; // Double padding for right and bottom
          
          // Check boundaries with proper padding
          if (rat.position.x <= padding) {
            rat.position.x = padding;
            rat.velocity.x = Math.abs(rat.velocity.x);
          } else if (rat.position.x >= canvas.width - rightPadding) {
            rat.position.x = canvas.width - rightPadding;
            rat.velocity.x = -Math.abs(rat.velocity.x);
          }
          
          if (rat.position.y <= padding) {
            rat.position.y = padding;
            rat.velocity.y = Math.abs(rat.velocity.y);
          } else if (rat.position.y >= canvas.height - bottomPadding) {
            rat.position.y = canvas.height - bottomPadding;
            rat.velocity.y = -Math.abs(rat.velocity.y);
          }

          // Store original velocity
          const originalVX = rat.velocity.x;
          const originalVY = rat.velocity.y;
          
          // Apply speed multiplier
          rat.velocity.x *= 20;
          rat.velocity.y *= 20;
          
          // Update position
          rat.update();
          
          // Restore original velocity
          rat.velocity.x = originalVX;
          rat.velocity.y = originalVY;
        }
        drawRat(ctx, rat);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rats]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-[60vh] bg-terminal rounded-lg border border-foreground/20"
      width={800}
      height={600}
    />
  );
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.closePath();
  ctx.fill();
}

function drawFireEffect(ctx, x, y, size) {
  // Flame pattern
  for(let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * size/2,
      y + Math.sin(angle) * size/2,
      x + Math.cos(angle) * size,
      y + Math.sin(angle) * size
    );
    ctx.stroke();
  }
}

function drawMagicCircle(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();
  // Add runes
  for(let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.translate(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    ctx.rotate(angle);
    ctx.fillText('⚡', 0, 0);
    ctx.restore();
  }
}

function drawShieldEffect(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff40';
  ctx.stroke();
}

function drawMindControlEffect(ctx, x, y, size) {
  for(let i = 0; i < 3; i++) {
    const scale = 1 + i * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, size * scale, 0, Math.PI * 2);
    ctx.stroke();
  }
} 