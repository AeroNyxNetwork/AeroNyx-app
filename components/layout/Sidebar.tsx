'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Server, 
  Layers, 
  BarChart3, 
  Wallet, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AeroNyxLogo } from '@/components/ui/logo';

type SidebarItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Nodes', href: '/dashboard/nodes', icon: Server },
  { name: 'All Network Nodes', href: '/dashboard/network', icon: Layers },
  { name: 'Staking', href: '/dashboard/staking', icon: Wallet },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="glass-sidebar w-72 overflow-y-auto py-4 px-3 z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-4 mb-6 mt-2">
          <Link href="/dashboard" className="flex items-center">
            <AeroNyxLogo className="h-10 w-10" />
            <span className="ml-3 text-xl font-semibold gradient-text">AeroNyx</span>
          </Link>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
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
        
        {/* Footer */}
        <div className="px-4 py-4 mt-auto">
          <Link
            href="/help"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
            Help & Support
          </Link>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              <div>AeroNyx Network</div>
              <div className="mt-1">© 2025 All rights reserved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
