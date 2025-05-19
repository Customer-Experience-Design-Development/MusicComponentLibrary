export const FIGMA_CONFIG = {
  // Replace these with your actual Figma access token and file key
  accessToken: process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN || '',
  fileKey: process.env.NEXT_PUBLIC_FIGMA_FILE_KEY || '',
  
  // Default settings for Figma embeds
  embedDefaults: {
    theme: 'light' as const,
    allowFullscreen: true,
    showUI: true,
    height: '450px',
    width: '100%',
  },
  
  // Component sync settings
  syncSettings: {
    autoSync: false,
    syncInterval: 5 * 60 * 1000, // 5 minutes
    formats: ['svg', 'png'] as const,
  },
}; 