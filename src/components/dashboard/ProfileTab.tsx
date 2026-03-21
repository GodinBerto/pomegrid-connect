import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { toast } from "sonner";

export const ProfileTab = () => {
  const [form, setForm] = useState({
    fullName: "Alex Farmer",
    email: "alex@pomegrid.com",
    company: "Green Valley Farms",
    country: "Kenya",
    phone: "+254 712 345 678",
    bio: "Family-owned farm specializing in premium avocados and tropical fruits for export. 15+ years of experience in international trade.",
  });

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-display text-xl font-bold">My Profile</h2>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              AF
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold">{form.fullName}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">Farmer</span>
          </div>
        </div>

        {/* Form */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => update("fullName", e.target.value)} className="mt-1" /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={e => update("email", e.target.value)} className="mt-1" /></div>
          <div><Label>Farm / Company</Label><Input value={form.company} onChange={e => update("company", e.target.value)} className="mt-1" /></div>
          <div><Label>Country</Label><Input value={form.country} onChange={e => update("country", e.target.value)} className="mt-1" /></div>
          <div className="sm:col-span-2"><Label>Phone</Label><Input value={form.phone} onChange={e => update("phone", e.target.value)} className="mt-1" /></div>
        </div>

        <div>
          <Label>Bio</Label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            value={form.bio}
            onChange={e => update("bio", e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
