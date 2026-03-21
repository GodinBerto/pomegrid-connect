"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Eye, EyeOff, Tractor, ShoppingCart } from "lucide-react";

type UserType = "farmer" | "importer" | null;

const Register = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
    country: "",
    phone: "",
    description: "",
  });

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  const handleStep1 = () => {
    if (!userType) { setError("Please select your account type."); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.password || !form.country) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(userType!);
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-12">
        <div className="relative z-10 text-primary-foreground max-w-md">
          <Sprout className="h-12 w-12 mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">Join Pomegrid</h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            {userType === "farmer"
              ? "Showcase your produce to thousands of verified importers worldwide. Grow your market reach."
              : userType === "importer"
              ? "Discover quality agricultural products from verified farmers across the globe."
              : "Register as a farmer or importer and start trading globally today."}
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=60')] bg-cover bg-center opacity-20" />
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold">Pomegrid</span>
          </Link>

          <h1 className="font-display text-2xl font-bold mb-1">Create an account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {step === 1 ? "Choose your account type to get started" : "Fill in your details to complete registration"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: "farmer" as const, icon: Tractor, label: "Farmer", desc: "I grow & sell produce" },
                  { type: "importer" as const, icon: ShoppingCart, label: "Importer", desc: "I buy & import produce" },
                ].map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => { setUserType(opt.type); setError(""); }}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-200 hover:shadow-md active:scale-[0.97] ${
                      userType === opt.type
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <opt.icon className={`h-8 w-8 mx-auto mb-3 ${userType === opt.type ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <Button className="w-full" onClick={handleStep1}>Continue</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setStep(1)} className="text-xs text-primary hover:underline">
                  ← Change type
                </button>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium capitalize">{userType}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="company">{userType === "farmer" ? "Farm Name" : "Company"}</Label>
                  <Input id="company" value={form.company} onChange={(e) => update("company", e.target.value)} className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="regEmail">Email *</Label>
                <Input id="regEmail" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="regPassword">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="regPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" value={form.country} onChange={(e) => update("country", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="desc">{userType === "farmer" ? "What do you grow?" : "What do you import?"}</Label>
                <textarea
                  id="desc"
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder={userType === "farmer" ? "e.g. Avocados, Mangoes, Citrus..." : "e.g. Tropical fruits, Grains, Spices..."}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
