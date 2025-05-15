# MusicUI Visualization Enhancement Guide

This document outlines recommended libraries and techniques for enhancing the visualization capabilities of MusicUI components with a focus on the specific needs of the music industry.

## Recommended Libraries

### Core Visualization Libraries

| Library | Specialization | Best For | Integration Complexity |
|---------|---------------|----------|------------------------|
| **D3.js** | Custom data visualization | Complex analytics displays | High |
| **Three.js** | 3D visualization | Immersive experiences | High |
| **Tone.js** | Audio processing & analysis | Real-time audio manipulation | Medium |
| **Wavesurfer.js** | Waveform visualization | High-quality audio waveforms | Low |
| **Chart.js** | Statistical visualization | Performance analytics | Low |
| **Recharts** | React charting library | Responsive analytics | Low |
| **React-Vis** | React visualization | Data-heavy applications | Medium |
| **Victory** | React data visualization | Animated charts | Medium |

### Specialized Audio Libraries

| Library | Specialization | Best For | Integration Complexity |
|---------|---------------|----------|------------------------|
| **Peaks.js** | Waveform interaction | Audio editing interfaces | Medium |
| **Howler.js** | Audio playback | Cross-platform audio | Low |
| **Web Audio API** | Audio processing | Building custom processors | High |
| **Pizzicato.js** | Audio effects | Effect visualization | Medium |
| **Teoria.js** | Music theory | Music education apps | Medium |
| **Tonal.js** | Music theory | Chord and scale visualization | Medium |
| **SoundTouch.js** | Audio time-stretching | DJ/remixing applications | High |

## Visualization Types by Use Case

### Artist-Focused Visualizations

#### Performance Analytics
```jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ArtistPerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="streams" 
          stroke="#8884d8" 
          fill="url(#colorStreams)" 
        />
        <defs>
          <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

#### Advanced Waveform Visualization
```jsx
import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef } from 'react';

function EnhancedWaveform({ audioUrl, peaks, color = '#6200EA' }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  
  useEffect(() => {
    if (waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
      
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: color,
        progressColor: `${color}BB`,
        cursorColor: '#f5f5f5',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 80,
        barGap: 2,
        responsive: true,
        normalize: true,
        partialRender: true,
      });
      
      if (peaks) {
        wavesurfer.current.load(audioUrl, peaks);
      } else {
        wavesurfer.current.load(audioUrl);
      }
    }
    
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioUrl, peaks, color]);
  
  return <div ref={waveformRef} className="w-full rounded-md overflow-hidden" />;
}
```

### Fan-Focused Visualizations

#### Music Discovery Radar
```jsx
import { ResponsiveRadar } from '@nivo/radar';

