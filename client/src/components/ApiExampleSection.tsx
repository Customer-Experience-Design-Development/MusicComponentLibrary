import { useState } from 'react';
import { CodeExample } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface ApiExampleSectionProps {
  examples: CodeExample[];
  className?: string;
}

export function ApiExampleSection({ examples, className = '' }: ApiExampleSectionProps) {
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);

  return (
    <section className={`mb-12 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Integration Example</h2>
      
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
          {examples.map((example, index) => (
            <button
              key={index}
              className={`py-3 px-4 whitespace-nowrap ${
                index === activeExampleIndex
                  ? 'border-b-2 border-primary font-medium text-primary'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-primary transition'
              }`}
              onClick={() => setActiveExampleIndex(index)}
            >
              {example.title}
            </button>
          ))}
        </div>
        
        <div className="p-5">
          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-neutral-800 dark:text-neutral-200">
              {examples[activeExampleIndex].code}
            </pre>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="link" className="text-primary p-0 h-auto">
              <Github className="h-4 w-4 mr-1" />
              View full code examples
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
