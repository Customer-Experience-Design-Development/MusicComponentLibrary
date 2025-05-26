import React from 'react';

interface ComponentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function ComponentSection({ id, title, children }: ComponentSectionProps) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
} 