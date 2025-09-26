import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Clock, CheckCircle, MessageSquare } from "lucide-react";

interface Call {
  id: string;
  clientName: string;
  company: string;
  duration: string;
  date: string;
  time: string;
  status: "recorded" | "processing" | "summarized";
  outcome: "positive" | "neutral" | "negative";
}

const mockCalls: Call[] = [
  {
    id: "1",
    clientName: "Marie Dubois",
    company: "TechCorp Inc.",
    duration: "23 min",
    date: "Aujourd'hui",
    time: "14:30",
    status: "summarized",
    outcome: "positive"
  },
  {
    id: "2",
    clientName: "Pierre Martin", 
    company: "StartupXYZ",
    duration: "31 min",
    date: "Aujourd'hui",
    time: "11:15",
    status: "processing",
    outcome: "neutral"
  },
  {
    id: "3",
    clientName: "Sophie Chen",
    company: "Innovate Co.",
    duration: "18 min",
    date: "Hier",
    time: "16:45",
    status: "recorded",
    outcome: "positive"
  }
];

const getStatusColor = (status: Call["status"]) => {
  switch (status) {
    case "recorded": return "bg-warning-soft text-warning";
    case "processing": return "bg-pending-soft text-pending";
    case "summarized": return "bg-success-soft text-success";
  }
};

const getStatusIcon = (status: Call["status"]) => {
  switch (status) {
    case "recorded": return Play;
    case "processing": return Clock;
    case "summarized": return CheckCircle;
  }
};

const getOutcomeEmoji = (outcome: Call["outcome"]) => {
  switch (outcome) {
    case "positive": return "😊";
    case "neutral": return "😐";
    case "negative": return "😔";
  }
};

export default function Calls() {
  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appels</h1>
          <p className="text-muted-foreground">Historique et résumés d'appels</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel appel
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">2h 15m</p>
            <p className="text-xs text-muted-foreground">Durée totale</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">67%</p>
            <p className="text-xs text-muted-foreground">Positifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {mockCalls.map((call) => {
          const StatusIcon = getStatusIcon(call.status);
          return (
            <Card key={call.id} className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{call.clientName}</h3>
                      <span className="text-lg">{getOutcomeEmoji(call.outcome)}</span>
                      <Badge className={getStatusColor(call.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {call.status === "recorded" && "Enregistré"}
                        {call.status === "processing" && "Analyse en cours"}
                        {call.status === "summarized" && "Résumé prêt"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{call.company}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📅 {call.date} à {call.time}</span>
                      <span>⏱️ {call.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {call.status === "summarized" && (
                      <Button size="sm" variant="default" className="btn-primary">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Voir résumé
                      </Button>
                    )}
                    {call.status === "recorded" && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Analyser
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}