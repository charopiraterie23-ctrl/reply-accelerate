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
    <Card className={cn("card-gradient", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs font-medium mt-1",
                isPositiveTrend ? "text-success" : "text-destructive"
              )}>
                {isPositiveTrend ? "+" : ""}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}