import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { OverviewCard, OverviewGroup, CompactOverviewCard } from '@/components/music-ui/AnalyticsOverview';
import { PerformanceChart } from '@/components/music-ui/PerformanceChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Radio,
  Eye,
  MessageCircle
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

// Demo data for the analytics dashboard
const overviewMetrics = [
  {
    label: 'Total Streams',
    value: 2450000,
    previousValue: 2100000,
    format: 'number' as const,
    icon: <Play className="h-4 w-4" />,
    color: 'success' as const
  },
  {
    label: 'Monthly Revenue',
    value: 18750,
    previousValue: 16200,
    format: 'currency' as const,
    icon: <DollarSign className="h-4 w-4" />,
    color: 'success' as const
  },
  {
    label: 'Active Listeners',
    value: 125000,
    previousValue: 118000,
    format: 'number' as const,
    icon: <Users className="h-4 w-4" />,
    color: 'success' as const
  },
  {
    label: 'Completion Rate',
    value: 78.5,
    previousValue: 75.2,
    format: 'percentage' as const,
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'default' as const
  }
];

const engagementMetrics = [
  {
    label: 'Saves',
    value: 89000,
    previousValue: 82000,
    format: 'number' as const,
    icon: <Heart className="h-4 w-4" />
  },
  {
    label: 'Shares',
    value: 34500,
    previousValue: 38000,
    format: 'number' as const,
    icon: <Share2 className="h-4 w-4" />
  },
  {
    label: 'Comments',
    value: 12800,
    previousValue: 11200,
    format: 'number' as const,
    icon: <MessageCircle className="h-4 w-4" />
  }
];

const sidebarMetrics = [
  {
    label: 'Downloads',
    value: 15200,
    previousValue: 14800,
    format: 'number' as const,
    icon: <Download className="h-4 w-4" />
  },
  {
    label: 'Playlist Adds',
    value: 5890,
    previousValue: 5420,
    format: 'number' as const,
    icon: <Music className="h-4 w-4" />
  },
  {
    label: 'Radio Plays',
    value: 2100,
    previousValue: 1950,
    format: 'number' as const,
    icon: <Radio className="h-4 w-4" />
  },
  {
    label: 'Profile Views',
    value: 45600,
    previousValue: 42300,
    format: 'number' as const,
    icon: <Eye className="h-4 w-4" />
  }
];

// Chart data for PerformanceChart
const chartData = [
  { date: '2024-01-01', streams: 45000, saves: 2200, shares: 890 },
  { date: '2024-01-02', streams: 52000, saves: 2500, shares: 1020 },
  { date: '2024-01-03', streams: 48000, saves: 2300, shares: 950 },
  { date: '2024-01-04', streams: 61000, saves: 2800, shares: 1150 },
  { date: '2024-01-05', streams: 58000, saves: 2650, shares: 1080 },
  { date: '2024-01-06', streams: 67000, saves: 3100, shares: 1250 },
  { date: '2024-01-07', streams: 72000, saves: 3400, shares: 1380 },
  { date: '2024-01-08', streams: 69000, saves: 3200, shares: 1290 },
  { date: '2024-01-09', streams: 75000, saves: 3600, shares: 1450 },
  { date: '2024-01-10', streams: 81000, saves: 3850, shares: 1520 }
];

export default function AnalyticsDashboardExample() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/examples/analytics-dashboard" />
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
              title="Analytics Dashboard Example"
              description="A comprehensive dashboard combining overview cards with detailed performance charts."
            />
            
            <div className="mt-8 space-y-6">
              {/* Time Range Selector */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Performance Overview</h2>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Main Overview Metrics */}
              <OverviewGroup 
                data={overviewMetrics}
                columns={4}
                showTrends={true}
                size="md"
              />

              {/* Main Content Grid */}
              <div className="grid grid-cols-12 gap-6">
                {/* Performance Chart */}
                <div className="col-span-12 lg:col-span-8">
                  <PerformanceChart 
                    data={chartData}
                    title="Daily Performance Metrics"
                    description="Track your music performance over time"
                  />
                </div>

                {/* Sidebar Metrics */}
                <div className="col-span-12 lg:col-span-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {sidebarMetrics.map((metric, index) => (
                        <CompactOverviewCard 
                          key={index}
                          data={metric}
                          showTrend={true}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <OverviewGroup 
                    data={engagementMetrics}
                    columns={3}
                    showTrends={true}
                    size="sm"
                  />
                </CardContent>
              </Card>

              {/* Individual Metric Examples */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <OverviewCard 
                  data={{
                    label: 'Top Track Streams',
                    value: 450000,
                    previousValue: 380000,
                    format: 'number',
                    icon: <Music className="h-4 w-4" />,
                    color: 'success'
                  }}
                  size="lg"
                />
                <OverviewCard 
                  data={{
                    label: 'Avg. Listen Duration',
                    value: 195,
                    previousValue: 180,
                    format: 'duration',
                    icon: <Clock className="h-4 w-4" />,
                    color: 'default'
                  }}
                  size="lg"
                />
                <OverviewCard 
                  data={{
                    label: 'Fan Growth Rate',
                    value: 12.5,
                    previousValue: 8.2,
                    format: 'percentage',
                    icon: <TrendingUp className="h-4 w-4" />,
                    color: 'success'
                  }}
                  size="lg"
                />
              </div>

              {/* Usage Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="overview">Overview Cards</TabsTrigger>
                      <TabsTrigger value="chart">Performance Chart</TabsTrigger>
                      <TabsTrigger value="combined">Combined Usage</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">
{`// Single overview card
<OverviewCard 
  data={{
    label: 'Total Streams',
    value: 2450000,
    previousValue: 2100000,
    format: 'number',
    icon: <Play className="h-4 w-4" />,
    color: 'success'
  }}
  size="md"
  showTrend={true}
/>

// Group of overview cards
<OverviewGroup 
  data={overviewMetrics}
  columns={4}
  showTrends={true}
  size="md"
/>`}
                        </code>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="chart" className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">
{`// Performance chart with time-series data
<PerformanceChart 
  data={chartData}
  title="Daily Performance Metrics"
  description="Track your music performance over time"
/>`}
                        </code>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="combined" className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">
{`// Combined dashboard layout
<div className="space-y-6">
  {/* Overview metrics at the top */}
  <OverviewGroup 
    data={overviewMetrics}
    columns={4}
    showTrends={true}
  />
  
  {/* Main content with chart and sidebar */}
  <div className="grid grid-cols-12 gap-6">
    <div className="col-span-8">
      <PerformanceChart data={chartData} />
    </div>
    <div className="col-span-4">
      {sidebarMetrics.map((metric, index) => (
        <CompactOverviewCard 
          key={index}
          data={metric}
          showTrend={true}
        />
      ))}
    </div>
  </div>
</div>`}
                        </code>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
} 