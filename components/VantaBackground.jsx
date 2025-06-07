"use client";
import { useEffect, useRef } from 'react';

export default function VantaBackground({ children }) {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const time = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        function drawWave() {
            const width = canvas.width;
            const height = canvas.height;
            
            ctx.clearRect(0, 0, width, height);
            
            // Draw gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0f172a');  // Dark blue-gray
            gradient.addColorStop(1, '#1e293b');  // Darker blue-gray
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw animated waves
            time.current += 0.002;
            
            // First wave - deeper blue
            drawWaveLayer(ctx, width, height, 0.2, 0.4, 0.25, time.current, '#3b82f6');
            // Second wave - lighter blue
            drawWaveLayer(ctx, width, height, 0.3, 0.5, 0.2, time.current * 1.3, '#60a5fa');
            // Third wave - subtle purple
            drawWaveLayer(ctx, width, height, 0.4, 0.6, 0.15, time.current * 0.7, '#818cf8');
            
            animationRef.current = requestAnimationFrame(drawWave);
        }
        
        function drawWaveLayer(ctx, width, height, amplitude, frequency, opacity, time, color) {
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            
            for (let x = 0; x < width; x += 2) {
                const y = Math.sin(x * frequency * 0.01 + time) * amplitude * 50 + height * 0.6;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        animationRef.current = requestAnimationFrame(drawWave);
        
        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden isolate">
            <canvas 
                ref={canvasRef} 
                className="fixed top-0 left-0 w-full h-full -z-10"
            />
            <div className="relative z-0">
                {children}
            </div>
        </div>
    );
}
