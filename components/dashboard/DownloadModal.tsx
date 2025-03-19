'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AeroNyxLogo } from '@/components/ui/logo';
import {
  Apple,
  Monitor, // Use Monitor instead of Windows
  Server, // Use Server instead of Linux
  Smartphone,
  Chrome,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Platform = {
  name: string;
  icon: React.ElementType;
  versions: {
    available: boolean;
    version?: string;
    link?: string;
  }[];
};

const platforms: Platform[] = [
  {
    name: 'macOS',
    icon: Apple,
    versions: [
      { available: true, version: '1.2.5', link: '#macos' },
    ]
  },
  {
    name: 'Windows',
    icon: Monitor, // Changed from Windows to Monitor
    versions: [
      { available: true, version: '1.2.5', link: '#windows' },
    ]
  },
  {
    name: 'Linux',
    icon: Server, // Changed from Linux to Server
    versions: [
      { available: true, version: '1.2.5', link: '#linux' },
    ]
  },
  {
    name: 'Android',
    icon: Smartphone,
    versions: [
      { available: true, version: '1.1.0', link: '#android' },
    ]
  },
  {
    name: 'iOS',
    icon: Apple,
    versions: [
      { available: false },
    ]
  },
  {
    name: 'Chrome',
    icon: Chrome,
    versions: [
      { available: true, version: '0.9.1', link: '#chrome' },
    ]
  }
];

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const handleDownload = (platform: Platform) => {
    const version = platform.versions[0];
    if (version.available && version.link) {
      window.open(version.link, '_blank');
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl glass-card border-gray-700">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <AeroNyxLogo className="h-16 w-16" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold gradient-text">
            AeroNyx Privacy Client
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="text-center mb-6 text-sm text-gray-400">
            Download the AeroNyx client to protect your privacy and contribute to the network
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const isAvailable = platform.versions[0].available;
              const version = platform.versions[0].version;

              return (
                <div
                  key={platform.name}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer",
                    isAvailable
                      ? "border-gray-700 bg-gray-900 bg-opacity-50"
                      : "border-gray-800 bg-gray-900 bg-opacity-30 opacity-60 cursor-not-allowed",
                    hoveredPlatform === platform.name && isAvailable && "border-primary"
                  )}
                  onMouseEnter={() => setHoveredPlatform(platform.name)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                  onClick={() => isAvailable && handleDownload(platform)}
                >
                  <platform.icon
                    className={cn(
                      "h-8 w-8 mb-2",
                      isAvailable ? "text-primary" : "text-gray-500"
                    )}
                  />
                  <div className="font-medium">{platform.name}</div>

                  {isAvailable ? (
                    <div className="text-xs text-gray-400 mt-1">v{version}</div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Coming Soon
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-center">
          By downloading, you agree to the <a href="#terms" className="text-primary hover:underline">Terms of Service</a> and <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a>
        </div>

        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
