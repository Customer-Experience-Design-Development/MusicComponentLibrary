import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Feed, type PostProps, type FeedLayout, type PaginationType } from '@/components/music-ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, Play, Bookmark, Download, ExternalLink } from 'lucide-react';

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

// Extended sample posts for better demonstration
const generateSamplePosts = (count: number): PostProps[] => {
  const basePost: Omit<PostProps, 'id' | 'timestamp'> = {
    type: 'social',
    platform: 'twitter',
    author: {
      id: 'user1',
      name: 'Sample User',
      username: 'sampleuser',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: false,
      followerCount: 1000
    },
    content: 'This is a sample post content.',
    tags: ['sample'],
    metrics: { likes: 10, comments: 2, shares: 1 },
    actions: [
      { type: 'like', label: 'Like', icon: Heart, count: 10 },
      { type: 'comment', label: 'Comment', icon: MessageCircle, count: 2 },
      { type: 'share', label: 'Share', icon: Share2, count: 1 }
    ]
  };

  const posts: PostProps[] = [
    {
      id: '1',
      type: 'dsp_release',
      platform: 'spotify',
      author: {
        id: 'artist1',
        name: 'Luna Eclipse',
        username: 'lunaeclipse',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true,
        followerCount: 125000
      },
      title: 'New Single: "Midnight Frequencies" Out Now!',
      content: 'After months of work in the studio, I\'m thrilled to share my latest single with you all. This track explores the intersection of electronic and organic sounds, recorded during late-night sessions when the city sleeps. 🌙✨',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
          alt: 'Midnight Frequencies album cover',
          aspectRatio: '1/1'
        }
      ],
      tags: ['newmusic', 'electronic', 'indie', 'spotify'],
      timestamp: '2024-01-15T10:30:00Z',
      metrics: {
        likes: 2847,
        comments: 156,
        shares: 89,
        plays: 15420
      },
      actions: [
        { type: 'like', label: 'Like', icon: Heart, count: 2847 },
        { type: 'comment', label: 'Comment', icon: MessageCircle, count: 156 },
        { type: 'share', label: 'Share', icon: Share2, count: 89 },
        { type: 'play', label: 'Play', icon: Play },
        { type: 'external', label: 'Listen on Spotify', icon: ExternalLink, href: 'https://spotify.com' }
      ],
      releaseInfo: {
        releaseDate: '2024-01-15',
        label: 'Independent',
        genre: 'Electronic',
        trackCount: 1,
        duration: 245
      },
      featured: true
    },
    {
      id: '2',
      type: 'video',
      platform: 'youtube',
      author: {
        id: 'musicproducer',
        name: 'Beat Lab Studios',
        username: 'beatlabstudios',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        followerCount: 45000
      },
      title: 'Studio Session: Creating Lo-Fi Hip Hop from Scratch',
      content: 'Take a behind-the-scenes look at how we create those chill lo-fi beats you love. In this 20-minute session, we\'ll break down the entire process from selecting samples to final mix.',
      media: [
        {
          type: 'video',
          url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop',
          alt: 'Studio session video thumbnail',
          duration: 1245,
          aspectRatio: '16/9'
        }
      ],
      tags: ['lofi', 'hiphop', 'tutorial', 'production'],
      timestamp: '2024-01-13T12:00:00Z',
      metrics: {
        views: 12500,
        likes: 890,
        comments: 67,
        saves: 234
      },
      actions: [
        { type: 'like', label: 'Like', icon: Heart, count: 890 },
        { type: 'comment', label: 'Comment', icon: MessageCircle, count: 67 },
        { type: 'save', label: 'Save', icon: Bookmark, count: 234 },
        { type: 'external', label: 'Watch on YouTube', icon: ExternalLink, href: 'https://youtube.com' }
      ]
    },
    {
      id: '3',
      type: 'live_event',
      platform: 'instagram',
      author: {
        id: 'venue1',
        name: 'The Underground',
        username: 'theundergroundvenue',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        followerCount: 15000
      },
      title: 'Live Music Night: Electronic Showcase',
      content: 'Join us this Friday for an incredible night of electronic music featuring local and touring artists. Doors open at 8 PM, show starts at 9 PM. Limited tickets available!',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop',
          alt: 'Live music event poster',
          aspectRatio: '3/2'
        }
      ],
      tags: ['livemusic', 'electronic', 'showcase', 'friday'],
      timestamp: '2024-01-12T18:00:00Z',
      metrics: {
        likes: 456,
        comments: 89,
        shares: 123
      },
      actions: [
        { type: 'like', label: 'Like', icon: Heart, count: 456 },
        { type: 'comment', label: 'Comment', icon: MessageCircle, count: 89 },
        { type: 'share', label: 'Share', icon: Share2, count: 123 }
      ],
      eventInfo: {
        date: '2024-01-19T21:00:00Z',
        venue: 'The Underground',
        location: 'Downtown Music District',
        ticketUrl: 'https://tickets.example.com'
      }
    },
    {
      id: '4',
      type: 'blog',
      platform: 'medium',
      author: {
        id: 'musicwriter',
        name: 'Alex Rivera',
        username: 'alexrivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        followerCount: 3200
      },
      title: 'The Evolution of Digital Music Production: From DAWs to AI',
      content: 'The landscape of music production has transformed dramatically over the past two decades. From the early days of digital audio workstations to today\'s AI-powered composition tools, we\'re witnessing a revolution that\'s democratizing music creation like never before...',
      tags: ['musicproduction', 'technology', 'AI', 'DAW'],
      timestamp: '2024-01-11T09:00:00Z',
      metrics: {
        views: 2340,
        likes: 187,
        comments: 34,
        shares: 56
      },
      actions: [
        { type: 'like', label: 'Clap', icon: Heart, count: 187 },
        { type: 'comment', label: 'Respond', icon: MessageCircle, count: 34 },
        { type: 'save', label: 'Save', icon: Bookmark },
        { type: 'external', label: 'Read on Medium', icon: ExternalLink, href: 'https://medium.com' }
      ],
      maxContentLength: 200
    },
    {
      id: '5',
      type: 'playlist',
      platform: 'spotify',
      author: {
        id: 'curator1',
        name: 'Midnight Vibes',
        username: 'midnightvibes',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: false,
        followerCount: 25000
      },
      title: 'Chill Electronic for Late Night Coding',
      content: 'Perfect background music for those late-night coding sessions. Featuring ambient electronic, lo-fi beats, and minimal techno that won\'t distract from your flow state.',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop',
          alt: 'Playlist cover art',
          aspectRatio: '1/1'
        }
      ],
      tags: ['playlist', 'electronic', 'coding', 'ambient'],
      timestamp: '2024-01-10T14:30:00Z',
      metrics: {
        likes: 1250,
        saves: 890,
        shares: 234
      },
      actions: [
        { type: 'like', label: 'Like', icon: Heart, count: 1250 },
        { type: 'save', label: 'Save', icon: Bookmark, count: 890 },
        { type: 'share', label: 'Share', icon: Share2, count: 234 },
        { type: 'external', label: 'Open in Spotify', icon: ExternalLink, href: 'https://spotify.com' }
      ]
    },
    {
      id: '6',
      type: 'social',
      platform: 'twitter',
      author: {
        id: 'musicblogger',
        name: 'Sarah Chen',
        username: 'musicdiscovery',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: false,
        followerCount: 8500
      },
      content: 'Just discovered this incredible underground artist through a friend\'s playlist. Sometimes the best music finds you when you least expect it. The production quality is absolutely stunning for an independent release. 🎵',
      tags: ['musicdiscovery', 'underground', 'indie'],
      timestamp: '2024-01-14T15:45:00Z',
      metrics: {
        likes: 127,
        comments: 23,
        shares: 45,
        views: 1200
      },
      actions: [
        { type: 'like', label: 'Like', icon: Heart, count: 127 },
        { type: 'comment', label: 'Reply', icon: MessageCircle, count: 23 },
        { type: 'share', label: 'Retweet', icon: Share2, count: 45 }
      ]
    }
  ];

  // Generate additional posts to reach the desired count
  const additionalPosts: PostProps[] = [];
  for (let i = posts.length; i < count; i++) {
    const variations = [
      { type: 'social' as const, platform: 'twitter' as const, content: `This is sample post #${i + 1}. Exploring new music trends and sharing discoveries with the community.` },
      { type: 'dsp_release' as const, platform: 'spotify' as const, content: `New release alert! Track #${i + 1} is now available on all streaming platforms.` },
      { type: 'video' as const, platform: 'youtube' as const, content: `Behind the scenes video #${i + 1}. Watch how this track came together in the studio.` },
      { type: 'blog' as const, platform: 'medium' as const, content: `Article #${i + 1}: Deep dive into music production techniques and industry insights.` }
    ];
    
    const variation = variations[i % variations.length];
    
    additionalPosts.push({
      ...basePost,
      ...variation,
      id: `${i + 1}`,
      title: `Sample Post ${i + 1}`,
      timestamp: new Date(Date.now() - (i * 60 * 60 * 1000)).toISOString(),
      author: {
        ...basePost.author,
        id: `user${i + 1}`,
        name: `User ${i + 1}`,
        username: `user${i + 1}`,
        followerCount: Math.floor(Math.random() * 10000) + 100
      },
      metrics: {
        likes: Math.floor(Math.random() * 1000) + 10,
        comments: Math.floor(Math.random() * 100) + 1,
        shares: Math.floor(Math.random() * 50) + 1,
        views: Math.floor(Math.random() * 5000) + 100
      }
    });
  }

  return [...posts, ...additionalPosts];
};

