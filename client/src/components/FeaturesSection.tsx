import { Feature } from '@/types/music';

interface FeaturesSectionProps {
  features: Feature[];
  className?: string;
}

export function FeaturesSection({ features, className = '' }: FeaturesSectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Features & Capabilities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-card rounded-xl shadow-sm border p-5">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className={`${feature.icon} text-xl text-primary`}></i>
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
