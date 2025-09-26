import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Phone, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Appels", href: "/appels", icon: Phone },
  { name: "Suivi", href: "/suivi", icon: MessageSquare },
  { name: "Analytique", href: "/analytique", icon: BarChart3 },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] h-12 px-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary bg-primary-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "text-primary")} />
              <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}