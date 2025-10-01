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
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold text-gradient">SalesCopilot Pro</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-primary/10">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="pt-16 pb-20 animate-fade-in">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}