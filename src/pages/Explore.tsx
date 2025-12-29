import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  Clock,
  MapPin,
  X,
} from "lucide-react";

const Explore = () => {
  const [showFilters, setShowFilters] = useState(false);

  const services = [
    {
      id: 1,
      title: "Professional Website Development with React & Node.js",
      vendor: {
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        level: "Top Rated",
        verified: true,
        location: "San Francisco, US",
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
      title: "Complete Brand Identity & Logo Design Package",
      vendor: {
        name: "Sarah Miller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        level: "Pro",
        verified: true,
        location: "London, UK",
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
      title: "Cinematic Video Editing & Post Production",
      vendor: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        level: "Rising Star",
        verified: false,
        location: "Los Angeles, US",
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
        location: "Toronto, CA",
      },
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=500&h=300&fit=crop",
      price: { from: 299 },
      rating: 4.9,
      reviews: 567,
      deliveryTime: "10 days",
      category: "Marketing",
    },
    {
      id: 5,
      title: "Professional Voice Over for Commercials",
      vendor: {
        name: "James Brown",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        level: "Pro",
        verified: true,
        location: "New York, US",
      },
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&h=300&fit=crop",
      price: { from: 75 },
      rating: 4.7,
      reviews: 234,
      deliveryTime: "3 days",
      category: "Audio",
    },
    {
      id: 6,
      title: "Mobile App UI/UX Design",
      vendor: {
        name: "Lisa Park",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        level: "Top Rated",
        verified: true,
        location: "Seoul, KR",
      },
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop",
      price: { from: 350 },
      rating: 5.0,
      reviews: 412,
      deliveryTime: "7 days",
      category: "Design",
    },
  ];

  const categories = [
    "All",
    "Development",
    "Design",
    "Marketing",
    "Video",
    "Writing",
    "Audio",
  ];

  return (
    <>
      <Helmet>
        <title>Explore Services - MarketFlow</title>
        <meta
          name="description"
          content="Browse thousands of professional services from verified vendors. Find the perfect match for your project needs."
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card/50">
            <div className="container mx-auto px-4 py-8">
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                Explore Services
              </h1>
              <p className="text-muted-foreground">
                Discover talented professionals ready to bring your ideas to life
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-10"
                  />
                </div>

                {/* Category Pills - Desktop */}
                <div className="hidden lg:flex items-center gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={cat === "All" ? "default" : "secondary"}
                      size="sm"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Filter & Sort */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile Category Pills */}
              <div className="flex lg:hidden overflow-x-auto gap-2 mt-4 pb-2 -mx-4 px-4">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={cat === "All" ? "default" : "secondary"}
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-40 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Min" className="flex-1" />
                      <Input type="number" placeholder="Max" className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Delivery Time</h3>
                    <div className="space-y-2">
                      {["24 hours", "3 days", "7 days", "14 days", "Any"].map((time) => (
                        <label key={time} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="delivery" className="accent-primary" />
                          <span className="text-sm">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Vendor Level</h3>
                    <div className="space-y-2">
                      {["Top Rated", "Pro", "Rising Star", "New"].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-primary" />
                          <span className="text-sm">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </aside>

              {/* Services Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">1,234</span> services found
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <a
                      key={service.id}
                      href={`/service/${service.id}`}
                      className="group glass-card-hover rounded-2xl overflow-hidden opacity-0 animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
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
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium truncate">
                                {service.vendor.name}
                              </span>
                              {service.vendor.verified && (
                                <Badge variant="verified" className="text-[10px] px-1.5 py-0">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {service.vendor.location}
                            </div>
                          </div>
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
                    </a>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg">
                    Load More Services
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Explore;
