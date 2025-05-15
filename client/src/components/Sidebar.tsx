import { Link, useLocation } from "wouter";
import { NavCategory } from "@/types/music";

interface SidebarProps {
  categories: NavCategory[];
}

export function Sidebar({ categories }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className="col-span-12 lg:col-span-3 lg:pr-8">
      <div className="sticky top-20">
        {categories.map((category, index) => (
          <div className="mb-8" key={index}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              {category.title}
            </h2>
            <ul className="space-y-2">
              {category.links.map((link, linkIndex) => {
                const isActive = link.active || location === link.path;
                return (
                  <li key={linkIndex}>
                    <Link href={link.path}>
                      <a
                        className={`flex items-center text-sm px-3 py-2 rounded-md transition ${
                          isActive
                            ? "font-medium text-primary bg-primary/5"
                            : "hover:text-primary"
                        }`}
                      >
                        {link.title}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
