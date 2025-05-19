import React, { useState, useEffect } from 'react';
import { FigmaService } from '../../services/figma';

interface FigmaSyncProps {
  figmaService: FigmaService;
  onComponentSync?: (components: any[]) => void;
}

export const FigmaSync: React.FC<FigmaSyncProps> = ({
  figmaService,
  onComponentSync,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncComponents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the Figma file data
      const fileData = await figmaService.getFile();
      
      // Extract components from the file
      const components = Object.values(fileData.document.children)
        .filter((node: any) => node.type === 'COMPONENT')
        .map((component: any) => ({
          id: component.id,
          name: component.name,
          description: component.description || '',
          properties: component.properties || {},
        }));

      if (onComponentSync) {
        onComponentSync(components);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync components');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="figma-sync">
      <button
        onClick={syncComponents}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Syncing...' : 'Sync Figma Components'}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}; 