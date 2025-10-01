import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfToday, startOfYesterday, startOfWeek, startOfMonth } from "date-fns";

export function useDashboardData() {
  const { data: callsToday, isLoading: loadingCalls } = useQuery({
    queryKey: ["calls-today"],
    queryFn: async () => {
      const today = startOfToday();
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .gte("created_at", today.toISOString())
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: callsYesterday } = useQuery({
    queryKey: ["calls-yesterday"],
    queryFn: async () => {
      const yesterday = startOfYesterday();
      const today = startOfToday();
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .gte("created_at", yesterday.toISOString())
        .lt("created_at", today.toISOString())
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: followUps, isLoading: loadingFollowUps } = useQuery({
    queryKey: ["followups-today"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follow_ups")
        .select("*, client:clients(*), call:calls(*)")
        .eq("status", "pending")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .order("scheduled_at", { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: callsThisWeek } = useQuery({
    queryKey: ["calls-week"],
    queryFn: async () => {
      const weekStart = startOfWeek(new Date());
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .gte("created_at", weekStart.toISOString())
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: callsThisMonth } = useQuery({
    queryKey: ["calls-month"],
    queryFn: async () => {
      const monthStart = startOfMonth(new Date());
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .gte("created_at", monthStart.toISOString())
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate metrics
  const todayCount = callsToday?.length || 0;
  const yesterdayCount = callsYesterday?.length || 0;
  const callsTrend = yesterdayCount > 0 
    ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
    : 0;

  const completedCallsToday = callsToday?.filter(c => c.status === "completed").length || 0;
  const responseRate = todayCount > 0 
    ? Math.round((completedCallsToday / todayCount) * 100)
    : 0;

  const followUpsSent = followUps?.filter(f => f.status === "sent").length || 0;
  const followUpsTrend = yesterdayCount > 0 
    ? Math.round((followUpsSent / yesterdayCount) * 100)
    : 0;

  const meetingsScheduled = callsThisWeek?.filter(c => c.outcome === "meeting_scheduled").length || 0;

  return {
    metrics: {
      callsToday: todayCount,
      callsTrend,
      responseRate,
      followUpsSent,
      followUpsTrend,
      meetingsScheduled,
    },
    followUps: followUps || [],
    isLoading: loadingCalls || loadingFollowUps,
  };
}
