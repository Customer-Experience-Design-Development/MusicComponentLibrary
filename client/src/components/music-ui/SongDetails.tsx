import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Play, Pause, Share2, Download, Edit2, Save, X, ExternalLink, BarChart2,
  SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Upload, File, Image, Music,
  Trash2, PlusCircle, Headphones, Layers, FileText, Loader2
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
  variant?: 'default' | 'player';
  isEditable?: boolean;
  onSave?: (updatedSong: Song) => void;
  onTranscriptionComplete?: (transcription: any) => void;
  onSeekAudio?: (time: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  audioSrc?: string;
  albumArt?: string;
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
  variant = 'default',
  isEditable = false,
  onSave,
  onTranscriptionComplete,
  onSeekAudio,
  audioRef: externalAudioRef,
  audioSrc,
  albumArt,
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

  // Render the player variant of the component
  if (variant === 'player') {
    return (
      <>
        {fileUploadDialog}
        <Card className={className}>
          <div className="p-6 space-y-6">
            {/* Album Art and Basic Info */}
            <div className="flex items-start gap-6">
              {albumArt && (
                <img
                  src={albumArt}
                  alt={`${displayTitle} album art`}
                  className="w-48 h-48 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{displayTitle}</h2>
                  <p className="text-lg text-muted-foreground">{displayArtist}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsRepeat(!isRepeat)}>
                    <Repeat className={`h-5 w-5 ${isRepeat ? 'text-primary' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsShuffle(!isShuffle)}>
                    <Shuffle className={`h-5 w-5 ${isShuffle ? 'text-primary' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Audio Player Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={displayDuration}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {formatTime(displayDuration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-32"
                />
              </div>
            </div>

            {/* Additional Features */}
            <Tabs defaultValue="waveform" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="waveform" className="flex-1">Waveform</TabsTrigger>
                <TabsTrigger value="lyrics" className="flex-1">Lyrics</TabsTrigger>
                <TabsTrigger value="stems" className="flex-1">Stems</TabsTrigger>
              </TabsList>
              <TabsContent value="waveform" className="mt-4">
                <div className="h-32 bg-muted rounded-lg" />
              </TabsContent>
              <TabsContent value="lyrics" className="mt-4">
                <div className="prose dark:prose-invert max-w-none">
                  {song.lyrics ? (
                    song.lyrics.split('\n').map((line, index) => (
                      <p key={index} className="text-sm">{line}</p>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">Lyrics will be displayed here</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="stems" className="mt-4">
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">Stem controls will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {!externalAudioRef && audioSrc && (
            <audio
              ref={internalAudioRef}
              src={audioSrc}
            />
          )}
        </Card>
      </>
    );
  }

  // Default variant - original SongDetails component
  return (
    <>
      {fileUploadDialog}
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {isEditing ? (
                <Input
                  value={editedSong.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="text-2xl font-bold"
                />
              ) : (
                <CardTitle className="text-2xl">{song.title}</CardTitle>
              )}
              {isEditing ? (
                <Input
                  value={editedSong.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-neutral-500">{song.artist}</p>
              )}
            </div>
            <div className="flex gap-2">
              {isEditable && !isEditing && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleEdit}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit song details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isEditable && isEditing && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      
        <CardContent className="p-0 sm:p-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap border-b rounded-none px-2 sm:px-0">
              <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Information</TabsTrigger>
              <TabsTrigger value="credits" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Credits</TabsTrigger>
              {song.lyrics && <TabsTrigger value="lyrics" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Lyrics</TabsTrigger>}
              {song.dspLinks && song.dspLinks.length > 0 && (
                <TabsTrigger value="streaming" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Streaming</TabsTrigger>
              )}
              {song.analysis && song.analysis.length > 0 && (
                <TabsTrigger value="analysis" className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <BarChart2 className="h-3 w-3" />
                  <span>Analysis</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="files" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Files</TabsTrigger>
              {audioSrc && (
                <TabsTrigger value="player" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Player</TabsTrigger>
              )}
            </TabsList>
          
            {/* Content for the info tab */}
            <TabsContent value="info" className="space-y-4 p-4 sm:p-0 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Album</p>
                  {isEditing ? (
                    <Input
                      value={editedSong.album}
                      onChange={(e) => handleInputChange('album', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.album}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Release Date</p>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedSong.releaseDate}
                      onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.releaseDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-neutral-500">{formatDuration(song.duration)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Genre</p>
                  {isEditing ? (
                    <Input
                      value={editedSong.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.genre}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">BPM</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedSong.bpm}
                      onChange={(e) => handleInputChange('bpm', parseInt(e.target.value))}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.bpm}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key</p>
                  {isEditing ? (
                    <Input
                      value={editedSong.key}
                      onChange={(e) => handleInputChange('key', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.key}</p>
                  )}
                </div>
              </div>
            
              <div className="space-y-2">
                <p className="text-sm font-medium">Tags</p>
                {isEditing ? (
                  <Input
                    value={editedSong.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                    placeholder="Enter tags separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {song.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          
            <TabsContent value="credits" className="space-y-4 p-4 sm:p-0 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Producer</p>
                  {isEditing ? (
                    <Input
                      value={editedSong.credits.producer}
                      onChange={(e) => handleInputChange('credits', { ...editedSong.credits, producer: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.credits.producer}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Songwriter</p>
                  {isEditing ? (
                    <Input
                      value={editedSong.credits.songwriter}
                      onChange={(e) => handleInputChange('credits', { ...editedSong.credits, songwriter: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.credits.songwriter}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Mixer</p>
                  {isEditing ? (
                    <Input
                      value={editedSong.credits.mixer}
                      onChange={(e) => handleInputChange('credits', { ...editedSong.credits, mixer: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">{song.credits.mixer}</p>
                  )}
                </div>
              </div>
            </TabsContent>
          
            {song.lyrics && (
              <TabsContent value="lyrics" className="space-y-4 p-4 sm:p-0 mt-4">
                {isEditing ? (
                  <Textarea
                    value={editedSong.lyrics}
                    onChange={(e) => handleInputChange('lyrics', e.target.value)}
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    {song.analysis?.some(a => a.source === 'whisper') ? (
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          Transcription available - click on segments to navigate audio
                        </div>
                        {song.analysis.find(a => a.source === 'whisper')?.data.segments.map((segment: any, index: number) => (
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
                    ) : (
                      song.lyrics.split('\n').map((line, index) => (
                        <p key={index} className="text-sm">
                          {line}
                        </p>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            )}

            {song.dspLinks && song.dspLinks.length > 0 && (
              <TabsContent value="streaming" className="space-y-4 p-4 sm:p-0 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {song.dspLinks.map((link) => (
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

            {song.analysis && song.analysis.length > 0 && (
              <TabsContent value="analysis" className="space-y-6 p-4 sm:p-0 mt-4">
                {song.analysis.length > 1 && (
                  <Tabs defaultValue={song.analysis[0].source} className="space-y-4">
                    <TabsList className="mb-2">
                      {song.analysis.map((analysis) => (
                        <TabsTrigger key={analysis.source} value={analysis.source} className="capitalize">
                          {analysis.source}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {song.analysis.map((analysis) => (
                      <TabsContent key={analysis.source} value={analysis.source}>
                        {renderAnalysisContent(analysis)}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
                
                {song.analysis.length === 1 && renderAnalysisContent(song.analysis[0])}
              </TabsContent>
            )}
            
            <TabsContent value="files" className="p-4 sm:p-0 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Files</h3>
                  {isEditable && onFileUpload && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setUploadDialogOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Upload File</span>
                    </Button>
                  )}
                </div>
                
                {(!song.files || song.files.length === 0) ? (
                  <div className="text-center py-8 border rounded-md">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No files have been uploaded yet</p>
                    {isEditable && onFileUpload && (
                      <Button 
                        variant="link" 
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        Upload your first file
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 px-3 py-2 text-xs font-medium text-muted-foreground">
                      <div className="col-span-2">Name</div>
                      <div>Type</div>
                      <div>Size</div>
                      <div>Added</div>
                    </div>
                    <div className="divide-y">
                      {song.files.map((file) => (
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
                              {file.type === 'master' || file.type === 'stem' ? (
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
                              ) : (
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
                              )}
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
                                        <Trash2 className="h-4 w-4" />
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
                )}
              </div>
            </TabsContent>
            
            {audioSrc && (
              <TabsContent value="player" className="p-4 sm:p-0 mt-4">
                <div className="space-y-4">
                  {/* Audio Player Controls */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-10 w-10"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(currentTime)}
                        </span>
                        <div className="flex-1"></div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(displayDuration)}
                        </span>
                      </div>
                      <Slider
                        value={[currentTime]}
                        max={displayDuration}
                        step={1}
                        onValueChange={handleSeek}
                      />
                    </div>
                  </div>
                
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-32"
                    />
                  </div>
                </div>
              
                {albumArt && (
                  <div className="mt-4">
                    <img
                      src={albumArt}
                      alt={`${song.title} album art`}
                      className="mx-auto max-w-full max-h-[300px] rounded-md object-contain"
                    />
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        
          {!externalAudioRef && audioSrc && (
            <audio
              ref={internalAudioRef}
              src={audioSrc}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
} 