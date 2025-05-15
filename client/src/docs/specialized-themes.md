# MusicUI Specialized Themes

This document outlines specialized themes designed for different music industry users and contexts. Each theme includes color palettes, typography recommendations, and component styling guidance.

## Theme Structure

All MusicUI themes follow a consistent structure with the following customizable properties:

- **Color Palette**: Primary, secondary, accent, and neutral colors
- **Typography**: Font families, sizes, and weights
- **Component Styling**: Specific styling variants for components
- **Animation**: Motion characteristics and timing
- **Spacing**: Layout spacing scales
- **Borders & Shadows**: Elevation and separation styles

## Artist Themes

### Producer Theme

Designed for electronic music producers and beatmakers with a focus on technical detail and modern aesthetics.

```css
:root {
  /* Colors */
  --primary: 265 85% 40%; /* #4f2cbd - Deep purple */
  --primary-foreground: 0 0% 100%;
  --secondary: 180 90% 40%; /* #0cc7c7 - Bright teal */
  --secondary-foreground: 0 0% 100%;
  --accent: 325 80% 50%; /* #e01b84 - Vivid pink */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  /* Other properties */
  --border-radius: 4px;
  --animation-timing: cubic-bezier(0.16, 1, 0.3, 1);
  --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
```

**Usage Context**: DAW-like interfaces, beat-making applications, sound design tools

**Component Styling**:
- Audio visualization with high detail and precision
- Technical data displays that show exact values
- Grid-based layouts with clear segmentation
- Minimalist controls with hover effects

### Performer Theme

Designed for performing artists and bands with emphasis on brand identity and emotional impact.

```css
:root {
  /* Colors */
  --primary: 5 90% 50%; /* #f8252a - Energetic red */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 80% 45%; /* #1268d8 - Deep blue */
  --secondary-foreground: 0 0% 100%;
  --accent: 45 90% 50%; /* #f9c31b - Warm yellow */
  --accent-foreground: 0 0% 10%;
  
  /* Typography */
  --font-heading: "Montserrat", sans-serif;
  --font-body: "Source Sans Pro", sans-serif;
  --font-mono: "Roboto Mono", monospace;
  
  /* Other properties */
  --border-radius: 8px;
  --animation-timing: cubic-bezier(0.2, 0.9, 0.1, 1);
  --box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}
```

**Usage Context**: Artist websites, EPKs (Electronic Press Kits), tour management

**Component Styling**:
- Large hero areas for visual impact
- Emphasis on media and imagery
- Interactive elements with bold feedback
- Brand-focused design with consistent identity

## Fan Themes

### Listener Theme

Designed for music consumers with focus on discovery and enjoyable listening experiences.

```css
:root {
  /* Colors */
  --primary: 235 70% 50%; /* #425ff5 - Pleasant blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 140 50% 45%; /* #30a85e - Gentle green */
  --secondary-foreground: 0 0% 100%;
  --accent: 325 60% 50%; /* #cf3b7f - Soft pink */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "DM Sans", sans-serif;
  --font-body: "Nunito", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  
  /* Other properties */
  --border-radius: 12px;
  --animation-timing: cubic-bezier(0.34, 1.56, 0.64, 1);
  --box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}
```

**Usage Context**: Streaming apps, playlist creators, music discovery platforms

**Component Styling**:
- Rounded, friendly interface elements
- Focus on content over controls
- Smooth animations and transitions
- Card-based layouts for browsing

### Enthusiast Theme

Designed for serious music collectors and audiophiles with attention to detail and information density.

```css
:root {
  /* Colors */
  --primary: 200 70% 40%; /* #1f77b4 - Deep blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 25 80% 50%; /* #e67e22 - Rich orange */
  --secondary-foreground: 0 0% 100%;
  --accent: 280 60% 45%; /* #8e44ad - Purple */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "Playfair Display", serif;
  --font-body: "Lora", serif;
  --font-mono: "Fira Code", monospace;
  
  /* Other properties */
  --border-radius: 2px;
  --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}
```

**Usage Context**: Collection management, music metadata apps, vinyl cataloging

**Component Styling**:
- Typography-focused design with attention to readability
- Detailed metadata displays
- Classic interface elements with subtle modern touches
- Information-dense layouts with clear hierarchy

