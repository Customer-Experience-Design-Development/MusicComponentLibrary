import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Waveform } from '@/components/music-ui/Waveform';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import React from 'react';

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

// Demo data for the Waveform component
const demoWaveformData = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2);

export default function WaveformPage() {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration] = React.useState(180); // 3 minutes

  const handleClick = (position: number) => {
    const newTime = position * duration;
    setCurrentTime(newTime);
    console.log('Seek to:', newTime);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/waveform" />
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
            title="Waveform"
            description="A visual representation of audio waveforms with playback progress and seeking functionality."
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
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Default Waveform</h4>
                      <Waveform
                        data={demoWaveformData}
                        currentTime={currentTime}
                        duration={duration}
                        onClick={handleClick}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Custom Colors</h4>
                      <Waveform
                        data={demoWaveformData}
                        currentTime={currentTime}
                        duration={duration}
                        color="#16A34A"
                        progressColor="#16A34A"
                        onClick={handleClick}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Custom Height</h4>
                      <Waveform
                        data={demoWaveformData}
                        currentTime={currentTime}
                        duration={duration}
                        height={32}
                        onClick={handleClick}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Waveform component provides a visual representation of audio waveforms with playback progress tracking and seeking functionality. It's perfect for audio players and music applications.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">data?: number[]</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Array of amplitude values for the waveform. If not provided, random data will be generated.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">currentTime: number</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current playback position in seconds.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">duration: number</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total duration of the audio in seconds.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">color?: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Color of the waveform. Defaults to '#6200EA'.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">progressColor?: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Color of the progress indicator. Defaults to '#6200EA'.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">height?: number</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Height of the waveform in pixels. Defaults to 64.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onClick?: (position: number) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when the waveform is clicked, providing the clicked position (0-1).
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
                    <li>Visual representation of audio waveforms</li>
                    <li>Playback progress tracking</li>
                    <li>Interactive seeking</li>
                    <li>Customizable colors</li>
                    <li>Adjustable height</li>
                    <li>Automatic data generation</li>
                    <li>Responsive design</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use in audio players and music applications.</li>
                    <li>Provide waveform data for accurate visualization.</li>
                    <li>Implement click handlers for seeking functionality.</li>
                    <li>Consider color choices for accessibility.</li>
                    <li>Adjust height based on available space.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { Waveform } from '@/components/music-ui/Waveform';
import { useState } from 'react';

export default function Example() {
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 180; // 3 minutes

  // Generate or load waveform data
  const waveformData = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2);

  const handleClick = (position: number) => {
    const newTime = position * duration;
    setCurrentTime(newTime);
    // Update audio player position
    console.log('Seek to:', newTime);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Waveform
        data={waveformData}
        currentTime={currentTime}
        duration={duration}
        color="#16A34A"
        progressColor="#16A34A"
        height={64}
        onClick={handleClick}
      />
    </div>
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