import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16 animate-fade-in">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}