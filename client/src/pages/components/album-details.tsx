import { useState, useRef } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { AlbumDetails, EnhancedAlbum, AlbumFile } from '@/components/music-ui/AlbumDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, ArrowRight, PlusCircle, FileText, Music, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { FileType, StemSubtype } from '@/components/music-ui/SongDetails';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Album, Track } from '@/types/music';

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

// Demo tracks
const demoTracks: Track[] = [
  {
    id: 1,
    title: "Celestial Beginning",
    artist: "Cosmic Ensemble",
    duration: 184,
    audioSrc: "/audio/track1.mp3",
    metadata: {
      album: "Astral Journeys",
      year: 2023,
      genre: ["Ambient", "Electronic"],
    }
  },
  {
    id: 2,
    title: "Nebula Dreams",
    artist: "Cosmic Ensemble",
    duration: 213,
    audioSrc: "/audio/track2.mp3",
    metadata: {
      album: "Astral Journeys",
      year: 2023,
      genre: ["Ambient", "Electronic"],
    }
  },
  {
    id: 3,
    title: "Solar Winds",
    artist: "Cosmic Ensemble",
    duration: 245,
    audioSrc: "/audio/track3.mp3",
    metadata: {
      album: "Astral Journeys",
      year: 2023,
      genre: ["Ambient", "Electronic"],
    }
  },
  {
    id: 4,
    title: "Interstellar Voyage",
    artist: "Cosmic Ensemble",
    duration: 198,
    audioSrc: "/audio/track4.mp3",
    metadata: {
      album: "Astral Journeys",
      year: 2023,
      genre: ["Ambient", "Electronic"],
    }
  },
  {
    id: 5,
    title: "Event Horizon",
    artist: "Cosmic Ensemble",
    duration: 267,
    audioSrc: "/audio/track5.mp3",
    metadata: {
      album: "Astral Journeys",
      year: 2023,
      genre: ["Ambient", "Electronic"],
    }
  }
];

// Basic album
const basicAlbum: EnhancedAlbum = {
  id: 1,
  title: "Astral Journeys",
  artist: "Cosmic Ensemble",
  releaseYear: 2023,
  albumArt: "https://picsum.photos/seed/album1/500/500",
  tracks: demoTracks,
};

// Enhanced album with more metadata
const enhancedAlbum: EnhancedAlbum = {
  ...basicAlbum,
  releaseDate: "2023-05-15",
  description: "A conceptual ambient album exploring the vastness of space through ethereal soundscapes and cosmic textures.",
  label: "Stellar Records",
  upc: "123456789012",
  albumType: "album",
  tags: ["ambient", "space", "electronic", "conceptual"],
  credits: {
    producer: "Alex Nova",
    executive_producer: "Stella Cosmos",
    mixing_engineer: "Mike Waves",
    mastering_engineer: "Sarah Soundsmith",
    artwork: "Celestial Designs Inc."
  }
};

// Album with streaming links
const albumWithStreamingLinks: EnhancedAlbum = {
  ...enhancedAlbum,
  dspLinks: [
    {
      platform: "Spotify",
      url: "https://open.spotify.com/album/example",
      icon: "/icons/spotify.svg"
    },
    {
      platform: "Apple Music",
      url: "https://music.apple.com/album/example",
      icon: "/icons/apple-music.svg"
    },
    {
      platform: "YouTube Music",
      url: "https://music.youtube.com/playlist/example",
      icon: "/icons/youtube-music.svg"
    },
    {
      platform: "Bandcamp",
      url: "https://artist.bandcamp.com/album/example",
      icon: "/icons/bandcamp.svg"
    }
  ]
};

// Album with files
const albumFiles: AlbumFile[] = [
  {
    id: "file-1",
    name: "Astral Journeys - Master WAV",
    type: "master",
    url: "https://example.com/files/master.wav",
    size: 1.2 * 1024 * 1024 * 1024, // 1.2GB
    date: "2023-05-01T10:30:00Z"
  },
  {
    id: "file-2",
    name: "Astral Journeys - Album Artwork (High Resolution)",
    type: "image",
    url: "https://picsum.photos/seed/album1/2000/2000",
    size: 8.5 * 1024 * 1024, // 8.5MB
    date: "2023-04-20T14:45:00Z"
  },
  {
    id: "file-3",
    name: "Celestial Beginning - Stems",
    type: "stem",
    subtype: "vocals",
    url: "https://example.com/files/track1_vocals.wav",
    size: 250 * 1024 * 1024, // 250MB
    date: "2023-04-15T09:20:00Z",
    trackId: 1
  },
  {
    id: "file-4",
    name: "Album Liner Notes",
    type: "document",
    url: "https://example.com/files/liner_notes.pdf",
    size: 2.3 * 1024 * 1024, // 2.3MB
    date: "2023-05-10T16:00:00Z"
  }
];

