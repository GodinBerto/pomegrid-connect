"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";
import { PartnerDetailDialog } from "@/components/discover/PartnerDetailDialog";
import { mockPartners, type TradePartner } from "@/data/partners";
import { useAuth } from "@/context/AuthContext";

const Discover = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "farmer" | "importer">("all");
  const [selectedPartner, setSelectedPartner] = useState<TradePartner | null>(null);

  const filtered = mockPartners.filter(p => {
    const matchesType = filterType === "all" || p.type === filterType;
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.products.some(pr => pr.toLowerCase().includes(search.toLowerCase())) ||
      p.country.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Discover Trade Partners</h1>
          <p className="text-muted-foreground">Browse verified farmers and importers from around the world.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, product, or country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "farmer", "importer"] as const).map(t => (
              <Button
                key={t}
                variant={filterType === t ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(t)}
                className="capitalize"
              >
                {t === "all" ? "All" : t + "s"}
              </Button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPartner(p)}
              className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow duration-200 text-left active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    p.type === "farmer" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-1.5">
                      {p.name}
                      {p.verified && <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">✓</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.company}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  p.type === "farmer" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                }`}>
                  {p.type}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" /> {p.country}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.bio}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.products.slice(0, 3).map(pr => (
                  <span key={pr} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">{pr}</span>
                ))}
                {p.products.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">+{p.products.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">⭐ {p.rating} · {p.totalDeals} deals</span>
                <span className="text-primary font-medium">View details →</span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No partners found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />

      <PartnerDetailDialog
        partner={selectedPartner}
        open={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        isLoggedIn={isLoggedIn}
        onRequireAuth={() => {
          setSelectedPartner(null);
          router.push("/login");
        }}
      />
    </div>
  );
};

export default Discover;
