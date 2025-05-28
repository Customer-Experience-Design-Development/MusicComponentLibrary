import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  label: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  icon?: React.ReactNode;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

interface OverviewCardProps {
  data: AnalyticsData;
  className?: string;
  showTrend?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface OverviewGroupProps {
  data: AnalyticsData[];
  title?: string;
  description?: string;
  className?: string;
  columns?: 2 | 3 | 4;
  showTrends?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Format numbers based on type
const formatValue = (value: number, format: AnalyticsData['format'] = 'number'): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'duration':
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    case 'number':
    default:
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
  }
};

// Calculate trend percentage
const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Get trend icon and color
const getTrendDisplay = (current: number, previous?: number) => {
  if (!previous) return { icon: null, color: 'text-muted-foreground', trend: null };
  
  const trendPercent = calculateTrend(current, previous);
  
  if (trendPercent > 0) {
    return {
      icon: <TrendingUp className="h-3 w-3" />,
      color: 'text-green-600',
      trend: `+${trendPercent.toFixed(1)}%`
    };
  } else if (trendPercent < 0) {
    return {
      icon: <TrendingDown className="h-3 w-3" />,
      color: 'text-red-600',
      trend: `${trendPercent.toFixed(1)}%`
    };
  } else {
    return {
      icon: <Minus className="h-3 w-3" />,
      color: 'text-muted-foreground',
      trend: '0%'
    };
  }
};

// Get color classes based on color prop
const getColorClasses = (color: AnalyticsData['color'] = 'default') => {
  switch (color) {
    case 'success':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
    case 'danger':
      return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
    default:
      return '';
  }
};

// Single Overview Card Component
export function OverviewCard({ 
  data, 
  className = '', 
  showTrend = true, 
  size = 'md' 
}: OverviewCardProps) {
  const { icon, color, trend } = getTrendDisplay(data.value, data.previousValue);
  const colorClasses = getColorClasses(data.color);
  
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const valueSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Card className={cn(colorClasses, className)}>
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {data.icon && (
              <div className="p-1 rounded-md bg-primary/10 text-primary">
                {data.icon}
              </div>
            )}
            <div>
              <p className={cn("font-medium text-muted-foreground", titleSizes[size])}>
                {data.label}
              </p>
              <p className={cn("font-bold", valueSizes[size])}>
                {formatValue(data.value, data.format)}
              </p>
            </div>
          </div>
          {showTrend && trend && (
            <div className={cn("flex items-center space-x-1 text-xs", color)}>
              {icon}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Overview Group Component
export function OverviewGroup({ 
  data, 
  title, 
  description, 
  className = '', 
  columns = 3, 
  showTrends = true, 
  size = 'md' 
}: OverviewGroupProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      <div className={cn("grid gap-4", gridClasses[columns])}>
        {data.map((item, index) => (
          <OverviewCard
            key={index}
            data={item}
            showTrend={showTrends}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

// Compact Overview Card for smaller spaces
export function CompactOverviewCard({ 
  data, 
  className = '', 
  showTrend = false 
}: Omit<OverviewCardProps, 'size'>) {
  const { icon, color, trend } = getTrendDisplay(data.value, data.previousValue);
  const colorClasses = getColorClasses(data.color);

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border bg-card",
      colorClasses,
      className
    )}>
      <div className="flex items-center space-x-2">
        {data.icon && (
          <div className="p-1 rounded bg-primary/10 text-primary">
            {data.icon}
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-muted-foreground">{data.label}</p>
          <p className="text-lg font-bold">{formatValue(data.value, data.format)}</p>
        </div>
      </div>
      {showTrend && trend && (
        <div className={cn("flex items-center space-x-1 text-xs", color)}>
          {icon}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

// Export types for external use
export type { AnalyticsData, OverviewCardProps, OverviewGroupProps }; 