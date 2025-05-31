import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Play, Pause, Share2, Download, Edit2, Save, X, ExternalLink, BarChart2,
  SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Upload, File, Image, Music,
  Trash2, PlusCircle, Headphones, Layers, FileText, Loader2, MoreHorizontal, Plus
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
import { formatTime } from '@/lib/utils';
import { Track } from '@/types/music';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FileType = 'master' | 'stem' | 'image' | 'document' | 'other';
export type StemSubtype = 'vocals' | 'instruments' | 'drums' | 'bass' | 'other';

export interface SongFile {
  id: string;
  name: string;
  type: FileType;
  subtype?: StemSubtype;
  url: string;
  size: number;
  date: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  duration: number;
  genre?: string;
  bpm?: number;
  key?: string;
  tags: string[];
  albumArt?: string;
  audioUrl?: string;
  lyrics?: string;
  credits: {
    producer?: string;
    songwriter?: string;
    mixer?: string;
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
  files?: SongFile[];
}

export interface SongDetailsProps {
  song: Song;
  className?: string;
  isEditable?: boolean;
  onSave?: (song: Song) => void;
  onSeekAudio?: (timeInSeconds: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  track?: Track;
  autoPlay?: boolean;
  onTogglePlay?: (isPlaying: boolean) => void;
  onFileUpload?: (file: File, type: FileType, subtype?: StemSubtype) => Promise<SongFile>;
  onFileDelete?: (fileId: string) => Promise<void>;
}

interface DSPLink {
  platform: string;
  url: string;
  icon?: string;
}

interface AudioAnalysis {
  source: string;
  data: {
    [key: string]: any;
  };
}

export function SongDetails({
  song,
  className = "",
  isEditable = false,
  onSave,
  onSeekAudio,
  audioRef: externalAudioRef,
  track,
  autoPlay = false,
  onTogglePlay,
  onFileUpload,
  onFileDelete
}: SongDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSong, setEditedSong] = useState<Song>(song);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Audio player state
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  // File upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>('master');
  const [stemSubtype, setStemSubtype] = useState<StemSubtype>('vocals');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use internal audio ref if external is not provided
  const audioRef = externalAudioRef || internalAudioRef;
  
  // Get audio source from song or track
  const audioSrc = song.audioUrl || track?.audioSrc;
  
  // Determine display properties
  const displayTitle = song.title;
  const displayArtist = song.artist;
  const displayDuration = duration || song.duration;

