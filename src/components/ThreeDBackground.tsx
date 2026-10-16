import React, { useEffect, useRef } from 'react';

/**
 * ThreeDBackground:
 * Renders a realistic 3D perspective dot-grid matrix with depth perspective,
 * horizon vanishing point, subtle mouse parallax, and ambient crimson lighting.
 */
export const ThreeDBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 3D Grid Parameters
    const cols = 28;
    const rows = 24;
    let offsetZ = 0;

    // Detect headless / reduced motion
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (/HeadlessChrome/i.test(navigator.userAgent) || navigator.webdriver);

    const render = () => {
      // Ease mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep dark floor gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2 + mouseX * 60,
        height * 0.2 + mouseY * 40,
        10,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(220, 38, 38, 0.16)');
      bgGrad.addColorStop(0.35, 'rgba(15, 10, 12, 0.8)');
      bgGrad.addColorStop(1, 'rgba(7, 7, 9, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Camera / Horizon parameters
      const fov = 340;
      const cameraY = -120 + mouseY * 25;
      const cameraZ = -100;
      const horizonY = height * 0.42 + mouseY * 30;

      // Subtle forward drift
      if (!isHeadless) {
        offsetZ = (offsetZ + 0.35) % 40;
      }

      ctx.save();

      // Render 3D Perspective Dots & Longitudinal lines
      for (let r = 0; r < rows; r++) {
        const z = (rows - r) * 38 - offsetZ;
        if (z <= 10) continue;

        const scale = fov / (fov + z - cameraZ);
        const y2d = horizonY - (cameraY * scale);

        // Alpha fades as depth increases towards horizon
        const depthRatio = Math.max(0, Math.min(1, 1 - z / (rows * 38)));
        const alpha = Math.pow(depthRatio, 1.4) * 0.75;

        // Draw horizontal raster line faintly
        if (r % 2 === 0) {
          ctx.beginPath();
          const leftX = width / 2 - (cols * 45 * scale) / 2 + mouseX * 40 * (1 - depthRatio);
          const rightX = width / 2 + (cols * 45 * scale) / 2 + mouseX * 40 * (1 - depthRatio);
          ctx.moveTo(leftX, y2d);
          ctx.lineTo(rightX, y2d);
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw 3D Matrix Dots
        for (let c = 0; c < cols; c++) {
          const x = (c - cols / 2) * 55;
          const x2d = width / 2 + x * scale + mouseX * 50 * (1 - depthRatio);

          if (x2d < -20 || x2d > width + 20) continue;

          // Color calculation: central dots have slight red/white neon glow, outer dots are darker
          const centerDist = Math.abs(c - cols / 2) / (cols / 2);
          const dotRadius = Math.max(0.7, scale * 2.2);

          ctx.beginPath();
          ctx.arc(x2d, y2d, dotRadius, 0, Math.PI * 2);

          if (centerDist < 0.25 && depthRatio > 0.5) {
            // Hot center dots: crimson glow
            ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.95})`;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 6 * scale;
          } else if (centerDist < 0.55) {
            // Secondary dots: crisp white/silver
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
            ctx.shadowBlur = 0;
          } else {
            // Peripheral dots: subtle carbon
            ctx.fillStyle = `rgba(161, 161, 170, ${alpha * 0.4})`;
            ctx.shadowBlur = 0;
          }

          ctx.fill();
        }
      }

      ctx.restore();

      // Top ceiling subtle dot array for full 3D spatial enclosure
      const ceilingRows = 8;
      for (let cr = 0; cr < ceilingRows; cr++) {
        const cz = (ceilingRows - cr) * 45;
        const cScale = fov / (fov + cz);
        const cy2d = horizonY * 0.7 - (220 * cScale);
        const cAlpha = Math.pow(1 - cz / (ceilingRows * 45), 1.8) * 0.35;

        for (let cc = 0; cc < cols; cc += 2) {
          const cx = (cc - cols / 2) * 60;
          const cx2d = width / 2 + cx * cScale - mouseX * 20;

          ctx.beginPath();
          ctx.arc(cx2d, cy2d, 1.2 * cScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${cAlpha * 0.4})`;
          ctx.fill();
        }
      }

      if (!isHeadless) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Canvas Matrix Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Hexagonal / Dot-matrix Micro-Texture Overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.25) 0%, transparent 60%)',
          backgroundSize: '24px 24px, 100% 100%',
        }}
      />

      {/* Cyber Vignette & Edge Shadow */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 140px rgba(0, 0, 0, 0.95), inset 0 0 40px rgba(0, 0, 0, 0.9)',
        }}
      />
    </div>
  );
};
