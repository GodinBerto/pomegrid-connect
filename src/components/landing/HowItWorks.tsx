import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, ListChecks, Handshake, ArrowRight } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Register", desc: "Sign up as a farmer or importer. Fill in your profile, location, and what you grow or need." },
  { icon: ListChecks, title: "List or Search", desc: "Farmers list their produce with pricing and specs. Importers browse and filter listings by crop, region, or quality." },
  { icon: Handshake, title: "Connect & Trade", desc: "Reach out directly, negotiate, and establish trade partnerships — all within Pomegrid." },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="py-24 sm:py-32">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-balance">
            Three Steps to Your Next Trade
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 120} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 relative">
                <s.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={400}>
        <div className="text-center mt-14">
          <Button asChild size="lg" className="gap-2">
            <Link href="/register">
              Create Your Account <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
