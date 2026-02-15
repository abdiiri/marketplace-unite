import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  UserPlus,
  Pencil,
  Shield,
  Activity,
} from "lucide-react";

const actionIcons: Record<string, any> = {
  delete: Trash2,
  approve: CheckCircle2,
  reject: XCircle,
  add_role: UserPlus,
  remove_role: Shield,
  update: Pencil,
  status_change: Activity,
};

const actionColors: Record<string, string> = {
  delete: "text-destructive",
  approve: "text-green-500",
  reject: "text-destructive",
  add_role: "text-primary",
  remove_role: "text-orange-500",
  update: "text-blue-500",
  status_change: "text-yellow-500",
};

export function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["admin-activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  const adminIds = [...new Set(logs?.map((l: any) => l.admin_id) || [])];
  const { data: profiles } = useQuery({
    queryKey: ["activity-log-profiles", adminIds],
    queryFn: async () => {
      if (adminIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", adminIds);
      if (error) throw error;
      return data;
    },
    enabled: adminIds.length > 0,
  });

  const getProfile = (id: string) => profiles?.find((p: any) => p.id === id);

  const filtered = (logs || []).filter((l: any) => {
    const q = searchQuery.toLowerCase();
    const profile = getProfile(l.admin_id);
    return (
      l.action?.toLowerCase().includes(q) ||
      l.target_type?.toLowerCase().includes(q) ||
      l.details?.toLowerCase().includes(q) ||
      profile?.full_name?.toLowerCase().includes(q) ||
      profile?.email?.toLowerCase().includes(q)
    );
  });

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search activity logs..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No activity logs yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log: any) => {
            const profile = getProfile(log.admin_id);
            const IconComp = actionIcons[log.action] || Activity;
            const colorClass = actionColors[log.action] || "text-muted-foreground";

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className={`mt-0.5 ${colorClass}`}>
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">
                      {profile?.full_name || profile?.email || "Unknown admin"}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {log.action}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {log.target_type}
                    </Badge>
                  </div>
                  {log.details && (
                    <p className="text-sm text-muted-foreground mt-0.5">{log.details}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(log.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
