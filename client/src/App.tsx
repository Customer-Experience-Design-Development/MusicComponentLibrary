import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";

import Home from "@/pages/home";
import ComponentsIndex from "@/pages/components/index";
import AudioPlayerPage from "@/pages/components/audio-player";
import ComponentShowcase from "@/pages/components/showcase";
import Documentation from "@/pages/documentation";
import DesignSystem from "@/pages/design-system";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/components" component={ComponentsIndex} />
      <Route path="/components/audio-player" component={AudioPlayerPage} />
      <Route path="/components/showcase" component={ComponentShowcase} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/design-system" component={DesignSystem} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
