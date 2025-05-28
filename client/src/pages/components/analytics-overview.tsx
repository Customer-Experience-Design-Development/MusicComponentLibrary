import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { OverviewCard, OverviewGroup, CompactOverviewCard } from '@/components/music-ui/AnalyticsOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Play, 
  Heart, 
  Share2, 
  Download, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Music,
  Headphones,
  Radio
} from 'lucide-react';

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

const socialLinks = [
  { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
  { icon: "ri-github-fill", href: "https://github.com/musicui" },
  { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
];

// Demo data for analytics overview
const singleCardData = {
  label: 'Total Streams',
  value: 1250000,
  previousValue: 1100000,
  format: 'number' as const,
  icon: <Play className="h-4 w-4" />,
  color: 'success' as const
};

const groupData = [
  {
    label: 'Total Streams',
    value: 1250000,
    previousValue: 1100000,
    format: 'number' as const,
    icon: <Play className="h-4 w-4" />,
    color: 'default' as const
  },
  {
    label: 'Saves',
    value: 45000,
    previousValue: 42000,
    format: 'number' as const,
    icon: <Heart className="h-4 w-4" />,
    color: 'success' as const
  },
  {
    label: 'Shares',
    value: 12500,
    previousValue: 15000,
    format: 'number' as const,
    icon: <Share2 className="h-4 w-4" />,
    color: 'warning' as const
  },
  {
    label: 'Revenue',
    value: 8750,
    previousValue: 7200,
    format: 'currency' as const,
    icon: <DollarSign className="h-4 w-4" />,
    color: 'success' as const
  }
];

const performanceData = [
  {
    label: 'Completion Rate',
    value: 78.5,
    previousValue: 75.2,
    format: 'percentage' as const,
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    label: 'Avg. Listen Time',
    value: 180,
    previousValue: 165,
    format: 'duration' as const,
    icon: <Clock className="h-4 w-4" />
  },
  {
    label: 'Active Listeners',
    value: 25000,
    previousValue: 23500,
    format: 'number' as const,
    icon: <Users className="h-4 w-4" />
  }
];

const compactData = [
  {
    label: 'Downloads',
    value: 5200,
    previousValue: 4800,
    format: 'number' as const,
    icon: <Download className="h-4 w-4" />
  },
  {
    label: 'Playlists',
    value: 890,
    previousValue: 820,
    format: 'number' as const,
    icon: <Music className="h-4 w-4" />
  },
  {
    label: 'Radio Plays',
    value: 1200,
    previousValue: 1150,
    format: 'number' as const,
    icon: <Radio className="h-4 w-4" />
  }
];

export default function AnalyticsOverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/analytics-overview" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Analytics Overview"
            description="Single number display components for analytics data with trend indicators and various formatting options."
          />
          <div className="mt-8">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-6">
                {/* Single Overview Card */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Single Overview Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <OverviewCard data={singleCardData} size="sm" />
                    <OverviewCard data={singleCardData} size="md" />
                    <OverviewCard data={singleCardData} size="lg" />
                  </div>
                </Card>

                {/* Overview Group */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview Group</h3>
                  <OverviewGroup 
                    data={groupData}
                    title="Music Performance Metrics"
                    description="Key performance indicators for your music content"
                    columns={4}
                  />
                </Card>

                {/* Different Column Layouts */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Different Layouts</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium mb-3">2 Columns</h4>
                      <OverviewGroup 
                        data={performanceData}
                        columns={2}
                        size="sm"
                      />
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-3">3 Columns</h4>
                      <OverviewGroup 
                        data={performanceData}
                        columns={3}
                        size="md"
                      />
                    </div>
                  </div>
                </Card>

                {/* Compact Overview Cards */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Compact Overview Cards</h3>
                  <div className="space-y-3">
                    {compactData.map((item, index) => (
                      <CompactOverviewCard 
                        key={index}
                        data={item}
                        showTrend={true}
                      />
                    ))}
                  </div>
                </Card>

                {/* Color Variants */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Color Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <OverviewCard 
                      data={{...singleCardData, color: 'default'}} 
                      size="sm" 
                    />
                    <OverviewCard 
                      data={{...singleCardData, color: 'success'}} 
                      size="sm" 
                    />
                    <OverviewCard 
                      data={{...singleCardData, color: 'warning'}} 
                      size="sm" 
                    />
                    <OverviewCard 
                      data={{...singleCardData, color: 'danger'}} 
                      size="sm" 
                    />
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Analytics Overview components provide clean, single-number displays for key metrics with optional trend indicators. Perfect for dashboards and analytics summaries.
                  </p>
                  
                  <h4 className="text-md font-semibold mt-6 mb-2">Components</h4>
                  <div className="space-y-4">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">OverviewCard</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Single metric display card with trend indicator and customizable styling.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">OverviewGroup</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Group of overview cards with responsive grid layout and optional title/description.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">CompactOverviewCard</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Compact version for smaller spaces or sidebar displays.
                      </p>
                    </div>
                  </div>

                  <h4 className="text-md font-semibold mt-6 mb-2">Data Format Options</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><code>number</code> - Formats large numbers with K/M suffixes</li>
                    <li><code>currency</code> - Displays as currency with proper formatting</li>
                    <li><code>percentage</code> - Shows as percentage with % symbol</li>
                    <li><code>duration</code> - Converts seconds to hours/minutes format</li>
                  </ul>

                  <h4 className="text-md font-semibold mt-6 mb-2">Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Automatic trend calculation and display</li>
                    <li>Multiple size variants (sm, md, lg)</li>
                    <li>Color-coded status indicators</li>
                    <li>Responsive grid layouts</li>
                    <li>Icon support for visual context</li>
                    <li>Customizable formatting options</li>
                  </ul>

                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for displaying key performance indicators</li>
                    <li>Include previous values for meaningful trend analysis</li>
                    <li>Choose appropriate icons that represent the metric</li>
                    <li>Use color variants to indicate status or importance</li>
                    <li>Group related metrics together for better context</li>
                  </ul>
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { 
  OverviewCard, 
  OverviewGroup, 
  CompactOverviewCard 
} from '@/components/music-ui/AnalyticsOverview';
import { Play, Heart, DollarSign } from 'lucide-react';

// Single card example
const singleData = {
  label: 'Total Streams',
  value: 1250000,
  previousValue: 1100000,
  format: 'number',
  icon: <Play className="h-4 w-4" />,
  color: 'success'
};

// Group data example
const groupData = [
  {
    label: 'Streams',
    value: 1250000,
    previousValue: 1100000,
    format: 'number',
    icon: <Play className="h-4 w-4" />
  },
  {
    label: 'Saves',
    value: 45000,
    previousValue: 42000,
    format: 'number',
    icon: <Heart className="h-4 w-4" />
  },
  {
    label: 'Revenue',
    value: 8750,
    previousValue: 7200,
    format: 'currency',
    icon: <DollarSign className="h-4 w-4" />
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Single Overview Card */}
      <OverviewCard 
        data={singleData}
        size="md"
        showTrend={true}
      />

      {/* Overview Group */}
      <OverviewGroup 
        data={groupData}
        title="Performance Metrics"
        description="Key indicators for your music"
        columns={3}
        showTrends={true}
        size="md"
      />

      {/* Compact Cards */}
      <div className="space-y-2">
        {groupData.map((item, index) => (
          <CompactOverviewCard 
            key={index}
            data={item}
            showTrend={true}
          />
        ))}
      </div>
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