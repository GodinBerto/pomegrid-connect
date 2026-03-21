"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Eye, EyeOff, Tractor, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"farmer" | "importer">("farmer");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-12">
        <div className="relative z-10 text-primary-foreground max-w-md">
          <Sprout className="h-12 w-12 mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">Welcome back to Pomegrid</h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Access your dashboard to manage listings, connect with trade partners, and track your agricultural business.
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=60')] bg-cover bg-center opacity-20" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold">Pomegrid</span>
          </Link>

          <h1 className="font-display text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-muted-foreground text-sm mb-8">Enter your credentials to access your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Demo role selector */}
            <div>
              <Label className="mb-2 block">Sign in as</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("farmer")}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-200 active:scale-[0.97] ${
                    selectedRole === "farmer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Tractor className={`h-5 w-5 mx-auto mb-1 ${selectedRole === "farmer" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-xs font-semibold">Farmer</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("importer")}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-200 active:scale-[0.97] ${
                    selectedRole === "importer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <ShoppingCart className={`h-5 w-5 mx-auto mb-1 ${selectedRole === "importer" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-xs font-semibold">Importer</p>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