## Industry Professional Themes

### Analytics Theme

Designed for data-driven music industry professionals with focus on clarity and insights.

```css
:root {
  /* Colors */
  --primary: 210 100% 50%; /* #0066ff - Clear blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 150 100% 40%; /* #00cc66 - Green */
  --secondary-foreground: 0 0% 100%;
  --accent: 25 100% 50%; /* #ff6600 - Orange */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "Poppins", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "Roboto Mono", monospace;
  
  /* Other properties */
  --border-radius: 6px;
  --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
}
```

**Usage Context**: Analytics dashboards, performance tracking, industry reporting

**Component Styling**:
- Clean, minimal interface elements
- High-contrast data visualizations
- Strong information hierarchy
- Tabular data with efficient use of space

### Business Theme

Designed for music business executives with professional appearance and strategic focus.

```css
:root {
  /* Colors */
  --primary: 215 60% 35%; /* #1e5089 - Navy blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 155 45% 42%; /* #3d9d7c - Forest green */
  --secondary-foreground: 0 0% 100%;
  --accent: 350 50% 45%; /* #b82e4c - Burgundy */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "Merriweather", serif;
  --font-body: "Source Sans Pro", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  
  /* Other properties */
  --border-radius: 4px;
  --animation-timing: cubic-bezier(0.25, 0.8, 0.25, 1);
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

**Usage Context**: Label management, publishing administration, licensing platforms

**Component Styling**:
- Professional, restrained interface elements
- Focus on legibility and clarity
- Structured layouts with consistent spacing
- Traditional UI patterns familiar to business users

## Educational Themes

### Music Education Theme

Designed for music learning platforms with clear information hierarchy and friendly approach.

```css
:root {
  /* Colors */
  --primary: 245 60% 50%; /* #5a63ee - Friendly violet */
  --primary-foreground: 0 0% 100%;
  --secondary: 180 60% 45%; /* #29a3a3 - Teal */
  --secondary-foreground: 0 0% 100%;
  --accent: 40 90% 50%; /* #f7ba0b - Warm yellow */
  --accent-foreground: 0 0% 10%;
  
  /* Typography */
  --font-heading: "Quicksand", sans-serif;
  --font-body: "Open Sans", sans-serif;
  --font-mono: "Inconsolata", monospace;
  
  /* Other properties */
  --border-radius: 10px;
  --animation-timing: cubic-bezier(0.25, 0.8, 0.25, 1);
  --box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}
```

**Usage Context**: Music theory apps, practice tools, educational platforms

**Component Styling**:
- Approachable interface with clear guidance
- Step-by-step progressive disclosure
- Visual feedback and reinforcement
- Encouraging messaging and design elements

## Implementing a Theme

To use one of these themes in your MusicUI implementation:

1. Import the theme CSS file:
```jsx
import '@/themes/producer-theme.css';
```

2. Apply the theme to your root component:
```jsx
<div className="musicui-theme-producer">
  {/* Your app components */}
</div>
```

3. Or set it programmatically:
```jsx
import { setTheme } from '@/lib/theme-provider';

// Later in your code
setTheme('producer');
```

## Creating Custom Themes

To create your own custom theme:

1. Start with our theme template structure
2. Customize the CSS variables to match your brand
3. Create component style overrides as needed
4. Register your theme with the ThemeProvider

Example custom theme creation:

```jsx
// Define your theme in a CSS file
:root {
  /* Your custom theme variables */
}

// Register your theme
import { registerTheme } from '@/lib/theme-provider';

registerTheme('my-custom-theme', {
  name: 'My Custom Theme',
  description: 'A specialized theme for my music app',
  author: 'Your Name',
  variables: {
    // Theme variables object for programmatic access
  }
});
```

## Theme Combinations

You can mix certain themes with functional modifiers:

- `high-contrast`: Enhanced contrast for accessibility
- `reduced-motion`: Minimizes animations for users with motion sensitivity
- `compact`: Tighter spacing for dense UIs
- `touch-optimized`: Larger hit areas for touch interfaces

Example:
```jsx
<div className="musicui-theme-producer high-contrast touch-optimized">
  {/* Your app components */}
</div>
```