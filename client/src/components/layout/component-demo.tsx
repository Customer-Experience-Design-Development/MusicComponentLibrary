import React from 'react';

interface ComponentDemoProps {
  children: React.ReactNode;
}

export function ComponentDemo({ children }: ComponentDemoProps) {
  return (
    <div className="p-4 border rounded-lg">
      {children}
    </div>
  );
} 