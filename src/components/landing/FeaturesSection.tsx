import { ScrollReveal } from "@/components/ScrollReveal";
import { Users, Search, ShieldCheck, BarChart3, Globe, Handshake } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Farmer & Importer Profiles",
    desc: "Register as a farmer or importer with verified profiles. Showcase your products or sourcing needs to the right audience.",
  },
  {
    icon: Search,
    title: "Smart Matching",
    desc: "Find exactly what you need. Farmers discover importers seeking their crops, and importers find reliable suppliers instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    desc: "Every product listing includes quality grades, certifications, and origin details for transparent trade.",
  },
  {
    icon: BarChart3,
    title: "Trade Analytics",
    desc: "Track your reach, inquiries, and connections through a powerful dashboard with real-time insights.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Connect across borders. Pomegrid supports multi-region trade with localization and logistics insights.",
  },
  {
    icon: Handshake,
    title: "Direct Communication",
    desc: "Message farmers or importers directly. Negotiate terms, share documents, and close deals on-platform.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/40">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Solutions</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-balance">
              Everything You Need to Trade Globally
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              From registration to deal closure, Pomegrid gives farmers and importers the tools to succeed.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <div className="group relative bg-card rounded-xl p-7 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/60">
                <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center mb-5">
                  <f.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
