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
      { label: 'Getting Started', href: '/docs/introduction' },
      { label: 'Components', href: '/components' },
      { label: 'API Reference', href: '/docs/api' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: 'https://github.com/yourusername/music-component-library' },
      { label: 'Discord', href: 'https://discord.gg/your-server' },
      { label: 'Twitter', href: 'https://twitter.com/your-handle' },
    ],
  },
];

const socialLinks = [
  { icon: 'ri-github-fill', href: 'https://github.com/yourusername/music-component-library' },
  { icon: 'ri-discord-fill', href: 'https://discord.gg/your-server' },
  { icon: 'ri-twitter-fill', href: 'https://twitter.com/your-handle' },
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
            <Tabs defaultValue="standard" className="mt-8">
              <TabsList className="mb-4">
                <TabsTrigger value="standard">Standard Control</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Responsive Volume Control</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    The component automatically adapts its layout based on the container size. It displays a compact layout in small containers and the full layout in larger spaces.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Compact Layout (Small Container)</h4>
                      <div className="w-32 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <VolumeControl
                          initialVolume={65}
                          onChange={handleVolumeChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Medium Layout</h4>
                      <div className="w-48 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <VolumeControl
                          initialVolume={75}
                          onChange={handleVolumeChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Full Layout (Large Container)</h4>
                      <div className="max-w-sm">
                        <VolumeControl
                          initialVolume={70}
                          onChange={handleVolumeChange}
                        />
                      </div>
                    </div>
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
            </Tabs>
          </div>
        </main>
        </div>
      </div>
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
} 