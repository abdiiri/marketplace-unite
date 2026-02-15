import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { logAdminAction } from "@/lib/activityLog";

export function TicketManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch profiles separately for ticket owners
  const userIds = [...new Set(tickets?.map((t: any) => t.user_id) || [])];
  const { data: profiles } = useQuery({
    queryKey: ["ticket-profiles", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: userIds.length > 0,
  });

  const getProfile = (userId: string) => {
    return profiles?.find((p: any) => p.id === userId);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Ticket marked as ${status}`);
      logAdminAction("status_change", "support_ticket", id, `Changed ticket status to ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update ticket");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this support ticket?")) return;
    try {
      const { error } = await supabase
        .from("support_tickets")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Ticket deleted");
      logAdminAction("delete", "support_ticket", id, "Deleted a support ticket");
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete ticket");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="warning" className="gap-1"><AlertCircle className="h-3 w-3" />Open</Badge>;
      case "in_progress":
        return <Badge variant="accent" className="gap-1"><Clock className="h-3 w-3" />In Progress</Badge>;
      case "resolved":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filtered = (tickets || []).filter((t: any) => {
    const q = searchQuery.toLowerCase();
    const profile = getProfile(t.user_id);
    return (
      t.subject?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      profile?.full_name?.toLowerCase().includes(q) ||
      profile?.email?.toLowerCase().includes(q)
    );
  });

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
          placeholder="Search tickets..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No support tickets found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket: any) => {
            const profile = getProfile(ticket.user_id);
            return (
              <div
                key={ticket.id}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium">{ticket.subject}</p>
                      {getStatusBadge(ticket.status)}
                      <Badge variant="secondary">{ticket.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{ticket.message}</p>
                    <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                      <span>From: <span className="text-foreground">{profile?.full_name || profile?.email || "Unknown"}</span></span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select
                      value={ticket.status}
                      onValueChange={(value) => updateStatus(ticket.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
