import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Globe, Star, Clock, Handshake, ShieldCheck, MessageSquare, Lock, Package } from "lucide-react";
import type { TradePartner } from "@/data/partners";

interface Props {
  partner: TradePartner | null;
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onRequireAuth: () => void;
}

export const PartnerDetailDialog = ({ partner, open, onClose, isLoggedIn, onRequireAuth }: Props) => {
  if (!partner) return null;

  const initials = partner.name.split(" ").map(n => n[0]).join("");

  const handleContact = () => {
    if (!isLoggedIn) {
      onRequireAuth();
      return;
    }
    // In a real app, this would open messages
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header banner */}
        <div className={`h-28 ${partner.type === "farmer" ? "bg-primary/10" : "bg-secondary/30"} relative`}>
          <div className="absolute -bottom-10 left-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold border-4 border-background shadow-md ${
              partner.type === "farmer" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              {initials}
            </div>
          </div>
        </div>

        <div className="px-6 pt-14 pb-6 space-y-6">
          {/* Name & badges */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogHeader className="p-0 space-y-0">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  {partner.name}
                  {partner.verified && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">✓</span>
                  )}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground mt-0.5">{partner.company}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{partner.country}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Est. {partner.established}</span>
              </div>
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              partner.type === "farmer" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
            }`}>
              {partner.type}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold text-sm tabular-nums">{partner.rating}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Rating</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Handshake className="h-3.5 w-3.5 text-primary" />
                <span className="font-bold text-sm tabular-nums">{partner.totalDeals}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Deals</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="font-bold text-sm">{partner.responseTime}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Response</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-sm font-semibold mb-2">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{partner.bio}</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              {partner.type === "farmer" ? "Products" : "Importing"}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {partner.products.map(p => (
                <span key={p} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium">{p}</span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {partner.certifications.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Certifications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {partner.certifications.map(c => (
                  <span key={c} className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Details grid - gated for non-logged-in users */}
          {isLoggedIn ? (
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{partner.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{partner.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4 shrink-0" />
                <span>Min. order: {partner.minOrderQty}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <span>{partner.languages.join(", ")}</span>
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-5 text-center space-y-3">
              <Lock className="h-6 w-6 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Sign in to see full details</p>
                <p className="text-xs text-muted-foreground mt-1">Contact info, minimum order quantities, and shipping details are available to registered users.</p>
              </div>
              <Button onClick={onRequireAuth} className="gap-2">
                Sign In or Register
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 gap-2" onClick={handleContact}>
              <MessageSquare className="h-4 w-4" />
              {isLoggedIn ? "Send Message" : "Contact"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
