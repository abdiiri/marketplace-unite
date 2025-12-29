import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
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
  ArrowLeft,
  X,
} from "lucide-react";
import { toast } from "sonner";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("recommended");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("Any");
  const [vendorLevels, setVendorLevels] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const activeCategory = searchParams.get("category") || "All";

  const allServices = [
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
      deliveryDays: 14,
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
      deliveryDays: 5,
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
      deliveryDays: 7,
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
      deliveryDays: 10,
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
      deliveryDays: 3,
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
      deliveryDays: 7,
      category: "Design",
    },
    {
      id: 7,
      title: "Professional Blog Writing & Content Creation",
      vendor: {
        name: "Emily Rose",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        level: "Pro",
        verified: true,
        location: "Austin, US",
      },
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop",
      price: { from: 50 },
      rating: 4.8,
      reviews: 312,
      deliveryTime: "2 days",
      deliveryDays: 2,
      category: "Writing",
    },
    {
      id: 8,
      title: "4K Video Production & Filming",
      vendor: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        level: "Top Rated",
        verified: true,
        location: "Miami, US",
      },
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&h=300&fit=crop",
      price: { from: 599 },
      rating: 4.9,
      reviews: 178,
      deliveryTime: "21 days",
      deliveryDays: 21,
      category: "Video",
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

  const deliveryOptions = ["24 hours", "3 days", "7 days", "14 days", "Any"];

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let result = [...allServices];

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((s) => s.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.vendor.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceMin) {
      result = result.filter((s) => s.price.from >= parseInt(priceMin));
    }
    if (priceMax) {
      result = result.filter((s) => s.price.from <= parseInt(priceMax));
    }

    // Filter by delivery time
    if (deliveryFilter !== "Any") {
      const days = parseInt(deliveryFilter);
      result = result.filter((s) => s.deliveryDays <= days);
    }

    // Filter by vendor level
    if (vendorLevels.length > 0) {
      result = result.filter((s) => vendorLevels.includes(s.vendor.level));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result = result.reverse();
        break;
      case "rating":
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result = result.sort((a, b) => a.price.from - b.price.from);
        break;
      case "price-high":
        result = result.sort((a, b) => b.price.from - a.price.from);
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, searchQuery, priceMin, priceMax, deliveryFilter, vendorLevels, sortBy]);

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set("q", searchQuery);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  const handleVendorLevelToggle = (level: string) => {
    setVendorLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleFavorite = (e: React.MouseEvent, serviceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    toast.success(
      favorites.includes(serviceId) ? "Removed from favorites" : "Added to favorites"
    );
  };

  const clearFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setDeliveryFilter("Any");
    setVendorLevels([]);
    setSearchQuery("");
    searchParams.delete("q");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <>
      <Helmet>
        <title>
          {activeCategory !== "All"
            ? `${activeCategory} Services - MarketFlow`
            : "Explore Services - MarketFlow"}
        </title>
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
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                {activeCategory !== "All" ? `${activeCategory} Services` : "Explore Services"}
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
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                {/* Category Pills - Desktop */}
                <div className="hidden lg:flex items-center gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "default" : "secondary"}
                      size="sm"
                      onClick={() => handleCategoryChange(cat)}
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
                  <Select value={sortBy} onValueChange={setSortBy}>
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
                    variant={activeCategory === cat ? "default" : "secondary"}
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Mobile Filters Panel */}
              {showFilters && (
                <div className="lg:hidden mt-4 p-4 bg-card rounded-xl border border-border animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Price Range</h4>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="flex-1"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          className="flex-1"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Delivery Time</h4>
                      <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryOptions.map((opt) => (
                            <SelectItem key={opt} value={opt === "Any" ? "Any" : opt.split(" ")[0]}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="w-full" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
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
                      <Input
                        type="number"
                        placeholder="Min"
                        className="flex-1"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        className="flex-1"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Delivery Time</h3>
                    <div className="space-y-2">
                      {deliveryOptions.map((time) => (
                        <label key={time} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            className="accent-primary"
                            checked={
                              time === "Any"
                                ? deliveryFilter === "Any"
                                : deliveryFilter === time.split(" ")[0]
                            }
                            onChange={() =>
                              setDeliveryFilter(time === "Any" ? "Any" : time.split(" ")[0])
                            }
                          />
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
                          <input
                            type="checkbox"
                            className="accent-primary"
                            checked={vendorLevels.includes(level)}
                            onChange={() => handleVendorLevelToggle(level)}
                          />
                          <span className="text-sm">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </aside>

              {/* Services Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredServices.length}</span>{" "}
                    services found
                  </p>
                </div>

                {filteredServices.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg mb-4">No services found matching your criteria</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => (
                      <Link
                        key={service.id}
                        to={`/service/${service.id}`}
                        className="group glass-card-hover rounded-2xl overflow-hidden opacity-0 animate-slide-up"
                        style={{
                          animationDelay: `${index * 0.05}s`,
                          animationFillMode: "forwards",
                        }}
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={(e) => handleFavorite(e, service.id)}
                            className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 ${
                              favorites.includes(service.id)
                                ? "bg-accent text-accent-foreground"
                                : "bg-card/80 opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                favorites.includes(service.id) ? "fill-current" : ""
                              }`}
                            />
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
                      </Link>
                    ))}
                  </div>
                )}

                {/* Load More */}
                {filteredServices.length > 0 && (
                  <div className="mt-12 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => toast.info("More services will be loaded from the database")}
                    >
                      Load More Services
                    </Button>
                  </div>
                )}
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
