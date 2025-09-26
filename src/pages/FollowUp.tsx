import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, MessageSquare, Calendar, Send, Edit } from "lucide-react";

interface FollowUp {
  id: string;
  clientName: string;
  company: string;
  type: "email" | "sms";
  subject: string;
  status: "draft" | "scheduled" | "sent" | "replied";
  scheduledFor?: string;
  sentAt?: string;
  template: string;
}

const mockFollowUps: FollowUp[] = [
  {
    id: "1",
    clientName: "Marie Dubois",
    company: "TechCorp Inc.",
    type: "email",
    subject: "Suite à notre échange - Proposition commerciale",
    status: "draft",
    template: "Discovery Follow-up"
  },
  {
    id: "2",
    clientName: "Pierre Martin",
    company: "StartupXYZ", 
    type: "email",
    subject: "Disponibilités pour la démonstration",
    status: "scheduled",
    scheduledFor: "Dans 2 heures",
    template: "Demo Booking"
  },
  {
    id: "3",
    clientName: "Sophie Chen",
    company: "Innovate Co.",
    type: "sms",
    subject: "Rappel RDV demain 14h30",
    status: "sent",
    sentAt: "Il y a 1 heure",
    template: "Meeting Reminder"
  }
];

const getStatusColor = (status: FollowUp["status"]) => {
  switch (status) {
    case "draft": return "bg-muted text-muted-foreground";
    case "scheduled": return "bg-warning-soft text-warning";
    case "sent": return "bg-success-soft text-success";
    case "replied": return "bg-primary-soft text-primary";
  }
};

const getTypeIcon = (type: FollowUp["type"]) => {
  return type === "email" ? Mail : MessageSquare;
};

export default function FollowUp() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFollowUps = mockFollowUps.filter(followUp => 
    activeTab === "all" || followUp.status === activeTab
  );

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suivi</h1>
          <p className="text-muted-foreground">Gérez vos suivis et relances</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau suivi
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="card-gradient">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Brouillons</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-warning">2</p>
            <p className="text-xs text-muted-foreground">Programmés</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-success">8</p>
            <p className="text-xs text-muted-foreground">Envoyés</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Réponses</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
          <TabsTrigger value="draft" className="text-xs">Brouillons</TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs">Programmés</TabsTrigger>
          <TabsTrigger value="sent" className="text-xs">Envoyés</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-6">
          {filteredFollowUps.map((followUp) => {
            const TypeIcon = getTypeIcon(followUp.type);
            return (
              <Card key={followUp.id} className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{followUp.clientName}</h3>
                        <Badge className={getStatusColor(followUp.status)}>
                          {followUp.status === "draft" && "Brouillon"}
                          {followUp.status === "scheduled" && "Programmé"}
                          {followUp.status === "sent" && "Envoyé"}
                          {followUp.status === "replied" && "Répondu"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{followUp.company}</p>
                      <p className="text-sm font-medium text-foreground mb-2">{followUp.subject}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📋 {followUp.template}</span>
                        {followUp.scheduledFor && <span>⏰ {followUp.scheduledFor}</span>}
                        {followUp.sentAt && <span>✅ {followUp.sentAt}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {followUp.status === "draft" && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" className="btn-primary">
                            <Send className="h-4 w-4 mr-1" />
                            Envoyer
                          </Button>
                        </>
                      )}
                      {followUp.status === "scheduled" && (
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reprogrammer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}