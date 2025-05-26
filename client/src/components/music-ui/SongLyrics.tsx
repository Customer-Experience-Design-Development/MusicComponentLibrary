import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  X,
  Clock,
  PlayCircle,
  Mic,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  BookOpen,
  Highlighter,
  TimerReset
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
import { Badge } from '@/components/ui/badge';
import { TimelineComments } from './TimelineComments';
import { TimelineComment, TimelineReaction } from './types';
import { v4 as uuidv4 } from 'uuid';

interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

interface Transcription {
  language: string;
  confidence: number;
  segments: TranscriptionSegment[];
}

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
    transcription?: Transcription;
  };
  className?: string;
  isEditable?: boolean;
  onSave?: (lyrics: string) => void;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  onSeekAudio?: (timeInSeconds: number) => void;
  showTimelineComments?: boolean;
  initialComments?: TimelineComment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function SongLyrics({
  song,
  className = '',
  isEditable = false,
  onSave,
  onAnnotationAdd,
  onAnnotationDelete,
  audioRef,
  onSeekAudio,
  showTimelineComments = false,
  initialComments = [],
  currentUser = { id: 'user-1', name: 'Guest User' },
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
  const [viewMode, setViewMode] = useState<'standard' | 'transcription'>('standard');
  const [showTimelinePanel, setShowTimelinePanel] = useState(showTimelineComments);
  const [comments, setComments] = useState<TimelineComment[]>(initialComments);
  const [currentTime, setCurrentTime] = useState(0);
  
  const lyricsRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedLineRef = useRef<HTMLDivElement>(null);

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

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const handleSeekToSegment = (timeInSeconds: number) => {
    if (onSeekAudio) {
      onSeekAudio(timeInSeconds);
    }
  };

  const getLineAnnotations = (lineNumber: number) => {
    return annotations.filter(a => a.lineNumber === lineNumber);
  };

  const hasTranscription = song.transcription && song.transcription.segments && song.transcription.segments.length > 0;

  useEffect(() => {
    if (audioRef?.current) {
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };
      
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [audioRef]);

  const handleAddComment = (comment: Omit<TimelineComment, 'id' | 'createdAt'>) => {
    const newComment: TimelineComment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleAddReaction = (commentId: string, reaction: Omit<TimelineReaction, 'id' | 'count' | 'users'>) => {
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === commentId) {
          // Check if this reaction type already exists
          const existingReactionIndex = comment.reactions?.findIndex(r => r.emoji === reaction.emoji);
          
          if (existingReactionIndex !== undefined && existingReactionIndex >= 0 && comment.reactions) {
            // Update existing reaction
            const updatedReactions = [...comment.reactions];
            const existingReaction = updatedReactions[existingReactionIndex];
            
            // Don't add duplicate user reactions
            if (!existingReaction.users.includes(currentUser.id)) {
              updatedReactions[existingReactionIndex] = {
                ...existingReaction,
                count: existingReaction.count + 1,
                users: [...existingReaction.users, currentUser.id]
              };
            }
            
            return { ...comment, reactions: updatedReactions };
          } else {
            // Add new reaction type
            return {
              ...comment,
              reactions: [
                ...(comment.reactions || []),
                {
                  id: uuidv4(),
                  emoji: reaction.emoji,
                  count: 1,
                  users: [currentUser.id]
                }
              ]
            };
          }
        } else if (comment.replies) {
          // Check in replies
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const existingReactionIndex = reply.reactions?.findIndex(r => r.emoji === reaction.emoji);
              
              if (existingReactionIndex !== undefined && existingReactionIndex >= 0 && reply.reactions) {
                const updatedReactions = [...reply.reactions];
                const existingReaction = updatedReactions[existingReactionIndex];
                
                if (!existingReaction.users.includes(currentUser.id)) {
                  updatedReactions[existingReactionIndex] = {
                    ...existingReaction,
                    count: existingReaction.count + 1,
                    users: [...existingReaction.users, currentUser.id]
                  };
                }
                
                return { ...reply, reactions: updatedReactions };
              } else {
                return {
                  ...reply,
                  reactions: [
                    ...(reply.reactions || []),
                    {
                      id: uuidv4(),
                      emoji: reaction.emoji,
                      count: 1,
                      users: [currentUser.id]
                    }
                  ]
                };
              }
            }
            return reply;
          });
          
          return { ...comment, replies: updatedReplies };
        }
        
        return comment;
      });
    });
  };

  const handleReply = (commentId: string, reply: Omit<TimelineComment, 'id' | 'createdAt'>) => {
    const newReply: TimelineComment = {
      ...reply,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => {
      // First check if it's a top-level comment
      const filteredComments = prev.filter(c => c.id !== commentId);
      
      // If lengths are the same, it might be a reply
      if (filteredComments.length === prev.length) {
        return prev.map(comment => {
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            };
          }
          return comment;
        });
      }
      
      return filteredComments;
    });
  };

  const matchLyricLineToTimestamp = (timestamp: number): number | null => {
    if (!song.transcription || !song.transcription.segments) {
      return null;
    }
    
    // Find the segment that contains this timestamp
    const segment = song.transcription.segments.find(
      seg => timestamp >= seg.start && timestamp <= seg.end
    );
    
    if (!segment) {
      return null;
    }
    
    // Now try to find which line in the lyrics this corresponds to
    const lyricsLines = song.lyrics.split('\n');
    const lineIndex = lyricsLines.findIndex(line => 
      line.trim().toLowerCase().includes(segment.text.trim().toLowerCase())
    );
    
    return lineIndex >= 0 ? lineIndex : null;
  };

  const handleTimelineSeek = (timeInSeconds: number) => {
    if (onSeekAudio) {
      onSeekAudio(timeInSeconds);
    }
    
    // Also highlight the corresponding line in the lyrics if possible
    const lineIndex = matchLyricLineToTimestamp(timeInSeconds);
    if (lineIndex !== null) {
      setSelectedLine(lineIndex);
      scrollToLine(lineIndex);
    }
  };

  const scrollToLine = (lineIndex: number) => {
    if (lyricsRef.current && resultRefs.current[lineIndex]) {
      const lineElement = resultRefs.current[lineIndex];
      if (lineElement) {
        lineElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {song.transcription && (
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'standard' | 'transcription')}
              className="w-auto"
            >
              <TabsList className="h-8">
                <TabsTrigger value="standard" className="h-8 px-3">
                  <FileText className="h-4 w-4 mr-1" />
                  Standard
                </TabsTrigger>
                <TabsTrigger value="transcription" className="h-8 px-3">
                  <Clock className="h-4 w-4 mr-1" />
                  Timestamped
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditable && !isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            <Tag className="h-4 w-4 mr-1" />
            Analysis
          </Button>
          
          {showTimelineComments && (
            <Button
              variant={showTimelinePanel ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowTimelinePanel(!showTimelinePanel)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments
              {comments.length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {comments.length}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {searchQuery.length > 0 && (
        <div className="bg-muted rounded-md p-2 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} for "{searchQuery}"
            </span>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              disabled={matches.length === 0}
              onClick={() => {
                // Navigate to previous match
                if (matches.length > 0) {
                  const currentIndex = selectedLine !== null ? matches.indexOf(selectedLine) : -1;
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : matches.length - 1;
                  setSelectedLine(matches[prevIndex]);
                  scrollToLine(matches[prevIndex]);
                }
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              disabled={matches.length === 0}
              onClick={() => {
                // Navigate to next match
                if (matches.length > 0) {
                  const currentIndex = selectedLine !== null ? matches.indexOf(selectedLine) : -1;
                  const nextIndex = currentIndex < matches.length - 1 ? currentIndex + 1 : 0;
                  setSelectedLine(matches[nextIndex]);
                  scrollToLine(matches[nextIndex]);
                }
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search lyrics..."
              className="mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
          
            <div 
              ref={lyricsRef}
              className="rounded-md border p-4 h-[500px] relative overflow-auto bg-card"
            >
              {isEditing ? (
                <div className="h-full flex flex-col">
                  <Textarea 
                    value={editedLyrics}
                    onChange={(e) => setEditedLyrics(e.target.value)}
                    className="h-full resize-none font-mono text-sm flex-1"
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : viewMode === 'transcription' && song.transcription ? (
                <div className="space-y-1">
                  {song.transcription.segments.map((segment, i) => (
                    <div
                      key={i}
                      className="flex items-start hover:bg-accent/50 p-2 rounded-sm cursor-pointer"
                      onClick={() => handleSeekToSegment(segment.start)}
                    >
                      <div className="text-xs font-mono text-blue-500 w-16">
                        {formatTime(segment.start)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{segment.text}</p>
                        <div className="flex items-center mt-1">
                          <div 
                            className="h-1 rounded-full" 
                            style={{ 
                              width: `${segment.confidence * 100}%`,
                              backgroundColor: segment.confidence > 0.8 
                                ? 'rgb(34, 197, 94)' 
                                : segment.confidence > 0.6 
                                ? 'rgb(234, 179, 8)' 
                                : 'rgb(239, 68, 68)'
                            }}
                          />
                          <span className="ml-2 text-xs text-muted-foreground">
                            {Math.round(segment.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLyrics.split('\n').map((line, i) => {
                    const lineAnnotations = getLineAnnotations(i);
                    const hasAnnotations = lineAnnotations.length > 0;
                    const isSelected = selectedLine === i;
                    const isMatch = searchQuery.length > 0 && line.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    // Highlight search term in the line
                    let highlightedLine = line;
                    if (isMatch && searchQuery.length > 0) {
                      const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                      highlightedLine = line.replace(regex, '<mark>$1</mark>');
                    }
                    
                    return (
                      <div 
                        key={i}
                        ref={isSelected ? selectedLineRef : null}
                        className={`relative group p-2 rounded-sm transition-colors ${
                          isSelected 
                            ? 'bg-primary/10' 
                            : isMatch 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                            : 'hover:bg-accent/50'
                        }`}
                        onMouseDown={(e) => handleMouseDown(e, i)}
                        onMouseMove={(e) => handleMouseMove(e, i)}
                        onMouseUp={(e) => handleMouseUp(e, i)}
                        onClick={() => handleLineClick(i)}
                      >
                        <div className="flex items-start">
                          <span className="text-xs font-mono text-muted-foreground w-8">
                            {i + 1}
                          </span>
                          <div className="flex-1 relative">
                            {line.trim() === '' ? (
                              <span className="text-muted-foreground">&nbsp;</span>
                            ) : (
                              <span 
                                dangerouslySetInnerHTML={{ __html: highlightedLine }}
                                ref={(el) => {
                                  if (isMatch) {
                                    resultRefs.current[i] = el;
                                  }
                                }}
                              />
                            )}
                          </div>
                          {isEditable && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLine(i);
                                  setAnnotationContent('');
                                  setAnnotationType('comment');
                                }}
                              >
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {hasAnnotations && (
                          <div className="mt-1 ml-8 space-y-1">
                            {lineAnnotations.map(annotation => (
                              <div 
                                key={annotation.id}
                                className={`text-xs p-2 rounded-md ${
                                  annotation.type === 'comment'
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : annotation.type === 'suggestion'
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    : annotation.type === 'correction'
                                    ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">
                                    {annotation.type === 'artist' && annotation.artist
                                      ? (
                                        <span 
                                          className="inline-block h-3 w-3 rounded-full mr-1"
                                          style={{ backgroundColor: annotation.artist.color }}
                                        />
                                      )
                                      : null
                                    }
                                    {annotation.type === 'artist' && annotation.artist
                                      ? `${annotation.artist.name} (${annotation.artist.role || 'Artist'})`
                                      : annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)
                                    }
                                  </div>
                                  {onAnnotationDelete && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 -mt-1 -mr-1"
                                      onClick={() => handleDeleteAnnotation(annotation.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                <p className="mt-1">{annotation.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {showAnalysis && (
            <Card className="mt-4">
              <CardHeader className="py-4">
                <CardTitle className="text-base">Lyrical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <LyricalAnalysis lyrics={editedLyrics} />
              </CardContent>
            </Card>
          )}
        </div>
        
        {showTimelinePanel && (
          <div className="rounded-md border p-4 h-[500px] overflow-auto bg-card">
            <TimelineComments 
              duration={audioRef?.current?.duration || 300}
              currentTime={audioRef?.current?.currentTime || 0}
              comments={comments}
              onAddComment={handleAddComment}
              onAddReaction={handleAddReaction}
              onSeekAudio={handleTimelineSeek}
              onReply={handleReply}
              onDelete={handleDeleteComment}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
} 