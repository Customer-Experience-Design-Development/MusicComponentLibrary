import { useState } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Github, Menu } from "lucide-react";

interface AppHeaderProps {
  user?: {
    name: string;
    initials: string;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { href: "/components", label: "Components" },
    { href: "/components/showcase", label: "Showcase" },
    { href: "/documentation", label: "Documentation" },
    { href: "/design-system", label: "Design System" },
    { href: "/resources/platforms", label: "Platforms" },
    { href: "/resources/accessibility", label: "Accessibility" }
  ];

  return (
    <header className="sticky top-0 z-30 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="flex items-center text-primary font-bold text-xl cursor-pointer">
              <i className="ri-music-2-line mr-2 text-2xl"></i>
              <span>MusicUI</span>
            </div>
          </Link>
          <div className="hidden md:block border-l border-neutral-200 dark:border-neutral-700 h-6 mx-2"></div>
          <nav className="hidden md:flex items-center space-x-4">
            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-sm text-foreground hover:text-primary dark:hover:text-primary transition cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <Search className="h-5 w-5" />
          </Button> */}
          {/* <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <Github className="h-5 w-5" />
          </Button> */}
          <ThemeToggle />
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <nav className="mt-8 flex flex-col space-y-4">
                {mainLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-foreground hover:text-primary dark:hover:text-primary transition cursor-pointer block py-2">
                      {link.label}
                    </span>
                  </Link>
                ))}
                {/* <div className="border-t pt-4 mt-4">
                  <Link href="https://github.com/musicui" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center text-foreground hover:text-primary dark:hover:text-primary transition cursor-pointer py-2">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </span>
                  </Link>
                </div> */}
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* {user && (
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          )} */}
        </div>
      </div>
    </header>
  );
}
