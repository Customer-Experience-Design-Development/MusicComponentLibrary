import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Play, Pause, Share2, Download, Edit2, Save, X, ExternalLink, 
  Calendar, Music, Disc, BarChart2, List, MoreHorizontal, Plus,
  SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle,
  Headphones, Users, Mic2, Clock, Tag, Info, FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTime } from '@/lib/utils';
import { Album, Track } from '@/types/music';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileType, SongFile, StemSubtype } from './SongDetails';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface AlbumFile extends SongFile {
  trackId?: string | number; // If the file is associated with a specific track
}

export interface EnhancedAlbum extends Album {
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
    rating?: number; // Out of 5 or 10
    content: string;
    url?: string;
  }[];
}

export interface AlbumDetailsProps {
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
}

export function AlbumDetails({
  album,
  className = "",
  variant = 'default',
  isEditable = false,
  onSave,
  onPlayTrack,
  onPlayAlbum,
  onToggleLike,
  onSeekAudio,
  audioRef: externalAudioRef,
  currentTrack,
  isPlaying = false,
  onFileUpload,
  onFileDelete
}: AlbumDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlbum, setEditedAlbum] = useState<EnhancedAlbum>(album);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('tracks');
  const [currentTrackId, setCurrentTrackId] = useState<string | number | null>(
    currentTrack ? currentTrack.id : null
  );
  
  // Audio player state
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const [audioIsPlaying, setAudioIsPlaying] = useState(isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  // File upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>('master');
  const [stemSubtype, setStemSubtype] = useState<StemSubtype>('vocals');
  const [selectedTrackId, setSelectedTrackId] = useState<string | number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Add state for track add dialog
  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState(false);
  const [newTrack, setNewTrack] = useState<Partial<Track>>({
    title: '',
    artist: album.artist,
    duration: 0
  });
  
  // Derived values
  const audioRef = externalAudioRef || internalAudioRef;
  const totalDuration = album.totalDuration || 
    album.tracks.reduce((total, track) => total + track.duration, 0);
  const trackCount = album.tracks.length;
  const releaseYear = album.releaseYear || 
    (album.releaseDate ? new Date(album.releaseDate).getFullYear() : undefined);
  
  // Update current track when props change
  useEffect(() => {
    if (currentTrack) {
      setCurrentTrackId(currentTrack.id);
    }
  }, [currentTrack]);
  
  // Update audio playing state when props change
  useEffect(() => {
    setAudioIsPlaying(isPlaying);
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);
  
  // Initialize audio
  useEffect(() => {
    if (audioRef?.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
      
      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [audioRef]);
  
  // Track time updates
  useEffect(() => {
    const ref = audioRef?.current;
    if (!ref) return;

    const updateTime = () => setCurrentTime(ref.currentTime);
    const handleEnded = () => {
      setAudioIsPlaying(false);
    };

    ref.addEventListener('timeupdate', updateTime);
    ref.addEventListener('ended', handleEnded);

    if (audioIsPlaying) {
      ref.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioIsPlaying(false);
      });
    } else {
      ref.pause();
    }

    return () => {
      ref.removeEventListener('timeupdate', updateTime);
      ref.removeEventListener('ended', handleEnded);
    };
  }, [audioIsPlaying, audioRef]);
  
  // Handlers
  const handlePlayPause = () => {
    setAudioIsPlaying(!audioIsPlaying);
  };

  const handlePlayTrack = (trackId: string | number) => {
    setCurrentTrackId(trackId);
    if (onPlayTrack) {
      onPlayTrack(trackId);
    }
  };
  
  const handlePlayAlbum = () => {
    if (onPlayAlbum) {
      onPlayAlbum();
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleMute = () => {
    if (audioRef?.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (onToggleLike) {
      onToggleLike(newLikedState);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAlbum(album);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedAlbum);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAlbum(album);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof EnhancedAlbum, value: any) => {
    setEditedAlbum(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'master':
        return <Music className="h-4 w-4 text-primary" />;
      case 'stem':
        return <Mic2 className="h-4 w-4 text-violet-500" />;
      case 'image':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const handleFileUpload = async () => {
    if (!uploadFile || !fileType || !onFileUpload) {
      setUploadError('No file selected or upload handler not provided');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      
      const newFile = await onFileUpload(
        uploadFile, 
        fileType, 
        fileType === 'stem' ? stemSubtype : undefined,
        selectedTrackId || undefined
      );
      
      // Update album with new file
      const updatedFiles = [...(editedAlbum.files || []), newFile];
      setEditedAlbum({
        ...editedAlbum,
        files: updatedFiles
      });
      
      // Close dialog and reset state
      setUploadDialogOpen(false);
      setUploadFile(null);
      setFileType('master');
      setStemSubtype('vocals');
      setSelectedTrackId(null);
      
      // If in edit mode, save changes
      if (isEditing && onSave) {
        onSave({
          ...editedAlbum,
          files: updatedFiles
        });
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteFile = async (fileId: string) => {
    if (!onFileDelete) {
      console.error('Delete handler not provided');
      return;
    }

    try {
      await onFileDelete(fileId);
      
      // Update album without the deleted file
      const updatedFiles = (editedAlbum.files || []).filter(f => f.id !== fileId);
      setEditedAlbum({
        ...editedAlbum,
        files: updatedFiles
      });
      
      // If in edit mode, save changes
      if (isEditing && onSave) {
        onSave({
          ...editedAlbum,
          files: updatedFiles
        });
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // Handle adding a new track
  const handleAddTrack = () => {
    if (!newTrack.title || newTrack.duration === 0) {
      // Could add validation UI here
      return;
    }
    
    // Create new track with a unique ID
    const trackToAdd: Track = {
      id: Date.now(), // Simple unique ID generation
      title: newTrack.title || '',
      artist: newTrack.artist || album.artist,
      duration: newTrack.duration || 0,
      audioSrc: newTrack.audioSrc,
      metadata: {
        album: album.title,
        year: album.releaseYear
      }
    };
    
    // Update the editedAlbum with the new track
    const updatedTracks = [...editedAlbum.tracks, trackToAdd];
    setEditedAlbum({
      ...editedAlbum,
      tracks: updatedTracks
    });
    
    // Reset form and close dialog
    setNewTrack({
      title: '',
      artist: album.artist,
      duration: 0
    });
    setAddTrackDialogOpen(false);
  };
  
  // Handle removing a track
  const handleRemoveTrack = (trackId: string | number) => {
    const updatedTracks = editedAlbum.tracks.filter(track => track.id !== trackId);
    setEditedAlbum({
      ...editedAlbum,
      tracks: updatedTracks
    });
  };
  
  // Track formatting helpers
  const formatDurationInput = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const parseDurationInput = (input: string): number => {
    const parts = input.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };
  
  // File Upload Dialog Component
  const fileUploadDialog = (
    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Add a new file to this album or track.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadFile(e.target.files[0]);
                }
              }}
            />
            {uploadFile && (
              <p className="text-xs text-muted-foreground">
                {uploadFile.name} ({formatFileSize(uploadFile.size)})
              </p>
            )}
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fileType">File Type</Label>
            <select 
              id="fileType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={fileType} 
              onChange={(e) => setFileType(e.target.value as FileType)}
            >
              <option value="master">Master Audio</option>
              <option value="stem">Stem</option>
              <option value="image">Image</option>
              <option value="document">Document</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {fileType === 'stem' && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="stemSubtype">Stem Type</Label>
              <select
                id="stemSubtype"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={stemSubtype}
                onChange={(e) => setStemSubtype(e.target.value as StemSubtype)}
              >
                <option value="vocals">Vocals</option>
                <option value="instruments">Instruments</option>
                <option value="drums">Drums</option>
                <option value="bass">Bass</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="trackId">Associated Track (Optional)</Label>
            <select
              id="trackId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedTrackId?.toString() || ""}
              onChange={(e) => setSelectedTrackId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Album-wide file</option>
              {album.tracks.map((track) => (
                <option key={track.id} value={track.id.toString()}>
                  {track.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setUploadDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFileUpload} 
            disabled={!uploadFile || !fileType || (fileType === 'stem' && !stemSubtype) || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Add Track Dialog
  const addTrackDialog = (
    <Dialog open={addTrackDialogOpen} onOpenChange={setAddTrackDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Track</DialogTitle>
          <DialogDescription>
            Add a new track to the album.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackTitle">Track Title</Label>
            <Input
              id="trackTitle"
              value={newTrack.title || ''}
              onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
              placeholder="Enter track title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trackArtist">Artist</Label>
            <Input
              id="trackArtist"
              value={newTrack.artist || album.artist}
              onChange={(e) => setNewTrack({...newTrack, artist: e.target.value})}
              placeholder="Enter artist name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trackDuration">Duration (MM:SS)</Label>
            <Input
              id="trackDuration"
              value={formatDurationInput(newTrack.duration || 0)}
              onChange={(e) => {
                const duration = parseDurationInput(e.target.value);
                setNewTrack({...newTrack, duration});
              }}
              placeholder="e.g. 3:45"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trackAudioSrc">Audio File URL (Optional)</Label>
            <Input
              id="trackAudioSrc"
              value={newTrack.audioSrc || ''}
              onChange={(e) => setNewTrack({...newTrack, audioSrc: e.target.value})}
              placeholder="https://example.com/audio/track.mp3"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setAddTrackDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddTrack}
            disabled={!newTrack.title || newTrack.duration === 0}
          >
            Add Track
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <>
        {fileUploadDialog}
        <Card className={className}>
          <div className="flex p-4">
            <div className="flex-shrink-0 mr-4">
              {album.albumArt ? (
                <img
                  src={album.albumArt}
                  alt={`${album.title} cover`}
                  className="w-24 h-24 object-cover rounded-md"
                />
              ) : (
                <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                  <Disc className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold truncate">{album.title}</h2>
                  <p className="text-sm text-muted-foreground">{album.artist}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{releaseYear}</span>
                    <span className="mx-1">•</span>
                    <span>{trackCount} tracks</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(totalDuration)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleLike}>
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="default" onClick={handlePlayAlbum}>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </>
    );
  }
  
  // Default & Expanded variants
  return (
    <>
      {fileUploadDialog}
      {addTrackDialog}
      <Card className={className}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Album Artwork */}
            <div className="flex-shrink-0">
              {album.albumArt ? (
                <img
                  src={album.albumArt}
                  alt={`${album.title} cover`}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Disc className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Album Info */}
            <div className="flex-1 min-w-0 space-y-4">
              <div>
                {isEditing ? (
                  <Input
                    value={editedAlbum.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-2xl font-bold mb-1"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{album.title}</h2>
                )}
                
                {isEditing ? (
                  <Input
                    value={editedAlbum.artist}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    className="text-lg mb-1"
                  />
                ) : (
                  <p className="text-lg">{album.artist}</p>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedAlbum.releaseYear}
                      onChange={(e) => handleInputChange('releaseYear', Number(e.target.value))}
                      className="w-24 mr-2"
                    />
                  ) : (
                    <span>{releaseYear}</span>
                  )}
                  <span className="mx-1">•</span>
                  <span>{trackCount} tracks</span>
                  <span className="mx-1">•</span>
                  <span>{formatTime(totalDuration)}</span>
                  
                  {isEditing && (
                    <>
                      <span className="mx-1">•</span>
                      <select
                        value={editedAlbum.albumType || 'album'}
                        onChange={(e) => handleInputChange('albumType', e.target.value)}
                        className="bg-transparent border-0 text-sm text-muted-foreground focus:outline-none"
                      >
                        <option value="album">Album</option>
                        <option value="ep">EP</option>
                        <option value="single">Single</option>
                        <option value="compilation">Compilation</option>
                      </select>
                    </>
                  )}
                  
                  {album.albumType && album.albumType !== 'album' && !isEditing && (
                    <>
                      <span className="mx-1">•</span>
                      <Badge variant="outline" className="capitalize">{album.albumType}</Badge>
                    </>
                  )}
                </div>
              </div>
              
              {/* Description */}
              {(album.description || isEditing) && (
                <div className="text-sm text-muted-foreground">
                  {isEditing ? (
                    <Textarea
                      value={editedAlbum.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Add album description..."
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p>{album.description}</p>
                  )}
                </div>
              )}
              
              {/* Additional Info */}
              {variant === 'expanded' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {album.label && (
                    <div>
                      <span className="text-muted-foreground">Label:</span>{' '}
                      <span>{album.label}</span>
                    </div>
                  )}
                  {album.upc && (
                    <div>
                      <span className="text-muted-foreground">UPC:</span>{' '}
                      <span>{album.upc}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handlePlayAlbum}>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                
                <Button variant="outline" onClick={handleLike}>
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                
                {isEditable && !isEditing && (
                  <Button variant="outline" size="icon" onClick={handleEdit}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
                {isEditable && isEditing && (
                  <>
                    <Button variant="outline" size="icon" onClick={handleSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                    <DropdownMenuItem>View Artist</DropdownMenuItem>
                    {album.dspLinks && album.dspLinks.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Open in</DropdownMenuLabel>
                        {album.dspLinks.slice(0, 3).map((link) => (
                          <DropdownMenuItem key={link.platform} asChild>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              {link.platform}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          {album.tags && album.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {album.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Tabs with content */}
          <Tabs defaultValue="tracks" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              {album.files && album.files.length > 0 && (
                <TabsTrigger value="files">Files</TabsTrigger>
              )}
              {album.dspLinks && album.dspLinks.length > 0 && (
                <TabsTrigger value="streaming">Streaming</TabsTrigger>
              )}
              {album.analysis && album.analysis.length > 0 && (
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              )}
              {album.reviews && album.reviews.length > 0 && (
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              )}
            </TabsList>
            
            {/* Tracks List */}
            <TabsContent value="tracks" className="space-y-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Track Listing</h3>
                {isEditable && isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAddTrackDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Track
                  </Button>
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Title</TableHead>
                    {variant === 'expanded' && (
                      <TableHead>Artist</TableHead>
                    )}
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedAlbum.tracks.map((track, index) => (
                    <TableRow 
                      key={track.id}
                      className={currentTrackId === track.id ? 'bg-muted/50' : undefined}
                    >
                      <TableCell className="text-center font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={track.title}
                            onChange={(e) => {
                              const updatedTracks = [...editedAlbum.tracks];
                              updatedTracks[index] = {
                                ...updatedTracks[index],
                                title: e.target.value
                              };
                              setEditedAlbum({...editedAlbum, tracks: updatedTracks});
                            }}
                          />
                        ) : (
                          track.title
                        )}
                      </TableCell>
                      {variant === 'expanded' && (
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={track.artist}
                              onChange={(e) => {
                                const updatedTracks = [...editedAlbum.tracks];
                                updatedTracks[index] = {
                                  ...updatedTracks[index],
                                  artist: e.target.value
                                };
                                setEditedAlbum({...editedAlbum, tracks: updatedTracks});
                              }}
                            />
                          ) : (
                            track.artist
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {isEditing ? (
                          <Input
                            value={formatDurationInput(track.duration)}
                            onChange={(e) => {
                              const duration = parseDurationInput(e.target.value);
                              const updatedTracks = [...editedAlbum.tracks];
                              updatedTracks[index] = {
                                ...updatedTracks[index],
                                duration
                              };
                              setEditedAlbum({...editedAlbum, tracks: updatedTracks});
                            }}
                            className="w-20 text-right ml-auto"
                          />
                        ) : (
                          formatTime(track.duration)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {!isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayTrack(track.id)}
                            >
                              {currentTrackId === track.id && audioIsPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          
                          {isEditable && isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveTrack(track.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {editedAlbum.tracks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No tracks added to this album yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Credits */}
            <TabsContent value="credits" className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="producer">Producer</Label>
                    <Input
                      id="producer"
                      value={editedAlbum.credits?.producer || ''}
                      onChange={(e) => 
                        handleInputChange('credits', { 
                          ...editedAlbum.credits, 
                          producer: e.target.value 
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executive_producer">Executive Producer</Label>
                    <Input
                      id="executive_producer"
                      value={editedAlbum.credits?.executive_producer || ''}
                      onChange={(e) => 
                        handleInputChange('credits', { 
                          ...editedAlbum.credits, 
                          executive_producer: e.target.value 
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mixing_engineer">Mixing Engineer</Label>
                    <Input
                      id="mixing_engineer"
                      value={editedAlbum.credits?.mixing_engineer || ''}
                      onChange={(e) => 
                        handleInputChange('credits', { 
                          ...editedAlbum.credits, 
                          mixing_engineer: e.target.value 
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mastering_engineer">Mastering Engineer</Label>
                    <Input
                      id="mastering_engineer"
                      value={editedAlbum.credits?.mastering_engineer || ''}
                      onChange={(e) => 
                        handleInputChange('credits', { 
                          ...editedAlbum.credits, 
                          mastering_engineer: e.target.value 
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artwork">Artwork</Label>
                    <Input
                      id="artwork"
                      value={editedAlbum.credits?.artwork || ''}
                      onChange={(e) => 
                        handleInputChange('credits', { 
                          ...editedAlbum.credits, 
                          artwork: e.target.value 
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {album.credits && Object.entries(album.credits).map(([role, person]) => (
                    person && (
                      <div key={role} className="flex flex-col">
                        <span className="text-sm text-muted-foreground capitalize">
                          {role.replace(/_/g, ' ')}
                        </span>
                        <span>{person}</span>
                      </div>
                    )
                  ))}
                  {(!album.credits || Object.keys(album.credits).length === 0) && (
                    <p className="text-muted-foreground">No credits available.</p>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Files */}
            {album.files && album.files.length > 0 && (
              <TabsContent value="files" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Files</h3>
                  {isEditable && onFileUpload && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-5 px-3 py-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-2">Name</div>
                    <div>Type</div>
                    <div>Size</div>
                    <div>Added</div>
                  </div>
                  <div className="divide-y">
                    {album.files.map((file) => (
                      <div key={file.id} className="grid grid-cols-5 items-center px-3 py-3 hover:bg-muted/50 rounded-md transition-colors">
                        <div className="col-span-2 flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="text-sm font-medium truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="capitalize">
                            {file.type}
                            {file.subtype && ` - ${file.subtype}`}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{new Date(file.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1">
                            {(file.type === 'master' || file.type === 'stem') && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Headphones className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Play</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            {isEditable && onFileDelete && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteFile(file.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
            
            {/* Streaming Links */}
            {album.dspLinks && album.dspLinks.length > 0 && (
              <TabsContent value="streaming" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {album.dspLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors"
                    >
                      {link.icon && (
                        <img
                          src={link.icon}
                          alt={`${link.platform} icon`}
                          className="w-6 h-6"
                        />
                      )}
                      <span className="font-medium">{link.platform}</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  ))}
                </div>
              </TabsContent>
            )}
            
            {/* Analysis */}
            {album.analysis && album.analysis.length > 0 && (
              <TabsContent value="analysis" className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Album Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed analytics and insights for this album are available.
                  </p>
                </div>
              </TabsContent>
            )}
            
            {/* Reviews */}
            {album.reviews && album.reviews.length > 0 && (
              <TabsContent value="reviews" className="space-y-4">
                {album.reviews.map((review) => (
                  <div key={review.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.source}</h4>
                        <p className="text-sm text-muted-foreground">
                          By {review.author} • {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      {review.rating && (
                        <Badge variant="outline" className="text-yellow-500">
                          {review.rating} / {review.rating > 5 ? 10 : 5}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{review.content}</p>
                    {review.url && (
                      <a 
                        href={review.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center"
                      >
                        Read full review <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Card>
    </>
  );
} 