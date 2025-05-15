import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Github } from "lucide-react";

interface AppHeaderProps {
  user?: {
    name: string;
    initials: string;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="flex items-center text-primary font-bold text-xl">
              <i className="ri-music-2-line mr-2 text-2xl"></i>
              <span>MusicUI</span>
            </a>
          </Link>
          <div className="hidden md:block border-l border-neutral-200 dark:border-neutral-700 h-6 mx-2"></div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/components">
              <a className="text-sm text-foreground hover:text-primary dark:hover:text-primary transition">
                Components
              </a>
            </Link>
            <Link href="/documentation">
              <a className="text-sm text-foreground hover:text-primary dark:hover:text-primary transition">
                Documentation
              </a>
            </Link>
            <Link href="/themes">
              <a className="text-sm text-foreground hover:text-primary dark:hover:text-primary transition">
                Themes
              </a>
            </Link>
            <Link href="/api">
              <a className="text-sm text-foreground hover:text-primary dark:hover:text-primary transition">
                API
              </a>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Github className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          {user && (
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}
