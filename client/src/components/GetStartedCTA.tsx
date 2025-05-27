import { Button } from "@/components/ui/button";
import { Github, ArrowRight } from "lucide-react";

interface GetStartedCTAProps {
  onGetStarted?: () => void;
  onViewGitHub?: () => void;
  className?: string;
}

export function GetStartedCTA({
  onGetStarted,
  onViewGitHub,
  className = "",
}: GetStartedCTAProps) {
  return (
    <section
      className={`rounded-xl overflow-hidden bg-gradient-to-r from-primary to-purple-700 text-white p-8 relative ${className}`}
    >
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Ready to build amazing music experiences?
        </h2>
        <p className="text-white/80 mb-6">
          Start using MusicUI today and create consistent, beautiful music
          applications across all platforms. Our component library makes it easy
          to build professional music experiences without starting from scratch.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={onGetStarted}
            className="bg-white text-primary hover:bg-neutral-100 px-6 py-6 h-auto rounded-lg font-medium"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {/* <Button 
            onClick={onViewGitHub}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-6 py-6 h-auto rounded-lg font-medium"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button> */}
        </div>
      </div>
    </section>
  );
}
