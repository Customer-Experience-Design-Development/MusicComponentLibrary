import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArtistDetails } from '@/components/music-ui/ArtistDetails';
import { ArtistPixelAvatar } from '@/components/music-ui/ArtistPixelAvatar';
import { ArtistAnalysis } from '@/components/music-ui/ArtistAnalysis';
import { Artist, Track, Album } from '@/types/music';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export default function ArtistDetailsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | number | null>(null);
  
  const demoTracks: Track[] = [
    {
      id: 1,
      title: "This is a Song",
      artist: "Artist Name",
      duration: 217,
      albumArt: "https://via.placeholder.com/300x300?text=Album+Cover",
      metadata: {
        album: "This is an Album",
        year: 2023,
        genre: ["Pop", "Electronic"],
      }
    },
    {
      id: 2,
      title: "Another Hit",
      artist: "Artist Name",
      duration: 183,
      albumArt: "https://via.placeholder.com/300x300?text=Album+Cover+2",
      metadata: {
        album: "This is an Album",
        year: 2023,
        genre: ["Pop", "Electronic"],
      }
    },
    {
      id: 3,
      title: "The Big Ballad",
      artist: "Artist Name",
      duration: 264,
      albumArt: "https://via.placeholder.com/300x300?text=Album+Cover",
      metadata: {
        album: "This is an Album",
        year: 2023,
        genre: ["Pop", "Electronic"],
      }
    },
    {
      id: 4,
      title: "Dance Track",
      artist: "Artist Name",
      duration: 192,
      albumArt: "https://via.placeholder.com/300x300?text=Single+Cover",
      metadata: {
        album: "Single",
        year: 2022,
        genre: ["Dance", "Electronic"],
      }
    },
    {
      id: 5,
      title: "Acoustic Version",
      artist: "Artist Name",
      duration: 231,
      albumArt: "https://via.placeholder.com/300x300?text=Acoustic+EP",
      metadata: {
        album: "Acoustic EP",
        year: 2021,
        genre: ["Acoustic", "Folk"],
      }
    },
  ];

  const demoAlbums: Album[] = [
    {
      id: 1,
      title: "This is an Album",
      artist: "Artist Name",
      releaseYear: 2023,
      albumArt: "https://via.placeholder.com/300x300?text=Album+Cover",
      tracks: demoTracks.slice(0, 3),
    },
    {
      id: 2,
      title: "Acoustic EP",
      artist: "Artist Name",
      releaseYear: 2021,
      albumArt: "https://via.placeholder.com/300x300?text=Acoustic+EP",
      tracks: [demoTracks[4]],
    },
    {
      id: 3,
      title: "First Album",
      artist: "Artist Name",
      releaseYear: 2019,
      albumArt: "https://via.placeholder.com/300x300?text=First+Album",
      tracks: [],
    },
  ];

  const demoArtist: Artist = {
    id: "artist-1",
    name: "Artist Name",
    bio: "Artist Name is a multi-platinum selling artist known for blending electronic and pop music into chart-topping hits. With multiple awards and sold-out world tours, they continue to push musical boundaries while maintaining commercial success.\n\nTheir innovative production style and emotive songwriting have earned critical acclaim across the industry. Artist Name has collaborated with some of the biggest names in music and contributed to soundtracks for major films.",
    imageUrl: "https://via.placeholder.com/300x300?text=Artist+Photo",
    headerImageUrl: "https://via.placeholder.com/1200x400?text=Artist+Header",
    genres: ["Pop", "Electronic", "Dance"],
    formationYear: 2015,
    origin: "Los Angeles, CA",
    website: "https://www.artistname.com",
    social: {
      spotify: "https://spotify.com/artist/example",
      instagram: "https://instagram.com/artistname",
      twitter: "https://twitter.com/artistname",
      youtube: "https://youtube.com/artistname",
      facebook: "https://facebook.com/artistname",
    },
    monthlyListeners: 12500000,
    topTracks: demoTracks,
    albums: demoAlbums,
    relatedArtists: [
      {
        id: "related-1",
        name: "Similar Artist",
        imageUrl: "https://via.placeholder.com/150x150?text=Similar+1",
      },
      {
        id: "related-2",
        name: "Collaborator",
        imageUrl: "https://via.placeholder.com/150x150?text=Collaborator",
      },
      {
        id: "related-3",
        name: "Influenced By",
        imageUrl: "https://via.placeholder.com/150x150?text=Influence",
      },
      {
        id: "related-4",
        name: "Producer",
        imageUrl: "https://via.placeholder.com/150x150?text=Producer",
      },
      {
        id: "related-5",
        name: "Remix Artist",
        imageUrl: "https://via.placeholder.com/150x150?text=Remixer",
      },
      {
        id: "related-6",
        name: "Tour Support",
        imageUrl: "https://via.placeholder.com/150x150?text=Support",
      },
    ],
    achievements: [
      {
        name: "Grammy Award - Best Electronic Album",
        date: "February 2022",
        description: "Won for sophomore album 'Digital Landscapes'",
      },
      {
        name: "Billboard #1 Single",
        date: "June 2021",
        description: "Chart-topping hit 'Electric Emotions' with 8 weeks at #1",
      },
      {
        name: "Diamond Certification",
        date: "November 2020",
        description: "10 million units sold for debut single 'First Light'",
      },
      {
        name: "Coachella Headliner",
        date: "April 2023",
        description: "Headlined the main stage with record-breaking attendance",
      },
    ],
    analytics: {
      listeningTrends: [
        { period: "Jan", value: 9800000 },
        { period: "Feb", value: 10200000 },
        { period: "Mar", value: 10500000 },
        { period: "Apr", value: 11000000 },
        { period: "May", value: 11300000 },
        { period: "Jun", value: 12000000 },
        { period: "Jul", value: 12500000 },
      ],
      demographics: [
        { ageRange: "18-24", percentage: 42 },
        { ageRange: "25-34", percentage: 31 },
        { ageRange: "35-44", percentage: 15 },
        { ageRange: "45+", percentage: 8 },
        { ageRange: "Under 18", percentage: 4 },
      ],
      topRegions: [
        { name: "United States", value: 3800000 },
        { name: "United Kingdom", value: 1500000 },
        { name: "Germany", value: 1200000 },
        { name: "Brazil", value: 980000 },
        { name: "Australia", value: 750000 },
      ],
    },
    tags: ["Grammy Winner", "Headliner", "Producer", "Songwriter", "Remix Artist"],
    news: [
      {
        id: "news-1",
        source: "instagram",
        content: "Just finished mastering the new single! Can't wait for you all to hear it next week. #NewMusic #ComingSoon",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        imageUrl: "https://via.placeholder.com/800x600?text=New+Single+Teaser",
        likes: 45872,
        comments: 2105,
        shares: 3720,
        isVerified: true
      },
      {
        id: "news-2",
        source: "release",
        title: "New Album Pre-Save Available",
        content: "My new album 'Digital Landscapes' is now available for pre-save on all platforms. Release date: July 15th!",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        url: "https://example.com/album-presave",
        imageUrl: "https://via.placeholder.com/1200x1200?text=Digital+Landscapes+Album+Cover",
        isPinned: true
      },
      {
        id: "news-3",
        source: "spotify",
        title: "Artist Name releases 'First Light' Remix EP",
        content: "Stream the new remix collection featuring reworks by top producers in the electronic scene.",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        url: "https://spotify.com/example",
        imageUrl: "https://via.placeholder.com/1200x630?text=Remix+EP+Cover"
      },
      {
        id: "news-4",
        source: "youtube",
        title: "Official Music Video - 'Electric Emotions'",
        content: "Watch the official music video for my latest hit single 'Electric Emotions'",
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "https://youtube.com/watch?v=example",
        likes: 142000,
        comments: 8700
      },
      {
        id: "news-5",
        source: "tour",
        title: "World Tour Announcement",
        content: "I'm excited to announce the 'Digital Landscapes World Tour' starting this fall. Presale tickets available next Monday for fan club members.",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        url: "https://example.com/tour-info",
        imageUrl: "https://via.placeholder.com/1000x500?text=World+Tour+Announcement",
        isPinned: true
      },
      {
        id: "news-6",
        source: "article",
        title: "Behind the Music: An Interview with Artist Name",
        content: "In this exclusive interview, we discuss the creative process behind 'Digital Landscapes' and what's next.",
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        url: "https://musicmagazine.com/example-interview",
        imageUrl: "https://via.placeholder.com/800x450?text=Artist+Interview"
      }
    ]
  };

  const handlePlayTrack = (trackId: string | number) => {
    setCurrentTrackId(trackId);
    setIsPlaying(true);
    console.log(`Playing track with ID: ${trackId}`);
  };

  const handlePlayAlbum = (albumId: number) => {
    console.log(`Playing album with ID: ${albumId}`);
    // In a real implementation, this would queue up all album tracks
  };

  const handleFollow = (artistId: string, isFollowing: boolean) => {
    console.log(`${isFollowing ? 'Following' : 'Unfollowed'} artist: ${artistId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/artist-details" />
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
              title="Artist Details"
              description="A comprehensive component for displaying artist information, discography, analytics, and achievements."
            />

            <div className="mt-8 space-y-8">
              <section id="overview">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <Alert>
                  <AlertTitle>Component Features</AlertTitle>
                  <AlertDescription>
                    The ArtistDetails component provides a complete view of an artist, including biography, 
                    top tracks, albums, analytics, and social media links. It supports playback functionality,
                    follow/unfollow actions, and detailed analytics visualization.
                  </AlertDescription>
                </Alert>
              </section>

              <section id="example">
                <h2 className="text-2xl font-bold mb-4">Example</h2>
                <Tabs defaultValue="preview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="mt-4">
                    <Card className="p-6">
                      <Tabs defaultValue="standard">
                        <TabsList className="mb-4">
                          <TabsTrigger value="standard">Standard</TabsTrigger>
                          <TabsTrigger value="pixel-avatar">Pixel Avatar</TabsTrigger>
                          <TabsTrigger value="analytics">Artist Analysis</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="standard">
                          <ArtistDetails 
                            artist={demoArtist}
                            onPlayTrack={handlePlayTrack}
                            onPlayAlbum={handlePlayAlbum}
                            onFollow={handleFollow}
                          />
                        </TabsContent>
                        
                        <TabsContent value="pixel-avatar">
                          <div className="p-4 border rounded-lg mb-4">
                            <h3 className="text-lg font-semibold mb-3">Pixel Art Avatar Feature</h3>
                            <p className="text-muted-foreground mb-4">
                              Enhance artist profiles with customizable pixel avatars. Unlock new customization options through achievements.
                            </p>
                          </div>
                          <ArtistPixelAvatar artist={demoArtist} />
                        </TabsContent>
                        
                        <TabsContent value="analytics">
                          <div className="p-4 border rounded-lg mb-4">
                            <h3 className="text-lg font-semibold mb-3">Advanced Artist Analysis</h3>
                            <p className="text-muted-foreground mb-4">
                              Gain deep insights into artistic style, lyrical themes, and career trends through comprehensive data analysis.
                            </p>
                          </div>
                          <ArtistAnalysis artist={demoArtist} />
                        </TabsContent>
                      </Tabs>
                    </Card>
                  </TabsContent>
                  <TabsContent value="code">
                    <Card className="p-6">
                      <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <Tabs defaultValue="standard">
                          <TabsList>
                            <TabsTrigger value="standard">Standard</TabsTrigger>
                            <TabsTrigger value="pixel-avatar">Pixel Avatar</TabsTrigger>
                            <TabsTrigger value="analytics">Artist Analysis</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="standard">
                            <pre className="text-sm">
                              <code className="language-tsx">{`import { ArtistDetails } from '@/components/music-ui/ArtistDetails';

// Example data setup (would typically come from an API)
const artist = {
  id: "artist-1",
  name: "Artist Name",
  bio: "Artist biography text...",
  imageUrl: "/path/to/artist-image.jpg",
  headerImageUrl: "/path/to/header-image.jpg",
  genres: ["Pop", "Electronic"],
  monthlyListeners: 12500000,
  // News feed data from multiple sources
  news: [
    {
      id: "news-1",
      source: "instagram",
      content: "Just finished mastering the new single!",
      date: "2023-06-15T12:00:00Z",
      imageUrl: "/path/to/image.jpg",
      likes: 45872,
      comments: 2105,
      isVerified: true
    },
    {
      id: "news-2",
      source: "spotify",
      title: "New EP Release",
      content: "My new EP is out now on all platforms",
      date: "2023-06-10T10:30:00Z",
      url: "https://spotify.com/example"
    }
  ],
  // ... other artist properties
};

// In your component:
export default function YourComponent() {
  const handlePlayTrack = (trackId) => {
    // Logic to play a specific track
    console.log(\`Playing track: \${trackId}\`);
  };

  const handlePlayAlbum = (albumId) => {
    // Logic to play an entire album
    console.log(\`Playing album: \${albumId}\`);
  };

  const handleFollow = (artistId, isFollowing) => {
    // Logic to follow/unfollow artist
    console.log(\`\${isFollowing ? 'Following' : 'Unfollowed'} artist: \${artistId}\`);
  };

  return (
    <ArtistDetails
      artist={artist}
      onPlayTrack={handlePlayTrack}
      onPlayAlbum={handlePlayAlbum}
      onFollow={handleFollow}
    />
  );
}`}</code>
                            </pre>
                          </TabsContent>
                          
                          <TabsContent value="pixel-avatar">
                            <pre className="text-sm">
                              <code className="language-tsx">{`import { ArtistPixelAvatar } from '@/components/music-ui/ArtistPixelAvatar';

// Example artist data
const artist = {
  id: "artist-1",
  name: "Artist Name",
  // ... other artist properties
  achievements: [
    {
      name: "Grammy Award - Best Electronic Album",
      date: "February 2022",
      description: "Won for sophomore album 'Digital Landscapes'"
    },
    // ... other achievements
  ]
};

// In your component:
export default function YourComponent() {
  return (
    <ArtistPixelAvatar artist={artist} />
  );
}

// The pixel avatar component will use achievements to unlock customization options
// Users can generate, customize, and share pixel avatars for their artists`}</code>
                            </pre>
                          </TabsContent>
                          
                          <TabsContent value="analytics">
                            <pre className="text-sm">
                              <code className="language-tsx">{`import { ArtistAnalysis } from '@/components/music-ui/ArtistAnalysis';

// Example artist data
const artist = {
  id: "artist-1",
  name: "Artist Name",
  // ... other artist properties
};

// In your component:
export default function YourComponent() {
  return (
    <ArtistAnalysis artist={artist} />
  );
}

// The analysis component will process lyrics, sound patterns, and career metrics
// to generate insights and visualizations about the artist's work`}</code>
                            </pre>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              <section id="usage">
                <h2 className="text-2xl font-bold mb-4">Usage</h2>
                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">When to use</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Artist profile pages in music applications</li>
                      <li>Detailed artist information sections in streaming platforms</li>
                      <li>Artist dashboards for music management systems</li>
                      <li>Artist discovery features in music recommendation systems</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-6">Component Variants</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-md font-medium">Standard Artist Details</h4>
                        <p className="text-sm text-muted-foreground">
                          The standard view provides comprehensive artist information, discography, news feed, and achievements.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium">Pixel Avatar Feature</h4>
                        <p className="text-sm text-muted-foreground">
                          An interactive variant that generates custom pixel art avatars for artists with achievement-based customization options.
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-sm text-muted-foreground space-y-1">
                          <li>Uses AI to generate base pixel art from artist photos</li>
                          <li>Allows customization of avatar features (hair, accessories, etc.)</li>
                          <li>Ties customization options to artist achievements</li>
                          <li>Provides sharing and download functionality</li>
                          <li>Includes applications for community, streaming profiles, and fan rewards</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium">Advanced Artist Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          A data-driven variant that analyzes lyrics, sound patterns, and career metrics to generate insights.
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-sm text-muted-foreground space-y-1">
                          <li>Provides deep lyrical analysis (themes, vocabulary, mood)</li>
                          <li>Analyzes sound characteristics (genre, tempo, production elements)</li>
                          <li>Tracks career performance and audience demographics</li>
                          <li>Generates actionable insights for artists</li>
                          <li>Visualizes trends and patterns in the artist's work</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6">Integrated News Feed</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Multi-source Aggregation:</strong> Combine updates from social media, DSPs, press, and other sources in one unified feed</li>
                      <li><strong>Source Filtering:</strong> Allow users to filter content by specific platforms or content types</li>
                      <li><strong>Important Announcements:</strong> Highlight key updates such as new releases and tour announcements</li>
                      <li><strong>Rich Media:</strong> Display embedded images, videos, and links directly in the feed</li>
                      <li><strong>Engagement Metrics:</strong> View likes, shares, comments, and other engagement statistics</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-6">Gamification Opportunities</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Achievement Badges:</strong> Unlock special badges for discovering new artists or listening to complete discographies</li>
                      <li><strong>Artist Loyalty:</strong> Earn points for following artists and listening to their content regularly</li>
                      <li><strong>First Listener Rewards:</strong> Special recognition for being among the first to listen to new releases</li>
                      <li><strong>Artist Challenges:</strong> Complete listening challenges related to specific artists</li>
                      <li><strong>Super Fan Status:</strong> Achieve recognition for in-depth knowledge of an artist's catalog</li>
                      <li><strong>Avatar Customization:</strong> Unlock special avatar items based on listening habits and achievements</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-6">Analytics Applications</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Growth Tracking:</strong> Visualize artist popularity growth over time</li>
                      <li><strong>Audience Insights:</strong> Understand demographic and geographic distribution of listeners</li>
                      <li><strong>Song Performance:</strong> Compare track popularity and streaming metrics</li>
                      <li><strong>Release Impact:</strong> Measure the impact of new releases on overall artist metrics</li>
                      <li><strong>Trend Analysis:</strong> Identify trending periods and correlate with events or promotions</li>
                      <li><strong>Lyrical Insights:</strong> Analyze themes, vocabulary, and emotional tone of lyrics</li>
                      <li><strong>Sound Profile:</strong> Identify signature production elements and musical characteristics</li>
                    </ul>
                  </div>
                </Card>
              </section>
            </div>
          </main>
        </div>
      </div>
      <Footer 
        categories={[
          {
            title: "Documentation",
            links: [
              { label: "Getting Started", href: "/docs/introduction" },
              { label: "Components", href: "/components" },
              { label: "API Reference", href: "/docs/api" },
            ]
          },
          {
            title: "Resources",
            links: [
              { label: "GitHub", href: "https://github.com/yourusername/music-component-library" },
              { label: "Discord", href: "https://discord.gg/your-server" },
              { label: "Twitter", href: "https://twitter.com/your-handle" },
            ]
          }
        ]}
        socialLinks={[
          { icon: "ri-github-fill", href: "https://github.com/yourusername/music-component-library" },
          { icon: "ri-discord-fill", href: "https://discord.gg/your-server" },
          { icon: "ri-twitter-fill", href: "https://twitter.com/your-handle" },
        ]}
      />
    </div>
  );
} 