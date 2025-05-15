import { useMemo } from 'react';

interface WaveformProps {
  data?: number[];
  currentTime: number;
  duration: number;
  color?: string;
  progressColor?: string;
  height?: number;
  onClick?: (position: number) => void;
  className?: string;
}

export function Waveform({ 
  data, 
  currentTime, 
  duration, 
  color = '#6200EA', // Explicit hex color instead of CSS variable
  progressColor = '#6200EA', // Explicit hex color instead of CSS variable
  height = 64, 
  onClick,
  className = ''
}: WaveformProps) {
  // For demo, generate random waveform data if none provided
  const waveformData = useMemo(() => {
    if (data && data.length > 0) return data;
    return Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2);
  }, [data]);

  const progressPercentage = Math.min(100, Math.max(0, (currentTime / duration) * 100));
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    onClick(position);
  };

  return (
    <div 
      className={`waveform ${className}`} 
      style={{ height: `${height}px` }}
      onClick={handleClick}
    >
      <div 
        className="wave-path" 
        style={{
          backgroundImage: `url("data:image/svg+xml,${generateWaveformSVG(waveformData, color)}")`,
        }}
      />
      <div 
        className="absolute top-0 left-0 bottom-0 border-r-2 border-primary" 
        style={{ 
          width: `${progressPercentage}%`,
          backgroundColor: `${progressColor}20`,
        }}
      />
    </div>
  );
}

// Helper function to generate SVG for the waveform
function generateWaveformSVG(data: number[], color: string): string {
  const width = 1200;
  const height = 64;
  const points = data.map((amplitude, i) => 
    [i * (width / data.length), height / 2 * (1 - amplitude)]
  ).flat();
  
  const path = `M0 ${height / 2} ${points.join(' ')} ${width} ${height / 2}`;
  
  // Need to encode some characters for SVG in data URL
  const encodedColor = color.replace('#', '%23');
  
  const svg = `<svg width='100%25' height='${height}' viewBox='0 0 ${width} ${height}' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='${path}' stroke='${encodedColor}' stroke-opacity='0.5' stroke-width='2'/></svg>`;
  
  return encodeURIComponent(svg);
}
