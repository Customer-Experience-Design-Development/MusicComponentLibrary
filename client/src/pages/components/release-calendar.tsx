import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { ReleaseCalendar, type Release } from '@/components/music-ui/ReleaseCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

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

// Demo data for the ReleaseCalendar component
const demoReleases: Release[] = [
  {
    id: "1",
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    releaseDate: "2024-03-25",
    type: "album" as const,
    status: "scheduled" as const,
    coverArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "2",
    title: "Ocean Waves",
    artist: "Marine Melodies",
    releaseDate: "2024-03-25",
    type: "single" as const,
    status: "announced" as const,
    coverArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "3",
    title: "Mountain Echo",
    artist: "Peak Performers",
    releaseDate: "2024-03-28",
    type: "ep" as const,
    status: "scheduled" as const,
    coverArt: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "4",
    title: "Urban Rhythms",
    artist: "City Beats",
    releaseDate: "2024-04-01",
    type: "album" as const,
    status: "announced" as const,
    coverArt: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "5",
    title: "Digital Dreams",
    artist: "Virtual Vibes",
    releaseDate: "2024-04-05",
    type: "single" as const,
    status: "scheduled" as const,
    coverArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

export default function ReleaseCalendarPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/release-calendar" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Release Calendar" 
              description="A comprehensive calendar component for managing and displaying upcoming music releases."
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
                    <ReleaseCalendar 
                      releases={demoReleases}
                      onReleaseClick={(release) => console.log('Release clicked:', release)}
                      onAddRelease={() => console.log('Add release clicked')}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The ReleaseCalendar component provides a comprehensive interface for managing and displaying upcoming music releases, including:</p>
                      <ul>
                        <li>Monthly, weekly, and daily views</li>
                        <li>Color-coded release types (single, album, EP)</li>
                        <li>Release status tracking</li>
                        <li>Interactive release cards</li>
                        <li>Add new release functionality</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface ReleaseCalendarProps {
  releases: Array<{
    id: string;
    title: string;
    artist: string;
    releaseDate: string;
    type: 'single' | 'album' | 'ep';
    status: 'scheduled' | 'announced' | 'released';
    coverArt?: string;
  }>;
  onReleaseClick?: (release: Release) => void;
  onAddRelease?: () => void;
  className?: string;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { ReleaseCalendar } from '@/components/music-ui/ReleaseCalendar';

function MyComponent() {
  const releases = [
    {
      id: "1",
      title: "Album Title",
      artist: "Artist Name",
      releaseDate: "2024-03-25",
      type: "album",
      status: "scheduled"
    }
  ];

  return (
    <ReleaseCalendar 
      releases={releases}
      onReleaseClick={(release) => console.log(release)}
      onAddRelease={() => console.log('Add release')}
    />
  );
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// ReleaseCalendar.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface Release {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  type: 'single' | 'album' | 'ep';
  status: 'scheduled' | 'announced' | 'released';
  coverArt?: string;
}

interface ReleaseCalendarProps {
  releases: Release[];
  onReleaseClick?: (release: Release) => void;
  onAddRelease?: () => void;
  className?: string;
}

export function ReleaseCalendar({ 
  releases, 
  onReleaseClick, 
  onAddRelease,
  className = '' 
}: ReleaseCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const releasesByDate = releases.reduce((acc, release) => {
    const date = format(new Date(release.releaseDate), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(release);
    return acc;
  }, {} as Record<string, Release[]>);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const getReleaseTypeColor = (type: Release['type']) => {
    switch (type) {
      case 'single':
        return 'bg-blue-500';
      case 'album':
        return 'bg-purple-500';
      case 'ep':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            {onAddRelease && (
              <Button onClick={onAddRelease}>
                <Plus className="h-4 w-4 mr-2" />
                Add Release
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="bg-background p-2 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayReleases = releasesByDate[dateStr] || [];
            
            return (
              <div
                key={index}
                className={\`bg-background p-2 min-h-[100px] \${
                  !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                } \${
                  isToday(day) ? 'bg-primary/5' : ''
                }\`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={\`text-sm \${
                    isToday(day) ? 'font-bold text-primary' : ''
                  }\`}>
                    {format(day, 'd')}
                  </span>
                  {dayReleases.length > 0 && (
                    <span className="text-xs text-neutral-500">
                      {dayReleases.length} release{dayReleases.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayReleases.map(release => (
                    <div
                      key={release.id}
                      className={\`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity \${
                        getReleaseTypeColor(release.type)
                      } text-white\`}
                      onClick={() => onReleaseClick?.(release)}
                    >
                      <div className="font-medium truncate">{release.title}</div>
                      <div className="opacity-80 truncate">{release.artist}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}`}</code></pre>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
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