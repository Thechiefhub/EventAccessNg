import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/registration": "Registration",
  "/dashboard/spark": "The Spark",
  "/dashboard/spark/studio": "Narrative Studio",
  "/dashboard/chase": "The Chase",
  "/dashboard/buzz": "The Buzz",
  "/dashboard/engine": "The Engine",
  "/dashboard/dday": "The D-Day",
  "/dashboard/shortlist": "Shortlist",
  "/dashboard/admin": "Admin",
};

export default function DashboardLayout() {
  const location = useLocation();

  useEffect(() => {
    const pageName = ROUTE_TITLES[location.pathname] || "Dashboard";
    document.title = `${pageName} – Checking`;
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background/85 backdrop-blur-lg">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <span className="inline-flex items-center gap-1.5 font-cabinet text-lg font-extrabold uppercase tracking-[-0.03em] text-foreground">
                <span>CHECKING</span>
                <span
                  className="checking-dot-pulse inline-block w-2 h-2 rounded-full bg-[#C8FF00]"
                  aria-hidden="true"
                />
              </span>
            </div>
            <span className="hidden sm:inline font-satoshi text-xs text-muted-foreground">
              Your event co-pilot.
            </span>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
          <footer className="border-t border-border px-6 py-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-satoshi">
            <span>Made in Africa. Built for the world. Powered by Checking.</span>
            <span>© 2025 Checking</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
