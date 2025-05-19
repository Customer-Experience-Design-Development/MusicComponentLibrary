import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { PerformanceChart } from '@/components/music-ui/PerformanceChart';
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

// Demo data for the PerformanceChart component
const chartData = [
  {
    date: '2024-01-01',
    streams: 1000,
    saves: 50,
    shares: 25
  },
  {
    date: '2024-01-02',
    streams: 1200,
    saves: 60,
    shares: 30
  },
  {
    date: '2024-01-03',
    streams: 1500,
    saves: 75,
    shares: 40
  },
  {
    date: '2024-01-04',
    streams: 1800,
    saves: 90,
    shares: 45
  },
  {
    date: '2024-01-05',
    streams: 2000,
    saves: 100,
    shares: 50
  }
];

export default function PerformanceChartPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/performance-chart" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Performance Chart"
            description="A data visualization component for displaying music performance metrics over time."
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
                  <PerformanceChart data={chartData} />
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Performance Chart component provides a visual representation of music performance metrics over time, including streams, saves, and shares. It's designed for tracking and analyzing music performance data.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">data: PerformanceData[]</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Array of performance data points, each containing date, streams, saves, and shares.
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
                    <li>Time-series data visualization</li>
                    <li>Multiple metric tracking</li>
                    <li>Interactive tooltips</li>
                    <li>Responsive design</li>
                    <li>Customizable styling</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for tracking music performance metrics over time.</li>
                    <li>Ensure data points are properly formatted with dates and metrics.</li>
                    <li>Consider using with other analytics components for comprehensive insights.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { PerformanceChart } from '@/components/music-ui/PerformanceChart';

export default function Example() {
  const data = [
    {
      date: '2024-01-01',
      streams: 1000,
      saves: 50,
      shares: 25
    },
    {
      date: '2024-01-02',
      streams: 1200,
      saves: 60,
      shares: 30
    },
    {
      date: '2024-01-03',
      streams: 1500,
      saves: 75,
      shares: 40
    }
  ];

  return (
    <PerformanceChart 
      data={data}
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