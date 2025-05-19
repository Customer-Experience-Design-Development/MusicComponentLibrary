import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { RightsManager } from '@/components/music-ui/industry/RightsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const footerCategories = [
  {
    title: 'Documentation',
    links: [
      { title: 'Getting Started', path: '/docs/introduction' },
      { title: 'Components', path: '/components' },
      { title: 'API Reference', path: '/docs/api' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'GitHub', path: 'https://github.com/yourusername/music-component-library' },
      { title: 'Discord', path: 'https://discord.gg/your-server' },
      { title: 'Twitter', path: 'https://twitter.com/your-handle' },
    ],
  },
];

const socialLinks = [
  { title: 'GitHub', path: 'https://github.com/yourusername/music-component-library' },
  { title: 'Discord', path: 'https://discord.gg/your-server' },
  { title: 'Twitter', path: 'https://twitter.com/your-handle' },
];

// Demo data for the RightsManager component
const demoTrack = {
  title: "Summer Vibes",
  artist: "DJ Cool",
  rightHolders: [
    {
      name: "DJ Cool",
      role: "composer" as const,
      share: 50,
      territory: "Worldwide"
    },
    {
      name: "Music Publishing Co.",
      role: "publisher" as const,
      share: 50,
      territory: "Worldwide"
    }
  ],
  licenses: [
    {
      type: "sync" as const,
      licensee: "Netflix",
      territory: "Worldwide",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      fee: 10000,
      feeType: "flat" as const,
      status: "active" as const
    }
  ],
  registrations: [
    {
      type: "copyright" as const,
      number: "SR-123456",
      date: "2023-06-15",
      territory: "Worldwide",
      status: "active" as const
    }
  ]
};

export default function RightsManagerPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <Sidebar activePath="/components/rights-manager" />
        <main className="flex-1 p-8">
          <PageHeader
            title="Rights Manager"
            description="A comprehensive component for managing music rights, licenses, and registrations."
          />
          <div className="mt-8">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
                  <RightsManager
                    track={demoTrack}
                    onUpdateRights={(rights) => console.log('Updated rights:', rights)}
                    onAddLicense={(license) => console.log('Added license:', license)}
                    onExport={() => console.log('Exporting rights data...')}
                  />
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Rights Manager component provides a comprehensive interface for managing music rights, including right holders, licenses, and registrations. It's designed for music industry professionals to track and manage their intellectual property.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">track: Track</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The track object containing rights information.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onUpdateRights?: (rights: RightHolder[]) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional callback function when rights are updated.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onAddLicense?: (license: License) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional callback function when a new license is added.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onExport?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional callback function when rights data is exported.
                      </p>
                    </div>
                  </div>
                  <h4 className="text-md font-semibold mt-6 mb-2">Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Right holder management</li>
                    <li>License tracking</li>
                    <li>Registration management</li>
                    <li>Territory-based rights</li>
                    <li>Share calculation</li>
                    <li>Data export</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for managing music rights and licenses.</li>
                    <li>Implement callbacks to handle rights updates and license additions.</li>
                    <li>Ensure all required track data is provided.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { RightsManager } from '@/components/music-ui/industry/RightsManager';

export default function Example() {
  const track = {
    title: "Summer Vibes",
    artist: "DJ Cool",
    rightHolders: [
      {
        name: "DJ Cool",
        role: "composer",
        share: 50,
        territory: "Worldwide"
      },
      {
        name: "Music Publishing Co.",
        role: "publisher",
        share: 50,
        territory: "Worldwide"
      }
    ],
    licenses: [
      {
        type: "sync",
        licensee: "Netflix",
        territory: "Worldwide",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        fee: 10000,
        feeType: "flat",
        status: "active"
      }
    ],
    registrations: [
      {
        type: "copyright",
        number: "SR-123456",
        date: "2023-06-15",
        territory: "Worldwide",
        status: "active"
      }
    ]
  };

  return (
    <RightsManager
      track={track}
      onUpdateRights={(rights) => console.log('Updated rights:', rights)}
      onAddLicense={(license) => console.log('Added license:', license)}
      onExport={() => console.log('Exporting rights data...')}
    />
  );
}`}
                    </code>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
} 