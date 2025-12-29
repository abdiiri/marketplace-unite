import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Clock, ArrowRight } from "lucide-react";

const FeaturedServices = () => {
  const services = [
    {
      id: 1,
      title: "Professional Website Development",
      vendor: {
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        level: "Top Rated",
        verified: true,
      },
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
      price: { from: 499 },
      rating: 4.9,
      reviews: 328,
      deliveryTime: "14 days",
      category: "Development",
    },
    {
      id: 2,
      title: "Brand Identity & Logo Design",
      vendor: {
        name: "Sarah Miller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        level: "Pro",
        verified: true,
      },
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=300&fit=crop",
      price: { from: 199 },
      rating: 5.0,
      reviews: 456,
      deliveryTime: "5 days",
      category: "Design",
    },
    {
      id: 3,
      title: "Cinematic Video Editing",
      vendor: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        level: "Rising Star",
        verified: false,
      },
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=300&fit=crop",
      price: { from: 149 },
      rating: 4.8,
      reviews: 189,
      deliveryTime: "7 days",
      category: "Video",
    },
    {
      id: 4,
      title: "SEO & Digital Marketing Strategy",
      vendor: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        level: "Top Rated",
        verified: true,
      },
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=500&h=300&fit=crop",
      price: { from: 299 },
      rating: 4.9,
      reviews: 567,
      deliveryTime: "10 days",
      category: "Marketing",
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="accent" className="mb-3">Featured</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Popular Services
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Discover top-rated services from verified professionals trusted by thousands.
            </p>
          </div>
          <Link to="/explore">
            <Button variant="ghost" className="group">
              Explore All
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="group glass-card-hover rounded-2xl overflow-hidden opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
                  <Heart className="h-4 w-4" />
                </button>
                <Badge variant="glass" className="absolute top-3 left-3">
                  {service.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Vendor */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={service.vendor.avatar}
                    alt={service.vendor.name}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-background"
                  />
                  <span className="text-sm font-medium">{service.vendor.name}</span>
                  {service.vendor.verified && (
                    <Badge variant="verified" className="text-[10px] px-1.5 py-0">
                      ✓
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-medium text-sm">{service.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({service.reviews})
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {service.deliveryTime}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">From</span>
                    <p className="font-display font-bold text-lg">
                      ${service.price.from}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
