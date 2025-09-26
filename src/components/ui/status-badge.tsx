import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "leads" | "interested" | "pending" | "completed";
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  leads: "bg-muted text-muted-foreground",
  interested: "status-badge-interested",
  pending: "status-badge-pending", 
  completed: "status-badge-completed",
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-xs font-medium px-2 py-1",
        statusStyles[status],
        className
      )}
    >
      {children}
    </Badge>
  );
}