const albumWithFiles: EnhancedAlbum = {
  ...albumWithStreamingLinks,
  files: albumFiles
};

// Album with reviews
const albumWithReviews: EnhancedAlbum = {
  ...albumWithFiles,
  reviews: [
    {
      id: "review-1",
      source: "Ambient Music Magazine",
      author: "James Listener",
      date: "2023-05-20",
      rating: 4.5,
      content: "An immersive sonic experience that transports the listener to the far reaches of the cosmos. The production is pristine, with layers of carefully crafted textures.",
      url: "https://example.com/reviews/1"
    },
    {
      id: "review-2",
      source: "Electronic Sounds",
      author: "Maria Beat",
      date: "2023-05-22",
      rating: 8.5,
      content: "Cosmic Ensemble delivers a thoughtful and atmospheric album that stands out in the crowded ambient genre. 'Nebula Dreams' is a standout track that showcases the group's ability to create evolving soundscapes.",
      url: "https://example.com/reviews/2"
    },
    {
      id: "review-3",
      source: "Music Today",
      author: "Robert Harmony",
      date: "2023-05-25",
      rating: 4,
      content: "While not breaking new ground, 'Astral Journeys' is a solid ambient album with beautiful moments and consistent production quality throughout.",
      url: "https://example.com/reviews/3"
    }
  ]
};

// Album with analysis
const albumWithAnalysis: EnhancedAlbum = {
  ...albumWithReviews,
  analysis: [
    {
      source: "harmonic",
      data: {
        keyDistribution: {
          "C minor": 2,
          "G major": 1,
          "D minor": 1,
          "A minor": 1
        },
        tempoRange: {
          min: 68,
          max: 84,
          average: 76
        },
        moodProfile: {
          calm: 0.8,
          ethereal: 0.75,
          introspective: 0.65,
          hopeful: 0.45,
          melancholic: 0.3
        }
      }
    },
    {
      source: "spectrum",
      data: {
        frequencyBalance: {
          bass: 0.65,
          midrange: 0.75,
          highs: 0.6,
          transients: 0.4
        },
        dynamicRange: {
          value: 12.3, // dB
          description: "Good dynamic range, minimal compression"
        },
        spectralCentroid: {
          min: 420,
          max: 1250,
          average: 780
        }
      }
    }
  ]
};

