import { Platform } from "@/types/music";

interface PlatformCompatibilityProps {
  platforms: Platform[];
}

export function PlatformCompatibility({ platforms }: PlatformCompatibilityProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">Platform Compatibility</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map((platform, index) => (
          <div 
            key={index} 
            className="device-pill flex flex-col items-center bg-card p-4 rounded-lg border cursor-pointer"
          >
            <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full mb-3">
              <i className={`${platform.icon} text-2xl text-primary`}></i>
            </div>
            <h3 className="font-medium">{platform.name}</h3>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {platform.supportLevel}% Support
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
