import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationAngle: number;
  opacity: number;
  isBurst: boolean;
}

interface PetalCanvasProps {
  burstTrigger?: { x: number; y: number; count: number } | null;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ burstTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const colors = [
    '#ffb703', // Marigold Yellow
    '#fb8500', // Marigold Orange
    '#e63946', // Rose Crimson
    '#f8f9fa', // Jasmine White
    '#ffd166'  // Gold Petal
  ];

  const createPetal = (width: number, height: number, x?: number, y?: number, isBurst = false): Petal => {
    return {
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : -20,
      size: 7 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: isBurst ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.4,
      speedY: isBurst ? -2 - Math.random() * 6 : 0.9 + Math.random() * 2.0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.8,
      oscillationSpeed: 0.02 + Math.random() * 0.03,
      oscillationAngle: Math.random() * Math.PI * 2,
      opacity: 0.75 + Math.random() * 0.25,
      isBurst
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial petal pool
    petalsRef.current = Array.from({ length: 35 }, () =>
      createPetal(canvas.width, canvas.height, undefined, Math.random() * canvas.height)
    );

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const petals = petalsRef.current;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.oscillationAngle += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillationAngle) * 0.75;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.isBurst) {
          p.speedY += 0.14; // Gravity
          p.speedX *= 0.98; // Air resistance
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.y > canvas.height + 30 || p.x < -40 || p.x > canvas.width + 40) {
          if (p.isBurst) {
            petals.splice(i, 1);
          } else {
            petals[i] = createPetal(canvas.width, canvas.height);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Handle burst trigger
  useEffect(() => {
    if (!burstTrigger || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const count = burstTrigger.count || 50;
    for (let i = 0; i < count; i++) {
      petalsRef.current.push(
        createPetal(canvas.width, canvas.height, burstTrigger.x, burstTrigger.y, true)
      );
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      id="petalCanvas"
      className="petal-canvas-layer"
      aria-hidden="true"
    />
  );
};
