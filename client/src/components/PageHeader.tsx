interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl">
        {description}
      </p>
    </div>
  );
}
