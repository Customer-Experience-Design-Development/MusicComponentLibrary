import React from 'react';

interface FigmaEmbedProps {
  fileKey: string;
  nodeId?: string;
  mode?: 'design' | 'prototype';
  theme?: 'light' | 'dark' | 'system';
  allowFullscreen?: boolean;
  showUI?: boolean;
  height?: string | number;
  width?: string | number;
}

export const FigmaEmbed: React.FC<FigmaEmbedProps> = ({
  fileKey,
  nodeId,
  mode = 'design',
  theme = 'light',
  allowFullscreen = true,
  showUI = true,
  height = '450px',
  width = '100%',
}) => {
  const baseUrl = `https://www.figma.com/embed`;
  const embedUrl = `${baseUrl}/${mode}/${fileKey}${nodeId ? `?node-id=${nodeId}` : ''}`;

  return (
    <iframe
      src={embedUrl}
      style={{
        border: 'none',
        width,
        height,
      }}
      allowFullScreen={allowFullscreen}
      data-theme={theme}
      data-show-ui={showUI}
    />
  );
}; 