  // Set volume when it changes
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  // Initialize audio duration
  useEffect(() => {
    if (audioRef?.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // If the audio is already loaded, set the duration
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
      
      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [audioRef, audioSrc]);

  // Track audio element's current time
  useEffect(() => {
    const ref = audioRef?.current;
    if (!ref) return;

    const updateTime = () => setCurrentTime(ref.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
    };

    ref.addEventListener('timeupdate', updateTime);
    ref.addEventListener('ended', handleEnded);

    if (isPlaying) {
      ref.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      ref.pause();
    }

    return () => {
      ref.removeEventListener('timeupdate', updateTime);
      ref.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, audioRef]);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedSong);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSong(song);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof typeof song, value: any) => {
    setEditedSong(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleFileTypeChange = (value: string) => {
    setFileType(value as FileType);
    
    // Reset subtype if changing from stem to something else
    if (value !== 'stem') {
      setStemSubtype('vocals');
    }
  };

  const handleUploadFile = async () => {
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
        fileType === 'stem' ? stemSubtype : undefined
      );
      
      // Update song with new file
      const updatedFiles = [...(editedSong.files || []), newFile];
      setEditedSong({
        ...editedSong,
        files: updatedFiles
      });
      
      // Close dialog and reset state
      setUploadDialogOpen(false);
      setUploadFile(null);
      setFileType('master');
      setStemSubtype('vocals');
      
      // If in edit mode, save changes
      if (isEditing && onSave) {
        onSave({
          ...editedSong,
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
      
      // Update song without the deleted file
      const updatedFiles = (editedSong.files || []).filter(f => f.id !== fileId);
      setEditedSong({
        ...editedSong,
        files: updatedFiles
      });
      
      // If in edit mode, save changes
      if (isEditing && onSave) {
        onSave({
          ...editedSong,
          files: updatedFiles
        });
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
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
        return <Layers className="h-4 w-4 text-violet-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderAnalysisContent = (analysis: AudioAnalysis) => {
    switch (analysis.source) {
      case 'whisper':
        return (
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-medium mb-4">Whisper Transcription</h3>
            {analysis.data.segments && analysis.data.segments.map((segment: any, index: number) => (
              <p 
                key={index} 
                className="text-sm cursor-pointer hover:bg-muted p-1 rounded transition-colors"
                onClick={() => onSeekAudio && onSeekAudio(segment.start)}
              >
                <span className="text-xs text-muted-foreground mr-2">
                  {Math.floor(segment.start / 60)}:{(segment.start % 60).toFixed(1).padStart(4, '0')}
                </span>
                {segment.text}
              </p>
            ))}
          </div>
        );
      case 'spotify':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Spotify Audio Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(analysis.data.audioFeatures).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                  {typeof value === 'number' && (
                    <div className="space-y-1">
                      <Progress value={value * 100} className="h-2" />
                      <p className="text-xs text-right text-muted-foreground">{(value * 100).toFixed(0)}%</p>
                    </div>
                  )}
                  {typeof value !== 'number' && (
                    <p className="text-sm text-muted-foreground">{String(value)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'vocalRange':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Vocal Range Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Lowest Note</p>
                <p className="text-sm text-muted-foreground">{analysis.data.lowestNote}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Highest Note</p>
                <p className="text-sm text-muted-foreground">{analysis.data.highestNote}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Range</p>
                <p className="text-sm text-muted-foreground">{analysis.data.range}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Recommended Key</p>
                <p className="text-sm text-muted-foreground">{analysis.data.recommendedKey}</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-medium mb-4">{analysis.source} Analysis</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
              {JSON.stringify(analysis.data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  // File Upload Dialog Component
  const fileUploadDialog = (
    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Add a new file to this song.
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
            <Select value={fileType} onValueChange={(value: FileType) => setFileType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="master">Master Audio</SelectItem>
                <SelectItem value="stem">Stem</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {fileType === 'stem' && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="stemSubtype">Stem Type</Label>
              <Select value={stemSubtype} onValueChange={(value: StemSubtype) => setStemSubtype(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stem type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocals">Vocals</SelectItem>
                  <SelectItem value="instruments">Instruments</SelectItem>
                  <SelectItem value="drums">Drums</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setUploadDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUploadFile} 
            disabled={!uploadFile || !fileType || (fileType === 'stem' && !stemSubtype) || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const handleSeekAudio = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
    if (onSeekAudio) {
      onSeekAudio(time);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Track Details
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Add to playlist
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View artist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Large album artwork */}
        <div className="col-span-12 md:col-span-5">
          <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-lg flex items-center justify-center">
            {song.albumArt ? (
              <img 
                src={song.albumArt} 
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="h-32 w-32 text-white/80" />
            )}
          </div>
        </div>

        {/* Song details and metadata */}
        <div className="col-span-12 md:col-span-7 space-y-6">
          {/* Title and artist */}
          <div className="space-y-2">
            {isEditing ? (
              <Input
                value={editedSong.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-3xl font-bold border-none p-0 h-auto text-gray-900 dark:text-white"
                placeholder="Song title"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {song.title}
              </h1>
            )}
            
            {isEditing ? (
              <Input
                value={editedSong.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                className="text-xl border-none p-0 h-auto text-gray-600 dark:text-gray-400"
                placeholder="Artist name"
              />
            ) : (
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {song.artist}
              </p>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
              <div className="text-lg font-semibold">{formatTime(song.duration)}</div>
            </div>
            
            {song.bpm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">BPM</div>
                <div className="text-lg font-semibold">{song.bpm}</div>
              </div>
            )}
            
            {song.key && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Key</div>
                <div className="text-lg font-semibold">{song.key}</div>
              </div>
            )}
            
            {song.genre && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Genre</div>
                <div className="text-lg font-semibold">{song.genre}</div>
              </div>
            )}
          </div>

          {/* Tags */}
          {song.tags && song.tags.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</div>
              <div className="flex flex-wrap gap-2">
                {song.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Audio controls */}
          {audioSrc && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlayPause}
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <div className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-150"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabbed content */}
      <div className="border-t dark:border-gray-700 pt-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Details</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            {song.lyrics && <TabsTrigger value="lyrics">Lyrics</TabsTrigger>}
            {song.dspLinks && song.dspLinks.length > 0 && (
              <TabsTrigger value="streaming">Streaming</TabsTrigger>
            )}
            {song.files && song.files.length > 0 && (
              <TabsTrigger value="files">Files</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info" className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Album</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {song.album || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Release Date</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {song.releaseDate || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Duration</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(song.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Genre</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {song.genre || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credits" className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
            <div className="space-y-3">
              {Object.entries(song.credits).map(([role, name]) => (
                <div key={role} className="flex justify-between">
                  <span className="text-sm font-medium capitalize">{role}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{name}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {song.lyrics && (
            <TabsContent value="lyrics" className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {song.lyrics}
              </pre>
            </TabsContent>
          )}

          {song.dspLinks && song.dspLinks.length > 0 && (
            <TabsContent value="streaming" className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {song.dspLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {link.icon && (
                      <img src={link.icon} alt={link.platform} className="w-6 h-6" />
                    )}
                    <span className="font-medium">{link.platform}</span>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                ))}
              </div>
            </TabsContent>
          )}

          {song.files && song.files.length > 0 && (
            <TabsContent value="files" className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <div className="space-y-3">
                {song.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Hidden audio element */}
      {!externalAudioRef && audioSrc && (
        <audio
          ref={internalAudioRef}
          src={audioSrc}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onPlay={() => {
            setIsPlaying(true);
            onTogglePlay?.(true);
          }}
          onPause={() => {
            setIsPlaying(false);
            onTogglePlay?.(false);
          }}
        />
      )}
    </div>
  );
} 