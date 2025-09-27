import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Phone, MessageSquare, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Appels", href: "/appels", icon: Phone },
  { name: "Suivi", href: "/suivi", icon: MessageSquare },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Analytics", href: "/analytique", icon: BarChart3 },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border/30 z-50 pb-safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center mobile-touch-target px-3 rounded-xl transition-all duration-300 transform relative group",
                isActive
                  ? "text-primary bg-primary-soft shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:scale-105"
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl animate-pulse-glow" />
              )}
              <item.icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-all duration-300 relative z-10",
                  isActive ? "text-primary drop-shadow-sm" : "group-hover:scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium relative z-10 transition-all duration-300",
                isActive ? "text-primary text-shadow" : "group-hover:font-semibold"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce-in" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}