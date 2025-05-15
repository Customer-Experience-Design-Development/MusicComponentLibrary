import { useEffect, useRef } from 'react';

interface EqualizerProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
}

export function Equalizer({ 
  isActive = true, 
  barCount = 5,
  className = ''
}: EqualizerProps) {
  return (
    <div className={`animated-eq ${className} ${!isActive ? 'opacity-0' : ''}`}>
      {Array.from({ length: barCount }).map((_, index) => (
        <span key={index}></span>
      ))}
    </div>
  );
}

// Advanced Equalizer with canvas visualization
interface CanvasEqualizerProps {
  audioElement?: HTMLAudioElement | null;
  barCount?: number;
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
  isActive?: boolean;
  className?: string;
}

export function CanvasEqualizer({
  audioElement,
  barCount = 32,
  height = 100,
  width = 200,
  barWidth = 4,
  barGap = 2,
  barColor = '#6200EA', // Explicit hex color instead of CSS variable
  isActive = true,
  className = ''
}: CanvasEqualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current || !isActive) return;

    // Initialize audio context
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    };

    // Draw visualization
    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw bars
      const totalWidth = barCount * (barWidth + barGap) - barGap;
      const startX = (canvas.width - totalWidth) / 2;
      
      for (let i = 0; i < barCount; i++) {
        const index = Math.floor(i * bufferLength / barCount);
        const barHeight = (dataArray[index] / 255) * canvas.height;
        
        ctx.fillStyle = barColor;
        ctx.fillRect(
          startX + i * (barWidth + barGap),
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    try {
      initAudioContext();
      draw();
    } catch (error) {
      console.error("Error initializing audio visualizer:", error);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, isActive, barCount, barWidth, barGap, barColor, height, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className} ${!isActive ? 'opacity-50' : ''}`}
    />
  );
}
