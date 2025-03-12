'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Server, 
  Layers, 
  BarChart3, 
  Wallet, 
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AeroNyxLogo } from '@/components/ui/logo';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Nodes', href: '/dashboard/nodes', icon: Server },
  { name: 'All Network Nodes', href: '/dashboard/network', icon: Layers },
  { name: 'Staking', href: '/dashboard/staking', icon: Wallet },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MobileNav({ isOpen, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  
  // Prevent scrolling when the mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Side drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-card glass p-6 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center" onClick={() => onOpenChange(false)}>
            <AeroNyxLogo className="h-8 w-8" />
            <span className="ml-2 text-lg font-semibold gradient-text">AeroNyx</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary bg-opacity-20 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-primary" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6">
          <Link
            href="/help"
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            onClick={() => onOpenChange(false)}
          >
            <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
            Help & Support
          </Link>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              <div>AeroNyx Network</div>
              <div className="mt-1">© 2025 All rights reserved</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
