'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);









  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-4">AeroNyx Network</h1>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
