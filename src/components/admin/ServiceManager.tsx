import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  status: string | null;
  user_id: string;
  created_at: string;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "draft",
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          profile:profiles(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || "",
      price: service.price?.toString() || "",
      status: service.status || "draft",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const { error } = await supabase
        .from("services")
        .update({
          title: formData.title,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : null,
          status: formData.status,
        })
        .eq("id", editingService.id);

      if (error) throw error;

      toast.success("Service updated successfully!");
      setIsDialogOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      toast.success("Service deleted successfully!");
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const togglePublish = async (service: Service) => {
    const newStatus = service.status === "published" ? "draft" : "published";

    try {
      const { error } = await supabase
        .from("services")
        .update({ status: newStatus })
        .eq("id", service.id);

      if (error) throw error;
      toast.success(`Service ${newStatus}!`);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string | null) => {
    if (status === "published") {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Published
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Draft
      </Badge>
    );
  };

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
          placeholder="Search services..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredServices.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No services found</p>
      ) : (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{service.title}</p>
                    {getStatusBadge(service.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By: {service.profile?.full_name || service.profile?.email || "Unknown"}
                  </p>
                  {service.price && (
                    <p className="text-sm font-semibold text-primary">${service.price}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish(service)}
                  >
                    {service.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
            <Button type="submit" className="w-full">
              Update Service
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
