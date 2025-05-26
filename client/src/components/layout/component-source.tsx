import React from 'react';

interface ComponentSourceProps {
  language: string;
  code: string;
}

export function ComponentSource({ language, code }: ComponentSourceProps) {
  return (
    <div className="rounded-md bg-muted p-4 overflow-auto">
      <pre className="text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
} 