import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, Eye, EyeOff, Download, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Types identical to those in RhymeSchemeAnalysis for consistency
interface RhymeWord {
  word: string;
  line: number;
  position: number;
  start: number;
  end: number;
  isEndRhyme: boolean;
  phoneticRepresentation?: string;
  syllables?: number;
}

interface RhymeGroup {
  id: string;
  color: string;
  words: RhymeWord[];
  type: 'perfect' | 'family' | 'slant' | 'assonance' | 'consonance';
  strength: number;
}

interface RhymeConnection {
  source: RhymeWord;
  target: RhymeWord;
  group: RhymeGroup;
  distance: number; // Number of lines between source and target
  density: number;  // Connection density in this region
}

interface RhymeFlowVisualizerProps {
  rhymeGroups: RhymeGroup[];
  lyrics: string[];
  className?: string;
  maxConnections?: number;
  onWordSelect?: (word: RhymeWord, group: RhymeGroup) => void;
}

export function RhymeFlowVisualizer({
  rhymeGroups,
  lyrics,
  className = '',
  maxConnections = 80, // Increased for better visualization
  onWordSelect
}: RhymeFlowVisualizerProps) {
  const [viewMode, setViewMode] = useState<'arc' | 'force' | 'column'>('arc');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [visibleTypes, setVisibleTypes] = useState<{[key in RhymeGroup['type']]: boolean}>({
    perfect: true,
    family: true,
    slant: false,
    assonance: false,
    consonance: false
  });
  const [showEndRhymes, setShowEndRhymes] = useState(true);
  const [showInternalRhymes, setShowInternalRhymes] = useState(true);
  const [complexityLevel, setComplexityLevel] = useState(3); // 1-5 scale for visualization complexity
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom factor
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate connections between rhyming words with enhanced metrics
  const generateConnections = useCallback((): RhymeConnection[] => {
    const connections: RhymeConnection[] = [];
    const connectionDensity: Map<number, number> = new Map(); // Track density by line
    
    // Filter groups based on visibility settings
    const filteredGroups = rhymeGroups.filter(group => 
      visibleTypes[group.type] &&
      (showEndRhymes || !group.words.some(w => w.isEndRhyme)) &&
      (showInternalRhymes || !group.words.some(w => !w.isEndRhyme))
    );
    
    // For selected group or all groups
    const groupsToProcess = selectedGroup 
      ? filteredGroups.filter(g => g.id === selectedGroup)
      : filteredGroups;
    
    // First pass - create all potential connections and track density
    const potentialConnections: RhymeConnection[] = [];
    
    groupsToProcess.forEach(group => {
      // Sort words by line number and position
      const sortedWords = [...group.words].sort((a, b) => 
        a.line === b.line ? a.position - b.position : a.line - b.line
      );
      
      // If a word is selected, only show connections to/from that word
      if (selectedWord) {
        const wordKey = selectedWord;
        const selectedWordObj = sortedWords.find(w => `${w.line}-${w.position}` === wordKey);
        
        if (selectedWordObj) {
          sortedWords.forEach(word => {
            if (`${word.line}-${word.position}` !== wordKey) {
              const distance = Math.abs(word.line - selectedWordObj.line);
              
              potentialConnections.push({
                source: selectedWordObj,
                target: word,
                group,
                distance,
                density: 0 // Will calculate in second pass
              });
              
              // Track connection density for this line range
              const minLine = Math.min(word.line, selectedWordObj.line);
              const maxLine = Math.max(word.line, selectedWordObj.line);
              
              for (let i = minLine; i <= maxLine; i++) {
                connectionDensity.set(i, (connectionDensity.get(i) || 0) + 1);
              }
            }
          });
        }
      } else {
        // Connect all words in the group based on complexity level
        for (let i = 0; i < sortedWords.length - 1; i++) {
          // Adjust the number of connections based on complexity level
          const maxConnections = Math.min(sortedWords.length - i - 1, complexityLevel * 2);
          
          for (let j = i + 1; j < i + 1 + maxConnections && j < sortedWords.length; j++) {
            const distance = Math.abs(sortedWords[j].line - sortedWords[i].line);
            
            // Limit distance between connected words based on complexity
            if (distance > 10 + complexityLevel * 5) continue;
            
            potentialConnections.push({
              source: sortedWords[i],
              target: sortedWords[j],
              group,
              distance,
              density: 0 // Will calculate in second pass
            });
            
            // Track connection density for this line range
            const minLine = Math.min(sortedWords[i].line, sortedWords[j].line);
            const maxLine = Math.max(sortedWords[i].line, sortedWords[j].line);
            
            for (let k = minLine; k <= maxLine; k++) {
              connectionDensity.set(k, (connectionDensity.get(k) || 0) + 1);
            }
          }
        }
      }
    });
    
    // Second pass - Calculate density values and filter connections
    potentialConnections.forEach(conn => {
      // Calculate average density in this region
      const minLine = Math.min(conn.source.line, conn.target.line);
      const maxLine = Math.max(conn.source.line, conn.target.line);
      
      let totalDensity = 0;
      for (let i = minLine; i <= maxLine; i++) {
        totalDensity += connectionDensity.get(i) || 0;
      }
      
      const avgDensity = totalDensity / (maxLine - minLine + 1);
      conn.density = avgDensity;
      
      connections.push(conn);
    });
    
    // Sort connections by type and strength
    connections.sort((a, b) => {
      // Prioritize selected or hovered words
      if (selectedWord || hoveredWord) {
        const aIsSelected = 
          `${a.source.line}-${a.source.position}` === selectedWord || 
          `${a.source.line}-${a.source.position}` === hoveredWord ||
          `${a.target.line}-${a.target.position}` === selectedWord ||
          `${a.target.line}-${a.target.position}` === hoveredWord;
          
        const bIsSelected = 
          `${b.source.line}-${b.source.position}` === selectedWord || 
          `${b.source.line}-${b.source.position}` === hoveredWord ||
          `${b.target.line}-${b.target.position}` === selectedWord ||
          `${b.target.line}-${b.target.position}` === hoveredWord;
          
        if (aIsSelected && !bIsSelected) return -1;
        if (!aIsSelected && bIsSelected) return 1;
      }
      
      // Then by group strength
      const strengthDiff = b.group.strength - a.group.strength;
      if (Math.abs(strengthDiff) > 0.1) return strengthDiff;
      
      // Then by distance (shorter connections first)
      return a.distance - b.distance;
    });
    
    // Limit total connections for performance
    return connections.slice(0, maxConnections);
  }, [rhymeGroups, selectedGroup, selectedWord, hoveredWord, visibleTypes, showEndRhymes, showInternalRhymes, complexityLevel]);
  
  // Render the SVG visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    const connections = generateConnections();
    const svg = svgRef.current;
    
    // Clear previous visualization
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const containerWidth = containerRef.current.clientWidth;
    const baseHeight = Math.max(lyrics.length * 24, 500); // Height based on lyric count
    const containerHeight = baseHeight * zoomLevel; // Apply zoom
    
    // Set SVG dimensions
    svg.setAttribute('width', containerWidth.toString());
    svg.setAttribute('height', containerHeight.toString());
    
    // Create visualization based on selected mode
    if (viewMode === 'arc') {
      renderArcDiagram(svg, connections, containerWidth, containerHeight);
    } else if (viewMode === 'force') {
      renderForceDirected(svg, connections, containerWidth, containerHeight);
    } else if (viewMode === 'column') {
      renderColumnView(svg, connections, containerWidth, containerHeight);
    }
    
  }, [rhymeGroups, selectedGroup, selectedWord, hoveredWord, viewMode, visibleTypes, showEndRhymes, showInternalRhymes, complexityLevel, zoomLevel, lyrics, generateConnections]);
  
  // Arc diagram visualization (showing arcs connecting rhyming words)
  const renderArcDiagram = (svg: SVGSVGElement, connections: RhymeConnection[], width: number, height: number) => {
    const marginLeft = 100; // Space for line numbers
    const chartWidth = width - marginLeft - 20;
    const lineSpacing = 24 * zoomLevel; // Adjust for zoom
    
    // Create definitions for gradient arcs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    
    // Add patterns or gradients for enhanced visualization
    connections.forEach((connection, i) => {
      const gradientId = `rhymeGradient-${i}`;
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', gradientId);
      gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      
      // Set gradient coordinates
      const sourceY = connection.source.line * lineSpacing + 20;
      const targetY = connection.target.line * lineSpacing + 20;
      const sourceX = marginLeft + connection.source.start * 7; // Approximate character width
      const targetX = marginLeft + connection.target.start * 7;
      
      gradient.setAttribute('x1', sourceX.toString());
      gradient.setAttribute('y1', sourceY.toString());
      gradient.setAttribute('x2', targetX.toString());
      gradient.setAttribute('y2', targetY.toString());
      
      // Create gradient stops
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', connection.group.color);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', connection.group.color);
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    });
    
    // Create a group for the lyrics text that can be scrolled/zoomed
    const lyricsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(lyricsGroup);
    
    // Create text for each line
    lyrics.forEach((line, lineIndex) => {
      const lineY = lineIndex * lineSpacing + 20;
      
      // Line number
      const lineNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lineNumber.setAttribute('x', '10');
      lineNumber.setAttribute('y', lineY.toString());
      lineNumber.setAttribute('font-size', `${12 * Math.sqrt(zoomLevel)}px`);
      lineNumber.setAttribute('text-anchor', 'start');
      lineNumber.setAttribute('fill', '#888');
      lineNumber.textContent = (lineIndex + 1).toString();
      lyricsGroup.appendChild(lineNumber);
      
      // Check if this is a section header [Verse], [Chorus], etc.
      const isSectionTitle = line.trim().match(/^\[.*\]$/);
      
      if (isSectionTitle) {
        // Render section title with background
        const sectionBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        sectionBg.setAttribute('x', marginLeft.toString());
        sectionBg.setAttribute('y', (lineY - 15).toString());
        sectionBg.setAttribute('width', chartWidth.toString());
        sectionBg.setAttribute('height', '20');
        sectionBg.setAttribute('fill', 'rgba(100, 100, 100, 0.1)');
        sectionBg.setAttribute('rx', '4');
        lyricsGroup.appendChild(sectionBg);
        
        const sectionText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        sectionText.setAttribute('x', (marginLeft + chartWidth / 2).toString());
        sectionText.setAttribute('y', lineY.toString());
        sectionText.setAttribute('font-size', `${14 * Math.sqrt(zoomLevel)}px`);
        sectionText.setAttribute('font-weight', 'bold');
        sectionText.setAttribute('text-anchor', 'middle');
        sectionText.textContent = line;
        lyricsGroup.appendChild(sectionText);
      } else {
        // Split the line into words to handle individual word highlighting
        const words = line.split(/(\s+)/); // Split by whitespace but keep separators
        let currentX = marginLeft;
        
        words.forEach((word, wordIndex) => {
          const wordWidth = word.length * 7; // Approximate character width
          
          // Check if this word is in any rhyme group
          const rhymeWord = rhymeGroups.flatMap(g => g.words).find(
            w => w.line === lineIndex && line.substring(w.start, w.end) === w.word
          );
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', currentX.toString());
          text.setAttribute('y', lineY.toString());
          text.setAttribute('font-size', `${14 * Math.sqrt(zoomLevel)}px`);
          text.setAttribute('text-anchor', 'start');
          
          // Highlight rhyme words
          if (rhymeWord) {
            const wordKey = `${rhymeWord.line}-${rhymeWord.position}`;
            const isSelected = wordKey === selectedWord;
            const isHovered = wordKey === hoveredWord;
            
            // Find the group this word belongs to
            const group = rhymeGroups.find(g => 
              g.words.some(w => w.line === rhymeWord.line && w.position === rhymeWord.position)
            );
            
            if (group) {
              // Style based on word state
              if (isSelected) {
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', group.color);
                text.setAttribute('text-decoration', 'underline');
              } else if (isHovered) {
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', group.color);
              } else {
                text.setAttribute('fill', group.color);
              }
              
              // Add background for better visibility
              const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              bg.setAttribute('x', (currentX - 2).toString());
              bg.setAttribute('y', (lineY - 14).toString());
              bg.setAttribute('width', (wordWidth + 4).toString());
              bg.setAttribute('height', '18');
              bg.setAttribute('fill', `${group.color}20`);
              bg.setAttribute('rx', '2');
              lyricsGroup.appendChild(bg);
              
              // Add interactivity
              text.setAttribute('cursor', 'pointer');
              text.onclick = () => {
                if (onWordSelect) {
                  onWordSelect(rhymeWord, group);
                }
                setSelectedWord(isSelected ? null : wordKey);
              };
              
              text.onmouseover = () => setHoveredWord(wordKey);
              text.onmouseout = () => setHoveredWord(null);
            }
          }
          
          text.textContent = word;
          lyricsGroup.appendChild(text);
          
          currentX += wordWidth;
        });
      }
    });
    
    // Create a group for connections that renders below the text
    const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.insertBefore(connectionsGroup, lyricsGroup);
    
    // Draw arcs between rhyming words with enhanced styling
    connections.forEach((connection, i) => {
      const sourceY = connection.source.line * lineSpacing + 20;
      const targetY = connection.target.line * lineSpacing + 20;
      
      // Calculate x positions based on word positions
      const sourceX = marginLeft + connection.source.start * 7; // Approximate character width
      const targetX = marginLeft + connection.target.start * 7;
      
      // Create path for the arc
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Calculate arc height based on distance between lines and connection strength
      const lineDist = Math.abs(targetY - sourceY);
      const arcHeight = Math.min(
        lineDist * 0.5, 
        20 + connection.group.strength * 30 + Math.log(lineDist) * 10
      );
      
      // Adjust control points based on line distance
      const midX = (sourceX + targetX) / 2;
      let controlPointY: number;
      
      if (connection.source.line < connection.target.line) {
        // Arc goes down
        controlPointY = Math.min(sourceY, targetY) - arcHeight;
      } else {
        // Arc goes up
        controlPointY = Math.max(sourceY, targetY) + arcHeight;
      }
      
      path.setAttribute('d', `M ${sourceX} ${sourceY} Q ${midX} ${controlPointY} ${targetX} ${targetY}`);
      path.setAttribute('fill', 'none');
      
      // Use gradient for enhanced visual effect
      path.setAttribute('stroke', `url(#rhymeGradient-${i})`);
      
      // Adjust stroke width based on rhyme strength
      const baseWidth = 1 + connection.group.strength * 3;
      const adjustedWidth = Math.max(0.5, Math.min(6, baseWidth));
      path.setAttribute('stroke-width', adjustedWidth.toString());
      
      // Adjust opacity based on selection state
      const sourceKey = `${connection.source.line}-${connection.source.position}`;
      const targetKey = `${connection.target.line}-${connection.target.position}`;
      const isSelected = selectedWord && (sourceKey === selectedWord || targetKey === selectedWord);
      const isHovered = hoveredWord && (sourceKey === hoveredWord || targetKey === hoveredWord);
      
      if (isSelected || isHovered) {
        path.setAttribute('opacity', '0.9');
        path.setAttribute('stroke-width', (adjustedWidth * 1.5).toString());
      } else if (selectedWord || hoveredWord) {
        path.setAttribute('opacity', '0.2');
      } else {
        path.setAttribute('opacity', '0.7');
      }
      
      // Add interactivity to arcs
      path.setAttribute('cursor', 'pointer');
      path.onclick = () => {
        setSelectedWord(null); // Clear current selection
      };
      
      path.onmouseover = () => {
        path.setAttribute('stroke-width', (adjustedWidth * 1.5).toString());
        path.setAttribute('opacity', '0.9');
      };
      
      path.onmouseout = () => {
        path.setAttribute('stroke-width', adjustedWidth.toString());
        if (isSelected || isHovered) {
          path.setAttribute('opacity', '0.9');
        } else if (selectedWord || hoveredWord) {
          path.setAttribute('opacity', '0.2');
        } else {
          path.setAttribute('opacity', '0.7');
        }
      };
      
      connectionsGroup.appendChild(path);
    });
  };
  
  // Force-directed graph visualization with enhanced features
  const renderForceDirected = (svg: SVGSVGElement, connections: RhymeConnection[], width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.35;
    
    // Add definitions for enhanced visuals
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    
    // Create a radial gradient for background
    const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    radialGradient.setAttribute('id', 'radialBackground');
    radialGradient.setAttribute('cx', '50%');
    radialGradient.setAttribute('cy', '50%');
    radialGradient.setAttribute('r', '50%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'rgba(240, 240, 245, 0.2)');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'rgba(240, 240, 245, 0)');
    
    radialGradient.appendChild(stop1);
    radialGradient.appendChild(stop2);
    defs.appendChild(radialGradient);
    
    // Add a background circle
    const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backgroundCircle.setAttribute('cx', centerX.toString());
    backgroundCircle.setAttribute('cy', centerY.toString());
    backgroundCircle.setAttribute('r', baseRadius.toString());
    backgroundCircle.setAttribute('fill', 'url(#radialBackground)');
    svg.appendChild(backgroundCircle);
    
    // Group words by their type and rhyme group
    type WordNodeMap = Map<string, {
      word: RhymeWord,
      group: RhymeGroup,
      x: number,
      y: number,
      radius: number,
      cluster: number
    }>;
    
    const wordNodes: WordNodeMap = new Map();
    const clusters: Map<string, {color: string, count: number, words: RhymeWord[]}> = new Map();
    
    // First pass - gather words and organize into clusters
    connections.forEach(conn => {
      const sourceKey = `${conn.source.line}-${conn.source.position}`;
      const targetKey = `${conn.target.line}-${conn.target.position}`;
      
      // Add to clusters
      const groupId = conn.group.id;
      if (!clusters.has(groupId)) {
        clusters.set(groupId, {
          color: conn.group.color,
          count: 0,
          words: []
        });
      }
      
      const cluster = clusters.get(groupId)!;
      
      if (!cluster.words.some(w => w.line === conn.source.line && w.position === conn.source.position)) {
        cluster.words.push(conn.source);
        cluster.count++;
      }
      
      if (!cluster.words.some(w => w.line === conn.target.line && w.position === conn.target.position)) {
        cluster.words.push(conn.target);
        cluster.count++;
      }
      
      // Add to word nodes if not already there
      if (!wordNodes.has(sourceKey)) {
        wordNodes.set(sourceKey, {
          word: conn.source,
          group: conn.group,
          x: 0, y: 0, // Will be set later
          radius: conn.source.isEndRhyme ? 6 : 4,
          cluster: parseInt(groupId.substring(0, 4), 16) % clusters.size // For positioning
        });
      }
      
      if (!wordNodes.has(targetKey)) {
        wordNodes.set(targetKey, {
          word: conn.target,
          group: conn.group,
          x: 0, y: 0, // Will be set later
          radius: conn.target.isEndRhyme ? 6 : 4,
          cluster: parseInt(groupId.substring(0, 4), 16) % clusters.size // For positioning
        });
      }
    });
    
    // Sort clusters by size
    const sortedClusters = Array.from(clusters.entries())
      .sort((a, b) => b[1].count - a[1].count);
    
    // Position nodes in orbit-like clusters
    const clusterPositions: {x: number, y: number, radius: number}[] = [];
    
    // Position major clusters in a circle, with the largest at the center
    if (sortedClusters.length > 0) {
      // Largest cluster at center
      clusterPositions.push({x: centerX, y: centerY, radius: baseRadius * 0.3});
      
      // Other clusters in orbit
      const numClusters = Math.min(sortedClusters.length - 1, 7); // Limit orbital clusters
      for (let i = 0; i < numClusters; i++) {
        const angle = (i / numClusters) * 2 * Math.PI;
        const orbitRadius = baseRadius * 0.6;
        const x = centerX + orbitRadius * Math.cos(angle);
        const y = centerY + orbitRadius * Math.sin(angle);
        
        // Size varies by cluster size
        const clusterRadius = baseRadius * (0.15 + (sortedClusters[i+1][1].count / sortedClusters[0][1].count) * 0.15);
        
        clusterPositions.push({x, y, radius: clusterRadius});
      }
    }
    
    // Position words within their clusters
    wordNodes.forEach((node, key) => {
      const clusterIndex = Math.min(node.cluster, clusterPositions.length - 1);
      const cluster = clusterPositions[clusterIndex];
      
      // Words within a rhyme group in a small circle
      const localAngle = (parseInt(key, 36) % 100) / 100 * 2 * Math.PI;
      const localRadius = cluster.radius * (0.3 + Math.random() * 0.7);
      
      node.x = cluster.x + localRadius * Math.cos(localAngle);
      node.y = cluster.y + localRadius * Math.sin(localAngle);
      
      // Adjust radius based on word properties
      const syllableCount = node.word.syllables || countSyllables(node.word.word);
      node.radius = Math.max(3, Math.min(8, 3 + syllableCount + (node.word.isEndRhyme ? 2 : 0)));
      
      // Add jitter to prevent overlap
      node.x += (Math.random() - 0.5) * 10;
      node.y += (Math.random() - 0.5) * 10;
    });
    
    // Draw connections first (so they're behind nodes)
    connections.forEach(connection => {
      const sourceKey = `${connection.source.line}-${connection.source.position}`;
      const targetKey = `${connection.target.line}-${connection.target.position}`;
      
      const sourceNode = wordNodes.get(sourceKey)!;
      const targetNode = wordNodes.get(targetKey)!;
      
      // Create curved line connecting the words
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Calculate control point for curve
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Perpendicular offset for control point
      const offset = Math.min(40, dist * 0.3);
      const nx = -dy / dist; // normalized perpendicular vector
      const ny = dx / dist;
      
      const ctrlX = midX + nx * offset;
      const ctrlY = midY + ny * offset;
      
      path.setAttribute('d', `M ${sourceNode.x} ${sourceNode.y} Q ${ctrlX} ${ctrlY} ${targetNode.x} ${targetNode.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', connection.group.color);
      
      // Adjust line thickness by rhyme strength and selection state
      const sourceIsSelected = sourceKey === selectedWord || sourceKey === hoveredWord;
      const targetIsSelected = targetKey === selectedWord || targetKey === hoveredWord;
      const isSelected = sourceIsSelected || targetIsSelected;
      
      // Base width on rhyme strength and type
      const rhymeTypeMultiplier = {
        'perfect': 1.0,
        'family': 0.8,
        'slant': 0.6,
        'assonance': 0.5,
        'consonance': 0.4
      }[connection.group.type];
      
      const baseWidth = Math.max(0.5, connection.group.strength * 4 * (rhymeTypeMultiplier || 0.7));
      
      if (isSelected) {
        path.setAttribute('stroke-width', (baseWidth * 1.5).toString());
        path.setAttribute('opacity', '0.9');
      } else if (selectedWord || hoveredWord) {
        path.setAttribute('stroke-width', baseWidth.toString());
        path.setAttribute('opacity', '0.2');
      } else {
        path.setAttribute('stroke-width', baseWidth.toString());
        path.setAttribute('opacity', '0.6');
      }
      
      // Add interactivity
      path.setAttribute('cursor', 'pointer');
      path.onmouseover = () => {
        path.setAttribute('stroke-width', (baseWidth * 1.5).toString());
        path.setAttribute('opacity', '0.9');
      };
      
      path.onmouseout = () => {
        if (isSelected) {
          path.setAttribute('stroke-width', (baseWidth * 1.5).toString());
          path.setAttribute('opacity', '0.9');
        } else if (selectedWord || hoveredWord) {
          path.setAttribute('stroke-width', baseWidth.toString());
          path.setAttribute('opacity', '0.2');
        } else {
          path.setAttribute('stroke-width', baseWidth.toString());
          path.setAttribute('opacity', '0.6');
        }
      };
      
      svg.appendChild(path);
    });
    
    // Helper function to estimate syllable count
    function countSyllables(word: string): number {
      const text = word.toLowerCase().replace(/[^a-z]/g, '');
      
      // Simple syllable counter
      const vowels = 'aeiouy';
      let count = 0;
      let prevIsVowel = false;
      
      for (let i = 0; i < text.length; i++) {
        const isVowel = vowels.includes(text[i]);
        
        if (isVowel && !prevIsVowel) {
          count++;
        }
        
        prevIsVowel = isVowel;
      }
      
      // Handle common silent e at end
      if (text.length > 2 && text.endsWith('e') && !vowels.includes(text[text.length - 2])) {
        count--;
      }
      
      return Math.max(1, count);
    }
    
    // Draw nodes for words
    wordNodes.forEach((node, key) => {
      // Circle for the word
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', node.radius.toString());
      
      // Color based on rhyme group
      const isSelected = key === selectedWord;
      const isHovered = key === hoveredWord;
      
      if (isSelected) {
        // Create a glow effect for selected word
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', node.x.toString());
        glow.setAttribute('cy', node.y.toString());
        glow.setAttribute('r', (node.radius + 4).toString());
        glow.setAttribute('fill', 'none');
        glow.setAttribute('stroke', node.group.color);
        glow.setAttribute('stroke-width', '2');
        glow.setAttribute('opacity', '0.7');
        svg.appendChild(glow);
        
        circle.setAttribute('fill', node.group.color);
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '2');
      } else if (isHovered) {
        circle.setAttribute('fill', node.group.color);
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '1.5');
      } else if (selectedWord || hoveredWord) {
        circle.setAttribute('fill', `${node.group.color}70`);
        circle.setAttribute('stroke', node.group.color);
        circle.setAttribute('stroke-width', '0.5');
        circle.setAttribute('opacity', '0.7');
      } else {
        circle.setAttribute('fill', node.group.color);
        circle.setAttribute('stroke', 'none');
      }
      
      // Add rhyme type indication
      const rhymeTypeIndicator = {
        'perfect': '',
        'family': '',
        'slant': 'stroke-dasharray: 3,1',
        'assonance': 'stroke-dasharray: 1,1',
        'consonance': 'stroke-dasharray: 1,2'
      }[node.group.type];
      
      if (rhymeTypeIndicator) {
        circle.setAttribute('style', rhymeTypeIndicator);
      }
      
      // Add interactivity
      circle.setAttribute('cursor', 'pointer');
      circle.onclick = () => {
        if (onWordSelect) {
          onWordSelect(node.word, node.group);
        }
        setSelectedWord(isSelected ? null : key);
      };
      
      circle.onmouseover = () => {
        setHoveredWord(key);
      };
      
      circle.onmouseout = () => {
        setHoveredWord(null);
      };
      
      svg.appendChild(circle);
      
      // Text label for the word
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x.toString());
      text.setAttribute('y', (node.y - node.radius - 3).toString());
      text.setAttribute('font-size', isSelected || isHovered ? '14' : '12');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', isSelected || isHovered ? '#000000' : '#555555');
      text.setAttribute('pointer-events', 'none'); // Don't interfere with mouse events
      
      // Include line number for context
      text.textContent = `${node.word.word} (${node.word.line + 1})`;
      
      // Add highlight effect for better visibility
      if (isSelected || isHovered) {
        const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const textWidth = text.textContent.length * 6 + 6;
        textBg.setAttribute('x', (node.x - textWidth / 2).toString());
        textBg.setAttribute('y', (node.y - node.radius - 16).toString());
        textBg.setAttribute('width', textWidth.toString());
        textBg.setAttribute('height', '16');
        textBg.setAttribute('fill', 'white');
        textBg.setAttribute('opacity', '0.7');
        textBg.setAttribute('rx', '2');
        svg.appendChild(textBg);
      }
      
      svg.appendChild(text);
    });
    
    // Add cluster labels for better context
    sortedClusters.slice(0, clusterPositions.length).forEach((cluster, i) => {
      const position = clusterPositions[i];
      
      // Skip small clusters
      if (cluster[1].count < 3) return;
      
      // Find a representative word
      const words = cluster[1].words.slice(0, 3);
      const label = words.map(w => w.word).join(", ") + (cluster[1].count > 3 ? "..." : "");
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', position.x.toString());
      text.setAttribute('y', (position.y + position.radius + 15).toString());
      text.setAttribute('font-size', '12');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', cluster[1].color);
      text.textContent = label;
      
      svg.appendChild(text);
    });
  };
  
  // Column-based visualization showing rhymes across verses
  const renderColumnView = (svg: SVGSVGElement, connections: RhymeConnection[], width: number, height: number) => {
    // Identify verse sections in the lyrics
    const verses: {
      startLine: number, 
      endLine: number, 
      title?: string,
      type?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'section'
    }[] = [];
    
    let currentStart = 0;
    
    // Detect sections with more sophisticated pattern recognition
    lyrics.forEach((line, i) => {
      // Detect section headers [Verse], [Chorus], etc.
      if (line.trim().match(/^\[.*\]$/)) {
        if (i > currentStart) {
          verses.push({startLine: currentStart, endLine: i - 1, type: 'section'});
        }
        
        // Parse section type from header
        const title = line.trim();
        const lowerTitle = title.toLowerCase();
        let type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'section' = 'section';
        
        if (lowerTitle.includes('verse')) type = 'verse';
        else if (lowerTitle.includes('chorus')) type = 'chorus';
        else if (lowerTitle.includes('bridge')) type = 'bridge';
        else if (lowerTitle.includes('intro')) type = 'intro';
        else if (lowerTitle.includes('outro')) type = 'outro';
        
        verses.push({startLine: i, endLine: i, title, type});
        currentStart = i + 1;
      } else if (i === lyrics.length - 1) {
        // Handle the last section
        verses.push({startLine: currentStart, endLine: i, type: 'section'});
      }
    });
    
    // If no explicit sections found, create implicit ones based on blank lines
    if (verses.length <= 1) {
      verses.length = 0;
      currentStart = 0;
      
      lyrics.forEach((line, i) => {
        if (line.trim() === '' && i > currentStart) {
          if (i - currentStart > 1) { // Only create sections with at least 2 lines
            verses.push({startLine: currentStart, endLine: i - 1, type: 'section'});
          }
          currentStart = i + 1;
        } else if (i === lyrics.length - 1) {
          verses.push({startLine: currentStart, endLine: i, type: 'section'});
        }
      });
    }
    
    // Set column layout parameters
    const padding = 20;
    const columnSpacing = 40;
    const columnWidth = Math.min(
      200, 
      (width - padding * 2 - columnSpacing * (verses.length - 1)) / Math.max(1, verses.length)
    );
    const headerHeight = 40;
    
    // Draw background and headers for sections
    verses.forEach((verse, verseIndex) => {
      if (!verse.title && verse.endLine - verse.startLine < 1) return; // Skip empty sections
      
      const isSection = verse.title !== undefined;
      
      if (isSection) {
        // Just draw the section header
        const headerX = padding + verseIndex * (columnWidth + columnSpacing);
        const headerY = padding;
        
        // Section title background
        const titleBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        titleBg.setAttribute('x', headerX.toString());
        titleBg.setAttribute('y', headerY.toString());
        titleBg.setAttribute('width', columnWidth.toString());
        titleBg.setAttribute('height', headerHeight.toString());
        titleBg.setAttribute('rx', '4');
        
        // Set background color based on section type
        const sectionColors = {
          'verse': '#8b5cf650',
          'chorus': '#3b82f650',
          'bridge': '#10b98150',
          'intro': '#6366f150',
          'outro': '#ef444450',
          'section': '#64748b50'
        };
        
        titleBg.setAttribute('fill', sectionColors[verse.type || 'section']);
        svg.appendChild(titleBg);
        
        // Section title
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', (headerX + columnWidth / 2).toString());
        title.setAttribute('y', (headerY + headerHeight / 2 + 5).toString());
        title.setAttribute('font-size', '14');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('fill', '#000000');
        title.textContent = verse.title || `Section ${verseIndex + 1}`;
        svg.appendChild(title);
      } else {
        // Draw background for content section
        const sectionX = padding + verseIndex * (columnWidth + columnSpacing);
        const sectionY = padding + (isSection ? headerHeight + 10 : 0);
        const sectionHeight = (verse.endLine - verse.startLine + 1) * 24 + 20;
        
        const sectionBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        sectionBg.setAttribute('x', sectionX.toString());
        sectionBg.setAttribute('y', sectionY.toString());
        sectionBg.setAttribute('width', columnWidth.toString());
        sectionBg.setAttribute('height', sectionHeight.toString());
        sectionBg.setAttribute('rx', '4');
        sectionBg.setAttribute('fill', '#f1f5f950');
        sectionBg.setAttribute('stroke', '#e2e8f0');
        svg.appendChild(sectionBg);
        
        // Draw section label if no explicit title
        if (!verse.title) {
          const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          title.setAttribute('x', (sectionX + columnWidth / 2).toString());
          title.setAttribute('y', (sectionY + 15).toString());
          title.setAttribute('font-size', '12');
          title.setAttribute('text-anchor', 'middle');
          title.setAttribute('fill', '#64748b');
          title.textContent = `Section ${verseIndex + 1}`;
          svg.appendChild(title);
        }
        
        // Draw lines for this section
        for (let i = verse.startLine; i <= verse.endLine; i++) {
          const lineY = sectionY + (i - verse.startLine) * 24 + 40;
          
          // Line number
          const lineNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          lineNumber.setAttribute('x', (sectionX + 10).toString());
          lineNumber.setAttribute('y', lineY.toString());
          lineNumber.setAttribute('font-size', '10');
          lineNumber.setAttribute('fill', '#94a3b8');
          lineNumber.textContent = (i + 1).toString();
          svg.appendChild(lineNumber);
          
          // Find rhyme words in this line
          const rhymeWords = rhymeGroups.flatMap(g => g.words).filter(w => w.line === i);
          
          // Full line text (with highlighting for rhyme words)
          if (rhymeWords.length > 0) {
            // Draw line with highlighted rhyme words
            let currentPos = 0;
            const lineText = lyrics[i];
            const segments = [];
            
            // Sort rhyme words by position in line
            rhymeWords.sort((a, b) => a.start - b.start);
            
            // Create segments with rhyme words highlighted
            rhymeWords.forEach(word => {
              if (word.start > currentPos) {
                // Add plain text segment before this word
                segments.push({
                  text: lineText.substring(currentPos, word.start),
                  isRhyme: false,
                  color: ''
                });
              }
              
              // Find the group this word belongs to
              const group = rhymeGroups.find(g => 
                g.words.some(w => w.line === word.line && w.position === word.position)
              );
              
              // Add rhyme word segment
              segments.push({
                text: word.word,
                isRhyme: true,
                word,
                color: group?.color || '#000000'
              });
              
              currentPos = word.end;
            });
            
            // Add remaining text after last rhyme word
            if (currentPos < lineText.length) {
              segments.push({
                text: lineText.substring(currentPos),
                isRhyme: false,
                color: ''
              });
            }
            
            // Draw segments
            let currentX = sectionX + 30;
            const truncateWidth = columnWidth - 40;
            
            segments.forEach(segment => {
              if (segment.text.trim() === '') return;
              
              // Check if we need to truncate
              let displayText = segment.text;
              if (currentX - (sectionX + 30) + displayText.length * 6 > truncateWidth) {
                // Truncate and add ellipsis
                const availableChars = Math.floor((truncateWidth - (currentX - (sectionX + 30))) / 6) - 1;
                if (availableChars <= 0) return; // No space left
                displayText = displayText.substring(0, availableChars) + '…';
              }
              
              // Draw segment
              const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              text.setAttribute('x', currentX.toString());
              text.setAttribute('y', lineY.toString());
              text.setAttribute('font-size', '12');
              
              if (segment.isRhyme) {
                text.setAttribute('fill', segment.color);
                text.setAttribute('font-weight', 'bold');
                
                // Add highlight background
                const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                const bgWidth = displayText.length * 6 + 4;
                bg.setAttribute('x', (currentX - 2).toString());
                bg.setAttribute('y', (lineY - 12).toString());
                bg.setAttribute('width', bgWidth.toString());
                bg.setAttribute('height', '16');
                bg.setAttribute('rx', '2');
                bg.setAttribute('fill', `${segment.color}20`);
                svg.appendChild(bg);
                
                // Add interactivity
                if (segment.word) {
                  const wordKey = `${segment.word.line}-${segment.word.position}`;
                  text.setAttribute('cursor', 'pointer');
                  
                  text.onclick = () => {
                    if (onWordSelect) {
                      const group = rhymeGroups.find(g => 
                        g.words.some(w => w.line === segment.word.line && w.position === segment.word.position)
                      );
                      if (group) {
                        onWordSelect(segment.word, group);
                      }
                    }
                    setSelectedWord(wordKey === selectedWord ? null : wordKey);
                  };
                  
                  text.onmouseover = () => setHoveredWord(wordKey);
                  text.onmouseout = () => setHoveredWord(null);
                  
                  // Highlight if selected
                  if (wordKey === selectedWord || wordKey === hoveredWord) {
                    text.setAttribute('text-decoration', 'underline');
                  }
                }
              }
              
              text.textContent = displayText;
              svg.appendChild(text);
              
              currentX += displayText.length * 6;
            });
          } else {
            // Draw plain text line (potentially truncated)
            const lineText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lineText.setAttribute('x', (sectionX + 30).toString());
            lineText.setAttribute('y', lineY.toString());
            lineText.setAttribute('font-size', '12');
            
            // Truncate long lines
            let displayText = lyrics[i];
            if (displayText.length * 6 > columnWidth - 40) {
              displayText = displayText.substring(0, Math.floor((columnWidth - 40) / 6) - 1) + '…';
            }
            
            lineText.textContent = displayText;
            svg.appendChild(lineText);
          }
        }
      }
    });
    
    // Draw rhyme connections between verses with bundling for cleaner visualization
    type ConnectionBundle = {
      sourceVerse: number,
      targetVerse: number,
      connections: {
        sourceLine: number,
        targetLine: number,
        color: string,
        strength: number,
        sourceWord: RhymeWord,
        targetWord: RhymeWord,
        groupId: string
      }[]
    };
    
    // Group connections by verse pairs
    const bundles: ConnectionBundle[] = [];
    
    connections.forEach(connection => {
      // Find which verses these words belong to
      const sourceVerseIndex = verses.findIndex(v => 
        connection.source.line >= v.startLine && connection.source.line <= v.endLine
      );
      
      const targetVerseIndex = verses.findIndex(v => 
        connection.target.line >= v.startLine && connection.target.line <= v.endLine
      );
      
      // Only connect across different verses and skip section headers
      if (sourceVerseIndex !== targetVerseIndex && 
          sourceVerseIndex >= 0 && targetVerseIndex >= 0 &&
          !verses[sourceVerseIndex].title && !verses[targetVerseIndex].title) {
        
        // Find or create a bundle for this verse pair
        let bundle = bundles.find(b => 
          (b.sourceVerse === sourceVerseIndex && b.targetVerse === targetVerseIndex) ||
          (b.sourceVerse === targetVerseIndex && b.targetVerse === sourceVerseIndex)
        );
        
        if (!bundle) {
          bundle = {
            sourceVerse: sourceVerseIndex,
            targetVerse: targetVerseIndex,
            connections: []
          };
          bundles.push(bundle);
        }
        
        // Add connection to bundle
        bundle.connections.push({
          sourceLine: connection.source.line - verses[sourceVerseIndex].startLine,
          targetLine: connection.target.line - verses[targetVerseIndex].startLine,
          color: connection.group.color,
          strength: connection.group.strength,
          sourceWord: connection.source,
          targetWord: connection.target,
          groupId: connection.group.id
        });
      }
    });
    
    // Draw bundled connections
    bundles.forEach(bundle => {
      // Ensure consistent order
      const [sourceVerse, targetVerse] = bundle.sourceVerse < bundle.targetVerse
        ? [bundle.sourceVerse, bundle.targetVerse]
        : [bundle.targetVerse, bundle.sourceVerse];
      
      // Get verse positions
      const sourceX = padding + sourceVerse * (columnWidth + columnSpacing);
      const targetX = padding + targetVerse * (columnWidth + columnSpacing);
      const sourceY = padding + (verses[sourceVerse].title ? headerHeight + 10 : 0);
      const targetY = padding + (verses[targetVerse].title ? headerHeight + 10 : 0);
      
      // Sort connections by rhyme group for bundling
      const groupedConnections: {[groupId: string]: typeof bundle.connections} = {};
      
      bundle.connections.forEach(conn => {
        if (!groupedConnections[conn.groupId]) {
          groupedConnections[conn.groupId] = [];
        }
        groupedConnections[conn.groupId].push(conn);
      });
      
      // Draw connection bundles for each rhyme group
      Object.entries(groupedConnections).forEach(([groupId, connections]) => {
        // Don't draw bundles with too few connections
        if (connections.length < 2) {
          connections.forEach(conn => {
            const sourceWordKey = `${conn.sourceWord.line}-${conn.sourceWord.position}`;
            const targetWordKey = `${conn.targetWord.line}-${conn.targetWord.position}`;
            const isSelected = sourceWordKey === selectedWord || targetWordKey === selectedWord ||
                              sourceWordKey === hoveredWord || targetWordKey === hoveredWord;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Calculate start/end positions
            const x1 = sourceVerse < targetVerse ? sourceX + columnWidth : sourceX;
            const x2 = sourceVerse < targetVerse ? targetX : targetX + columnWidth;
            const y1 = sourceY + conn.sourceLine * 24 + 40;
            const y2 = targetY + conn.targetLine * 24 + 40;
            
            // Create curved path
            path.setAttribute('d', `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', conn.color);
            path.setAttribute('stroke-width', (conn.strength * 2).toString());
            path.setAttribute('opacity', isSelected ? '0.9' : '0.6');
            
            // Add interactivity
            path.setAttribute('cursor', 'pointer');
            path.onmouseover = () => {
              setHoveredWord(null); // Clear hovering on direct connection hover
              path.setAttribute('stroke-width', (conn.strength * 3).toString());
              path.setAttribute('opacity', '0.9');
            };
            
            path.onmouseout = () => {
              path.setAttribute('stroke-width', (conn.strength * 2).toString());
              path.setAttribute('opacity', isSelected ? '0.9' : '0.6');
            };
            
            svg.appendChild(path);
          });
          return;
        }
        
        // Calculate bundle control points
        const avgSourceLine = connections.reduce((sum, c) => sum + c.sourceLine, 0) / connections.length;
        const avgTargetLine = connections.reduce((sum, c) => sum + c.targetLine, 0) / connections.length;
        
        const bundleY1 = sourceY + avgSourceLine * 24 + 40;
        const bundleY2 = targetY + avgTargetLine * 24 + 40;
        
        // Draw bundle trunk
        const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x1 = sourceVerse < targetVerse ? sourceX + columnWidth : sourceX;
        const x2 = sourceVerse < targetVerse ? targetX : targetX + columnWidth;
        
        mainPath.setAttribute('d', `M ${x1} ${bundleY1} C ${(x1 + x2) / 2} ${bundleY1}, ${(x1 + x2) / 2} ${bundleY2}, ${x2} ${bundleY2}`);
        mainPath.setAttribute('fill', 'none');
        mainPath.setAttribute('stroke', connections[0].color);
        mainPath.setAttribute('stroke-width', ((connections.length * 0.5) + 1).toString());
        mainPath.setAttribute('opacity', '0.6');
        mainPath.setAttribute('stroke-dasharray', '4,2');
        svg.appendChild(mainPath);
        
        // Draw individual connections
        connections.forEach(conn => {
          const sourceWordKey = `${conn.sourceWord.line}-${conn.sourceWord.position}`;
          const targetWordKey = `${conn.targetWord.line}-${conn.targetWord.position}`;
          const isSelected = sourceWordKey === selectedWord || targetWordKey === selectedWord ||
                             sourceWordKey === hoveredWord || targetWordKey === hoveredWord;
          
          // Only draw branches for selected words or when there are few connections
          if (!isSelected && connections.length > 5) return;
          
          // Source branch
          const sourceBranch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const y1 = sourceY + conn.sourceLine * 24 + 40;
          
          sourceBranch.setAttribute('d', `M ${x1} ${y1} Q ${x1 + (sourceVerse < targetVerse ? 15 : -15)} ${(y1 + bundleY1) / 2}, ${x1} ${bundleY1}`);
          sourceBranch.setAttribute('fill', 'none');
          sourceBranch.setAttribute('stroke', conn.color);
          sourceBranch.setAttribute('stroke-width', (conn.strength * 1.5).toString());
          sourceBranch.setAttribute('opacity', isSelected ? '0.9' : '0.5');
          
          // Target branch
          const targetBranch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const y2 = targetY + conn.targetLine * 24 + 40;
          
          targetBranch.setAttribute('d', `M ${x2} ${bundleY2} Q ${x2 + (sourceVerse < targetVerse ? -15 : 15)} ${(y2 + bundleY2) / 2}, ${x2} ${y2}`);
          targetBranch.setAttribute('fill', 'none');
          targetBranch.setAttribute('stroke', conn.color);
          targetBranch.setAttribute('stroke-width', (conn.strength * 1.5).toString());
          targetBranch.setAttribute('opacity', isSelected ? '0.9' : '0.5');
          
          // Add interactivity
          const addBranchInteractivity = (element: SVGElement, sourceKey: string, targetKey: string) => {
            element.setAttribute('cursor', 'pointer');
            
            element.onmouseover = () => {
              element.setAttribute('stroke-width', (conn.strength * 2.5).toString());
              element.setAttribute('opacity', '0.9');
              setHoveredWord(sourceKey); // Highlight the source word
            };
            
            element.onmouseout = () => {
              element.setAttribute('stroke-width', (conn.strength * 1.5).toString());
              element.setAttribute('opacity', isSelected ? '0.9' : '0.5');
              setHoveredWord(null);
            };
            
            element.onclick = () => {
              if (selectedWord === sourceKey) {
                setSelectedWord(targetKey);
              } else if (selectedWord === targetKey) {
                setSelectedWord(null);
              } else {
                setSelectedWord(sourceKey);
              }
            };
          };
          
          addBranchInteractivity(sourceBranch, sourceWordKey, targetWordKey);
          addBranchInteractivity(targetBranch, targetWordKey, sourceWordKey);
          
          svg.appendChild(sourceBranch);
          svg.appendChild(targetBranch);
        });
      });
    });
  };
  
  const toggleRhymeType = (type: RhymeGroup['type']) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex gap-2">
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arc">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Arc Diagram
                    </div>
                  </SelectItem>
                  <SelectItem value="force">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        <circle cx="6" cy="8" r="2" fill="currentColor"/>
                        <circle cx="18" cy="8" r="2" fill="currentColor"/>
                        <circle cx="6" cy="16" r="2" fill="currentColor"/>
                        <circle cx="18" cy="16" r="2" fill="currentColor"/>
                        <line x1="12" y1="12" x2="6" y2="8" stroke="currentColor"/>
                        <line x1="12" y1="12" x2="18" y2="8" stroke="currentColor"/>
                        <line x1="12" y1="12" x2="6" y2="16" stroke="currentColor"/>
                        <line x1="12" y1="12" x2="18" y2="16" stroke="currentColor"/>
                      </svg>
                      Force Graph
                    </div>
                  </SelectItem>
                  <SelectItem value="column">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <rect x="4" y="4" width="4" height="16" fill="currentColor" opacity="0.6"/>
                        <rect x="10" y="4" width="4" height="16" fill="currentColor" opacity="0.8"/>
                        <rect x="16" y="4" width="4" height="16" fill="currentColor"/>
                        <line x1="8" y1="8" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="14" y1="12" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      Column View
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showEndRhymes ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowEndRhymes(!showEndRhymes)}
                        className="rounded-r-none border-r-0"
                      >
                        <span className="sr-only">Toggle End Rhymes</span>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1">
                          <path d="M3 20h18M3 4h18M9 16l3-3 3 3M12 4v9" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        End
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle end rhymes visibility</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showInternalRhymes ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowInternalRhymes(!showInternalRhymes)}
                        className="rounded-l-none"
                      >
                        <span className="sr-only">Toggle Internal Rhymes</span>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1">
                          <path d="M4 9h16M4 15h8M16 15h4M9 5l3 3-3 3M16 12l-3 3 3 3" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Internal
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle internal rhymes visibility</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
                      <ZoomOut className="h-4 w-4" />
                      <span className="sr-only">Zoom Out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}>
                      <ZoomIn className="h-4 w-4" />
                      <span className="sr-only">Zoom In</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom in</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setSelectedWord(null)}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M4 4l16 16m-16 0l16-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="sr-only">Clear Selection</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear selection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Export SVG</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export visualization as SVG</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Complexity:</span>
              <Slider
                value={[complexityLevel]}
                min={1}
                max={5}
                step={1}
                className="w-32"
                onValueChange={(value) => setComplexityLevel(value[0])}
              />
              <span className="w-3 text-center">{complexityLevel}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>
                {selectedWord ? (
                  'Click on another word to see connections or clear selection'
                ) : (
                  'Click any word to highlight its rhyme connections'
                )}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {Object.entries(visibleTypes).map(([type, isVisible]) => (
              <Badge 
                key={type}
                variant={isVisible ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  isVisible ? "opacity-100" : "opacity-60"
                )}
                onClick={() => toggleRhymeType(type as any)}
              >
                <div className="flex items-center gap-1">
                  <span 
                    className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      type === 'perfect' ? "bg-blue-500" :
                      type === 'family' ? "bg-green-500" :
                      type === 'slant' ? "bg-purple-500" :
                      type === 'assonance' ? "bg-amber-500" :
                      "bg-rose-500"
                    )}
                  />
                  {type === 'perfect' ? 'Perfect' :
                   type === 'family' ? 'Family' :
                   type === 'slant' ? 'Slant' :
                   type === 'assonance' ? 'Assonance' :
                   'Consonance'} Rhymes
                </div>
              </Badge>
            ))}
          </div>
          
          <div 
            ref={containerRef} 
            className="w-full border rounded-md overflow-auto bg-white dark:bg-gray-950"
            style={{ height: '500px' }}
          >
            <svg ref={svgRef} />
          </div>
          
          {selectedWord && (
            <div className="text-sm p-2 border rounded bg-muted/50">
              <div className="font-medium">Selected Word</div>
              {rhymeGroups.flatMap(g => g.words).filter(w => `${w.line}-${w.position}` === selectedWord).map(word => (
                <div key={`${word.line}-${word.position}`} className="mt-1">
                  <span className="font-mono">{word.word}</span> (Line {word.line + 1})
                  {word.phoneticRepresentation && (
                    <span className="ml-2 text-muted-foreground">[{word.phoneticRepresentation}]</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 