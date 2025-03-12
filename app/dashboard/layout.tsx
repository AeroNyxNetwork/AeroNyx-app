'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when path changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="animated-bg" />
      
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block`}>
        <Sidebar />
      </div>
      
      {/* Mobile Nav */}
      <div className="block lg:hidden">
        <MobileNav 
          isOpen={isSidebarOpen} 
          onOpenChange={setIsSidebarOpen} 
        />
      </div>
      
      {/* Main Content */}
      <div className="lg:pl-72 min-h-screen">
        <Header 
          onMenuClick={() => setIsSidebarOpen(prev => !prev)} 
          showMenuButton={isMobile}
        />
        <main className="p-4 md:p-6 lg:p-8 pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}
