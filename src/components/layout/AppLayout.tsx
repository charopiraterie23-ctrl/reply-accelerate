import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="fixed top-0 left-0 right-0 glass-effect border-b border-border/30 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="heading-sm text-gradient">SalesTrack Pro</h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="pt-14 pb-20 animate-fade-in">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}