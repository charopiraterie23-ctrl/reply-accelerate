import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Plus, Phone, Mail, MoreVertical } from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "leads" | "interested" | "pending" | "completed";
  lastContact: string;
  nextAction: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Marie Dubois",
    company: "TechCorp Inc.",
    email: "marie@techcorp.com",
    phone: "+33 1 23 45 67 89",
    status: "interested",
    lastContact: "Il y a 2 heures",
    nextAction: "Envoyer proposition"
  },
  {
    id: "2",
    name: "Pierre Martin",
    company: "StartupXYZ",
    email: "p.martin@startupxyz.fr",
    phone: "+33 6 12 34 56 78",
    status: "pending",
    lastContact: "Hier",
    nextAction: "Relance demo"
  },
  {
    id: "3",
    name: "Sophie Chen",
    company: "Innovate Co.",
    email: "sophie@innovate.com",
    phone: "+33 1 87 65 43 21",
    status: "completed",
    lastContact: "Il y a 3 jours",
    nextAction: "Suivi post-signature"
  }
];

const statusCounts = {
  leads: 15,
  interested: 8,
  pending: 12,
  completed: 5
};

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || client.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Gérez vos prospects et clients</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs">
            Tous
          </TabsTrigger>
          <TabsTrigger value="interested" className="text-xs">
            Intéressés
            <Badge variant="secondary" className="ml-1 text-xs">
              {statusCounts.interested}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            En attente
            <Badge variant="secondary" className="ml-1 text-xs">
              {statusCounts.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Conclus
            <Badge variant="secondary" className="ml-1 text-xs">
              {statusCounts.completed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <StatusBadge status={client.status}>
                        {client.status === "interested" && "Intéressé"}
                        {client.status === "pending" && "En attente"}
                        {client.status === "completed" && "Conclu"}
                        {client.status === "leads" && "Lead"}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{client.company}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📞 {client.lastContact}</span>
                      <span>🎯 {client.nextAction}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}