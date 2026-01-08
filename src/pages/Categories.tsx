import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const getIcon = (iconName: string | null) => {
    if (!iconName) return <LucideIcons.Folder className="h-8 w-8" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-8 w-8" /> : <LucideIcons.Folder className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our wide range of service categories and find exactly what you need
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-8 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/explore?category=${category.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                      {getIcon(category.icon)}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {category.description || "Explore services in this category"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <LucideIcons.FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground">
              Categories will appear here once they are created.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
