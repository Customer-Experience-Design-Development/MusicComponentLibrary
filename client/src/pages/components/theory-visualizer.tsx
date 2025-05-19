import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { TheoryVisualizer } from '@/components/music-ui/education/TheoryVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const footerCategories = [
  {
    title: 'Documentation',
    links: [
      { title: 'Getting Started', path: '/docs/introduction' },
      { title: 'Components', path: '/components' },
      { title: 'API Reference', path: '/docs/api' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'GitHub', path: 'https://github.com/yourusername/music-component-library' },
      { title: 'Discord', path: 'https://discord.gg/your-server' },
      { title: 'Twitter', path: 'https://twitter.com/your-handle' },
    ],
  },
];

const socialLinks = [
  { title: 'GitHub', path: 'https://github.com/yourusername/music-component-library' },
  { title: 'Discord', path: 'https://discord.gg/your-server' },
  { title: 'Twitter', path: 'https://twitter.com/your-handle' },
];

export default function TheoryVisualizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/theory-visualizer" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Theory Visualizer"
            description="An interactive component for visualizing and exploring music theory concepts."
          />
          <div className="mt-8">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
                  <TheoryVisualizer 
                    onPlayNote={(frequency) => {
                      // Create and play a note using the Web Audio API
                      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                      const oscillator = audioContext.createOscillator();
                      const gainNode = audioContext.createGain();
                      
                      oscillator.type = 'sine';
                      oscillator.frequency.value = frequency;
                      gainNode.gain.value = 0.2;
                      
                      oscillator.connect(gainNode);
                      gainNode.connect(audioContext.destination);
                      
                      oscillator.start();
                      setTimeout(() => {
                        oscillator.stop();
                        audioContext.close();
                      }, 1000);
                    }}
                  />
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Theory Visualizer component provides an interactive interface for exploring music theory concepts, including scales, chords, and keyboard visualization. It's designed for music education and theory practice.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onPlayNote?: (noteFreq: number) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional callback function when a note is played. Receives the frequency of the note in Hz.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">className?: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional CSS class name for custom styling.
                      </p>
                    </div>
                  </div>
                  <h4 className="text-md font-semibold mt-6 mb-2">Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Interactive piano keyboard visualization</li>
                    <li>Scale visualization and playback</li>
                    <li>Chord visualization and playback</li>
                    <li>Multiple scale and chord types</li>
                    <li>Built-in audio synthesis</li>
                    <li>Customizable note playback</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for music theory education and practice.</li>
                    <li>Customize note playback using the onPlayNote callback.</li>
                    <li>Combine with other components for a complete music learning experience.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { TheoryVisualizer } from '@/components/music-ui/education/TheoryVisualizer';

export default function Example() {
  const handlePlayNote = (frequency: number) => {
    // Create and play a note using the Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.2;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 1000);
  };

  return (
    <TheoryVisualizer 
      onPlayNote={handlePlayNote}
      className="w-full h-[400px]"
    />
  );
}`}
                    </code>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        </div>
      </div>
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
} 