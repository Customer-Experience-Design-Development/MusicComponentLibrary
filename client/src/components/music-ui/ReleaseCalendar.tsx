import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

export interface Release {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  type: 'single' | 'album' | 'ep';
  status: 'scheduled' | 'announced' | 'released';
  coverArt?: string;
}

interface ReleaseCalendarProps {
  releases: Release[];
  onReleaseClick?: (release: Release) => void;
  onAddRelease?: () => void;
  className?: string;
}

export function ReleaseCalendar({ 
  releases, 
  onReleaseClick, 
  onAddRelease,
  className = '' 
}: ReleaseCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const releasesByDate = releases.reduce((acc, release) => {
    const date = format(new Date(release.releaseDate), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(release);
    return acc;
  }, {} as Record<string, Release[]>);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const getReleaseTypeColor = (type: Release['type']) => {
    switch (type) {
      case 'single':
        return 'bg-blue-500';
      case 'album':
        return 'bg-purple-500';
      case 'ep':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            {onAddRelease && (
              <Button onClick={onAddRelease}>
                <Plus className="h-4 w-4 mr-2" />
                Add Release
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="bg-background p-2 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayReleases = releasesByDate[dateStr] || [];
            
            return (
              <div
                key={index}
                className={`bg-background p-2 min-h-[100px] ${
                  !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                } ${
                  isToday(day) ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${
                    isToday(day) ? 'font-bold text-primary' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayReleases.length > 0 && (
                    <span className="text-xs text-neutral-500">
                      {dayReleases.length} release{dayReleases.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayReleases.map(release => (
                    <div
                      key={release.id}
                      className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                        getReleaseTypeColor(release.type)
                      } text-white`}
                      onClick={() => onReleaseClick?.(release)}
                    >
                      <div className="font-medium truncate">{release.title}</div>
                      <div className="opacity-80 truncate">{release.artist}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 