import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Bell,
  Settings,
  MessageSquare,
  Package,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";
import omtiiLogo from "@/assets/omtii-logo.png";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  status: string | null;
  created_at: string;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const stats = [
    {
      title: "Total Services",
      value: services.length.toString(),
      change: "+0",
      trend: "up",
      icon: Package,
    },
    {
      title: "Published",
      value: services.filter((s) => s.status === "published").length.toString(),
      change: "+0",
      trend: "up",
      icon: CheckCircle2,
    },
    {
      title: "Drafts",
      value: services.filter((s) => s.status === "draft").length.toString(),
      change: "0",
      trend: "up",
      icon: Clock,
    },
    {
      title: "Avg. Rating",
      value: "N/A",
      change: "+0",
      trend: "up",
      icon: Star,
    },
  ];

  const fetchServices = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", user.id)
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
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from("services")
          .update({
            title,
            description,
            price: price ? parseFloat(price) : null,
          })
          .eq("id", editingService.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Service updated successfully!");
      } else {
        // Create new service
        const { error } = await supabase.from("services").insert({
          user_id: user.id,
          title,
          description,
          price: price ? parseFloat(price) : null,
          status: "draft",
        });

        if (error) throw error;
        toast.success("Service created successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to save service");
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Service deleted successfully!");
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const togglePublish = async (service: Service) => {
    if (!user) return;

    const newStatus = service.status === "published" ? "draft" : "published";

    try {
      const { error } = await supabase
        .from("services")
        .update({ status: newStatus })
        .eq("id", service.id)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success(`Service ${newStatus === "published" ? "published" : "unpublished"}!`);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setEditingService(null);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description || "");
    setPrice(service.price?.toString() || "");
    setIsDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

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

  return (
    <>
      <Helmet>
        <title>Vendor Dashboard - OMTII</title>
        <meta name="description" content="Manage your services, orders, and earnings from your vendor dashboard." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Link to="/" className="flex items-center gap-2">
                  <img src={omtiiLogo} alt="OMTII" className="h-9 w-auto" />
                </Link>
                <Badge variant="verified">Vendor</Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {profile?.full_name?.charAt(0) || "V"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">
                Welcome back, {profile?.full_name || "Vendor"}!
              </h1>
              <p className="text-muted-foreground">Manage your services and grow your business.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? "Edit Service" : "Create New Service"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Website Development"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your service..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingService ? "Update Service" : "Create Service"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.title}
                className="glass-card-hover opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="font-display text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Services */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No services yet. Create your first one!</p>
                      <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium truncate">{service.title}</p>
                              {getStatusBadge(service.status)}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {service.description || "No description"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {service.price && (
                              <span className="font-display font-bold">${service.price}</span>
                            )}
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
                              onClick={() => openEditDialog(service)}
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Performance */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Create New Service
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    View Messages
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/profile")}
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Response Rate</span>
                      <span className="text-sm font-medium">N/A</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-success w-0" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Order Completion</span>
                      <span className="text-sm font-medium">N/A</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-primary w-0" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">On-time Delivery</span>
                      <span className="text-sm font-medium">N/A</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-accent w-0" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;