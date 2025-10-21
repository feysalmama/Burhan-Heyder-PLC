"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ModernNav } from "@/components/modern-nav";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Pages that should not have navigation
  const noNavPages = ["/login", "/register", "/landing"];

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show navigation only for authenticated users on pages that need it
  const shouldShowNav = isAuthenticated && !noNavPages.includes(pathname);

  if (shouldShowNav) {
    return (
      <SidebarProvider>
        <div
          className="min-h-screen bg-gray-50 flex"
          style={{ width: "100%", margin: 0, padding: 0 }}
        >
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content Area - FULL WIDTH */}
          <div
            className="flex-1 flex flex-col"
            style={{ width: "100%", margin: 0, padding: 0 }}
          >
            <ModernNav />
            <main
              className="flex-1"
              style={{ width: "100%", margin: 0, padding: 0 }}
            >
              <div style={{ width: "100%", margin: 0, padding: 0 }}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // For login, register, and landing pages, render children directly
  return <>{children}</>;
}
