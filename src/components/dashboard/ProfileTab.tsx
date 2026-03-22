import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ApiError, updateConnectProfile, updateCoreUser } from "@/lib/api";

export const ProfileTab = () => {
  const { user, accessToken, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    country: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      fullName: user.fullName,
      email: user.email,
      company: user.company,
      country: user.country,
      phone: user.phone,
      bio: user.bio,
    });
  }, [user]);

  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2) ?? "PG";

  const handleSave = async () => {
    if (!accessToken || !user) {
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        updateCoreUser(accessToken, {
          full_name: form.fullName,
          phone: form.phone,
          address: form.country,
        }),
        updateConnectProfile(accessToken, {
          account_type: user.accountType ?? undefined,
          company: form.company,
          country: form.country,
          bio: form.bio,
        }),
      ]);
      await refreshUser();
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-display text-xl font-bold">My Profile</h2>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold">{form.fullName}</p>
            {user?.role ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium capitalize">
                {user.role}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} readOnly className="mt-1 bg-muted/40" />
          </div>
          <div>
            <Label>{user?.role === "farmer" ? "Farm / Company" : "Company"}</Label>
            <Input
              value={form.company}
              onChange={(event) => update("company", event.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              value={form.country}
              onChange={(event) => update("country", event.target.value)}
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Bio</Label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            value={form.bio}
            onChange={(event) => update("bio", event.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