function GenreExplorerRadar({ data }) {
  return (
    <div className="h-96">
      <ResponsiveRadar
        data={data}
        keys={['currentTaste', 'recommendation']}
        indexBy="genre"
        maxValue="auto"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'purple_blue' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="gentle"
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
}
```

#### Mood-Based Visualization
```jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function MoodVisualizer({ audioElement, mood = 'energetic' }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current || !audioElement) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    
    // Create audio analyzer
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 256;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Create visual elements based on mood
    let particles = [];
    const particleCount = 500;
    
    // Color schemes for different moods
    const colorSchemes = {
      energetic: [0xff4500, 0xff8c00, 0xffff00],
      mellow: [0x4b0082, 0x800080, 0x9400d3],
      happy: [0x00ff00, 0x7cfc00, 0x00fa9a],
      sad: [0x1e90ff, 0x00bfff, 0x87ceeb],
      intense: [0xff0000, 0x8b0000, 0xff4500]
    };
    
    const colors = colorSchemes[mood] || colorSchemes.energetic;
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color
      const color = new THREE.Color(colors[i % colors.length]);
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    camera.position.z = 50;
    
    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Get audio data
      analyzer.getByteFrequencyData(dataArray);
      
      // Apply audio data to particles
      const positions = particleGeometry.attributes.position.array;
      
      let k = 0;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Use audio data to modify particle positions
        const freqIndex = Math.floor(i / particleCount * bufferLength);
        const value = dataArray[freqIndex] / 255;
        
        // Different movement patterns based on mood
        if (mood === 'energetic') {
          positions[i3] = x + Math.sin(Date.now() * 0.001 + i) * value;
          positions[i3 + 1] = y + Math.cos(Date.now() * 0.002 + i) * value;
          positions[i3 + 2] = z + Math.sin(Date.now() * 0.001 + i) * value;
        } else if (mood === 'mellow') {
          positions[i3] = x + Math.sin(Date.now() * 0.0005 + i) * value * 0.5;
          positions[i3 + 1] = y + Math.cos(Date.now() * 0.0005 + i) * value * 0.5;
          positions[i3 + 2] = z;
        } else if (mood === 'happy') {
          positions[i3] = x + Math.sin(Date.now() * 0.001 + i) * value;
          positions[i3 + 1] = y + Math.abs(Math.sin(Date.now() * 0.001 + i)) * value;
          positions[i3 + 2] = z;
        } else if (mood === 'sad') {
          positions[i3] = x;
          positions[i3 + 1] = y - Math.abs(Math.sin(Date.now() * 0.0003 + i)) * value;
          positions[i3 + 2] = z;
        } else if (mood === 'intense') {
          positions[i3] = x * (1 + value * 0.1 * Math.sin(Date.now() * 0.003));
          positions[i3 + 1] = y * (1 + value * 0.1 * Math.sin(Date.now() * 0.003));
          positions[i3 + 2] = z * (1 + value * 0.1 * Math.sin(Date.now() * 0.003));
        }
      }
      
      particleGeometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth, 
        containerRef.current.clientHeight
      );
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      source.disconnect();
      analyzer.disconnect();
    };
  }, [audioElement, mood]);
  
  return <div ref={containerRef} className="w-full h-80 rounded-lg overflow-hidden bg-black" />;
}
```

### Industry Professional Visualizations

#### Revenue Stream Breakdown
```jsx
import { ResponsiveSunburst } from '@nivo/sunburst';

function RevenueSunburst({ data }) {
  return (
    <div className="h-96">
      <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="value"
        cornerRadius={2}
        borderWidth={1}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'paired' }}
        childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      />
    </div>
  );
}
```

#### Geographic Analytics Map
```jsx
import { ResponsiveChoropleth } from '@nivo/geo';
import { useEffect, useState } from 'react';

