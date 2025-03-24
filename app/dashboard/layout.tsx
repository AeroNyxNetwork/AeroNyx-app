/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-24 14:58:07
 */
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
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
    <div className="relative min-h-screen   bg-background">
      {/* message */}




      <div className="animated-bg" />

      {/* Desktop Sidebar */}
      {/* <div className={`hidden lg:block`}>
        <Sidebar />
      </div> */}

      {/* Mobile Nav */}
      <div className="block lg:hidden">
        <MobileNav
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className=" min-h-screen">
        {
          pathname !== "/dashboard/map" &&
          < Header
            onMenuClick={() => setIsSidebarOpen(prev => !prev)}
            showMenuButton={isMobile}
          />
        }

        <main className="p-4 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
