'use client'
import { useEffect, useRef } from 'react';
import { COMPOUNDS } from '../types/types';

export default function RatPreviewCanvas({ rat }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (rat && canvasRef.current) {
      const canvas = canvasRef.current;
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
      const centerX = canvas.width / 1.75;
      const centerY = canvas.height / 2;
      const ratSize = 12;
      
      ctx.save();
      const ratColor = rat.originalCompound === 'POLYJUICE_POTION' 
        ? COMPOUNDS['POLYJUICE_POTION'].color 
        : COMPOUNDS[rat.compound]?.color || '#ffffff';
      ctx.fillStyle = ratColor;
      ctx.strokeStyle = ratColor;

      const headAngle = 0; // Fixed angle for preview
      const bodyLength = ratSize * 2;
      const bodyWidth = ratSize * 1.2;

      // Draw tail first (behind body)
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
        const wave = Math.sin(t * Math.PI * 2) * ratSize * 0.3;
        
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

      // Draw head
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(headAngle) * bodyLength * 0.6, 
                centerY + Math.sin(headAngle) * bodyLength * 0.6);
      ctx.lineTo(
        centerX + Math.cos(headAngle + Math.PI/2) * ratSize * 0.6 + Math.cos(headAngle) * bodyLength * 0.6,
        centerY + Math.sin(headAngle + Math.PI/2) * ratSize * 0.6 + Math.sin(headAngle) * bodyLength * 0.6
      );
      ctx.lineTo(
        centerX + Math.cos(headAngle) * (bodyLength * 0.6 + ratSize),
        centerY + Math.sin(headAngle) * (bodyLength * 0.6 + ratSize)
      );
      ctx.lineTo(
        centerX + Math.cos(headAngle - Math.PI/2) * ratSize * 0.6 + Math.cos(headAngle) * bodyLength * 0.6,
        centerY + Math.sin(headAngle - Math.PI/2) * ratSize * 0.6 + Math.sin(headAngle) * bodyLength * 0.6
      );
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }, [rat]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-terminal rounded-lg border border-foreground/20"
      width={150}
      height={100}
    />
  );
} 