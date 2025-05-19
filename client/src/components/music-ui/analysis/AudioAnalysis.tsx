import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Info, Download, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AudioAnalysisProps {
  audioElement?: HTMLAudioElement | null;
  className?: string;
}

interface AudioMetrics {
  loudness: number; // LUFS
  dynamicRange: number; // dB
  peakLevel: number; // dB
  rmsLevel: number; // dB
  crestFactor: number;
  spectralCentroid: number; // Hz
  spectralFlatness: number;
  spectralRolloff: number; // Hz
  zeroCrossings: number;
}

export function AudioAnalysis({
  audioElement,
  className = ''
}: AudioAnalysisProps) {
  const [metrics, setMetrics] = useState<AudioMetrics>({
    loudness: 0,
    dynamicRange: 0,
    peakLevel: 0,
    rmsLevel: 0,
    crestFactor: 0,
    spectralCentroid: 0,
    spectralFlatness: 0,
    spectralRolloff: 0,
    zeroCrossings: 0
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048; // Higher FFT size for better frequency resolution
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    };

    const analyzeAudio = () => {
      if (!analyserRef.current || !canvasRef.current) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const frequencyData = new Float32Array(bufferLength);
      const timeData = new Float32Array(bufferLength);
      
      analyserRef.current.getFloatFrequencyData(frequencyData);
      analyserRef.current.getFloatTimeDomainData(timeData);
      
      // Calculate metrics
      const newMetrics = calculateMetrics(frequencyData, timeData);
      setMetrics(newMetrics);
      
      // Draw visualization
      drawVisualization(frequencyData, timeData);
      
      if (isAnalyzing) {
        requestAnimationFrame(analyzeAudio);
      }
    };

    try {
      initAudioContext();
      setIsAnalyzing(true);
      analyzeAudio();
    } catch (error) {
      console.error("Error initializing audio analysis:", error);
      setIsAnalyzing(false);
    }

    return () => {
      setIsAnalyzing(false);
    };
  }, [audioElement]);

  const calculateMetrics = (frequencyData: Float32Array, timeData: Float32Array): AudioMetrics => {
    // Convert dB to linear scale
    const linearData = frequencyData.map(db => Math.pow(10, db / 20));
    
    // Calculate RMS level
    const rms = Math.sqrt(timeData.reduce((sum, val) => sum + val * val, 0) / timeData.length);
    const rmsDb = 20 * Math.log10(rms);
    
    // Calculate peak level
    const peak = Math.max(...timeData.map(Math.abs));
    const peakDb = 20 * Math.log10(peak);
    
    // Calculate crest factor
    const crestFactor = peak / rms;
    
    // Calculate spectral centroid
    const frequencies = Array.from({ length: frequencyData.length }, (_, i) => i * audioContextRef.current!.sampleRate / (2 * frequencyData.length));
    const centroid = frequencies.reduce((sum, freq, i) => sum + freq * linearData[i], 0) / linearData.reduce((sum, val) => sum + val, 0);
    
    // Calculate spectral flatness
    const geometricMean = Math.exp(linearData.reduce((sum, val) => sum + Math.log(val + 1e-10), 0) / linearData.length);
    const arithmeticMean = linearData.reduce((sum, val) => sum + val, 0) / linearData.length;
    const flatness = geometricMean / arithmeticMean;
    
    // Calculate spectral rolloff
    const totalEnergy = linearData.reduce((sum, val) => sum + val, 0);
    let cumulativeEnergy = 0;
    let rolloffIndex = 0;
    for (let i = 0; i < linearData.length; i++) {
      cumulativeEnergy += linearData[i];
      if (cumulativeEnergy >= totalEnergy * 0.85) {
        rolloffIndex = i;
        break;
      }
    }
    const rolloff = frequencies[rolloffIndex];
    
    // Calculate zero crossings
    let zeroCrossings = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i] >= 0 && timeData[i - 1] < 0) || (timeData[i] < 0 && timeData[i - 1] >= 0)) {
        zeroCrossings++;
      }
    }
    
    return {
      loudness: -14, // Placeholder - would need more sophisticated LUFS calculation
      dynamicRange: peakDb - rmsDb,
      peakLevel: peakDb,
      rmsLevel: rmsDb,
      crestFactor,
      spectralCentroid: centroid,
      spectralFlatness: flatness,
      spectralRolloff: rolloff,
      zeroCrossings
    };
  };

  const drawVisualization = (frequencyData: Float32Array, timeData: Float32Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw frequency spectrum
    const barWidth = width / frequencyData.length;
    ctx.fillStyle = '#4f46e5';
    
    for (let i = 0; i < frequencyData.length; i++) {
      const barHeight = (frequencyData[i] + 140) * height / 140;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audio Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Real-time audio analysis with spectral and dynamic metrics.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="spectrum">
          <TabsList className="mb-4">
            <TabsTrigger value="spectrum">Spectrum</TabsTrigger>
            <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spectrum">
            <div className="space-y-4">
              <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Spectral Centroid</h4>
                  <Progress value={metrics.spectralCentroid / 10000 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{Math.round(metrics.spectralCentroid)} Hz</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Spectral Flatness</h4>
                  <Progress value={metrics.spectralFlatness * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.spectralFlatness.toFixed(3)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dynamics">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Loudness (LUFS)</h4>
                  <Progress value={Math.abs(metrics.loudness) / 20 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.loudness.toFixed(1)} LUFS</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Dynamic Range</h4>
                  <Progress value={metrics.dynamicRange / 20 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.dynamicRange.toFixed(1)} dB</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Peak Level</h4>
                  <Progress value={Math.abs(metrics.peakLevel) / 20 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.peakLevel.toFixed(1)} dB</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">RMS Level</h4>
                  <Progress value={Math.abs(metrics.rmsLevel) / 20 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.rmsLevel.toFixed(1)} dB</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technical">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Crest Factor</h4>
                  <Progress value={metrics.crestFactor / 10 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.crestFactor.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Spectral Rolloff</h4>
                  <Progress value={metrics.spectralRolloff / 10000 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{Math.round(metrics.spectralRolloff)} Hz</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Zero Crossings</h4>
                  <Progress value={metrics.zeroCrossings / 1000 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.zeroCrossings} per second</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 