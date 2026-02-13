import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Send,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Package,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Get Started' on the homepage, fill in your details, and verify your email. You can sign up as a buyer or vendor.",
      },
      {
        q: "How do I become a vendor?",
        a: "Visit the 'Become a Vendor' page, create an account with a vendor profile, then list your services from your Vendor Dashboard.",
      },
      {
        q: "Is it free to sign up?",
        a: "Yes! Creating an account on Abdiiri is completely free for both buyers and vendors.",
      },
    ],
  },
  {
    category: "For Buyers",
    questions: [
      {
        q: "How do I request a service?",
        a: "Browse the Explore page, find a service you need, and click 'Request Service'. You can include a message describing your needs.",
      },
      {
        q: "How do I communicate with a vendor?",
        a: "Once you've sent a service request, you can message the vendor directly from your Client Dashboard.",
      },
      {
        q: "What if I'm not satisfied with a service?",
        a: "Contact us through the support ticket form below and our team will help resolve any issues.",
      },
    ],
  },
  {
    category: "For Vendors",
    questions: [
      {
        q: "How do I list a service?",
        a: "Go to your Vendor Dashboard and click 'Add New Service'. Fill in the details, set your price, and submit for approval.",
      },
      {
        q: "Why is my service pending approval?",
        a: "All new services are reviewed by our admin team to ensure quality and safety. This usually takes 24-48 hours.",
      },
      {
        q: "How do I accept or reject service requests?",
        a: "Go to your Vendor Dashboard, find the request in the 'Service Requests' section, and click Accept or Reject.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I update my profile?",
        a: "Go to Profile Settings from the dropdown menu in the navbar. You can update your name, bio, phone, and avatar.",
      },
      {
        q: "How do I reset my password?",
        a: "On the login page, click 'Forgot Password' to receive a reset link via email.",
      },
    ],
  },
];

const HelpCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  // Fetch user's tickets
  const { data: tickets, refetch: refetchTickets } = useQuery({
    queryKey: ["support-tickets", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit a support ticket");
      navigate("/login");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        category,
      });
      if (error) throw error;
      toast.success("Support ticket submitted! We'll get back to you soon.");
      setSubject("");
      setMessage("");
      setCategory("general");
      refetchTickets();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="warning" className="gap-1"><AlertCircle className="h-3 w-3" />Open</Badge>;
      case "in_progress":
        return <Badge variant="accent" className="gap-1"><Clock className="h-3 w-3" />In Progress</Badge>;
      case "resolved":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    general: <HelpCircle className="h-5 w-5" />,
    account: <Users className="h-5 w-5" />,
    billing: <CreditCard className="h-5 w-5" />,
    services: <Package className="h-5 w-5" />,
    safety: <ShieldCheck className="h-5 w-5" />,
  };

  return (
    <>
      <Helmet>
        <title>Help Center - Abdiiri</title>
        <meta name="description" content="Get help with Abdiiri. Browse FAQs or contact our support team." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          {/* Hero */}
          <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">We're here to help</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions or reach out to our support team.
              </p>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* FAQs - Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  {faqs.map((section) => (
                    <div key={section.category} className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-primary">{section.category}</h3>
                      <Accordion type="single" collapsible className="space-y-2">
                        {section.questions.map((faq, i) => (
                          <AccordionItem
                            key={i}
                            value={`${section.category}-${i}`}
                            className="border border-border rounded-xl px-4 data-[state=open]:bg-secondary/30"
                          >
                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>

                {/* My Tickets */}
                {user && tickets && tickets.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        My Support Tickets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {tickets.map((ticket: any) => (
                          <div
                            key={ticket.id}
                            className="flex items-start justify-between gap-4 p-4 rounded-xl bg-secondary/50"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="font-medium">{ticket.subject}</p>
                                {getStatusBadge(ticket.status)}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(ticket.created_at).toLocaleDateString()} • {ticket.category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Contact Form - Right Column */}
              <div>
                <Card className="glass-card sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Contact Support
                    </CardTitle>
                    <CardDescription>
                      Can't find your answer? Submit a ticket and we'll respond within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="account">Account Issue</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="services">Services & Orders</SelectItem>
                            <SelectItem value="safety">Trust & Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe your issue in detail..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full gap-2" disabled={submitting}>
                        <Send className="h-4 w-4" />
                        {submitting ? "Submitting..." : "Submit Ticket"}
                      </Button>

                      {!user && (
                        <p className="text-xs text-muted-foreground text-center">
                          You need to{" "}
                          <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-primary underline"
                          >
                            sign in
                          </button>{" "}
                          to submit a ticket.
                        </p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