export default function FeedPage() {
  const [selectedLayout, setSelectedLayout] = useState<FeedLayout>('grid');
  const [selectedPagination, setSelectedPagination] = useState<PaginationType>('numbered');
  const [posts, setPosts] = useState<PostProps[]>(() => generateSamplePosts(24));
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [columnCount, setColumnCount] = useState<{ [key: string]: number }>({
    grid: 4,
    masonry: 3,
    cards: 3,
    compact: 5,
    magazine: 12
  });

  const handleAuthorClick = (author: any) => {
    console.log('Author clicked:', author);
  };

  const handlePostClick = (post: any) => {
    console.log('Post clicked:', post);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPosts = generateSamplePosts(posts.length + 12).slice(posts.length);
    setPosts(prev => [...prev, ...newPosts]);
    setLoadingMore(false);
    
    // Simulate reaching end of data
    if (posts.length >= 48) {
      setHasMore(false);
    }
  };

  const handleLayoutChange = (layout: FeedLayout) => {
    setSelectedLayout(layout);
  };

  const customSources = [
    { key: 'following', label: 'Following', count: 12 },
    { key: 'saved', label: 'Saved', count: 8 }
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/feed" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
              title="Feed Component"
              description="Advanced feed component with multiple layouts, pagination types, infinite scroll, and boutique CSS grid styles."
            />

            <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Overview</h2>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-8">
            <p className="text-lg text-muted-foreground mb-6">
              A comprehensive feed component following modern UX patterns with smart defaults and responsive design principles.
            </p>
            
            {/* Key Features - Following Miller's Rule (7±2 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Layout Patterns
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Grid</Badge>
                  <Badge variant="secondary" className="text-xs">List</Badge>
                  <Badge variant="secondary" className="text-xs">Masonry</Badge>
                  <Badge variant="secondary" className="text-xs">+3 more</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Smart Interactions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Progressive Loading</Badge>
                  <Badge variant="secondary" className="text-xs">Smart Filtering</Badge>
                  <Badge variant="secondary" className="text-xs">Adaptive UI</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  UX Principles
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Fitts's Law</Badge>
                  <Badge variant="secondary" className="text-xs">Progressive Disclosure</Badge>
                  <Badge variant="secondary" className="text-xs">Consistency</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Layout Variants</h2>
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              Choose from essential layout patterns optimized for different content types and user contexts.
            </p>
          </div>
          
          <Tabs value={selectedLayout} onValueChange={(value: any) => setSelectedLayout(value)}>
            <div className="space-y-4">
              {/* Core Layouts - Essential Use Cases Only */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold">Core Layouts</h3>
                  <Badge variant="outline" className="text-xs">Essential</Badge>
                </div>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1">
                  <TabsTrigger value="grid" className="flex flex-col gap-1 h-16 text-xs">
                    <div className="text-sm font-medium">Grid</div>
                    <div className="text-xs text-muted-foreground">Responsive</div>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex flex-col gap-1 h-16 text-xs">
                    <div className="text-sm font-medium">List</div>
                    <div className="text-xs text-muted-foreground">Linear</div>
                  </TabsTrigger>
                  <TabsTrigger value="masonry" className="flex flex-col gap-1 h-16 text-xs">
                    <div className="text-sm font-medium">Masonry</div>
                    <div className="text-xs text-muted-foreground">Pinterest-style</div>
                  </TabsTrigger>
                  <TabsTrigger value="magazine" className="flex flex-col gap-1 h-16 text-xs">
                    <div className="text-sm font-medium">Magazine</div>
                    <div className="text-xs text-muted-foreground">Editorial</div>
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="flex flex-col gap-1 h-16 text-xs">
                    <div className="text-sm font-medium">Cards</div>
                    <div className="text-xs text-muted-foreground">Large format</div>
                  </TabsTrigger>
                  <TabsTrigger value="compact" className="flex flex-col gap-1 h-16 text-xs">
                    <div className="text-sm font-medium">Compact</div>
                    <div className="text-xs text-muted-foreground">Dense</div>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            {/* Standard Layouts */}
            <TabsContent value="grid" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Grid Layout <Badge variant="secondary">Responsive Grid</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-muted-foreground">Columns:</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, grid: Math.max(1, prev.grid - 1) }))}
                          disabled={columnCount.grid <= 1}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">{columnCount.grid}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, grid: Math.min(8, prev.grid + 1) }))}
                          disabled={columnCount.grid >= 8}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Feed 
                    posts={posts.slice(0, 12)} 
                    layout="grid" 
                    paginationType="numbered" 
                    postsPerPage={12} 
                    showLayoutSwitcher={false} 
                    showSourceTabs={false} 
                    onPostClick={handlePostClick} 
                    onAuthorClick={handleAuthorClick} 
                    customSources={customSources}
                    columnCount={columnCount.grid}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="masonry" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Masonry Layout <Badge variant="secondary">Pinterest Style</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-muted-foreground">Columns:</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, masonry: Math.max(1, prev.masonry - 1) }))}
                          disabled={columnCount.masonry <= 1}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">{columnCount.masonry}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, masonry: Math.min(8, prev.masonry + 1) }))}
                          disabled={columnCount.masonry >= 8}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Feed 
                    posts={posts.slice(0, 12)} 
                    layout="masonry" 
                    paginationType="numbered" 
                    postsPerPage={12} 
                    showLayoutSwitcher={false} 
                    showSourceTabs={false} 
                    onPostClick={handlePostClick} 
                    onAuthorClick={handleAuthorClick} 
                    customSources={customSources}
                    columnCount={columnCount.masonry}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    List Layout <Badge variant="secondary">Vertical List</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Feed posts={posts.slice(0, 8)} layout="list" paginationType="numbered" postsPerPage={8} showLayoutSwitcher={false} showSourceTabs={false} onPostClick={handlePostClick} onAuthorClick={handleAuthorClick} customSources={customSources} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cards" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Cards Layout <Badge variant="secondary">Large Cards</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-muted-foreground">Columns:</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, cards: Math.max(1, prev.cards - 1) }))}
                          disabled={columnCount.cards <= 1}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">{columnCount.cards}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, cards: Math.min(6, prev.cards + 1) }))}
                          disabled={columnCount.cards >= 6}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Feed 
                    posts={posts.slice(0, 8)} 
                    layout="cards" 
                    paginationType="numbered" 
                    postsPerPage={8} 
                    showLayoutSwitcher={false} 
                    showSourceTabs={false} 
                    onPostClick={handlePostClick} 
                    onAuthorClick={handleAuthorClick} 
                    customSources={customSources}
                    columnCount={columnCount.cards}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="magazine" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Magazine Layout <Badge variant="secondary">Editorial Style</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-muted-foreground">Grid Columns:</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, magazine: Math.max(6, prev.magazine - 1) }))}
                          disabled={columnCount.magazine <= 6}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">{columnCount.magazine}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, magazine: Math.min(20, prev.magazine + 1) }))}
                          disabled={columnCount.magazine >= 20}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Feed 
                    posts={posts.slice(0, 12)} 
                    layout="magazine" 
                    paginationType="numbered" 
                    postsPerPage={12} 
                    showLayoutSwitcher={false} 
                    showSourceTabs={false} 
                    onPostClick={handlePostClick} 
                    onAuthorClick={handleAuthorClick} 
                    customSources={customSources}
                    columnCount={columnCount.magazine}
                  />
                </CardContent>
              </Card>
            </TabsContent>



            <TabsContent value="compact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Compact Layout <Badge variant="secondary">Dense Grid</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-muted-foreground">Columns:</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, compact: Math.max(2, prev.compact - 1) }))}
                          disabled={columnCount.compact <= 2}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">{columnCount.compact}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setColumnCount(prev => ({ ...prev, compact: Math.min(10, prev.compact + 1) }))}
                          disabled={columnCount.compact >= 10}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Feed 
                    posts={posts.slice(0, 15)} 
                    layout="compact" 
                    paginationType="numbered" 
                    postsPerPage={15} 
                    showLayoutSwitcher={false} 
                    showSourceTabs={false} 
                    onPostClick={handlePostClick} 
                    onAuthorClick={handleAuthorClick} 
                    customSources={customSources}
                    columnCount={columnCount.compact}
                  />
                </CardContent>
              </Card>
            </TabsContent>


          </Tabs>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Pagination Patterns</h2>
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              Different pagination strategies optimized for various user behaviors and content consumption patterns.
            </p>
          </div>
          
          <Tabs value={selectedPagination} onValueChange={(value: any) => setSelectedPagination(value)}>
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1">
              <TabsTrigger value="numbered" className="flex flex-col gap-2 h-20 text-xs">
                <div className="text-sm font-medium">Numbered Pages</div>
                <div className="text-xs text-muted-foreground text-center">Traditional navigation with page numbers</div>
                <Badge variant="outline" className="text-xs">Best for browsing</Badge>
              </TabsTrigger>
              <TabsTrigger value="loadmore" className="flex flex-col gap-2 h-20 text-xs">
                <div className="text-sm font-medium">Load More</div>
                <div className="text-xs text-muted-foreground text-center">User-controlled progressive loading</div>
                <Badge variant="secondary" className="text-xs">User control</Badge>
              </TabsTrigger>
              <TabsTrigger value="infinite" className="flex flex-col gap-2 h-20 text-xs">
                <div className="text-sm font-medium">Infinite Scroll</div>
                <div className="text-xs text-muted-foreground text-center">Automatic loading for continuous browsing</div>
                <Badge variant="default" className="text-xs">Engagement</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="numbered" className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Numbered Pagination</h3>
              <p className="text-muted-foreground">Traditional page-based navigation with numbered buttons.</p>
              <Feed
                posts={posts}
                layout="grid"
                paginationType="numbered"
                postsPerPage={6}
                showSourceTabs={false}
                onPostClick={handlePostClick}
                onAuthorClick={handleAuthorClick}
                customSources={customSources}
              />
            </TabsContent>
            
            <TabsContent value="loadmore" className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Load More Button</h3>
              <p className="text-muted-foreground">Manual loading with a "Load More" button for user control.</p>
              <Feed
                posts={posts.slice(0, 12)}
                layout="cards"
                paginationType="loadmore"
                postsPerPage={6}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                showSourceTabs={false}
                onPostClick={handlePostClick}
                onAuthorClick={handleAuthorClick}
                customSources={customSources}
              />
            </TabsContent>
            
            <TabsContent value="infinite" className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Infinite Scroll</h3>
              <p className="text-muted-foreground">Automatic loading as user scrolls to the bottom.</p>
              <div className="max-h-[600px] overflow-y-auto border rounded-lg p-4">
                <Feed
                  posts={posts.slice(0, 18)}
                  layout="compact"
                  paginationType="infinite"
                  enableInfiniteScroll={true}
                  loadingMore={loadingMore}
                  hasMore={hasMore}
                  onLoadMore={handleLoadMore}
                  showSourceTabs={false}
                  onPostClick={handlePostClick}
                  onAuthorClick={handleAuthorClick}
                  customSources={customSources}
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>



        <section>
          <h2 className="text-2xl font-semibold mb-4">Full-Featured Example</h2>
          <p className="text-muted-foreground mb-6">
            Complete feed with all features enabled: layout switcher, search, filters, and pagination.
          </p>
          <Feed
            posts={posts}
            layout="grid"
            paginationType="numbered"
            postsPerPage={9}
            showFilters={true}
            showSearch={true}
            showLayoutSwitcher={true}
            showSourceTabs={false}
            onPostClick={handlePostClick}
            onAuthorClick={handleAuthorClick}
            onLayoutChange={handleLayoutChange}
            customSources={customSources}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Technical Capabilities</h2>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Built with modern web standards and UX best practices for optimal performance and user experience.
            </p>
          </div>
          
          {/* Core Features - Following Proximity Principle */}
          <div className="space-y-8">
            {/* User Experience Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                User Experience
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-3">Smart Interactions</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Progressive disclosure of content
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Fitts's Law compliant touch targets
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Consistent visual hierarchy
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-3">Responsive Patterns</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Layer cake layout architecture
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Mostly fluid design pattern
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Priority+ navigation pattern
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Performance Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Performance & Accessibility
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-3">Optimized Loading</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Intersection Observer API
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Skeleton loading states
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Memory-efficient pagination
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-3">Accessibility First</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        WCAG 2.1 AA compliant
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Keyboard navigation support
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Screen reader optimized
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Developer Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Developer Experience
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-3">Type Safety</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        Full TypeScript support
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        Comprehensive prop interfaces
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        IntelliSense support
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-3">Customization</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        Extensible layout system
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        Theme-aware styling
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        Event callback system
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
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