export default function AlbumDetailsPage() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [playingTrackId, setPlayingTrackId] = useState<string | number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  
  const handlePlayTrack = (trackId: string | number) => {
    setPlayingTrackId(trackId);
    setIsPlaying(true);
    console.log(`Playing track with ID: ${trackId}`);
  };
  
  const handlePlayAlbum = () => {
    console.log('Playing entire album');
    // In a real app, this would queue all tracks
    if (basicAlbum.tracks.length > 0) {
      handlePlayTrack(basicAlbum.tracks[0].id);
    }
  };
  
  const handleToggleLike = (isLiked: boolean) => {
    toast({
      title: isLiked ? 'Album added to your library' : 'Album removed from your library',
      description: isLiked 
        ? 'Astral Journeys has been added to your liked albums' 
        : 'Astral Journeys has been removed from your liked albums'
    });
  };
  
  const handleSaveUpdatedAlbum = (updatedAlbum: EnhancedAlbum) => {
    // In a real app, this would save to a backend
    console.log('Updated album:', updatedAlbum);
    toast({
      title: 'Album updated successfully!',
      description: 'Your changes have been saved.'
    });
  };
  
  const handleFileUpload = async (file: File, type: FileType, subtype?: StemSubtype, trackId?: string | number): Promise<AlbumFile> => {
    // Simulate upload process
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Create a new file object
        const newFile: AlbumFile = {
          id: uuidv4(),
          name: file.name,
          type: type,
          subtype: subtype,
          trackId: trackId,
          url: URL.createObjectURL(file), // Create a temporary URL
          size: file.size,
          date: new Date().toISOString()
        };
        
        toast({
          title: 'File uploaded',
          description: `Successfully uploaded ${file.name}`
        });
        
        resolve(newFile);
      }, 1500); // Simulate 1.5s upload time
    });
  };
  
  const handleFileDelete = async (fileId: string): Promise<void> => {
    // Simulate delete process
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        toast({
          title: 'File deleted',
          description: `File has been removed`
        });
        
        resolve();
      }, 500);
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/album-details" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Album Details" 
              description="A comprehensive component for displaying albums, their tracks, metadata, streaming links, and related content."
            />
            
            <div className="mt-8 space-y-8">
              <section id="overview">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <Alert>
                  <AlertTitle>Component Features</AlertTitle>
                  <AlertDescription>
                    The AlbumDetails component provides a complete view of an album, including track listings, 
                    metadata, streaming links, and file management. It supports multiple display variants and 
                    editing capabilities.
                  </AlertDescription>
                </Alert>
              </section>
              
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Variants</TabsTrigger>
                  <TabsTrigger value="files">File Management</TabsTrigger>
                  <TabsTrigger value="streaming">Streaming & Reviews</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-8">
                  {/* Basic Variation */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Variation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      A simple view of an album with minimal metadata and track listing.
                    </p>
                    <AlbumDetails 
                      album={basicAlbum} 
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                  
                  {/* Enhanced Variation */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Enhanced Variation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Extended metadata with description, label info, and credits.
                    </p>
                    <AlbumDetails 
                      album={enhancedAlbum} 
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                  
                  {/* Compact Variation */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Compact Variation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      A condensed view suitable for lists or sidebars.
                    </p>
                    <AlbumDetails 
                      album={basicAlbum} 
                      variant="compact"
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                  
                  {/* Expanded Variation */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Expanded Variation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Full-featured display with all metadata, track details, and additional information.
                    </p>
                    <AlbumDetails 
                      album={albumWithAnalysis} 
                      variant="expanded"
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                  
                  {/* Editable Variation */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Editable Variation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Allows editing of album metadata and management of album content.
                    </p>
                    <AlbumDetails 
                      album={enhancedAlbum} 
                      isEditable={true}
                      onSave={handleSaveUpdatedAlbum}
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                  
                  {/* Track Management Example */}
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Track Management</h3>
                        <p className="text-sm text-muted-foreground">
                          Add, edit, and remove tracks from an album in edit mode.
                        </p>
                      </div>
                      <div className="inline-flex items-center justify-center rounded-md bg-muted px-3 py-1 text-sm font-medium">
                        <span className="text-muted-foreground mr-1">New</span>
                        <span className="text-emerald-500">Feature</span>
                      </div>
                    </div>
                    
                    <div className="p-4 mb-4 border rounded-md bg-amber-50 dark:bg-amber-950/20">
                      <div className="flex items-start">
                        <Info className="mt-0.5 h-5 w-5 text-amber-500 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">How to use this feature</h4>
                          <ol className="mt-1 text-sm text-amber-700 dark:text-amber-400 list-decimal list-inside space-y-1">
                            <li>Click the "Edit" button to enter edit mode</li>
                            <li>Navigate to the "Tracks" tab</li>
                            <li>Use the "Add Track" button to add new tracks</li>
                            <li>Edit track titles, artists, and durations directly</li>
                            <li>Remove tracks with the delete button</li>
                            <li>Click "Save" to save your changes</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    <AlbumDetails 
                      album={basicAlbum} 
                      isEditable={true}
                      onSave={handleSaveUpdatedAlbum}
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="files" className="space-y-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">File Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The AlbumDetails component supports uploading, organizing, and managing files associated with an album.
                    </p>
                    <AlbumDetails 
                      album={albumWithFiles} 
                      isEditable={true}
                      onSave={handleSaveUpdatedAlbum}
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                      onFileUpload={handleFileUpload}
                      onFileDelete={handleFileDelete}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="streaming" className="space-y-8">
                  {/* Streaming Links */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Streaming Links</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Display links to various streaming platforms where the album is available.
                    </p>
                    <AlbumDetails 
                      album={albumWithStreamingLinks} 
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                  
                  {/* Album Reviews */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Shows critical reviews and ratings from various sources.
                    </p>
                    <AlbumDetails 
                      album={albumWithReviews} 
                      onPlayTrack={handlePlayTrack}
                      onPlayAlbum={handlePlayAlbum}
                      onToggleLike={handleToggleLike}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>
                        The AlbumDetails component provides a comprehensive view of album information, including:
                      </p>
                      <ul>
                        <li>Basic album information (title, artist, release date)</li>
                        <li>Track listing with playback control</li>
                        <li>Album artwork and description</li>
                        <li>Credits and contributors</li>
                        <li>Streaming platform links</li>
                        <li>File management for album assets (master files, artwork, stems, etc.)</li>
                        <li>Reviews from various sources</li>
                        <li>Audio analysis and insights</li>
                        <li>Edit mode for updating information</li>
                        <li>Track management (adding, editing, and removing tracks)</li>
                      </ul>
                      
                      <h4>Component Variants</h4>
                      <p>The component supports several display variants:</p>
                      <ul>
                        <li><strong>Default:</strong> Balanced display of album information and tracks</li>
                        <li><strong>Compact:</strong> Condensed view for lists or sidebars</li>
                        <li><strong>Expanded:</strong> Full-featured display with all metadata and additional information</li>
                      </ul>
                      
                      <h4>File Management</h4>
                      <p>
                        The component includes a robust file management system that allows users to:
                      </p>
                      <ul>
                        <li>Upload various file types (master audio, artwork, documents)</li>
                        <li>Associate files with specific tracks or the entire album</li>
                        <li>Organize files by type and purpose</li>
                        <li>Preview and download files</li>
                        <li>Delete files when in edit mode</li>
                      </ul>
                      
                      <h4>Track Management</h4>
                      <p>
                        The component provides comprehensive track management capabilities:
                      </p>
                      <ul>
                        <li>Add new tracks to the album with a user-friendly dialog</li>
                        <li>Edit track details (title, artist, duration) directly in the track list</li>
                        <li>Remove tracks from the album</li>
                        <li>Automatically update track numbering</li>
                        <li>Format track duration with proper minutes and seconds</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface AlbumDetailsProps {
  album: EnhancedAlbum;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
  isEditable?: boolean;
  onSave?: (updatedAlbum: EnhancedAlbum) => void;
  onPlayTrack?: (trackId: string | number) => void;
  onPlayAlbum?: () => void;
  onToggleLike?: (isLiked: boolean) => void;
  onSeekAudio?: (time: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  currentTrack?: Track;
  isPlaying?: boolean;
  onFileUpload?: (file: File, type: FileType, subtype?: StemSubtype, trackId?: string | number) => Promise<AlbumFile>;
  onFileDelete?: (fileId: string) => Promise<void>;
}`}</code></pre>

                      <h4>EnhancedAlbum Interface</h4>
                      <p>The component uses an enhanced version of the standard Album interface:</p>
                      <pre><code>{`interface EnhancedAlbum extends Album {
  description?: string;
  releaseDate?: string;
  label?: string;
  upc?: string;
  totalDuration?: number;
  producers?: string[];
  engineers?: string[];
  recordingLocations?: string[];
  albumType?: 'album' | 'ep' | 'single' | 'compilation';
  tags?: string[];
  credits?: {
    producer?: string;
    executive_producer?: string;
    mixing_engineer?: string;
    mastering_engineer?: string;
    artwork?: string;
    [key: string]: string | undefined;
  };
  dspLinks?: {
    platform: string;
    url: string;
    icon?: string;
  }[];
  analysis?: {
    source: string;
    data: any;
  }[];
  files?: AlbumFile[];
  reviews?: {
    id: string;
    source: string;
    author: string;
    date: string;
    rating?: number;
    content: string;
    url?: string;
  }[];
}`}</code></pre>

                      <h4>Integration with Audio Players</h4>
                      <p>
                        The component can be connected to external audio players using the audioRef, isPlaying, and
                        currentTrack props. This allows for synchronized playback state across your application.
                      </p>
                      
                      <h4>Best Practices</h4>
                      <ul>
                        <li>Always provide track duration information for a better user experience</li>
                        <li>Use high-quality album artwork with consistent aspect ratios (preferably square)</li>
                        <li>Implement the onPlayTrack and onPlayAlbum handlers to provide actual audio playback</li>
                        <li>Use the compact variant in list views and the default or expanded variants for dedicated album pages</li>
                        <li>When enabling file management, include proper validation and progress indicators</li>
                      </ul>
                    </div>
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
      
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
} 