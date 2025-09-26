import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, className }: MetricCardProps) {
  const isPositiveTrend = trend && trend.value > 0;
  
  return (
    <Card className={cn("card-gradient interactive-card group overflow-hidden relative", className)}>
      <CardContent className="mobile-padding relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <p className="body-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {title}
            </p>
            <p className="heading-lg font-bold text-gradient animate-scale-in">
              {value}
            </p>
            {trend && (
              <div className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
                isPositiveTrend 
                  ? "bg-success-soft text-success border border-success/20 group-hover:shadow-success" 
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              )}>
                {isPositiveTrend ? "+" : ""}{trend.value}% {trend.label}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500 animate-pulse-glow" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-soft to-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative z-10">
              <Icon className="h-6 w-6 text-primary group-hover:text-primary-glow transition-colors duration-300" />
            </div>
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}