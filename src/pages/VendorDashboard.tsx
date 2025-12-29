import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

const VendorDashboard = () => {
  const stats = [
    {
      title: "Total Earnings",
      value: "$12,459",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Orders",
      value: "23",
      change: "+3",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Total Clients",
      value: "156",
      change: "+8",
      trend: "up",
      icon: Users,
    },
    {
      title: "Avg. Rating",
      value: "4.9",
      change: "+0.1",
      trend: "up",
      icon: Star,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      client: "John Smith",
      service: "Website Development",
      amount: 1500,
      status: "in_progress",
      dueDate: "Dec 28, 2024",
    },
    {
      id: "ORD-002",
      client: "Sarah Johnson",
      service: "Logo Design",
      amount: 350,
      status: "pending",
      dueDate: "Dec 30, 2024",
    },
    {
      id: "ORD-003",
      client: "Mike Brown",
      service: "SEO Optimization",
      amount: 800,
      status: "completed",
      dueDate: "Dec 25, 2024",
    },
    {
      id: "ORD-004",
      client: "Emily Davis",
      service: "Video Editing",
      amount: 450,
      status: "revision",
      dueDate: "Dec 29, 2024",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      in_progress: { variant: "info", label: "In Progress", icon: Clock },
      pending: { variant: "warning", label: "Pending", icon: AlertCircle },
      completed: { variant: "success", label: "Completed", icon: CheckCircle2 },
      revision: { variant: "accent", label: "Revision", icon: XCircle },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Vendor Dashboard - MarketFlow</title>
        <meta name="description" content="Manage your services, orders, and earnings from your vendor dashboard." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow">
                    <span className="text-primary-foreground font-display font-bold text-lg">M</span>
                  </div>
                  <span className="font-display font-bold text-xl hidden sm:block">MarketFlow</span>
                </Link>
                <Badge variant="verified">Vendor</Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-accent rounded-full" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent" />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">Here's what's happening with your business today.</p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
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
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="font-semibold text-sm">{order.client.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{order.service}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.client} · Due {order.dueDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-display font-bold">${order.amount}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <Button variant="secondary" className="w-full justify-start gap-2">
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
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <DollarSign className="h-4 w-4" />
                    Request Payout
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
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-success w-[98%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Order Completion</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-primary w-[95%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">On-time Delivery</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-accent w-[92%]" />
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
