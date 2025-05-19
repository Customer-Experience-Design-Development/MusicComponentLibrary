import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Play, Pause, Share2, Download, Edit2, Save, X, ExternalLink, BarChart2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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

interface SongDetailsProps {
  song: {
    id: string;
    title: string;
    artist: string;
    album: string;
    releaseDate: string;
    duration: number;
    genre: string;
    bpm: number;
    key: string;
    tags: string[];
    credits: {
      producer: string;
      songwriter: string;
      mixer: string;
    };
    lyrics?: string;
    dspLinks?: DSPLink[];
    analysis?: AudioAnalysis[];
  };
  className?: string;
  isEditable?: boolean;
  onSave?: (song: SongDetailsProps['song']) => void;
}

export function SongDetails({ 
  song, 
  className = '',
  isEditable = false,
  onSave
}: SongDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSong, setEditedSong] = useState(song);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  const renderAnalysisContent = (analysis: AudioAnalysis) => {
    if (analysis.source === 'spotify') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Audio Features</h4>
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900">Spotify</Badge>
          </div>
          <div className="space-y-2">
            {Object.entries(analysis.data.audioFeatures).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs capitalize">{key}</p>
                  <p className="text-xs font-medium">{Number(value).toFixed(2)}</p>
                </div>
                <Progress value={Number(value) * 100} />
              </div>
            ))}
          </div>
          
          {analysis.data.audioAnalysis && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Track Analysis</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs">Sections</p>
                  <p className="text-sm font-medium">{analysis.data.audioAnalysis.sections}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Segments</p>
                  <p className="text-sm font-medium">{analysis.data.audioAnalysis.segments}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Tatums</p>
                  <p className="text-sm font-medium">{analysis.data.audioAnalysis.tatums}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Bars</p>
                  <p className="text-sm font-medium">{analysis.data.audioAnalysis.bars}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (analysis.source === 'essentia') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Audio Descriptors</h4>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">Essentia</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium">Rhythm</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs">BPM</span>
                  <span className="text-xs font-medium">{analysis.data.rhythm.bpm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Beats Confidence</span>
                  <span className="text-xs font-medium">{analysis.data.rhythm.beatsConfidence.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">Tonal</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs">Key</span>
                  <span className="text-xs font-medium">{analysis.data.tonal.key}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Scale</span>
                  <span className="text-xs font-medium">{analysis.data.tonal.scale}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium">Moods</p>
            <div className="flex flex-wrap gap-1">
              {analysis.data.moods.map((mood: string) => (
                <span key={mood} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (analysis.source === 'openai') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">AI Generated Analysis</h4>
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">OpenAI</Badge>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium">Song Description</p>
              <p className="text-sm">{analysis.data.description}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">Genre Analysis</p>
              <p className="text-sm">{analysis.data.genreAnalysis}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">Similar Artists</p>
              <div className="flex flex-wrap gap-1">
                {analysis.data.similarArtists.map((artist: string) => (
                  <span key={artist} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (analysis.source === 'whisper') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Transcription & Analysis</h4>
            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">Whisper</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium">Language Detection</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{analysis.data.language}</span>
              <Badge variant="outline">{analysis.data.confidence.toFixed(2)}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium">Transcription Segments</p>
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
              {analysis.data.segments.map((segment: any, index: number) => (
                <div key={index} className="text-xs border-b pb-1 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{formatDuration(segment.start)} - {formatDuration(segment.end)}</span>
                    <span>{segment.confidence.toFixed(2)}</span>
                  </div>
                  <p className="mt-1">{segment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="py-2">
        <p>No analysis display available for {analysis.source}</p>
      </div>
    );
  };

  return (
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
              onClick={() => setIsPlaying(!isPlaying)}
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
      
      <CardContent>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            {song.lyrics && <TabsTrigger value="lyrics">Lyrics</TabsTrigger>}
            {song.dspLinks && song.dspLinks.length > 0 && (
              <TabsTrigger value="streaming">Streaming</TabsTrigger>
            )}
            {song.analysis && song.analysis.length > 0 && (
              <TabsTrigger value="analysis" className="flex items-center gap-1">
                <BarChart2 className="h-3 w-3" />
                <span>Analysis</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
          
          <TabsContent value="credits" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <TabsContent value="lyrics" className="space-y-4">
              {isEditing ? (
                <Textarea
                  value={editedSong.lyrics}
                  onChange={(e) => handleInputChange('lyrics', e.target.value)}
                  className="min-h-[200px]"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {song.lyrics.split('\n').map((line, index) => (
                    <p key={index} className="text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {song.dspLinks && song.dspLinks.length > 0 && (
            <TabsContent value="streaming" className="space-y-4">
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
            <TabsContent value="analysis" className="space-y-6">
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
        </Tabs>
      </CardContent>
    </Card>
  );
} 