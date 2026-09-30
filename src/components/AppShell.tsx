import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
