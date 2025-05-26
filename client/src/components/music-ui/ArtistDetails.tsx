import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Play, Pause, Share2, Calendar, ExternalLink, Music, Disc,
  ChevronDown, ChevronUp, Users, BarChart2, Globe, Award, Hash,
  Twitter, Facebook, Instagram, Youtube, Link2, ArrowUpRight,
  CheckCircle2, Pin, MessageSquare, FileText, Rss as RssIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Artist, Track, Album } from '@/types/music';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ArtistDetailsProps {
  artist: Artist;
  className?: string;
  isEditable?: boolean;
  onPlayTrack?: (trackId: string | number) => void;
  onPlayAlbum?: (albumId: number) => void;
  onFollow?: (artistId: string, isFollowing: boolean) => void;
  onViewAnalytics?: (analyticsType: string) => void;
}

export function ArtistDetails({
  artist,
  className = '',
  isEditable = false,
  onPlayTrack,
  onPlayAlbum,
  onFollow,
  onViewAnalytics
}: ArtistDetailsProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullBio, setShowFullBio] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | number | null>(null);
  
  // Source color mapping for news feed items
  const sourceColorMap: Record<string, string> = {
    instagram: 'bg-purple-100 text-purple-500',
    twitter: 'bg-blue-100 text-blue-500',
    facebook: 'bg-indigo-100 text-indigo-500',
    spotify: 'bg-green-100 text-green-500',
    youtube: 'bg-red-100 text-red-500',
    soundcloud: 'bg-orange-100 text-orange-500',
    bandcamp: 'bg-cyan-100 text-cyan-500',
    article: 'bg-slate-100 text-slate-500',
    release: 'bg-violet-100 text-violet-500',
    tour: 'bg-amber-100 text-amber-500',
    other: 'bg-gray-100 text-gray-500'
  };
  
  const handleFollowToggle = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    if (onFollow) {
      onFollow(artist.id, newFollowingState);
    }
  };
  
  const handlePlayPause = (trackId: string | number) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
      if (onPlayTrack) {
        onPlayTrack(trackId);
      }
    }
  };
  
  const handlePlayAlbum = (albumId: number) => {
    if (onPlayAlbum) {
      onPlayAlbum(albumId);
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className={`${className}`}>
      {/* Artist Header with Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden rounded-t-lg">
        {artist.headerImageUrl ? (
          <img
            src={artist.headerImageUrl}
            alt={`${artist.name} header image`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-end gap-6">
            {artist.imageUrl && (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{artist.name}</h1>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                {artist.monthlyListeners && (
                  <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
                )}
                {artist.genres && artist.genres.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{artist.genres.slice(0, 2).join(', ')}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleFollowToggle}
                variant={isFollowing ? "secondary" : "default"}
                className="gap-1"
              >
                {isFollowing ? 'Following' : 'Follow'}
                {isFollowing && <Heart className="h-4 w-4 text-red-500 fill-red-500" />}
              </Button>
              <Button variant="outline" className="bg-white/10">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-0 sm:p-6">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap border-b rounded-none px-2 sm:px-0">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Music
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              News Feed
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              About
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Achievements
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 p-4 sm:p-0 mt-4">
            {/* Bio Section */}
            {artist.bio && (
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold">Bio</h3>
                <p className={`text-muted-foreground ${showFullBio ? '' : 'line-clamp-3'}`}>
                  {artist.bio}
                </p>
                {artist.bio.length > 200 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-xs"
                    onClick={() => setShowFullBio(!showFullBio)}
                  >
                    {showFullBio ? 'Show less' : 'Read more'}
                    {showFullBio ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            )}
            
            {/* Top Tracks Section */}
            {artist.topTracks && artist.topTracks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Popular</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-1">
                  {artist.topTracks.slice(0, 5).map((track, index) => (
                    <div 
                      key={track.id} 
                      className="flex items-center py-2 px-3 hover:bg-muted rounded-md transition-colors"
                    >
                      <div className="w-6 text-center text-muted-foreground">{index + 1}</div>
                      <div className="w-10 h-10 mx-3">
                        {track.albumArt ? (
                          <img
                            src={track.albumArt}
                            alt={`${track.title} cover`}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                            <Music className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {track.metadata?.album || "Single"}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground mx-4">
                        {formatTime(track.duration)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePlayPause(track.id)}
                      >
                        {playingTrackId === track.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Albums Section */}
            {artist.albums && artist.albums.length > 0 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Albums</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {artist.albums.slice(0, 5).map((album) => (
                    <div key={album.id} className="space-y-2">
                      <div className="relative group aspect-square overflow-hidden rounded-md bg-muted">
                        {album.albumArt ? (
                          <img
                            src={album.albumArt}
                            alt={`${album.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="default"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => handlePlayAlbum(album.id)}
                          >
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate">{album.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {album.releaseYear || ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Related Artists Section */}
            {artist.relatedArtists && artist.relatedArtists.length > 0 && (
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Fans Also Like</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {artist.relatedArtists.slice(0, 6).map((relatedArtist) => (
                    <div key={relatedArtist.id} className="text-center space-y-2">
                      <div className="aspect-square overflow-hidden rounded-full bg-muted mx-auto">
                        {relatedArtist.imageUrl ? (
                          <img
                            src={relatedArtist.imageUrl}
                            alt={relatedArtist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{relatedArtist.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Music Tab - More comprehensive view of all music */}
          <TabsContent value="music" className="space-y-6 p-4 sm:p-0 mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Discography</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="albums">Albums</SelectItem>
                    <SelectItem value="singles">Singles</SelectItem>
                    <SelectItem value="compilations">Compilations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {artist.albums && artist.albums.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {artist.albums.map((album) => (
                    <div key={album.id} className="space-y-2">
                      <div className="relative group aspect-square overflow-hidden rounded-md bg-muted">
                        {album.albumArt ? (
                          <img
                            src={album.albumArt}
                            alt={`${album.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="default"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => handlePlayAlbum(album.id)}
                          >
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate">{album.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{album.releaseYear || ""}</span>
                          {album.tracks && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{album.tracks.length} tracks</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">All Tracks</h3>
                {artist.topTracks && artist.topTracks.length > 0 ? (
                  <div className="space-y-1">
                    {artist.topTracks.map((track, index) => (
                      <div 
                        key={track.id} 
                        className="flex items-center py-2 px-3 hover:bg-muted rounded-md transition-colors"
                      >
                        <div className="w-6 text-center text-muted-foreground">{index + 1}</div>
                        <div className="w-10 h-10 mx-3">
                          {track.albumArt ? (
                            <img
                              src={track.albumArt}
                              alt={`${track.title} cover`}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                              <Music className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{track.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.metadata?.album || "Single"}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground mx-4">
                          {formatTime(track.duration)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handlePlayPause(track.id)}
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No tracks available
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* News Feed Tab */}
          <TabsContent value="news" className="space-y-6 p-4 sm:p-0 mt-4">
            {artist.news && artist.news.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Latest Updates</h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="releases">Releases</SelectItem>
                      <SelectItem value="articles">Articles</SelectItem>
                      <SelectItem value="tour">Tour Dates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  {artist.news.map((item) => {
                    // Determine icon based on source
                    const getSourceIcon = () => {
                      switch(item.source) {
                        case 'instagram': return <Instagram className="h-4 w-4" />;
                        case 'twitter': return <Twitter className="h-4 w-4" />;
                        case 'facebook': return <Facebook className="h-4 w-4" />;
                        case 'spotify': return <Music className="h-4 w-4" />;
                        case 'youtube': return <Youtube className="h-4 w-4" />;
                        case 'release': return <Disc className="h-4 w-4" />;
                        case 'tour': return <Calendar className="h-4 w-4" />;
                        case 'article': return <FileText className="h-4 w-4" />;
                        default: return <MessageSquare className="h-4 w-4" />;
                      }
                    };
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`border rounded-lg p-4 space-y-3 ${item.isPinned ? 'border-primary/30 bg-primary/5' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-full ${sourceColorMap[item.source] || 'bg-gray-100'}`}>
                              {getSourceIcon()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium capitalize">{item.source}</p>
                                {item.isVerified && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline" className="h-5 rounded-full">
                                          <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Verified</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {item.isPinned && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline" className="h-5 rounded-full">
                                          <Pin className="h-3 w-3 text-red-500" />
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Pinned</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          {item.url && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {item.title && (
                          <h4 className="font-medium text-lg">{item.title}</h4>
                        )}
                        
                        <p className="text-muted-foreground">{item.content}</p>
                        
                        {item.imageUrl && (
                          <div className="mt-2 rounded-md overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title || "News image"} 
                              className="w-full object-cover max-h-80"
                            />
                          </div>
                        )}
                        
                        {item.videoUrl && (
                          <div className="mt-2 rounded-md overflow-hidden aspect-video">
                            <iframe 
                              src={item.videoUrl} 
                              title={item.title || "News video"}
                              className="w-full h-full" 
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                            />
                          </div>
                        )}
                        
                        {/* Engagement stats */}
                        {(item.likes !== undefined || item.comments !== undefined || item.shares !== undefined) && (
                          <div className="flex items-center gap-4 pt-2 text-muted-foreground text-sm">
                            {item.likes !== undefined && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{formatNumber(item.likes)}</span>
                              </div>
                            )}
                            {item.comments !== undefined && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{formatNumber(item.comments)}</span>
                              </div>
                            )}
                            {item.shares !== undefined && (
                              <div className="flex items-center gap-1">
                                <Share2 className="h-4 w-4" />
                                <span>{formatNumber(item.shares)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline">
                    Load More
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <RssIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No news or updates available</p>
              </div>
            )}
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 p-4 sm:p-0 mt-4">
            {artist.analytics ? (
              <div className="space-y-8">
                {/* Listening Trends */}
                {artist.analytics.listeningTrends && artist.analytics.listeningTrends.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Listening Trends</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewAnalytics && onViewAnalytics('listeningTrends')}
                      >
                        <BarChart2 className="h-4 w-4 mr-1" />
                        Detailed View
                      </Button>
                    </div>
                    <div className="h-64 p-4 rounded-md border">
                      <div className="h-full flex items-end gap-1">
                        {artist.analytics.listeningTrends.map((trend, i) => {
                          const maxValue = Math.max(...artist.analytics!.listeningTrends!.map(t => t.value));
                          const heightPercentage = (trend.value / maxValue) * 100;
                          
                          return (
                            <TooltipProvider key={i}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className="flex-1 bg-primary/80 hover:bg-primary rounded-t-sm transition-colors cursor-default"
                                    style={{ height: `${heightPercentage}%` }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{formatNumber(trend.value)} listeners</p>
                                  <p className="text-xs text-muted-foreground">{trend.period}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Demographics and Top Regions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Demographics */}
                  {artist.analytics.demographics && artist.analytics.demographics.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Demographics</h3>
                      <div className="space-y-3">
                        {artist.analytics.demographics.map((demographic, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{demographic.ageRange}</span>
                              <span className="text-sm">{demographic.percentage}%</span>
                            </div>
                            <Progress value={demographic.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Top Regions */}
                  {artist.analytics.topRegions && artist.analytics.topRegions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Top Regions</h3>
                      <div className="space-y-3">
                        {artist.analytics.topRegions.map((region, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{region.name}</span>
                              <span className="text-sm">{formatNumber(region.value)} listeners</span>
                            </div>
                            <Progress 
                              value={
                                (region.value / Math.max(...artist.analytics!.topRegions!.map(r => r.value))) * 100
                              } 
                              className="h-2" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Analytics data is not available for this artist</p>
              </div>
            )}
          </TabsContent>
          
          {/* About Tab */}
          <TabsContent value="about" className="space-y-6 p-4 sm:p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Full Biography */}
                {artist.bio && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Biography</h3>
                    <div className="text-muted-foreground">
                      {artist.bio.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-2">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Artist Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Info</h3>
                  <div className="space-y-3">
                    {artist.formationYear && (
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Formation Year</p>
                          <p className="text-sm text-muted-foreground">{artist.formationYear}</p>
                        </div>
                      </div>
                    )}
                    
                    {artist.origin && (
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Origin</p>
                          <p className="text-sm text-muted-foreground">{artist.origin}</p>
                        </div>
                      </div>
                    )}
                    
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="flex items-start">
                        <Music className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Genres</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {artist.genres.map((genre, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {artist.tags && artist.tags.length > 0 && (
                      <div className="flex items-start">
                        <Hash className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Tags</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {artist.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Social Links */}
                {artist.social && Object.keys(artist.social).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(artist.social)
                        .filter(([_, url]) => url)
                        .map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-md border hover:bg-muted transition-colors"
                          >
                            {renderSocialIcon(platform)}
                            <span className="capitalize">{platform}</span>
                            <ArrowUpRight className="h-3 w-3 ml-auto" />
                          </a>
                        ))}
                    </div>
                  </div>
                )}
                
                {/* Website */}
                {artist.website && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Website</h3>
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md border hover:bg-muted transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm truncate">{artist.website}</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6 p-4 sm:p-0 mt-4">
            {artist.achievements && artist.achievements.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Achievements & Milestones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artist.achievements.map((achievement, i) => (
                    <div 
                      key={i} 
                      className="flex items-start p-4 rounded-md border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mr-4 bg-primary/10 p-3 rounded-full">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{achievement.date}</p>
                        {achievement.description && (
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No achievements data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 