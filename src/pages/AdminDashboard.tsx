import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Settings,
  Bell,
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "24,589", change: "+1,234", icon: Users },
    { title: "Active Vendors", value: "2,845", change: "+156", icon: Package },
    { title: "Monthly Revenue", value: "$458K", change: "+22%", icon: DollarSign },
    { title: "Pending Verifications", value: "47", change: "-12", icon: Clock },
  ];

  const recentUsers = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "vendor", status: "pending", joined: "2 hours ago" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "buyer", status: "active", joined: "5 hours ago" },
    { id: 3, name: "Mike Brown", email: "mike@example.com", role: "vendor", status: "verified", joined: "1 day ago" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "buyer", status: "active", joined: "2 days ago" },
    { id: 5, name: "Alex Wilson", email: "alex@example.com", role: "vendor", status: "suspended", joined: "3 days ago" },
  ];

  const pendingActions = [
    { type: "verification", title: "KYC Verification Request", user: "James Lee", time: "10 min ago" },
    { type: "dispute", title: "Order Dispute #4521", user: "Anna White", time: "1 hour ago" },
    { type: "report", title: "Service Reported for Review", user: "Bob Martin", time: "2 hours ago" },
    { type: "verification", title: "KYC Verification Request", user: "Lisa Chen", time: "3 hours ago" },
  ];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      active: { variant: "success", label: "Active" },
      pending: { variant: "warning", label: "Pending" },
      verified: { variant: "verified", label: "Verified" },
      suspended: { variant: "destructive", label: "Suspended" },
    };
    return <Badge variant={config[status]?.variant || "secondary"}>{config[status]?.label || status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { variant: any }> = {
      vendor: { variant: "accent" },
      buyer: { variant: "secondary" },
      admin: { variant: "default" },
    };
    return <Badge variant={config[role]?.variant || "secondary"}>{role}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MarketFlow</title>
        <meta name="description" content="Manage users, vendors, orders, and platform settings from the admin dashboard." />
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
                <Badge variant="default" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              </div>

              <div className="flex-1 max-w-md mx-8 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users, orders, services..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    8
                  </Badge>
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-destructive to-destructive/80" />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
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
                    <ArrowUpRight className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">{stat.change}</span>
                    <span className="text-sm text-muted-foreground">this month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Users */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Users
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="font-semibold text-sm">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{user.name}</p>
                              {getRoleBadge(user.role)}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm text-muted-foreground">{user.joined}</p>
                          </div>
                          {getStatusBadge(user.status)}
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        action.type === "verification" ? "bg-info/10" :
                        action.type === "dispute" ? "bg-warning/10" : "bg-destructive/10"
                      }`}>
                        {action.type === "verification" ? (
                          <UserCheck className="h-4 w-4 text-info" />
                        ) : action.type === "dispute" ? (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        ) : (
                          <Eye className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.user} · {action.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <UserCheck className="h-4 w-4" />
                    Review Verifications
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" />
                    Manage Services
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Reports
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Platform Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
