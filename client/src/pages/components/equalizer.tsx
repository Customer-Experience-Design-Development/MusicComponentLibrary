import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Equalizer } from '@/components/music-ui/Equalizer';

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

export default function EqualizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/equalizer" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Equalizer"
            description="A powerful audio equalizer component with customizable frequency bands."
          />
          <div className="mt-8">
            <Equalizer 
              bands={10}
              min={-12}
              max={12}
              step={1}
            />
          </div>
        </main>
      </div>
      </div>
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
}
