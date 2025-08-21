
'use client';

import React, { useRef, useEffect } from 'react';

const DOT_RADIUS = 0.8;
const INTERACTIVE_RADIUS = 60;
const GRID_GAP = 20;

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const dots = useRef<any[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      dots.current = [];
      for (let x = GRID_GAP / 2; x < rect.width; x += GRID_GAP) {
        for (let y = GRID_GAP / 2; y < rect.height; y += GRID_GAP) {
          dots.current.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.current.forEach(dot => {
        const dx = dot.x - mouse.current.x;
        const dy = dot.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let fx = 0, fy = 0;

        if (dist < INTERACTIVE_RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = (INTERACTIVE_RADIUS - dist) / INTERACTIVE_RADIUS;
          fx = Math.cos(angle) * force * 2; // Repulsion force
          fy = Math.sin(angle) * force * 2;
        }

        // Return to original position
        fx += (dot.ox - dot.x) * 0.1;
        fy += (dot.oy - dot.y) * 0.1;

        dot.vx = (dot.vx + fx) * 0.85; // Damping
        dot.vy = (dot.vy + fy) * 0.85;
        
        dot.x += dot.vx;
        dot.y += dot.vy;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-hsl');
        ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}, 0.5)`;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
       canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="dot-grid">
      <div className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </div>
  );
}

