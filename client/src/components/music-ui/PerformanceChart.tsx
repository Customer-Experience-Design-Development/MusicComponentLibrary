import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  TooltipProps
} from 'recharts';

interface PerformanceData {
  date: string;
  streams: number;
  saves: number;
  shares: number;
  [key: string]: any;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
  description?: string;
  className?: string;
}

export function PerformanceChart({
  data,
  title = 'Performance Analytics',
  description = 'Track streaming metrics over time',
  className = ''
}: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('area');
  const [metricType, setMetricType] = useState('streams');
  
  // Filter data based on timeRange
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case '7d':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        cutoffDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  const filteredData = getFilteredData();
  
  // Calculate totals
  const totals = {
    streams: filteredData.reduce((sum, item) => sum + item.streams, 0),
    saves: filteredData.reduce((sum, item) => sum + item.saves, 0),
    shares: filteredData.reduce((sum, item) => sum + item.shares, 0)
  };
  
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-3 shadow-md">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const color = 
      metricType === 'streams' ? '#4f46e5' : 
      metricType === 'saves' ? '#10b981' : 
      '#f59e0b';
      
    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart 
            data={filteredData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id={`colorGradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              tickFormatter={formatNumber}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={metricType} 
              stroke={color} 
              fillOpacity={1}
              fill={`url(#colorGradient)`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              tickFormatter={formatNumber} 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={metricType} 
              fill={color} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Tabs value={metricType} onValueChange={setMetricType}>
            <TabsList>
              <TabsTrigger value="streams">
                <div className="text-center">
                  <span className="text-sm font-medium">Streams</span>
                  <p className="text-xs text-muted-foreground">{formatNumber(totals.streams)}</p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="saves">
                <div className="text-center">
                  <span className="text-sm font-medium">Saves</span>
                  <p className="text-xs text-muted-foreground">{formatNumber(totals.saves)}</p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="shares">
                <div className="text-center">
                  <span className="text-sm font-medium">Shares</span>
                  <p className="text-xs text-muted-foreground">{formatNumber(totals.shares)}</p>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('area')}
              className={`p-1 rounded ${chartType === 'area' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              title="Area Chart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1.5" />
                <path d="M2 10h20" />
                <path d="M7 15h.01" />
                <path d="M11 15h.01" />
                <path d="M15 15h.01" />
              </svg>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1 rounded ${chartType === 'bar' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              title="Bar Chart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <line x1="2" y1="20" x2="22" y2="20" />
              </svg>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}