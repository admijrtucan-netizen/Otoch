import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 flex-col">
        <TopNav />
        <div className="flex flex-1">
          <Sidebar />
          <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
