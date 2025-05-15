import { useRef, useEffect, useState } from 'react';

type VisualizerType = 'bars' | 'circle' | 'wave';

interface VisualizerProps {
  type?: VisualizerType;
  colorPalette?: string[];
  height?: number;
  isActive?: boolean;
  audioElement?: HTMLAudioElement | null;
  className?: string;
  onTypeChange?: (type: VisualizerType) => void;
}

export function Visualizer({
  type = 'bars',
  colorPalette = ['#6200EA', '#00C853', '#FF3D00'], // Explicit hex colors instead of CSS variables
  height = 200,
  isActive = true,
  audioElement,
  className = '',
  onTypeChange
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  const [visualizerType, setVisualizerType] = useState<VisualizerType>(type);

  useEffect(() => {
    setVisualizerType(type);
  }, [type]);

  const handleTypeChange = (newType: VisualizerType) => {
    setVisualizerType(newType);
    onTypeChange && onTypeChange(newType);
  };

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    // If we have an audio element, use real audio visualization
    if (audioElement) {
      initializeAudioVisualization();
    } else {
      // Otherwise, show a demo visualization
      renderDemoVisualization();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, isActive, visualizerType, colorPalette, height]);

  const initializeAudioVisualization = () => {
    if (!audioElement || !canvasRef.current) return;

    try {
      // Initialize audio context if not already created
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

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx || !analyserRef.current) return;

      const draw = () => {
        if (!ctx || !analyserRef.current) return;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Draw based on visualizer type
        switch (visualizerType) {
          case 'bars':
            drawBars(ctx, canvas, dataArray, bufferLength);
            break;
          case 'circle':
            drawCircle(ctx, canvas, dataArray, bufferLength);
            break;
          case 'wave':
            drawWave(ctx, canvas, dataArray, bufferLength);
            break;
        }
        
        animationRef.current = requestAnimationFrame(draw);
      };
      
      draw();
    } catch (error) {
      console.error("Error initializing audio visualizer:", error);
      renderDemoVisualization();
    }
  };

  const renderDemoVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create demo data
    const bufferLength = 64;
    const generateData = () => {
      return Array.from({ length: bufferLength }, () => 
        Math.floor(Math.random() * 150) + 50
      );
    };
    
    let dataArray = generateData();
    let step = 0;
    
    const draw = () => {
      if (!ctx) return;
      
      // Update demo data slightly for animation
      if (step % 5 === 0) {
        dataArray = dataArray.map(val => {
          const change = Math.floor(Math.random() * 30) - 15;
          return Math.max(30, Math.min(200, val + change));
        });
      }
      step++;
      
      // Draw based on visualizer type
      switch (visualizerType) {
        case 'bars':
          drawBars(ctx, canvas, dataArray, bufferLength);
          break;
        case 'circle':
          drawCircle(ctx, canvas, dataArray, bufferLength);
          break;
        case 'wave':
          drawWave(ctx, canvas, dataArray, bufferLength);
          break;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  const drawBars = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    dataArray: Uint8Array | number[], 
    bufferLength: number
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / bufferLength * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const value = typeof dataArray[i] === 'number' ? dataArray[i] : 0;
      const barHeight = (value / 255) * canvas.height;
      
      // Use colors from palette with gradient effect
      const colorIndex = i % colorPalette.length;
      const nextColorIndex = (i + 1) % colorPalette.length;
      
      const gradient = ctx.createLinearGradient(
        x, canvas.height - barHeight, 
        x, canvas.height
      );
      gradient.addColorStop(0, colorPalette[colorIndex]);
      gradient.addColorStop(1, colorPalette[nextColorIndex]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      
      x += barWidth;
    }
  };

  const drawCircle = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    dataArray: Uint8Array | number[], 
    bufferLength: number
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 4, 0, 2 * Math.PI);
    ctx.fillStyle = colorPalette[0];
    ctx.fill();
    
    for (let i = 0; i < bufferLength; i++) {
      const value = typeof dataArray[i] === 'number' ? dataArray[i] : 0;
      const barHeight = (value / 255) * (radius - radius / 4);
      
      const angle = (i * 2 * Math.PI) / bufferLength;
      const x1 = centerX + Math.cos(angle) * (radius / 4);
      const y1 = centerY + Math.sin(angle) * (radius / 4);
      const x2 = centerX + Math.cos(angle) * (radius / 4 + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius / 4 + barHeight);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = colorPalette[i % colorPalette.length];
      ctx.stroke();
    }
  };

  const drawWave = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    dataArray: Uint8Array | number[], 
    bufferLength: number
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const value = typeof dataArray[i] === 'number' ? dataArray[i] : 0;
      const y = (value / 255) * canvas.height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(canvas.width, canvas.height / 2);
    
    // Create gradient for wave
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (colorPalette.length === 1) {
      gradient.addColorStop(0, colorPalette[0]);
      gradient.addColorStop(1, colorPalette[0]);
    } else {
      colorPalette.forEach((color, index) => {
        const position = colorPalette.length === 1 ? 0.5 : index / Math.max(1, (colorPalette.length - 1));
        gradient.addColorStop(position, color);
      });
    }
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  return (
    <div className={className}>
      <div className={`h-[${height}px] bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden`}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={height} 
          className="w-full h-full"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button 
          className={`text-sm font-medium py-2 px-3 rounded-md ${
            visualizerType === 'bars' 
              ? 'bg-primary text-white' 
              : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
          } transition`}
          onClick={() => handleTypeChange('bars')}
        >
          Bar
        </button>
        <button 
          className={`text-sm font-medium py-2 px-3 rounded-md ${
            visualizerType === 'circle' 
              ? 'bg-primary text-white' 
              : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
          } transition`}
          onClick={() => handleTypeChange('circle')}
        >
          Circle
        </button>
        <button 
          className={`text-sm font-medium py-2 px-3 rounded-md ${
            visualizerType === 'wave' 
              ? 'bg-primary text-white' 
              : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
          } transition`}
          onClick={() => handleTypeChange('wave')}
        >
          Wave
        </button>
      </div>
    </div>
  );
}
