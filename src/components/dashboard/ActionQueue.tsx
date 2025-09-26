import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueItem {
  id: string;
  type: "summary" | "followup" | "meeting";
  title: string;
  subtitle: string;
  time: string;
  priority: "high" | "medium" | "low";
}

const mockItems: QueueItem[] = [
  {
    id: "1",
    type: "summary",
    title: "Résumé prêt - TechCorp Inc.",
    subtitle: "Appel découverte avec Marie Dubois",
    time: "Il y a 5 minutes",
    priority: "high"
  },
  {
    id: "2", 
    type: "followup",
    title: "Relance en attente - StartupXYZ",
    subtitle: "Proposition pricing envoyée",
    time: "Dans 2 heures",
    priority: "medium"
  },
  {
    id: "3",
    type: "meeting",
    title: "Démonstration prévue",
    subtitle: "Rendez-vous avec Innovate Co.",
    time: "Demain 14h30",
    priority: "high"
  }
];

const getIcon = (type: QueueItem["type"]) => {
  switch (type) {
    case "summary": return MessageSquare;
    case "followup": return Clock;
    case "meeting": return Calendar;
  }
};

const getPriorityColor = (priority: QueueItem["priority"]) => {
  switch (priority) {
    case "high": return "bg-destructive text-destructive-foreground";
    case "medium": return "bg-warning text-warning-foreground";
    case "low": return "bg-muted text-muted-foreground";
  }
};

export function ActionQueue() {
  return (
    <Card className="card-gradient">
      <CardHeader className="pb-4">
        <CardTitle className="heading-md text-gradient">Actions en attente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockItems.map((item, index) => {
          const Icon = getIcon(item.type);
          return (
            <div 
              key={item.id}
              className="interactive-card p-4 rounded-xl border border-border/50 hover:bg-muted/50 group overflow-hidden relative animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-soft to-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-5 w-5 text-primary group-hover:text-primary-glow transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="body-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </p>
                      <Badge 
                        className={cn(
                          "text-xs transition-all duration-300 hover:scale-105",
                          getPriorityColor(item.priority)
                        )}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{item.subtitle}</p>
                    <p className="text-xs text-muted-foreground font-medium">{item.time}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="mobile-touch-target text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-300 hover:scale-105 relative z-10"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          );
        })}
        {mockItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground animate-fade-in">
            <p className="body-sm">Aucune action en attente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}