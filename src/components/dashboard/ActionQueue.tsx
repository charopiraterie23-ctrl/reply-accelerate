import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Calendar, ArrowRight } from "lucide-react";

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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Actions en attente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockItems.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <Badge 
                      className={`text-xs ${getPriorityColor(item.priority)}`}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}