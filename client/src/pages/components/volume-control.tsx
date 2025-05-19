import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { VolumeControl } from '@/components/music-ui/VolumeControl';
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

export default function VolumeControlPage() {
  const [volume, setVolume] = React.useState(70);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    console.log('Volume changed:', newVolume);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/volume-control" />
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
            title="Volume Control"
            description="A versatile volume control component with mute, normalization, and preset options."
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
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Current Volume: {volume}%</span>
                    </div>
                    <VolumeControl
                      initialVolume={70}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Volume Control component provides a complete interface for managing audio volume with features like mute, volume normalization, and preset levels. It's designed to be both functional and user-friendly.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">initialVolume?: number</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The initial volume level (0-100). Defaults to 70.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onChange?: (volume: number) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when volume changes.
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
                    <li>Volume slider with percentage control</li>
                    <li>Mute/unmute toggle</li>
                    <li>Volume normalization</li>
                    <li>Preset volume levels (Quiet, Normal, Loud)</li>
                    <li>Dynamic volume icon based on level</li>
                    <li>Settings dropdown menu</li>
                    <li>Responsive design</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use in audio players and media applications.</li>
                    <li>Implement volume change handlers to control actual audio output.</li>
                    <li>Consider user preferences for initial volume level.</li>
                    <li>Use volume normalization for consistent playback levels.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { VolumeControl } from '@/components/music-ui/VolumeControl';
import { useState } from 'react';

export default function Example() {
  const [volume, setVolume] = useState(70);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Update audio context or player volume
    console.log('Volume changed:', newVolume);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Current Volume: {volume}%
        </span>
      </div>
      <VolumeControl
        initialVolume={70}
        onChange={handleVolumeChange}
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