function GeographicListenerMap({ data }) {
  const [geoData, setGeoData] = useState(null);
  
  useEffect(() => {
    // Load world map data
    fetch('/maps/world-countries.json')
      .then(response => response.json())
      .then(data => setGeoData(data));
  }, []);
  
  if (!geoData) return <div>Loading geographic data...</div>;
  
  return (
    <div className="h-96">
      <ResponsiveChoropleth
        data={data}
        features={geoData.features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors="blues"
        domain={[0, 1000000]}
        unknownColor="#DADADA"
        label="properties.name"
        valueFormat=".2s"
        projectionTranslation={[0.5, 0.5]}
        projectionRotation={[0, 0, 0]}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        borderWidth={0.5}
        borderColor="#152538"
        legends={[
          {
            anchor: 'bottom-left',
            direction: 'column',
            justify: true,
            translateX: 20,
            translateY: -100,
            itemsSpacing: 0,
            itemWidth: 94,
            itemHeight: 18,
            itemDirection: 'left-to-right',
            itemTextColor: '#444444',
            itemOpacity: 0.85,
            symbolSize: 18,
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000000',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
}
```

### Educational Visualizations

#### Music Theory Circle
```jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Tonal from 'tonal';

function CircleOfFifths({ highlightedNotes = [], highlightedScale = null }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2 - 20;
    
    const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
    const minorNotes = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];
    
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Draw the outer circle
    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);
    
    // Draw inner circle
    g.append('circle')
      .attr('r', radius * 0.7)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);
    
    // Position for major keys
    notes.forEach((note, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * radius * 0.85;
      const y = Math.sin(angle) * radius * 0.85;
      
      const isHighlighted = highlightedNotes.includes(note);
      const inScale = highlightedScale ? 
        Tonal.Scale.notes(`${highlightedScale}`).includes(note.replace('#', 'sharp').replace('b', 'flat')) : 
        false;
      
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 20)
        .attr('fill', isHighlighted ? '#6200EA' : inScale ? '#00C853' : '#f5f5f5')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1);
        
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', isHighlighted || inScale ? 'bold' : 'normal')
        .attr('fill', isHighlighted || inScale ? 'white' : 'black')
        .text(note);
    });
    
    // Position for minor keys
    minorNotes.forEach((note, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * radius * 0.55;
      const y = Math.sin(angle) * radius * 0.55;
      
      const isHighlighted = highlightedNotes.includes(note);
      const inScale = highlightedScale ? 
        note.replace('m', ' minor') === highlightedScale : 
        false;
      
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 16)
        .attr('fill', isHighlighted ? '#6200EA' : inScale ? '#00C853' : '#e9e9e9')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1);
        
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', isHighlighted || inScale ? 'bold' : 'normal')
        .attr('fill', isHighlighted || inScale ? 'white' : 'black')
        .text(note);
    });
    
  }, [highlightedNotes, highlightedScale]);
  
  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 400" />;
}
```

#### Audio Frequency Educator
```jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function FrequencyVisualizer({ audioElement, showLabels = true, interactive = true }) {
  const svgRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current || !audioElement) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Set up audio analyzer
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
    
    // Create scales
    const x = d3.scaleLog()
      .domain([20, 20000]) // Human hearing range
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, 255])
      .range([height, 0]);
    
    // Create axis
    const xAxis = d3.axisBottom(x)
      .tickValues([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
      .tickFormat(d => {
        if (d >= 1000) {
          return `${d/1000}kHz`;
        }
        return `${d}Hz`;
      });
    
    // Frequency labels
    const frequencyLabels = [
      { freq: 60, label: 'Bass', y: 20 },
      { freq: 300, label: 'Mid-bass', y: 20 },
      { freq: 1000, label: 'Mid-range', y: 20 },
      { freq: 4000, label: 'Upper-mid', y: 20 },
      { freq: 12000, label: 'Treble', y: 20 }
    ];
    
    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - 30})`)
      .call(xAxis);
    
    // Add frequency range labels
    if (showLabels) {
      svg.selectAll('.frequency-label')
        .data(frequencyLabels)
        .enter()
        .append('text')
        .attr('class', 'frequency-label')
        .attr('x', d => x(d.freq))
        .attr('y', d => d.y)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#666')
        .text(d => d.label);
    }
    
    // Create visualization elements
    const line = d3.line()
      .x((d, i) => {
        // Map index to frequency (logarithmic)
        const freq = 20 * Math.pow(1000, i / bufferLength);
        return x(freq);
      })
      .y(d => y(d))
      .curve(d3.curveCardinal);
    
    const path = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#6200EA')
      .attr('stroke-width', 2);
    
    // Add gradient area
    const gradient = svg.append('linearGradient')
      .attr('id', 'frequency-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(255));
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#6200EA')
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#6200EA')
      .attr('stop-opacity', 0.1);
    
    const area = d3.area()
      .x((d, i) => {
        const freq = 20 * Math.pow(1000, i / bufferLength);
        return x(freq);
      })
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveCardinal);
    
    const areaPath = svg.append('path')
      .attr('fill', 'url(#frequency-gradient)')
      .attr('stroke', 'none');
    
    // Add interactive frequency indicator
    let indicator = null;
    let indicatorText = null;
    let indicatorFreq = null;
    let indicatorDb = null;
    
    if (interactive) {
      indicator = svg.append('line')
        .attr('stroke', 'rgba(255, 0, 0, 0.5)')
        .attr('stroke-width', 1)
        .attr('y1', 0)
        .attr('y2', height - 30)
        .style('display', 'none');
        
      indicatorText = svg.append('rect')
        .attr('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', 120)
        .attr('height', 50)
        .style('display', 'none');
        
      indicatorFreq = svg.append('text')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .style('display', 'none');
        
      indicatorDb = svg.append('text')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .style('display', 'none');
        
      svg.on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const frequency = x.invert(mx);
        
        // Find closest data point
        const index = Math.floor(Math.log(frequency / 20) / Math.log(1000) * bufferLength);
        const db = dataArray[index] || 0;
        
        indicator
          .attr('x1', mx)
          .attr('x2', mx)
          .style('display', null);
          
        indicatorText
          .attr('x', mx + 10)
          .attr('y', 10)
          .style('display', null);
          
        indicatorFreq
          .attr('x', mx + 20)
          .attr('y', 30)
          .text(`${Math.round(frequency)} Hz`)
          .style('display', null);
          
        indicatorDb
          .attr('x', mx + 20)
          .attr('y', 50)
          .text(`Level: ${db}`)
          .style('display', null);
      });
      
      svg.on('mouseleave', () => {
        indicator.style('display', 'none');
        indicatorText.style('display', 'none');
        indicatorFreq.style('display', 'none');
        indicatorDb.style('display', 'none');
      });
    }
    
    // Animation function
    const animate = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      
      path.attr('d', line(dataArray));
      areaPath.attr('d', area(dataArray));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [audioElement, showLabels, interactive]);
  
  return <svg ref={svgRef} width="100%" height="300" />;
}
```

