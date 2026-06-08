'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR/hydration, pathname is null. Render children directly without
  // the admin shell to avoid hydration mismatches. After mount, skip the shell
  // only for the login route so it renders as a standalone page.
  if (!mounted || pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-cream-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
