import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Mail, MessageSquare, Calendar, Users } from "lucide-react";

interface AnalyticsMetric {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
}

const metrics: AnalyticsMetric[] = [
  {
    title: "Taux de réponse Email",
    value: "64%",
    change: 12,
    trend: "up",
    icon: Mail
  },
  {
    title: "Taux de réponse SMS", 
    value: "78%",
    change: 8,
    trend: "up",
    icon: MessageSquare
  },
  {
    title: "Meetings/100 appels",
    value: "23",
    change: -3,
    trend: "down",
    icon: Calendar
  },
  {
    title: "Temps moyen de réponse",
    value: "2.4h",
    change: 15,
    trend: "up",
    icon: TrendingUp
  }
];

interface ChannelPerformance {
  channel: string;
  sent: number;
  replied: number;
  replyRate: number;
  meetings: number;
}

const channelData: ChannelPerformance[] = [
  { channel: "Email découverte", sent: 45, replied: 28, replyRate: 62, meetings: 8 },
  { channel: "SMS relance", sent: 23, replied: 18, replyRate: 78, meetings: 5 },
  { channel: "Email proposition", sent: 12, replied: 9, replyRate: 75, meetings: 7 },
  { channel: "SMS rappel", sent: 34, replied: 25, replyRate: 74, meetings: 3 }
];

export default function Analytics() {
  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytique</h1>
        <p className="text-muted-foreground">Performances et insights commerciaux</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";
          
          return (
            <Card key={metric.title} className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className={`flex items-center gap-1 text-xs ${
                    isPositive ? "text-success" : "text-destructive"
                  }`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}{metric.change}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Channel Performance */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="text-lg">Performance par canal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channelData.map((channel) => (
            <div key={channel.channel} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{channel.channel}</h4>
                  <Badge variant="outline" className="text-xs">
                    {channel.replyRate}% taux de réponse
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {channel.meetings} meetings
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Envoyés: {channel.sent}</span>
                  <span>Réponses: {channel.replied}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${channel.replyRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="text-lg">Insights recommandés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-success-soft border border-success/20">
            <p className="text-sm font-medium text-success">🎯 Meilleure fenêtre d'envoi</p>
            <p className="text-xs text-muted-foreground mt-1">
              Mardis 10h-11h: +24% de taux de réponse
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-warning-soft border border-warning/20">
            <p className="text-sm font-medium text-warning">⚡ Template performant</p>
            <p className="text-xs text-muted-foreground mt-1">
              "Discovery Follow-up": 78% de taux de réponse (+18% vs moyenne)
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary-soft border border-primary/20">
            <p className="text-sm font-medium text-primary">🚀 Opportunité SMS</p>
            <p className="text-xs text-muted-foreground mt-1">
              Les relances SMS génèrent +32% de meetings que l'email seul
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}