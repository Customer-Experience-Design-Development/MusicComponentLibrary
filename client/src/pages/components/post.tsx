import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Post, PostFeed, type PostProps } from '@/components/music-ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const samplePosts: PostProps[] = [
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
    content: 'After months of work in the studio, I\'m thrilled to share my latest single with you all. This track explores the intersection of electronic and organic sounds, recorded during late-night sessions when the city sleeps. 🌙✨\n\nSpecial thanks to @producer_mike for the incredible mix and everyone who supported the journey.',
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
    ],
    variant: 'compact'
  },
  {
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    ],
    variant: 'minimal'
  }
];

export default function PostPage() {
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'compact' | 'featured' | 'minimal'>('default');

  const handleAuthorClick = (author: any) => {
    console.log('Author clicked:', author);
  };

  const handlePostClick = (post: any) => {
    console.log('Post clicked:', post);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/post" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
              title="Post Component"
              description="A versatile component for displaying content from blogs, social media, DSP releases, videos, and more."
            />

            <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              The Post component is designed to handle content from various sources including:
            </p>
            <ul className="grid grid-cols-2 gap-2 mt-4">
              <li><Badge variant="outline">Blog Posts</Badge></li>
              <li><Badge variant="outline">Social Media</Badge></li>
              <li><Badge variant="outline">DSP Releases</Badge></li>
              <li><Badge variant="outline">Video Content</Badge></li>
              <li><Badge variant="outline">Live Events</Badge></li>
              <li><Badge variant="outline">Playlists</Badge></li>
              <li><Badge variant="outline">Announcements</Badge></li>
              <li><Badge variant="outline">Reviews</Badge></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Variants</h2>
          <Tabs value={selectedVariant} onValueChange={(value: any) => setSelectedVariant(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="compact">Compact</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="space-y-6 mt-6">
              <h3 className="text-lg font-medium">Default Variant</h3>
              <p className="text-muted-foreground">Full-featured post layout with all elements visible.</p>
              {samplePosts.slice(0, 3).map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  variant="default"
                  onAuthorClick={handleAuthorClick}
                  onPostClick={handlePostClick}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="compact" className="space-y-6 mt-6">
              <h3 className="text-lg font-medium">Compact Variant</h3>
              <p className="text-muted-foreground">Condensed layout perfect for feeds and lists.</p>
              {samplePosts.slice(0, 4).map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  variant="compact"
                  onAuthorClick={handleAuthorClick}
                  onPostClick={handlePostClick}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="featured" className="space-y-6 mt-6">
              <h3 className="text-lg font-medium">Featured Variant</h3>
              <p className="text-muted-foreground">Highlighted layout for important or promoted content.</p>
              {samplePosts.slice(0, 2).map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  variant="featured"
                  featured={true}
                  onAuthorClick={handleAuthorClick}
                  onPostClick={handlePostClick}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="minimal" className="space-y-6 mt-6">
              <h3 className="text-lg font-medium">Minimal Variant</h3>
              <p className="text-muted-foreground">Clean, minimal layout for simple content display.</p>
              {samplePosts.map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  variant="minimal"
                  onAuthorClick={handleAuthorClick}
                  onPostClick={handlePostClick}
                />
              ))}
            </TabsContent>
          </Tabs>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Content Types</h2>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">DSP Release</h3>
              <Post
                {...samplePosts[0]}
                onAuthorClick={handleAuthorClick}
                onPostClick={handlePostClick}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Video Content</h3>
              <Post
                {...samplePosts[2]}
                onAuthorClick={handleAuthorClick}
                onPostClick={handlePostClick}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Live Event</h3>
              <Post
                {...samplePosts[3]}
                onAuthorClick={handleAuthorClick}
                onPostClick={handlePostClick}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Post Feed</h2>
          <p className="text-muted-foreground mb-6">
            The PostFeed component provides filtering, searching, and sorting capabilities for displaying multiple posts.
          </p>
          <PostFeed
            posts={samplePosts}
            variant="compact"
            onAuthorClick={handleAuthorClick}
            onPostClick={handlePostClick}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Platform Support</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Spotify</Badge>
                <Badge>Bandcamp</Badge>
                <Badge>SoundCloud</Badge>
                <Badge>YouTube</Badge>
                <Badge>Instagram</Badge>
                <Badge>Twitter</Badge>
                <Badge>Reddit</Badge>
                <Badge>Medium</Badge>
                <Badge>Custom</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interactive Elements</h3>
              <ul className="space-y-2 text-sm">
                <li>• Like, comment, and share actions</li>
                <li>• Media playback controls</li>
                <li>• Expandable content</li>
                <li>• External link handling</li>
                <li>• Author profile navigation</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Media Types</h3>
              <ul className="space-y-2 text-sm">
                <li>• Images with aspect ratio control</li>
                <li>• Video thumbnails with play buttons</li>
                <li>• Audio track previews</li>
                <li>• Multiple media support</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Metadata</h3>
              <ul className="space-y-2 text-sm">
                <li>• Release information for music</li>
                <li>• Event details for live shows</li>
                <li>• Engagement metrics</li>
                <li>• Tags and categorization</li>
              </ul>
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