import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageSquare,
  Package,
} from "lucide-react";
import { logAdminAction } from "@/lib/activityLog";

interface ServiceRequest {
  id: string;
  service_id: string;
  client_id: string;
  vendor_id: string;
  message: string | null;
  status: string;
  created_at: string;
  service?: { title: string };
  client?: { full_name: string | null; email: string | null };
  vendor?: { full_name: string | null; email: string | null };
}

export function RequestManager() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          service:services(title),
          client:profiles!service_requests_client_id_fkey(full_name, email),
          vendor:profiles!service_requests_vendor_id_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data as any) || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Request ${status}`);
      logAdminAction("status_change", "service_request", id, `Changed request status to ${status}`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service request?")) return;
    try {
      const { error } = await supabase
        .from("service_requests")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Request deleted");
      logAdminAction("delete", "service_request", id, "Deleted a service request");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
    }
  };

  const filtered = requests.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.service?.title?.toLowerCase().includes(q) ||
      r.client?.full_name?.toLowerCase().includes(q) ||
      r.client?.email?.toLowerCase().includes(q) ||
      r.vendor?.full_name?.toLowerCase().includes(q) ||
      r.vendor?.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
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
          placeholder="Search by service, client, or vendor..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No service requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <div
              key={request.id}
              className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-medium">{request.service?.title || "Unknown Service"}</p>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>Client: <span className="text-foreground">{request.client?.full_name || request.client?.email || "Unknown"}</span></span>
                    <span>Vendor: <span className="text-foreground">{request.vendor?.full_name || request.vendor?.email || "Unknown"}</span></span>
                  </div>
                  {request.message && (
                    <p className="text-sm text-muted-foreground mt-2 bg-background/50 p-2 rounded line-clamp-2">
                      "{request.message}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => updateStatus(request.id, "accepted")}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => updateStatus(request.id, "rejected")}
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(request.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
