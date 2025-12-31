import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  AlertTriangle,
  Clock,
  Eye,
  ArrowLeft,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import omtiiLogo from "@/assets/omtii-logo.png";

type AppRole = "admin" | "vendor" | "buyer" | "super_admin";

interface UserWithRoles {
  id: string;
  full_name: string | null;
  email: string | null;
  account_type: string | null;
  created_at: string;
  roles: AppRole[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, isSuperAdmin, profile } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Users", value: users.length.toString(), change: "+0", icon: Users },
    { title: "Active Vendors", value: users.filter(u => u.roles.includes("vendor")).length.toString(), change: "+0", icon: Package },
    { title: "Monthly Revenue", value: "$0", change: "+0%", icon: DollarSign },
    { title: "Pending Verifications", value: "0", change: "0", icon: Clock },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Map roles to users
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        account_type: p.account_type,
        created_at: p.created_at,
        roles: rolesData
          ?.filter((r) => r.user_id === p.id)
          .map((r) => r.role as AppRole) || [],
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: AppRole) => {
    const config: Record<string, { variant: any }> = {
      super_admin: { variant: "destructive" },
      admin: { variant: "default" },
      vendor: { variant: "accent" },
      buyer: { variant: "secondary" },
    };
    return (
      <Badge key={role} variant={config[role]?.variant || "secondary"} className="gap-1">
        {role === "super_admin" && <Shield className="h-3 w-3" />}
        {role}
      </Badge>
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - OMTII</title>
        <meta name="description" content="Manage users, vendors, orders, and platform settings from the admin dashboard." />
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
                <Badge variant="default" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </Badge>
              </div>

              <div className="flex-1 max-w-md mx-8 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center text-destructive-foreground font-semibold text-sm">
                  {profile?.full_name?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-1">
              Welcome, {profile?.full_name || "Admin"}!
            </h1>
            <p className="text-muted-foreground">
              {isSuperAdmin 
                ? "You have full access to manage all users, services, and platform settings."
                : "Manage users and platform settings from here."}
            </p>
          </div>

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
            {/* Users List */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    All Users ({filteredUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No users found</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() =>
                              setExpandedUserId(expandedUserId === u.id ? null : u.id)
                            }
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <span className="font-semibold text-sm">
                                  {u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium">{u.full_name || "No name"}</p>
                                  {u.roles.map(getRoleBadge)}
                                </div>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground hidden sm:block">
                                {formatDate(u.created_at)}
                              </span>
                              {isSuperAdmin && (
                                expandedUserId === u.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              )}
                            </div>
                          </div>

                          {/* Role Management (expanded) */}
                          {isSuperAdmin && expandedUserId === u.id && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-sm font-medium mb-2">Manage Roles:</p>
                              <UserRoleManager
                                userId={u.id}
                                currentRoles={u.roles}
                                onRolesUpdated={fetchUsers}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
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

              {isSuperAdmin && (
                <Card className="glass-card border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Shield className="h-5 w-5" />
                      Super Admin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>You have full access to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View and manage all users</li>
                      <li>Assign and remove any role</li>
                      <li>Edit or delete any service</li>
                      <li>Access all platform analytics</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;