"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";
import { PartnerDetailDialog } from "@/components/discover/PartnerDetailDialog";
import { useAuth } from "@/context/AuthContext";
import { fetchPartners, type TradePartner } from "@/lib/api";

const Discover = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "farmer" | "importer">("all");
  const [selectedPartner, setSelectedPartner] = useState<TradePartner | null>(null);

  const partnersQuery = useQuery({
    queryKey: ["public-partners"],
    queryFn: fetchPartners,
  });

  const filtered = (partnersQuery.data ?? []).filter((partner) => {
    const matchesType = filterType === "all" || partner.type === filterType;
    const matchesSearch =
      !search ||
      partner.name.toLowerCase().includes(search.toLowerCase()) ||
      partner.company.toLowerCase().includes(search.toLowerCase()) ||
      partner.products.some((product) =>
        product.toLowerCase().includes(search.toLowerCase()),
      ) ||
      partner.country.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Discover Trade Partners
          </h1>
          <p className="text-muted-foreground">
            Browse verified farmers and importers from around the world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, product, or country..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "farmer", "importer"] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize"
              >
                {type === "all" ? "All" : `${type}s`}
              </Button>
            ))}
          </div>
        </div>

        {partnersQuery.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading trade partners...
          </div>
        ) : partnersQuery.isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
            {partnersQuery.error instanceof Error
              ? partnersQuery.error.message
              : "Unable to load trade partners."}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow duration-200 text-left active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                          partner.type === "farmer"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {partner.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1.5">
                          {partner.name}
                          {partner.verified ? (
                            <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                              ✓
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-muted-foreground">{partner.company}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        partner.type === "farmer"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {partner.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" /> {partner.country}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {partner.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {partner.products.slice(0, 3).map((product) => (
                      <span
                        key={product}
                        className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                      >
                        {product}
                      </span>
                    ))}
                    {partner.products.length > 3 ? (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        +{partner.products.length - 3}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      ⭐ {partner.rating} · {partner.totalDeals} deals
                    </span>
                    <span className="text-primary font-medium">View details →</span>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p>No partners found matching your search.</p>
              </div>
            ) : null}
          </>
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
