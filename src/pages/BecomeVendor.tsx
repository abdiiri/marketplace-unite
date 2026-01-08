import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, TrendingUp, Users, Zap, Shield } from "lucide-react";

const BecomeVendor = () => {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Grow Your Business",
      description: "Reach thousands of potential clients actively looking for your services.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Build Your Network",
      description: "Connect with clients and other professionals in your industry.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Easy Management",
      description: "Powerful dashboard to manage services, orders, and communications.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Get paid safely and on time with our secure payment system.",
    },
  ];

  const steps = [
    { number: 1, title: "Create Account", description: "Sign up with your email and basic information." },
    { number: 2, title: "Complete Profile", description: "Add your skills, portfolio, and service details." },
    { number: 3, title: "List Services", description: "Create compelling service listings with pricing." },
    { number: 4, title: "Start Earning", description: "Receive requests and grow your client base." },
  ];

  const handleGetStarted = () => {
    if (user) {
      if (isVendor) {
        navigate("/vendor/dashboard");
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Join 2M+ professionals worldwide</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Turn Your Skills Into <span className="text-primary">Income</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join OMTII as a vendor and start offering your services to clients around the world. 
              Set your own prices, work on your terms.
            </p>
            <Button variant="hero" size="lg" onClick={handleGetStarted} className="text-lg px-8">
              {user ? (isVendor ? "Go to Dashboard" : "Complete Your Profile") : "Start Selling Today"}
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Become a Vendor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 container mx-auto px-4 text-center">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
                Join thousands of successful vendors already earning on OMTII.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="text-lg"
                >
                  {user ? "Go to Dashboard" : "Create Free Account"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate("/explore")}
                  className="text-lg border-primary-foreground/30 hover:bg-primary-foreground/10"
                >
                  Explore Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeVendor;
