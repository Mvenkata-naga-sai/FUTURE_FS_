import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  useRevealOnScroll();
  const { toast } = useToast();

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Received",
      description: "We will contact you shortly to confirm your reservation.",
    });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-serif text-2xl tracking-widest uppercase font-semibold text-primary">
            Agni &amp; Maati
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium text-muted-foreground">
            <a href="#story" className="hover:text-primary transition-colors">Story</a>
            <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
            <a href="#atmosphere" className="hover:text-primary transition-colors">Atmosphere</a>
            <a href="#visit" className="hover:text-primary transition-colors">Visit</a>
            <a href="#reservations" className="text-primary hover:text-white transition-colors">Reservations</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Tandoor flames"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 cinematic-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-primary uppercase tracking-[0.3em] text-sm mb-6 reveal-on-scroll">New Delhi, India</span>
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight reveal-on-scroll delay-100">
            Spice, Fire &<br />
            <span className="italic font-light">Ancient Craft</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-light reveal-on-scroll delay-200">
            An intimate dining room where centuries-old Indian recipes meet a live tandoor.
            Slow-cooked, wood-fired, and rooted in the soul of the subcontinent.
          </p>
          <div className="reveal-on-scroll delay-300">
            <Button size="lg" className="h-14 px-8 text-lg font-serif italic tracking-wide hover:scale-105 transition-transform" asChild>
              <a href="#reservations">Reserve a Table</a>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce">
          <a href="#story" aria-label="Scroll down">
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent"></div>
          </a>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-32 px-6 bg-background">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">
              A Return to<br /><span className="text-primary italic">The Tandoor's Truth</span>
            </h2>
            <div className="w-12 h-[1px] bg-primary mb-8"></div>
            <p className="text-muted-foreground leading-relaxed mb-6 font-light">
              Agni &amp; Maati — Fire and Earth. Our name says everything about how we cook. We believe the most honest flavors in Indian cuisine come from patience, whole spices, and an open flame. Our tandoor burns from noon till close, and every dish carries that truth.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light">
              Our dining room is designed to feel like a dastarkhan — a cloth spread with abundance, warmth, and care. We honour the dhaba spirit and the royal kitchen in equal measure. Come in and lose track of time.
            </p>
          </div>
          <div className="relative h-[600px] reveal-on-scroll delay-200">
            <img
              src="/images/interior.png"
              alt="Intimate dining room with warm lighting"
              className="absolute inset-0 w-full h-full object-cover rounded-sm grayscale-[20%] sepia-[10%]"
            />
            <div className="absolute inset-0 border border-primary/20 m-4 rounded-sm pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6 bg-[#161311]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 reveal-on-scroll">
            <span className="text-primary uppercase tracking-[0.3em] text-sm mb-4 block">Rasoi</span>
            <h2 className="text-4xl md:text-5xl font-serif">Tonight's Menu</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mt-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {/* Starters */}
            <div className="reveal-on-scroll delay-100">
              <h3 className="text-2xl font-serif text-primary mb-8 italic border-b border-white/5 pb-4">Shuruwaat</h3>
              <div className="space-y-8">
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Tandoori Malai Broccoli</h4>
                    <span className="text-muted-foreground">₹450</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Florets marinated in hung curd and cream, kissed by the tandoor, house mint chutney</p>
                </div>
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Dahi Ke Kebab</h4>
                    <span className="text-muted-foreground">₹380</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Hung curd and paneer patties, pan-seared golden, tamarind glaze, pomegranate pearls</p>
                </div>
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Bharwan Mirch</h4>
                    <span className="text-muted-foreground">₹420</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Banana peppers stuffed with spiced cottage cheese and raisins, finished in the tandoor</p>
                </div>
              </div>
            </div>

            {/* Mains */}
            <div className="reveal-on-scroll delay-200">
              <h3 className="text-2xl font-serif text-primary mb-8 italic border-b border-white/5 pb-4">Mukhya Bhojan</h3>
              <div className="space-y-8">
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Raan-e-Agni</h4>
                    <span className="text-muted-foreground">₹1,850</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Slow-cooked whole leg of lamb, 12-hour dum preparation, saffron jus, laccha paratha</p>
                </div>
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Laal Maas</h4>
                    <span className="text-muted-foreground">₹980</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Rajasthani mutton curry, mathania chilies, wood-fired slow-braised, bajra roti</p>
                </div>
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Murgh Makhani</h4>
                    <span className="text-muted-foreground">₹850</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Free-range chicken, 48-hour marinade, charcoal tandoor, house-churned butter tomato gravy</p>
                </div>
              </div>
            </div>

            {/* Desserts */}
            <div className="reveal-on-scroll delay-300">
              <h3 className="text-2xl font-serif text-primary mb-8 italic border-b border-white/5 pb-4">Meetha</h3>
              <div className="space-y-8">
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Gulab Jamun Brûlée</h4>
                    <span className="text-muted-foreground">₹320</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Warm khoya dumplings in rose syrup, set cream brûlée crust, saffron foam</p>
                </div>
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Aam Shrikhand</h4>
                    <span className="text-muted-foreground">₹280</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Hung curd sweetened with raw Alphonso mango, cardamom tuile, crushed pistachio</p>
                </div>
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors">Gajar Ka Halwa</h4>
                    <span className="text-muted-foreground">₹300</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">Slow-cooked carrot pudding, khoya, rose water, served warm with vanilla kulfi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Atmosphere Gallery */}
      <section id="atmosphere" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative h-[400px] md:h-[600px] group overflow-hidden reveal-on-scroll">
            <img
              src="/images/starter.png"
              alt="Tandoori starters"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="relative h-[400px] md:h-[600px] group overflow-hidden reveal-on-scroll delay-100 md:translate-y-12">
            <img
              src="/images/interior.png"
              alt="Dining room"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[30%]"
            />
          </div>
          <div className="relative h-[400px] md:h-[600px] group overflow-hidden reveal-on-scroll delay-200">
            <img
              src="/images/signature-dish.png"
              alt="Signature dish"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Info & Reservations */}
      <section id="visit" className="py-32 px-6 bg-[#161311] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
          <div className="reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-serif mb-12">Find Us</h2>

            <div className="space-y-10">
              <div>
                <h3 className="text-primary uppercase tracking-[0.2em] text-sm mb-4">Location</h3>
                <p className="text-muted-foreground font-light text-lg">
                  14, Janpath Lane<br />
                  Connaught Place, New Delhi — 110001
                </p>
                <a href="#" className="text-sm border-b border-primary text-primary pb-1 inline-block mt-4 hover:text-white hover:border-white transition-colors">Get Directions</a>
              </div>

              <div>
                <h3 className="text-primary uppercase tracking-[0.2em] text-sm mb-4">Hours</h3>
                <ul className="text-muted-foreground font-light text-lg space-y-2">
                  <li className="flex justify-between max-w-[260px]"><span>Tuesday – Sunday</span><span>6pm – 11pm</span></li>
                  <li className="flex justify-between max-w-[260px] text-white/40"><span>Monday</span><span>Closed</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-primary uppercase tracking-[0.2em] text-sm mb-4">Contact</h3>
                <p className="text-muted-foreground font-light text-lg">
                  +91 98765 43210<br />
                  namaste@agnimaati.in
                </p>
              </div>
            </div>
          </div>

          <div id="reservations" className="bg-background p-10 border border-white/5 reveal-on-scroll delay-200">
            <h3 className="text-3xl font-serif mb-8 text-center italic">Make a Reservation</h3>
            <form onSubmit={handleReservation} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-muted-foreground">Date</Label>
                <Select required>
                  <SelectTrigger className="h-12 bg-[#1A1614] border-white/10 rounded-none focus:ring-primary">
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-muted-foreground">Party Size</Label>
                  <Select required>
                    <SelectTrigger className="h-12 bg-[#1A1614] border-white/10 rounded-none focus:ring-primary">
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5">5 Guests</SelectItem>
                      <SelectItem value="6+">6+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-muted-foreground">Time</Label>
                  <Select required>
                    <SelectTrigger className="h-12 bg-[#1A1614] border-white/10 rounded-none focus:ring-primary">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:30">7:30 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                      <SelectItem value="21:00">9:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Name</Label>
                <Input id="name" required className="h-12 bg-[#1A1614] border-white/10 rounded-none focus-visible:ring-primary" placeholder="Priya Sharma" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input id="email" type="email" required className="h-12 bg-[#1A1614] border-white/10 rounded-none focus-visible:ring-primary" placeholder="priya@example.com" />
              </div>

              <Button type="submit" className="w-full h-14 mt-4 text-lg font-serif italic tracking-wide rounded-none">
                Request Table
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 px-6 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-serif text-2xl tracking-widest uppercase font-semibold text-primary mb-8">
            Agni &amp; Maati
          </h2>
          <div className="flex gap-8 mb-12">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors uppercase tracking-widest text-xs">Instagram</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors uppercase tracking-widest text-xs">Facebook</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors uppercase tracking-widest text-xs">Press</a>
          </div>
          <p className="text-muted-foreground/50 text-sm font-light">
            © {new Date().getFullYear()} Agni &amp; Maati. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
