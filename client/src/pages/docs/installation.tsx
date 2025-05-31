import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from 'wouter';

export default function Installation() {
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
        { label: "Twitter", href: "https://twitter.com/musicui" },
        { label: "Stack Overflow", href: "https://stackoverflow.com/questions/tagged/musicui" }
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

  const npmInstallCode = `# Using npm
npm install @musicui/react

# Using yarn
yarn add @musicui/react

# Using pnpm
pnpm add @musicui/react`;

  const peerDepsCode = `# Install peer dependencies
npm install react react-dom tailwindcss

# Using yarn
yarn add react react-dom tailwindcss

# Using pnpm
pnpm add react react-dom tailwindcss`;

  const tailwindConfigCode = `// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@musicui/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // ... other MusicUI theme variables
      },
    },
  },
  plugins: [],
}`;

  const cssVariablesCode = `:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 94.1%;
}`;

  const basicUsageCode = `import { AudioPlayer, Playlist, Visualizer } from '@musicui/react';
import '@musicui/react/styles.css';

function App() {
  const track = {
    id: 1,
    title: "Sample Track",
    artist: "Sample Artist",
    duration: 240,
    audioSrc: "/audio/sample.mp3",
    albumArt: "/images/album-art.jpg"
  };

  return (
    <div className="p-6">
      <AudioPlayer track={track} />
      <Visualizer type="bars" audioElement={audioRef.current} />
    </div>
  );
}`;

  const nextjsConfigCode = `// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ['@musicui/react'],
  },
};

module.exports = nextConfig;`;

  const viteConfigCode = `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@musicui/react'],
  },
});`;

  const iosInstallCode = `// Package.swift
dependencies: [
    .package(url: "https://github.com/musicui/musicui-ios.git", from: "1.0.0")
]

// In your target
.product(name: "MusicUI", package: "musicui-ios")`;

  const androidInstallCode = `// build.gradle (Module: app)
dependencies {
    implementation 'com.musicui:musicui-android:1.0.0'
    implementation 'androidx.compose.ui:ui:$compose_version'
    implementation 'androidx.compose.material3:material3:$material3_version'
}`;

  const androidUsageCode = `// MainActivity.kt
import com.musicui.AudioPlayer
import com.musicui.Visualizer

@Composable
fun MusicApp() {
    Column {
        AudioPlayer(
            track = track,
            onNext = { /* handle next */ },
            onPrevious = { /* handle previous */ }
        )
        
        Visualizer(
            type = VisualizerType.BARS,
            audioSource = audioSource
        )
    }
}`;

  const iosUsageCode = `// ContentView.swift
import SwiftUI
import MusicUI

struct ContentView: View {
    @State private var track = Track(
        id: 1,
        title: "Sample Track",
        artist: "Sample Artist",
        duration: 240
    )
    
    var body: some View {
        VStack {
            AudioPlayer(track: track)
            Visualizer(type: .bars, audioSource: audioSource)
        }
    }
}`;

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/docs/installation" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Installation" 
              description="Get MusicUI up and running in your project in just a few steps"
            />

            {/* Requirements Section */}
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-reactjs-line text-xl mr-2 text-primary"></i>
                        React
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>React 18.0.0 or higher</li>
                        <li>React DOM 18.0.0 or higher</li>
                        <li>TypeScript 4.9+ (recommended)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-palette-line text-xl mr-2 text-primary"></i>
                        Styling
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>Tailwind CSS 3.0+</li>
                        <li>PostCSS (usually included)</li>
                        <li>Autoprefixer (recommended)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-tools-line text-xl mr-2 text-primary"></i>
                        Build Tools
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>Node.js 16.0.0 or higher</li>
                        <li>npm, yarn, or pnpm</li>
                        <li>Vite, Next.js, or CRA</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Installation Tabs */}
            <Tabs defaultValue="react" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="ios">iOS</TabsTrigger>
                <TabsTrigger value="android">Android</TabsTrigger>
              </TabsList>
              
              <TabsContent value="react" className="mt-4 space-y-6">
                {/* Step 1: Install Package */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      Install MusicUI Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {npmInstallCode}
                    </pre>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Package Manager</AlertTitle>
                      <AlertDescription>
                        Choose the package manager that matches your project setup. All three options are fully supported.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Step 2: Install Peer Dependencies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      Install Peer Dependencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      MusicUI requires React, React DOM, and Tailwind CSS as peer dependencies:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {peerDepsCode}
                    </pre>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Already have these?</AlertTitle>
                      <AlertDescription>
                        If your project already has these dependencies, you can skip this step. Just make sure your versions meet the minimum requirements.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Step 3: Configure Tailwind */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      Configure Tailwind CSS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Update your Tailwind configuration to include MusicUI components:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {tailwindConfigCode}
                    </pre>
                  </CardContent>
                </Card>

                {/* Step 4: Add CSS Variables */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">4</span>
                      Add CSS Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Add the MusicUI CSS variables to your main CSS file (usually <code className="text-sm bg-muted px-1 py-0.5 rounded">globals.css</code> or <code className="text-sm bg-muted px-1 py-0.5 rounded">index.css</code>):
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96">
                      {cssVariablesCode}
                    </pre>
                  </CardContent>
                </Card>

                {/* Step 5: Basic Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">5</span>
                      Start Using Components
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Import and use MusicUI components in your React application:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {basicUsageCode}
                    </pre>
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>You're all set!</AlertTitle>
                      <AlertDescription>
                        MusicUI components are now ready to use in your application. Check out the{" "}
                        <Link href="/docs/quick-start" className="text-primary hover:underline">
                          Quick Start guide
                        </Link>{" "}
                        for your first implementation.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ios" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-apple-fill text-xl mr-2 text-primary"></i>
                      iOS Installation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Add MusicUI to your iOS project using Swift Package Manager:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {iosInstallCode}
                    </pre>
                    
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                      <li>iOS 15.0 or later</li>
                      <li>Xcode 14.0 or later</li>
                      <li>Swift 5.7 or later</li>
                    </ul>
                    
                    <h3 className="font-semibold mb-2">Basic Usage</h3>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      {iosUsageCode}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="android" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-android-fill text-xl mr-2 text-primary"></i>
                      Android Installation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Add MusicUI to your Android project using Gradle:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {androidInstallCode}
                    </pre>
                    
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                      <li>Android API level 21 or higher</li>
                      <li>Kotlin 1.8.0 or later</li>
                      <li>Jetpack Compose BOM 2023.03.00 or later</li>
                    </ul>
                    
                    <h3 className="font-semibold mb-2">Basic Usage</h3>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      {androidUsageCode}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Framework-Specific Setup */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Framework-Specific Setup</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-nextjs-line text-xl mr-2"></i>
                      Next.js
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Additional configuration for Next.js projects:
                    </p>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                      {nextjsConfigCode}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-vite-line text-xl mr-2"></i>
                      Vite
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Optimize MusicUI for Vite bundling:
                    </p>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                      {viteConfigCode}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Common Issues</h3>
                      <div className="space-y-3">
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <h4 className="font-medium">CSS Variables Not Working</h4>
                          <p className="text-sm text-muted-foreground">
                            Make sure you've added the CSS variables to your main CSS file and that Tailwind is processing your styles correctly.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <h4 className="font-medium">TypeScript Errors</h4>
                          <p className="text-sm text-muted-foreground">
                            Ensure you're using TypeScript 4.9+ and that your tsconfig.json includes the MusicUI module resolution.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <h4 className="font-medium">Build Errors with Next.js</h4>
                          <p className="text-sm text-muted-foreground">
                            Add MusicUI to your transpilePackages configuration in next.config.js.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Next Steps */}
            <section className="mb-8">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Now that MusicUI is installed, you're ready to start building your music application!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/docs/quick-start">
                      <Button className="w-full sm:w-auto">
                        <i className="ri-rocket-line mr-2"></i>
                        Quick Start Tutorial
                      </Button>
                    </Link>
                    <Link href="/components">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <i className="ri-grid-line mr-2"></i>
                        Browse Components
                      </Button>
                    </Link>
                    <Link href="/docs/introduction">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <i className="ri-book-line mr-2"></i>
                        Back to Introduction
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
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