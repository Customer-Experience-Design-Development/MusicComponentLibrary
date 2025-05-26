import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="container py-8 max-w-5xl mx-auto">
      {children}
    </div>
  );
} 