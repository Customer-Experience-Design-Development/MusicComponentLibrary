import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Download, 
  Share2, 
  Copy, 
  Edit2, 
  Save, 
  History, 
  MessageSquare,
  Tag,
  Users,
  Undo,
  Redo,
  Check,
  X
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LyricalAnalysis } from './analysis/LyricalAnalysis';

interface Annotation {
  id: string;
  lineNumber: number;
  content: string;
  author: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'correction' | 'artist';
  artist?: {
    name: string;
    role?: string;
    color?: string;
  };
  selection?: {
    start: number;
    end: number;
    text: string;
  };
}

interface Version {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  changes: string[];
}

interface SongLyricsProps {
  song: {
    id: string;
    title: string;
    artist: string;
    lyrics: string;
  };
  className?: string;
  isEditable?: boolean;
  onSave?: (lyrics: string) => void;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
}

export function SongLyrics({
  song,
  className = '',
  isEditable = false,
  onSave,
  onAnnotationAdd,
  onAnnotationDelete
}: SongLyricsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState(song.lyrics);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [annotationContent, setAnnotationContent] = useState('');
  const [annotationType, setAnnotationType] = useState<Annotation['type']>('comment');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [annotationArtist, setAnnotationArtist] = useState('');
  const [annotationRole, setAnnotationRole] = useState('');
  const [annotationColor, setAnnotationColor] = useState('#3b82f6'); // Default primary color
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const { filteredLyrics, matches } = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        filteredLyrics: editedLyrics,
        matches: []
      };
    }

    const lines = editedLyrics.split('\n');
    const query = searchQuery.toLowerCase();
    const matches: number[] = [];
    
    const filteredLines = lines.map((line, index) => {
      if (line.toLowerCase().includes(query)) {
        matches.push(index);
        return line;
      }
      return line;
    });

    return {
      filteredLyrics: filteredLines.join('\n'),
      matches
    };
  }, [editedLyrics, searchQuery]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedLyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedLyrics);
    }
    // Add to version history
    const newVersion: Version = {
      id: Date.now().toString(),
      content: editedLyrics,
      author: 'Current User', // Replace with actual user
      timestamp: new Date().toISOString(),
      changes: ['Updated lyrics']
    };
    setVersions(prev => [newVersion, ...prev]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLyrics(song.lyrics);
    setIsEditing(false);
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (isEditing) return;
    setIsDragging(true);
    setDragStart(index);
    setSelection(null);
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (!isDragging || dragStart === null) return;
    
    const start = Math.min(dragStart, index);
    const end = Math.max(dragStart, index);
    
    const lines = editedLyrics.split('\n');
    const selectedLines = lines.slice(start, end + 1);
    const selectedText = selectedLines.join('\n');
    
    setSelection({
      start,
      end,
      text: selectedText
    });
  };

  const handleMouseUp = (e: React.MouseEvent, index: number) => {
    if (!isDragging || dragStart === null) return;
    
    const start = Math.min(dragStart, index);
    const end = Math.max(dragStart, index);
    
    const lines = editedLyrics.split('\n');
    const selectedLines = lines.slice(start, end + 1);
    const selectedText = selectedLines.join('\n');
    
    setSelection({
      start,
      end,
      text: selectedText
    });
    setIsDragging(false);
    setDragStart(null);
    setSelectedLine(start);
  };

  const handleAddAnnotation = () => {
    if (!selectedLine || !annotationContent.trim()) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      lineNumber: selectedLine,
      content: annotationContent,
      author: 'Current User', // Replace with actual user
      timestamp: new Date().toISOString(),
      type: annotationType,
      ...(annotationType === 'artist' && {
        artist: {
          name: annotationArtist,
          role: annotationRole,
          color: annotationColor
        }
      }),
      ...(selection && {
        selection: {
          start: selection.start,
          end: selection.end,
          text: selection.text
        }
      })
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    if (onAnnotationAdd) {
      onAnnotationAdd(newAnnotation);
    }
    setAnnotationContent('');
    setAnnotationArtist('');
    setAnnotationRole('');
    setSelectedLine(null);
    setSelection(null);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
    if (onAnnotationDelete) {
      onAnnotationDelete(annotationId);
    }
  };

  const getLineAnnotations = (lineNumber: number) => {
    return annotations.filter(a => a.lineNumber === lineNumber);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{song.title}</CardTitle>
            <p className="text-sm text-neutral-500">{song.artist}</p>
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
                    <p>Edit lyrics</p>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopy}
                  >
                    <Copy className={`h-4 w-4 ${copied ? 'text-primary' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy lyrics'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <History className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Version History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {versions.map(version => (
                    <div key={version.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{version.author}</span>
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-neutral-500">
                        {version.changes.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              <Tag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search lyrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {searchQuery && (
            <p className="text-sm text-neutral-500">
              Found {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </p>
          )}
          
          {isEditing ? (
            <Textarea
              value={editedLyrics}
              onChange={(e) => setEditedLyrics(e.target.value)}
              className="min-h-[400px] font-mono"
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {filteredLyrics.split('\n').map((line, index) => {
                const lineAnnotations = getLineAnnotations(index);
                const artistAnnotation = lineAnnotations.find(a => a.type === 'artist');
                const isSelected = selection && index >= selection.start && index <= selection.end;
                
                return (
                  <div key={index} className="group relative">
                    <p 
                      className={`text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1 rounded ${
                        matches.includes(index) 
                          ? 'bg-primary/10 text-primary' 
                          : ''
                      } ${artistAnnotation ? 'border-l-4' : ''} ${
                        isSelected ? 'bg-primary/20' : ''
                      }`}
                      style={{
                        borderLeftColor: artistAnnotation?.artist?.color
                      }}
                      onMouseDown={(e) => handleMouseDown(e, index)}
                      onMouseMove={(e) => handleMouseMove(e, index)}
                      onMouseUp={(e) => handleMouseUp(e, index)}
                    >
                      {line}
                    </p>
                    {lineAnnotations.length > 0 && (
                      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {lineAnnotations.map(annotation => (
                      <div 
                        key={annotation.id}
                        className={`ml-4 mt-1 p-2 rounded text-sm ${
                          annotation.type === 'artist' 
                            ? 'bg-opacity-10' 
                            : 'bg-neutral-100 dark:bg-neutral-800'
                        }`}
                        style={{
                          backgroundColor: annotation.type === 'artist' 
                            ? `${annotation.artist?.color}20` 
                            : undefined
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="space-y-1">
                            <span className="font-medium">{annotation.author}</span>
                            {annotation.type === 'artist' && (
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: annotation.artist?.color }}
                                />
                                <span className="font-medium">{annotation.artist?.name}</span>
                                {annotation.artist?.role && (
                                  <span className="text-xs text-neutral-500">
                                    ({annotation.artist.role})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4"
                            onClick={() => handleDeleteAnnotation(annotation.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {annotation.type !== 'artist' && (
                          <>
                            {annotation.selection && (
                              <div className="mb-2 p-2 bg-neutral-200 dark:bg-neutral-700 rounded text-sm">
                                {annotation.selection.text}
                              </div>
                            )}
                            <p className="text-neutral-600 dark:text-neutral-400">
                              {annotation.content}
                            </p>
                          </>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(annotation.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedLine !== null && !isEditing && (
            <div className="fixed bottom-4 right-4 w-96 bg-background border rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Add Annotation</h4>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setSelectedLine(null);
                    setSelection(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {selection && (
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded text-sm mb-2">
                    <p className="text-xs text-neutral-500 mb-1">Selected text:</p>
                    <p className="text-neutral-600 dark:text-neutral-400">{selection.text}</p>
                  </div>
                )}
                <Select
                  value={annotationType}
                  onValueChange={(value: Annotation['type']) => setAnnotationType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Annotation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="correction">Correction</SelectItem>
                    <SelectItem value="artist">Artist Attribution</SelectItem>
                  </SelectContent>
                </Select>

                {annotationType === 'artist' ? (
                  <>
                    <Input
                      value={annotationArtist}
                      onChange={(e) => setAnnotationArtist(e.target.value)}
                      placeholder="Artist name"
                    />
                    <Input
                      value={annotationRole}
                      onChange={(e) => setAnnotationRole(e.target.value)}
                      placeholder="Role (e.g., Lead Vocals, Backing Vocals)"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={annotationColor}
                        onChange={(e) => setAnnotationColor(e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <span className="text-sm text-neutral-500">Artist color</span>
                    </div>
                  </>
                ) : (
                  <Textarea
                    value={annotationContent}
                    onChange={(e) => setAnnotationContent(e.target.value)}
                    placeholder="Write your annotation..."
                    className="min-h-[100px]"
                  />
                )}

                <Button 
                  className="w-full"
                  onClick={handleAddAnnotation}
                >
                  Add {annotationType === 'artist' ? 'Artist Attribution' : 'Annotation'}
                </Button>
              </div>
            </div>
          )}
          
          {showAnalysis && (
            <div className="mt-8">
              <LyricalAnalysis lyrics={editedLyrics} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 