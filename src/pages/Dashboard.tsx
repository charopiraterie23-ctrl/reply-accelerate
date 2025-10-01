import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActionQueue } from "@/components/dashboard/ActionQueue";
import { Phone, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { metrics, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

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
          value={metrics.callsToday}
          icon={Phone}
          trend={{ value: metrics.callsTrend, label: "vs hier" }}
        />
        <MetricCard
          title="Taux de réponse"
          value={`${metrics.responseRate}%`}
          icon={TrendingUp}
          trend={{ value: metrics.callsTrend, label: "ce mois" }}
        />
        <MetricCard
          title="Suivis envoyés"
          value={metrics.followUpsSent}
          icon={MessageSquare}
          trend={{ value: metrics.followUpsTrend, label: "vs hier" }}
        />
        <MetricCard
          title="RDV planifiés"
          value={metrics.meetingsScheduled}
          icon={Calendar}
          trend={{ value: 2, label: "cette semaine" }}
        />
      </div>

      {/* Action Queue */}
      <ActionQueue />
    </div>
  );
}