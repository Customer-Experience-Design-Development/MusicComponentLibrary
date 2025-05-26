import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Settings, Download, RefreshCw, Share2, Palette, Shield, Crown, MessageSquare, Music, Sparkles } from 'lucide-react';
import { Artist } from '@/types/music';

interface AchievementItem {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocksFeature?: string;
  icon: React.ReactNode;
}

interface CustomizationItem {
  id: string;
  name: string;
  previewUrl: string;
  category: 'hair' | 'eyes' | 'mouth' | 'accessories' | 'background' | 'special';
  requiresAchievement?: string;
  isUnlocked: boolean;
}

interface PixelAvatarProps {
  artist: Artist;
  className?: string;
}

export function ArtistPixelAvatar({ artist, className = '' }: PixelAvatarProps) {
  const [pixelAvatar, setPixelAvatar] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customizationTab, setCustomizationTab] = useState('hair');
  const [pixelDensity, setPixelDensity] = useState(16);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({
    hair: '',
    eyes: '',
    mouth: '',
    accessories: '',
    background: '',
    special: ''
  });
  
  const customizationItems: CustomizationItem[] = [
    // Hair styles
    { id: 'hair-1', name: 'Spiky', previewUrl: '/assets/avatar/hair/spiky.png', category: 'hair', isUnlocked: true },
    { id: 'hair-2', name: 'Long', previewUrl: '/assets/avatar/hair/long.png', category: 'hair', isUnlocked: true },
    { id: 'hair-3', name: 'Curly', previewUrl: '/assets/avatar/hair/curly.png', category: 'hair', isUnlocked: true },
    { id: 'hair-4', name: 'Mohawk', previewUrl: '/assets/avatar/hair/mohawk.png', category: 'hair', requiresAchievement: 'punk-rock', isUnlocked: false },
    { id: 'hair-5', name: 'Glowing', previewUrl: '/assets/avatar/hair/glowing.png', category: 'hair', requiresAchievement: 'viral-hit', isUnlocked: false },
    
    // Eyes
    { id: 'eyes-1', name: 'Round', previewUrl: '/assets/avatar/eyes/round.png', category: 'eyes', isUnlocked: true },
    { id: 'eyes-2', name: 'Almond', previewUrl: '/assets/avatar/eyes/almond.png', category: 'eyes', isUnlocked: true },
    { id: 'eyes-3', name: 'Star', previewUrl: '/assets/avatar/eyes/star.png', category: 'eyes', requiresAchievement: 'pop-star', isUnlocked: false },
    { id: 'eyes-4', name: 'Cybernetic', previewUrl: '/assets/avatar/eyes/cyber.png', category: 'eyes', requiresAchievement: 'electronic-master', isUnlocked: false },
    
    // Mouth
    { id: 'mouth-1', name: 'Smile', previewUrl: '/assets/avatar/mouth/smile.png', category: 'mouth', isUnlocked: true },
    { id: 'mouth-2', name: 'Singing', previewUrl: '/assets/avatar/mouth/singing.png', category: 'mouth', isUnlocked: true },
    { id: 'mouth-3', name: 'Gold Grill', previewUrl: '/assets/avatar/mouth/grill.png', category: 'mouth', requiresAchievement: 'hip-hop-icon', isUnlocked: false },
    
    // Accessories
    { id: 'acc-1', name: 'Headphones', previewUrl: '/assets/avatar/accessories/headphones.png', category: 'accessories', isUnlocked: true },
    { id: 'acc-2', name: 'Microphone', previewUrl: '/assets/avatar/accessories/mic.png', category: 'accessories', isUnlocked: true },
    { id: 'acc-3', name: 'Sunglasses', previewUrl: '/assets/avatar/accessories/sunglasses.png', category: 'accessories', isUnlocked: true },
    { id: 'acc-4', name: 'Grammy Award', previewUrl: '/assets/avatar/accessories/grammy.png', category: 'accessories', requiresAchievement: 'award-winner', isUnlocked: false },
    { id: 'acc-5', name: 'Diamond Chain', previewUrl: '/assets/avatar/accessories/chain.png', category: 'accessories', requiresAchievement: 'diamond-certified', isUnlocked: false },
    
    // Backgrounds
    { id: 'bg-1', name: 'Studio', previewUrl: '/assets/avatar/backgrounds/studio.png', category: 'background', isUnlocked: true },
    { id: 'bg-2', name: 'Stage', previewUrl: '/assets/avatar/backgrounds/stage.png', category: 'background', isUnlocked: true },
    { id: 'bg-3', name: 'City', previewUrl: '/assets/avatar/backgrounds/city.png', category: 'background', isUnlocked: true },
    { id: 'bg-4', name: 'Festival', previewUrl: '/assets/avatar/backgrounds/festival.png', category: 'background', requiresAchievement: 'festival-headliner', isUnlocked: false },
    
    // Special effects (all require achievements)
    { id: 'special-1', name: 'Aura', previewUrl: '/assets/avatar/special/aura.png', category: 'special', requiresAchievement: 'one-million-streams', isUnlocked: false },
    { id: 'special-2', name: 'Gold Frame', previewUrl: '/assets/avatar/special/gold-frame.png', category: 'special', requiresAchievement: 'gold-record', isUnlocked: false },
    { id: 'special-3', name: 'Animated Flames', previewUrl: '/assets/avatar/special/flames.png', category: 'special', requiresAchievement: 'trending', isUnlocked: false },
    { id: 'special-4', name: 'Diamond Sparkle', previewUrl: '/assets/avatar/special/sparkle.png', category: 'special', requiresAchievement: 'diamond-record', isUnlocked: false },
  ];
  
  // Mock achievement data - in a real application, this would come from the user's profile
  useEffect(() => {
    // This would normally be fetched from an API based on the artist's accomplishments
    const mockAchievements: AchievementItem[] = [
      { 
        id: 'one-million-streams', 
        name: 'Streaming Sensation', 
        description: 'Reached one million streams on a single track',
        unlocked: true,
        rarity: 'common',
        unlocksFeature: 'Aura effect for avatar',
        icon: <Music className="h-4 w-4" />
      },
      { 
        id: 'gold-record', 
        name: 'Gold Status', 
        description: 'Earned a gold certification for your album',
        unlocked: true,
        rarity: 'rare',
        unlocksFeature: 'Gold frame for avatar',
        icon: <Shield className="h-4 w-4" />
      },
      { 
        id: 'pop-star', 
        name: 'Pop Icon', 
        description: 'Released 3 consecutive top 10 pop hits',
        unlocked: false,
        rarity: 'rare',
        unlocksFeature: 'Star eyes for avatar',
        icon: <Sparkles className="h-4 w-4" />
      },
      { 
        id: 'diamond-record', 
        name: 'Diamond Status', 
        description: 'Achieved diamond certification for 10 million sales',
        unlocked: false,
        rarity: 'legendary',
        unlocksFeature: 'Diamond sparkle effect',
        icon: <Crown className="h-4 w-4" />
      },
      { 
        id: 'festival-headliner', 
        name: 'Festival Headliner', 
        description: 'Headlined a major music festival',
        unlocked: artist.achievements?.some(a => a.name.includes('Headliner')) || false,
        rarity: 'epic',
        unlocksFeature: 'Festival background',
        icon: <Music className="h-4 w-4" />
      },
    ];
    
    setAchievements(mockAchievements);
    
    // Update customization items based on achievements
    const unlockedAchievementIds = mockAchievements
      .filter(a => a.unlocked)
      .map(a => a.id);
      
    // In a real application, we'd update the customization items based on achievements
    // For now, we'll just simulate this with our mock data
  }, [artist]);
  
  useEffect(() => {
    // Normally, this would generate a pixel art avatar based on the artist's image
    // For demo purposes, we'll just simulate this with a loading delay
    if (isGenerating) {
      const timer = setTimeout(() => {
        setPixelAvatar('/assets/avatar/generated/artist-pixel.gif');
        setIsGenerating(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGenerating, artist]);
  
  const handleGenerateAvatar = () => {
    setIsGenerating(true);
  };
  
  const handleDownloadAvatar = () => {
    // In a real app, this would download the actual generated avatar
    alert('Avatar download started!');
  };
  
  const handleShareAvatar = () => {
    // In a real app, this would open a share dialog
    alert('Share dialog would open here!');
  };
  
  const handleCustomizationSelect = (itemId: string, category: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: itemId
    }));
  };
  
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'bg-slate-100 text-slate-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Display Area */}
        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="h-64 w-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="ml-3 text-sm text-muted-foreground">Generating pixel avatar...</p>
            </div>
          ) : pixelAvatar ? (
            <div className="relative group">
              <img 
                src={pixelAvatar} 
                alt={`${artist.name} pixel avatar`} 
                className="h-64 w-64 object-contain"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={handleDownloadAvatar}>
                    <Download className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleShareAvatar}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-48 w-48 bg-muted rounded-md mb-4 flex items-center justify-center mx-auto">
                <Settings className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                No pixel avatar generated yet
              </p>
              <Button onClick={handleGenerateAvatar}>
                Generate Pixel Avatar
              </Button>
            </div>
          )}
          
          {pixelAvatar && (
            <div className="mt-4 space-y-4 w-full max-w-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Pixel Density</label>
                  <span className="text-xs text-muted-foreground">{pixelDensity}px</span>
                </div>
                <Slider 
                  value={[pixelDensity]} 
                  min={8} 
                  max={32} 
                  step={4}
                  onValueChange={(values) => setPixelDensity(values[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Animation Speed</label>
                  <span className="text-xs text-muted-foreground">{animationSpeed}x</span>
                </div>
                <Slider 
                  value={[animationSpeed]} 
                  min={0.5} 
                  max={4} 
                  step={0.5}
                  onValueChange={(values) => setAnimationSpeed(values[0])} 
                />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateAvatar}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="default">
                      <Palette className="h-4 w-4 mr-1" />
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Customize Your Pixel Avatar</DialogTitle>
                      <DialogDescription>
                        Personalize your artist's pixel art avatar. Some items require achievements to unlock.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div className="md:col-span-1">
                        <img 
                          src={pixelAvatar} 
                          alt={`${artist.name} pixel avatar`} 
                          className="w-full aspect-square object-contain bg-slate-100 dark:bg-slate-800 rounded-md"
                        />
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Unlocked Achievements</h4>
                          <div className="space-y-2">
                            {achievements
                              .filter(a => a.unlocked)
                              .map(achievement => (
                                <div 
                                  key={achievement.id}
                                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                                >
                                  <Badge className={getRarityColor(achievement.rarity)}>
                                    {achievement.icon}
                                  </Badge>
                                  <div>
                                    <p className="text-xs font-medium">{achievement.name}</p>
                                    <p className="text-xs text-muted-foreground">{achievement.unlocksFeature}</p>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Tabs defaultValue="hair" onValueChange={setCustomizationTab}>
                          <TabsList className="grid grid-cols-6">
                            <TabsTrigger value="hair">Hair</TabsTrigger>
                            <TabsTrigger value="eyes">Eyes</TabsTrigger>
                            <TabsTrigger value="mouth">Mouth</TabsTrigger>
                            <TabsTrigger value="accessories">Accessories</TabsTrigger>
                            <TabsTrigger value="background">Background</TabsTrigger>
                            <TabsTrigger value="special">Special</TabsTrigger>
                          </TabsList>
                          
                          {['hair', 'eyes', 'mouth', 'accessories', 'background', 'special'].map((category) => (
                            <TabsContent key={category} value={category} className="p-2">
                              <div className="grid grid-cols-3 gap-3">
                                {customizationItems
                                  .filter(item => item.category === category)
                                  .map(item => (
                                    <div 
                                      key={item.id}
                                      className={`
                                        relative rounded-md overflow-hidden border-2 cursor-pointer 
                                        ${selectedItems[category] === item.id ? 'border-primary' : 'border-transparent'}
                                        ${!item.isUnlocked ? 'opacity-50' : ''}
                                      `}
                                      onClick={() => item.isUnlocked && handleCustomizationSelect(item.id, category)}
                                    >
                                      <img 
                                        src={item.previewUrl} 
                                        alt={item.name}
                                        className="w-full aspect-square object-cover"
                                      />
                                      <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1">
                                        <p className="text-xs text-white truncate">{item.name}</p>
                                      </div>
                                      
                                      {!item.isUnlocked && item.requiresAchievement && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                          <div className="bg-black/80 rounded-md p-2 max-w-[90%]">
                                            <p className="text-xs text-white text-center">
                                              {`Unlock ${achievements.find(a => a.id === item.requiresAchievement)?.name || 'Achievement'}`}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                }
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
        
        {/* Achievement & Unlockables Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Artist Avatar Achievements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete achievements to unlock special customization options for your pixel avatar.
            </p>
            
            <div className="space-y-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`
                    flex items-start gap-4 p-3 rounded-lg border
                    ${achievement.unlocked ? 'bg-muted/30' : 'bg-muted/10 opacity-70'}
                  `}
                >
                  <div className={`
                    p-2 rounded-full 
                    ${achievement.unlocked ? getRarityColor(achievement.rarity) : 'bg-slate-100'}
                  `}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <Badge variant={achievement.unlocked ? "default" : "outline"} className="text-xs">
                        {achievement.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    {achievement.unlocksFeature && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Unlocks: {achievement.unlocksFeature}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Avatar Applications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here's how your pixel avatar can be used across your music profiles:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Community Posts</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your avatar will appear next to your posts in community forums and comments.
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Streaming Platforms</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add your avatar as an alternate profile picture on streaming services.
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Fan Rewards</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Offer customized versions of your avatar as fan collectibles and rewards.
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Interactive Experiences</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use your avatar in mini-games and interactive fan experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 