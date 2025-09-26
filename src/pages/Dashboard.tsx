import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActionQueue } from "@/components/dashboard/ActionQueue";
import { Phone, MessageSquare, Calendar, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">Votre activité commerciale d'aujourd'hui</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Appels aujourd'hui"
          value={12}
          icon={Phone}
          trend={{ value: 8, label: "vs hier" }}
        />
        <MetricCard
          title="Taux de réponse"
          value="64%"
          icon={TrendingUp}
          trend={{ value: 12, label: "ce mois" }}
        />
        <MetricCard
          title="Suivis envoyés"
          value={8}
          icon={MessageSquare}
          trend={{ value: 5, label: "vs hier" }}
        />
        <MetricCard
          title="RDV planifiés"
          value={3}
          icon={Calendar}
          trend={{ value: 2, label: "cette semaine" }}
        />
      </div>

      {/* Action Queue */}
      <ActionQueue />
    </div>
  );
}