import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, ChevronDown, ChevronUp, Edit, Save, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SectionType = 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'pre-chorus' | 'refrain' | 'hook' | 'instrumental' | 'breakdown';

interface LyricSection {
  type: SectionType;
  startLine: number;
  endLine: number;
  label?: string;
  color?: string;
}

interface LyricStructureAnalysisProps {
  lyrics: string;
  className?: string;
  isEditable?: boolean;
  onSave?: (sections: LyricSection[]) => void;
}

// Map section types to default colors
const SECTION_COLORS: Record<SectionType, string> = {
  'verse': 'bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400',
  'chorus': 'bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400',
  'bridge': 'bg-purple-100 border-purple-400 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400',
  'intro': 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400',
  'outro': 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400',
  'pre-chorus': 'bg-teal-100 border-teal-400 text-teal-800 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400',
  'refrain': 'bg-indigo-100 border-indigo-400 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400',
  'hook': 'bg-pink-100 border-pink-400 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-400',
  'instrumental': 'bg-gray-100 border-gray-400 text-gray-800 dark:bg-gray-700/30 dark:border-gray-600 dark:text-gray-400',
  'breakdown': 'bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-400'
};

export function LyricStructureAnalysis({
  lyrics,
  className = '',
  isEditable = false,
  onSave
}: LyricStructureAnalysisProps) {
  const [sections, setSections] = useState<LyricSection[]>([]);
  const [showAllLines, setShowAllLines] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  
  const lines = lyrics.split('\n').filter(line => line.trim());
  
  useEffect(() => {
    // Auto-detect sections from section titles when component mounts
    if (sections.length === 0) {
      detectSectionsFromTitles();
    }
  }, [sections.length, lines]);
  
  // Function to detect and create sections based on section titles in brackets
  const detectSectionsFromTitles = () => {
    const detectedSections: LyricSection[] = [];
    // Define explicit type for currentSection
    let currentSection: { type: SectionType, startLine: number } | null = null;
    
    lines.forEach((line, lineIndex) => {
      // Check if this is a section title
      const titleMatch = line.trim().match(/^\[(.*?)\]$/);
      
      if (titleMatch) {
        // If there was a previous section being tracked, close it
        if (currentSection !== null) {
          detectedSections.push({
            type: currentSection.type,
            startLine: currentSection.startLine,
            endLine: lineIndex - 1,
            label: currentSection.type.charAt(0).toUpperCase() + currentSection.type.slice(1)
          });
        }
        
        // Start a new section
        const sectionTitle = titleMatch[1].toLowerCase();
        let sectionType: SectionType = 'verse'; // Default
        
        // Map the section title to a recognized section type
        if (sectionTitle.includes('chorus')) {
          sectionType = 'chorus';
        } else if (sectionTitle.includes('verse')) {
          sectionType = 'verse';
        } else if (sectionTitle.includes('bridge')) {
          sectionType = 'bridge';
        } else if (sectionTitle.includes('intro')) {
          sectionType = 'intro';
        } else if (sectionTitle.includes('outro')) {
          sectionType = 'outro';
        } else if (sectionTitle.includes('pre-chorus') || sectionTitle.includes('pre chorus')) {
          sectionType = 'pre-chorus';
        } else if (sectionTitle.includes('hook')) {
          sectionType = 'hook';
        } else if (sectionTitle.includes('instrumental')) {
          sectionType = 'instrumental';
        } else if (sectionTitle.includes('breakdown')) {
          sectionType = 'breakdown';
        } else if (sectionTitle.includes('refrain')) {
          sectionType = 'refrain';
        }
        
        // Start new section after this title line
        currentSection = {
          type: sectionType,
          startLine: lineIndex + 1
        };
      }
    });
    
    // Close the last section if one is open
    if (currentSection !== null && currentSection.startLine < lines.length) {
      detectedSections.push({
        type: currentSection.type,
        startLine: currentSection.startLine,
        endLine: lines.length - 1,
        label: currentSection.type.charAt(0).toUpperCase() + currentSection.type.slice(1)
      });
    }
    
    setSections(detectedSections);
  };
  
  const toggleAllLines = () => {
    setShowAllLines(!showAllLines);
  };
  
  const handleCreateSection = (startLine: number, endLine: number, type: SectionType = 'verse') => {
    const newSection: LyricSection = {
      type,
      startLine,
      endLine,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`
    };
    
    setSections([...sections, newSection]);
  };
  
  const handleEditSection = (index: number) => {
    setEditingSectionIndex(index);
  };
  
  const handleUpdateSection = (index: number, updates: Partial<LyricSection>) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], ...updates };
    setSections(updatedSections);
    setEditingSectionIndex(null);
  };
  
  const handleDeleteSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(sections);
    }
    setIsEditing(false);
  };
  
  const getSectionForLine = (lineIndex: number) => {
    return sections.find(section => 
      lineIndex >= section.startLine && lineIndex <= section.endLine
    );
  };
  
  const renderStructureMap = () => {
    // Group sections for visualization
    const maxLine = Math.max(...lines.map((_, i) => i), ...sections.map(s => s.endLine));
    
    return (
      <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 rounded-md relative mb-4">
        {sections.map((section, index) => {
          const startPercent = (section.startLine / maxLine) * 100;
          const widthPercent = ((section.endLine - section.startLine) / maxLine) * 100;
          
          return (
            <div
              key={index}
              className={cn(
                "absolute h-full border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all",
                SECTION_COLORS[section.type]
              )}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
              }}
              onClick={() => isEditable && handleEditSection(index)}
            >
              {section.label}
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderLinesList = () => {
    return (
      <div className="space-y-1 mt-4">
        {lines.slice(0, showAllLines ? undefined : 10).map((line, index) => {
          // Check if this is a section title
          const isSectionTitle = line.trim().match(/^\[.*\]$/);
          
          if (isSectionTitle) {
            // Render section title differently
            return (
              <div 
                key={index}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-center font-medium"
              >
                {line}
              </div>
            );
          }
          
          const section = getSectionForLine(index);
          return (
            <div 
              key={index}
              className={cn(
                "p-2 rounded-md flex items-center gap-2 group",
                section ? `${SECTION_COLORS[section.type]} border` : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <span className="text-xs text-gray-500 w-8">{index + 1}</span>
              <span className="flex-1">{line}</span>
              {isEditable && !section && isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => handleCreateSection(index, index)}
                >
                  + Section
                </Button>
              )}
            </div>
          );
        })}
        
        {!showAllLines && lines.length > 10 && (
          <Button 
            variant="ghost" 
            className="w-full text-center" 
            onClick={toggleAllLines}
          >
            Show {lines.length - 10} more lines <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        )}
        
        {showAllLines && (
          <Button 
            variant="ghost" 
            className="w-full text-center" 
            onClick={toggleAllLines}
          >
            Show fewer lines <ChevronUp className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Song Structure Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visual analysis of the song's structure (verses, choruses, bridges, etc.)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {isEditable && (
              <>
                {isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Structure map visualization */}
        {renderStructureMap()}
        
        {/* Structure summary */}
        <div className="flex flex-wrap gap-2 my-4">
          {sections.map((section, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={cn(SECTION_COLORS[section.type], "cursor-pointer")}
              onClick={() => isEditable && handleEditSection(index)}
            >
              {section.label}
            </Badge>
          ))}
          
          {isEditable && isEditing && (
            <Badge 
              variant="outline" 
              className="bg-gray-100 text-gray-800 cursor-pointer dark:bg-gray-800 dark:text-gray-200"
              onClick={() => handleCreateSection(0, 3)}
            >
              + Add Section
            </Badge>
          )}
        </div>
        
        {/* Editing modal for a section */}
        {editingSectionIndex !== null && (
          <div className="border rounded-md p-4 mb-4">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Edit Section</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingSectionIndex(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <Select 
                  value={sections[editingSectionIndex].type}
                  onValueChange={(value) => handleUpdateSection(editingSectionIndex, { type: value as SectionType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verse">Verse</SelectItem>
                    <SelectItem value="chorus">Chorus</SelectItem>
                    <SelectItem value="bridge">Bridge</SelectItem>
                    <SelectItem value="intro">Intro</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="pre-chorus">Pre-Chorus</SelectItem>
                    <SelectItem value="refrain">Refrain</SelectItem>
                    <SelectItem value="hook">Hook</SelectItem>
                    <SelectItem value="instrumental">Instrumental</SelectItem>
                    <SelectItem value="breakdown">Breakdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Line</label>
                  <Select 
                    value={sections[editingSectionIndex].startLine.toString()}
                    onValueChange={(value) => handleUpdateSection(editingSectionIndex, { startLine: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Start line" />
                    </SelectTrigger>
                    <SelectContent>
                      {lines.map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>Line {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">End Line</label>
                  <Select 
                    value={sections[editingSectionIndex].endLine.toString()}
                    onValueChange={(value) => handleUpdateSection(editingSectionIndex, { endLine: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="End line" />
                    </SelectTrigger>
                    <SelectContent>
                      {lines.map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>Line {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteSection(editingSectionIndex)}
                >
                  Delete
                </Button>
                
                <Button 
                  variant="default"
                  size="sm"
                  onClick={() => setEditingSectionIndex(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Lyrics with sections */}
        {renderLinesList()}
      </CardContent>
    </Card>
  );
} 