## Integration Approaches

### 1. Standalone Component Approach

For maximum flexibility, these visualizations can be used as standalone components:

```jsx
import { EnhancedWaveform } from '@/components/music-ui/EnhancedWaveform';

function MyApp() {
  return (
    <div className="container">
      <h1>My Music App</h1>
      <EnhancedWaveform 
        audioUrl="https://example.com/track.mp3"
        color="#6200EA"
      />
    </div>
  );
}
```

### 2. Enhanced Existing Components

You can enhance existing components with these visualization capabilities:

```jsx
import { AudioPlayer } from '@/components/music-ui';
import { FrequencyVisualizer } from '@/components/music-ui/enhanced';

function EnhancedAudioPlayer({ track, ...props }) {
  const audioRef = useRef(null);
  
  return (
    <div className="enhanced-player">
      <AudioPlayer
        track={track}
        ref={audioRef}
        {...props}
      />
      <FrequencyVisualizer 
        audioElement={audioRef.current}
        showLabels={true}
        interactive={true}
      />
    </div>
  );
}
```

### 3. Plugin Architecture

For maximum flexibility, consider implementing a plugin architecture:

```jsx
import { AudioPlayer } from '@/components/music-ui';
import { useVisualizer } from '@/hooks/use-visualizer';

function MyApp() {
  const { VisualizerComponent, connect } = useVisualizer('spectrum');
  
  return (
    <div className="app">
      <AudioPlayer
        track={track}
        onAudioElementCreated={connect}
      />
      <VisualizerComponent 
        height={200}
        colorScheme="purple"
      />
    </div>
  );
}
```

## Best Practices

1. **Performance Considerations**
   - Use requestAnimationFrame for smooth visualizations
   - Consider throttling high-frequency updates
   - Implement canvas-based visualizations for complex graphics
   - Use WebGL for 3D or particle-heavy visualizations

2. **Accessibility**
   - Provide alternative representations of audio data
   - Ensure keyboard navigation for interactive visualizations
   - Include descriptive text explanations of what visualizations represent
   - Implement high-contrast modes for visualizations

3. **Mobile Optimization**
   - Reduce complexity on smaller screens
   - Optimize touch interactions for mobile
   - Consider battery and performance impacts
   - Implement responsive sizing and detail levels

4. **Cross-Browser Compatibility**
   - Test visualization performance in different browsers
   - Implement fallbacks for unsupported features
   - Consider polyfills for older browsers
   - Test on various device performance levels