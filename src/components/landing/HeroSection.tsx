import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80"
      >
        <source
          src="https://videos.pexels.com/video-files/2526380/2526380-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/55" />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <ScrollReveal delay={100}>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary/20 text-primary-foreground border border-primary/30">
            B2B Agricultural Marketplace
          </span>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] tracking-tight text-balance mb-6">
            Connecting Farmers to
            Global Importers
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
            Pomegrid bridges the gap between agricultural producers and international buyers.
            List your produce, discover suppliers, and grow your trade — all in one platform.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={550}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="xl" className="gap-2">
              <Link href="/register">
                Start Trading Today <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
              <Link href="/register">
                Book a Demo
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={700}>
          <div className="mt-16 flex items-center justify-center gap-8 text-primary-foreground/60 text-sm">
            <span>Trusted by leaders in</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-primary-foreground/50 font-display font-semibold text-lg">
            {["AgriConnect", "FarmLink", "TradeHarvest", "GreenExport", "CropFlow"].map((name) => (
              <span key={name} className="hover:text-primary-foreground/70 transition-colors">{name}</span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
