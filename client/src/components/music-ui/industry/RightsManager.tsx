import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Badge, 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui';
import { Copy, Download, Filter, MoreHorizontal, PlusCircle, Share2, Shield, ShieldCheck, ShieldOff } from 'lucide-react';

interface RightHolder {
  id: number;
  name: string;
  role: 'composer' | 'lyricist' | 'producer' | 'performer' | 'publisher' | 'label' | 'distributor';
  share: number;
  verified: boolean;
}

interface License {
  id: number;
  licensee: string;
  type: 'sync' | 'mechanical' | 'performance' | 'master' | 'sample';
  territory: string[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'expired' | 'pending';
  fee: number;
  feeType: 'flat' | 'royalty';
}

interface Track {
  id: number;
  title: string;
  isrc?: string;
  rightHolders: RightHolder[];
  licenses: License[];
  registrations: {
    provider: string;
    id: string;
    date: string;
    status: 'registered' | 'pending' | 'rejected';
  }[];
}

interface RightsManagerProps {
  track: Track;
  onUpdateRights?: (track: Track) => void;
  onAddLicense?: (track: Track) => void;
  onExport?: (format: string, track: Track) => void;
  className?: string;
}

export function RightsManager({
  track,
  onUpdateRights,
  onAddLicense,
  onExport,
  className = ''
}: RightsManagerProps) {
  const [activeTab, setActiveTab] = useState('ownership');
  
  // Calculate total share percentage
  const totalShare = track.rightHolders.reduce((total, holder) => total + holder.share, 0);
  const isSharesComplete = Math.abs(totalShare - 100) < 0.01; // Account for floating point errors
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Format territory list
  const formatTerritories = (territories: string[]) => {
    if (territories.length === 1) return territories[0];
    if (territories.includes('Worldwide')) return 'Worldwide';
    if (territories.length > 2) return `${territories.length} Territories`;
    return territories.join(', ');
  };
  
  // Handle export
  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format, track);
    } else {
      console.log(`Exporting in ${format} format`);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{track.title}</CardTitle>
            <CardDescription>
              Rights Management{track.isrc ? ` • ISRC: ${track.isrc}` : ''}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <Download className="mr-2 h-4 w-4" /> Export JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" /> Share Rights Info
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="ownership" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Right Holders</h3>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge 
                        variant={isSharesComplete ? "outline" : "destructive"}
                        className="ml-2"
                      >
                        {isSharesComplete ? (
                          <ShieldCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <ShieldOff className="h-3 w-3 mr-1" />
                        )}
                        {totalShare}%
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSharesComplete 
                      ? 'Ownership shares total 100%' 
                      : `Ownership shares do not total 100% (${totalShare}%)`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Right Holder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Right Holder</DialogTitle>
                    <DialogDescription>
                      Add a new rightsholder to this track. The total ownership percentage must equal 100%.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Right holder form would go here */}
                  <div className="text-center text-muted-foreground py-6">
                    [Right Holder Form]
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Right Holder</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Share %</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {track.rightHolders.map((holder) => (
                <TableRow key={holder.id}>
                  <TableCell className="font-medium">{holder.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {holder.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{holder.share}%</TableCell>
                  <TableCell className="text-right">
                    {holder.verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Shield className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Contact</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="licenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Licenses</h3>
            
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" /> Add License
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New License</DialogTitle>
                    <DialogDescription>
                      Create a new license for this track.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* License form would go here */}
                  <div className="text-center text-muted-foreground py-6">
                    [License Form]
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create License</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Licensee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {track.licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">{license.licensee}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {license.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatTerritories(license.territory)}</TableCell>
                  <TableCell>
                    {formatDate(license.startDate)}
                    {license.endDate && ` - ${formatDate(license.endDate)}`}
                  </TableCell>
                  <TableCell>
                    {license.feeType === 'flat' 
                      ? `$${license.fee.toLocaleString()}`
                      : `${license.fee}%`
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="outline" 
                      className={
                        license.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : license.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                      }
                    >
                      {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Contract</DropdownMenuItem>
                        <DropdownMenuItem>Generate Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Terminate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="registrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Registrations</h3>
            
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Registration
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Registration</DialogTitle>
                    <DialogDescription>
                      Register this track with a collection society or PRO.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Registration form would go here */}
                  <div className="text-center text-muted-foreground py-6">
                    [Registration Form]
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Register</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Provider</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {track.registrations.map((registration, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{registration.provider}</TableCell>
                  <TableCell className="font-mono text-sm">{registration.id}</TableCell>
                  <TableCell>{formatDate(registration.date)}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="outline" 
                      className={
                        registration.status === 'registered' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : registration.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">Close</Button>
        <Button 
          variant="default"
          disabled={!isSharesComplete}
          onClick={() => {
            if (onUpdateRights) {
              onUpdateRights(track);
            }
          }}
        >
          <ShieldCheck className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}