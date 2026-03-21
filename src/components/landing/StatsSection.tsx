import { ScrollReveal } from "@/components/ScrollReveal";

const stats = [
  { value: "2,400+", label: "Registered Farmers" },
  { value: "890+", label: "Active Importers" },
  { value: "35", label: "Countries Reached" },
  { value: "$12.8M", label: "Trade Facilitated" },
];

export const StatsSection = () => (
  <section className="py-20 bg-primary">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100}>
            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">{s.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/70">{s.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);
