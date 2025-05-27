import { Link } from "wouter";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterCategory {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  categories: FooterCategory[];
  socialLinks: { icon: string; href: string }[];
  className?: string;
}

export function Footer({ categories, socialLinks, className = '' }: FooterProps) {
  return (
    <footer className={`bg-background border-t border-neutral-200 dark:border-neutral-800 mt-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <a className="flex items-center text-primary font-bold text-xl mb-4">
                <i className="ri-music-2-line mr-2 text-2xl"></i>
                <span>MusicUI</span>
              </a>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              A comprehensive UI component library for building beautiful music applications.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`${link.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {categories.map((category, index) => (
            <div className="col-span-1" key={index}>
              <h3 className="font-medium text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link key={link.href} href={link.href} className="text-sm text-foreground/60 hover:text-foreground transition-colors cursor-pointer">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Customer Experience Design & Development. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="bg-card border rounded-md text-sm py-1 px-2">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}