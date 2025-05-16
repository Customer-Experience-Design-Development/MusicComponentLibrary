import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function AccessibilityPage() {
  // Sidebar categories
  const sidebarCategories: NavCategory[] = [
    {
      title: "Getting Started",
      links: [
        { title: "Introduction", path: "/" },
        { title: "Installation", path: "/installation" },
        { title: "Usage", path: "/usage" },
        { title: "Theming", path: "/theming" },
      ]
    },
    {
      title: "Components",
      links: [
        { title: "Component Showcase", path: "/components/showcase" },
        { title: "Audio Player", path: "/components/audio-player" },
        { title: "Playlist", path: "/components/playlist" },
        { title: "Visualizer", path: "/components/visualizer" },
        { title: "Waveform", path: "/components/waveform" },
        { title: "Volume Control", path: "/components/volume-control" },
        { title: "Media Card", path: "/components/media-card" },
        { title: "Equalizer", path: "/components/equalizer" },
      ]
    },
    {
      title: "Resources",
      links: [
        { title: "Figma Integration", path: "/resources/figma" },
        { title: "Platform Support", path: "/resources/platforms" },
        { title: "Accessibility", path: "/resources/accessibility", active: true },
        { title: "Changelog", path: "/resources/changelog" },
      ]
    }
  ];

  // Footer categories
  const footerCategories = [
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/documentation" },
        { label: "API Reference", href: "/api" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Examples", href: "/examples" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com/musicui" },
        { label: "Discord", href: "https://discord.gg/musicui" },
        { label: "Twitter", href: "https://twitter.com/musicui" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "License", href: "/license" }
      ]
    }
  ];

  // Social links
  const socialLinks = [
    { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
    { icon: "ri-github-fill", href: "https://github.com/musicui" },
    { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
  ];

  // Accessibility compliance data
  const compliancePoints = [
    {
      title: "Keyboard Navigation",
      description: "All components can be navigated and operated using only the keyboard",
      status: "compliant",
      details: "Components support tab navigation, with clear focus states and keyboard shortcuts for common actions"
    },
    {
      title: "Screen Reader Support",
      description: "Components are fully compatible with common screen readers",
      status: "compliant",
      details: "ARIA attributes are implemented throughout for meaningful context and announcements"
    },
    {
      title: "Color Contrast",
      description: "Text and interactive elements meet WCAG 2.1 AA contrast requirements",
      status: "compliant",
      details: "Default themes are tested to ensure minimum 4.5:1 contrast ratio for text"
    },
    {
      title: "Text Resizing",
      description: "Interface remains usable when text is resized up to 200%",
      status: "compliant",
      details: "Components use relative units and flexible layouts to accommodate text scaling"
    },
    {
      title: "Alternative Media",
      description: "Audio visualizations have non-visual alternatives",
      status: "partially-compliant",
      details: "Working on better text descriptions for visualizations and alternative ways to interact with audio data"
    },
    {
      title: "Reduced Motion",
      description: "Respects user preference for reduced motion",
      status: "compliant",
      details: "All animations respond to the prefers-reduced-motion media query"
    },
    {
      title: "Responsive Design",
      description: "Components adapt to different screen sizes and orientations",
      status: "compliant",
      details: "Mobile-first approach ensures usability across devices"
    },
    {
      title: "Focus Management",
      description: "Focus is appropriately managed in dynamic components",
      status: "partially-compliant",
      details: "Complex widgets like audio players maintain logical focus order, some improvements in progress"
    }
  ];

  // Status badge colors
  const statusColors = {
    compliant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "partially-compliant": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "non-compliant": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Accessibility" 
              description="Our commitment to creating inclusive music experiences for all users."
            />
            
            <div className="space-y-6 mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Accessibility Statement</AlertTitle>
                <AlertDescription>
                  MusicUI is committed to ensuring digital accessibility for people with disabilities.
                  We continually improve the user experience for everyone, and apply the relevant
                  accessibility standards.
                </AlertDescription>
              </Alert>
              
              <Tabs defaultValue="compliance">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
                  <TabsTrigger value="guidelines">Implementation Guidelines</TabsTrigger>
                  <TabsTrigger value="testing">Testing & Tools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compliance" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>WCAG 2.1 AA Compliance Status</CardTitle>
                      <CardDescription>
                        Our components are built to meet WCAG 2.1 AA standards.
                        Here's our current compliance status.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {compliancePoints.map((point, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-medium">
                                  {point.status === "compliant" && <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-600" />}
                                  {point.status === "partially-compliant" && <AlertCircle className="inline-block h-4 w-4 mr-1 text-yellow-600" />}
                                  {point.status === "non-compliant" && <AlertCircle className="inline-block h-4 w-4 mr-1 text-red-600" />}
                                  {point.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{point.description}</p>
                              </div>
                              <Badge 
                                variant="secondary"
                                className={statusColors[point.status as keyof typeof statusColors]}
                              >
                                {point.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm border-t pt-2 mt-2">{point.details}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="guidelines" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Implementation Guidelines</CardTitle>
                      <CardDescription>
                        Follow these guidelines when using MusicUI components
                        to ensure accessibility in your applications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Audio Player Components</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Always provide descriptive labels for audio content</li>
                          <li>Include text alternatives for important audio information</li>
                          <li>Ensure keyboard controls work for all player functionality</li>
                          <li>Use the high-contrast theme option when placing players on complex backgrounds</li>
                          <li>Include time information in accessible formats</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Visualization Components</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Always pair visualizations with textual representation of data</li>
                          <li>Use the audio description props to provide narration of visuals</li>
                          <li>Include alternative interaction methods for non-visual users</li>
                          <li>Test visualizations with screen readers to ensure announcements are helpful</li>
                          <li>Avoid conveying information through color alone</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Navigation and Control Components</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Maintain logical tab order through complex interfaces</li>
                          <li>Ensure controls have appropriate ARIA roles and states</li>
                          <li>Provide clear focus indicators in both light and dark themes</li>
                          <li>Test with keyboard-only navigation to ensure all functions are accessible</li>
                          <li>Include skip links for repetitive navigation in complex layouts</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Theme Considerations</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Use the accessibility-first theme for maximum compliance</li>
                          <li>Test custom themes with contrast checkers</li>
                          <li>Ensure focus states remain visible in custom themes</li>
                          <li>Respect user preferences for reduced motion and contrast</li>
                          <li>Maintain text resizing compatibility in themed components</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="testing" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Testing Resources</CardTitle>
                      <CardDescription>
                        Tools and methodologies we use and recommend for testing accessibility.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Recommended Testing Tools</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Axe DevTools:</strong> Browser extension for automated accessibility testing</li>
                          <li><strong>WAVE:</strong> Web accessibility evaluation tool</li>
                          <li><strong>Screen Readers:</strong> NVDA (Windows), VoiceOver (Mac/iOS), TalkBack (Android)</li>
                          <li><strong>Keyboard Testing:</strong> Navigate with Tab, Shift+Tab, Arrow keys, Enter, Space</li>
                          <li><strong>Color Contrast Analyzers:</strong> WebAIM Contrast Checker, Colour Contrast Analyser</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Testing Methodology</h3>
                        <p className="mb-3">Our components undergo the following testing regimen:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Automated testing with Axe for WCAG violations</li>
                          <li>Manual keyboard navigation testing</li>
                          <li>Screen reader testing on multiple platforms</li>
                          <li>Color contrast verification for all themes</li>
                          <li>Testing at different text sizes up to 200%</li>
                          <li>Testing with reduced motion settings enabled</li>
                          <li>User testing with individuals with disabilities</li>
                        </ol>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-2">Accessibility Testing Command</h3>
                        <p className="mb-2">Our library includes a built-in testing utility:</p>
                        <pre className="bg-slate-200 dark:bg-slate-800 p-3 rounded text-sm font-mono overflow-x-auto">
                          {`npm run test:a11y`}
                        </pre>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This command runs automated accessibility tests on all components and generates
                          a report highlighting any issues that need attention.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ongoing Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    We're continuously working to improve accessibility in the following areas:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Enhanced screen reader support for complex visualizations</li>
                    <li>Improved keyboard navigation for complex interfaces</li>
                    <li>Better support for high contrast modes and dark themes</li>
                    <li>Additional non-visual alternatives for audio visualizations</li>
                    <li>Extending automation testing coverage</li>
                    <li>Exploring haptic feedback for mobile platforms</li>
                  </ol>
                  
                  <div className="bg-muted p-4 rounded-md mt-6">
                    <h3 className="font-medium mb-2">Feedback Welcome</h3>
                    <p>
                      We welcome feedback on accessibility issues. Please report any problems or suggestions
                      through our <a href="https://github.com/musicui/issues" className="text-primary hover:underline">GitHub issues</a> or
                      <a href="mailto:accessibility@musicui.com" className="text-primary hover:underline"> contact our team directly</a>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      
      <Footer 
        categories={footerCategories} 
        socialLinks={socialLinks} 
      />
    </div>
  );
}