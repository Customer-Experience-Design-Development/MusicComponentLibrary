import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Visualizer } from '@/components/music-ui/Visualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VisualizerPage() {
  // Sample audio data for demo
  const audioData = {
    frequencyData: new Float32Array(128).map((_, i) => Math.sin(i * 0.1) * 0.5 + 0.5),
    timeData: new Float32Array(128).map((_, i) => Math.cos(i * 0.1) * 0.5 + 0.5),
  };

  // Sidebar categories
  const sidebarCategories: NavCategory[] = [
    {
      title: "Getting Started",
      links: [
        { title: "Introduction", path: "/" },
        { title: "Installation", path: "/installation" },
        { title: "Usage", path: "/usage" },
        { title: "Theming", path: "/theming" },
      ]
    },
    {
      title: "Components",
      links: [
        { title: "Overview", path: "/components" },
        { title: "Component Showcase", path: "/components/showcase" },
        { title: "Audio Player", path: "/components/audio-player" },
        { title: "Playlist", path: "/components/playlist" },
        { title: "Visualizer", path: "/components/visualizer", active: true },
        { title: "Waveform", path: "/components/waveform" },
        { title: "Volume Control", path: "/components/volume-control" },
        { title: "Media Card", path: "/components/media-card" },
        { title: "Equalizer", path: "/components/equalizer" },
      ]
    },
    {
      title: "Resources",
      links: [
        { title: "Figma Integration", path: "/resources/figma" },
        { title: "Platform Support", path: "/resources/platforms" },
        { title: "Accessibility", path: "/resources/accessibility" },
        { title: "Changelog", path: "/resources/changelog" },
      ]
    }
  ];

  // Footer categories
  const footerCategories = [
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/documentation" },
        { label: "API Reference", href: "/api" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Examples", href: "/examples" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com/musicui" },
        { label: "Discord", href: "https://discord.gg/musicui" },
        { label: "Twitter", href: "https://twitter.com/musicui" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "License", href: "/license" }
      ]
    }
  ];

  // Social links
  const socialLinks = [
    { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
    { icon: "ri-github-fill", href: "https://github.com/musicui" },
    { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/visualizer" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader 
            title="Visualizer Component" 
            description="Real-time audio visualization with customizable styles and effects."
          />
          
          <Tabs defaultValue="preview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="p-0 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visualizer Demo</CardTitle>
                  <CardDescription>
                    Interactive demo of the Visualizer component with different visualization styles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-2xl mx-auto">
                    <Visualizer 
                      audioData={audioData}
                      type="bars"
                      color="#4F46E5"
                      height={200}
                      width={600}
                      barWidth={4}
                      barGap={2}
                      smoothing={0.8}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Learn how to use the Visualizer component in your applications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Overview</h3>
                    <p className="text-muted-foreground">
                      The Visualizer component provides real-time audio visualization with support for various
                      visualization styles, including bars, waves, and circles. It's perfect for creating
                      engaging audio experiences in your applications.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Props</h3>
                    <div className="border rounded-md divide-y">
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-medium">Name</div>
                        <div className="font-medium">Type</div>
                        <div className="font-medium">Description</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">audioData</div>
                        <div className="font-mono text-sm">AudioData</div>
                        <div>Audio data containing frequency and time domain data.</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">type</div>
                        <div className="font-mono text-sm">'bars' | 'waves' | 'circles'</div>
                        <div>Type of visualization to display.</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">color</div>
                        <div className="font-mono text-sm">string</div>
                        <div>Color of the visualization.</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">height</div>
                        <div className="font-mono text-sm">number</div>
                        <div>Height of the visualization in pixels.</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">width</div>
                        <div className="font-mono text-sm">number</div>
                        <div>Width of the visualization in pixels.</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">barWidth</div>
                        <div className="font-mono text-sm">number</div>
                        <div>Width of each bar in pixels (for bar visualization).</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">barGap</div>
                        <div className="font-mono text-sm">number</div>
                        <div>Gap between bars in pixels (for bar visualization).</div>
                      </div>
                      <div className="grid grid-cols-3 p-3">
                        <div className="font-mono text-sm">smoothing</div>
                        <div className="font-mono text-sm">number</div>
                        <div>Smoothing factor for animations (0-1).</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">AudioData Structure</h3>
                    <div className="border rounded-md p-4 bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`interface AudioData {
  frequencyData: Float32Array;
  timeData: Float32Array;
}`}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Usage Guidelines</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Use the Visualizer component to create engaging audio visualizations in your applications.</li>
                      <li>Choose the appropriate visualization type based on your needs (bars, waves, or circles).</li>
                      <li>Adjust the color, size, and smoothing parameters to match your design.</li>
                      <li>The component automatically handles animation and updates based on the provided audio data.</li>
                      <li>For best performance, ensure the audio data arrays are properly sized and updated regularly.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="code" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation</CardTitle>
                  <CardDescription>
                    Code example of how to use the Visualizer component.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`import { useEffect, useRef } from 'react';
import { Visualizer } from '@musicui/react';

export default function VisualizerExample() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioData, setAudioData] = useState<AudioData>({
    frequencyData: new Float32Array(128),
    timeData: new Float32Array(128)
  });

  useEffect(() => {
    // Initialize audio context and analyser
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;

    // Start animation loop
    const animate = () => {
      if (analyserRef.current) {
        const frequencyData = new Float32Array(analyserRef.current.frequencyBinCount);
        const timeData = new Float32Array(analyserRef.current.frequencyBinCount);
        
        analyserRef.current.getFloatFrequencyData(frequencyData);
        analyserRef.current.getFloatTimeDomainData(timeData);
        
        setAudioData({ frequencyData, timeData });
      }
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <Visualizer
      audioData={audioData}
      type="bars"
      color="#4F46E5"
      height={200}
      width={600}
      barWidth={4}
      barGap={2}
      smoothing={0.8}
    />
  );
}`}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      </div>
      <Footer 
        categories={footerCategories} 
        socialLinks={socialLinks} 
      />
    </div>
  );
}