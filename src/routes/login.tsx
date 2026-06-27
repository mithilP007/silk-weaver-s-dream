import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import heroSaree from "@/assets/hero-saree.jpg";

import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Sri Kamatchi Silk" }] }),
  component: LoginPage,
});

const field =
  "w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Save token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");

      // If user role is admin, redirect to admin area, otherwise stay on store
      if (data.user.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        toast.info("Welcome back! Redirecting to home...", {
          description: "Admin privileges are required to access portal.",
        });
        navigate({ to: "/" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Network error. Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StoreLayout>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="hidden overflow-hidden rounded-3xl lg:block">
          <img src={heroSaree} alt="Saree" className="h-full max-h-[560px] w-full object-cover" />
        </div>
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your shopping journey.
          </p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-[var(--primary)]" /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground flex items-center justify-center gap-2 hover:bg-primary/95 disabled:opacity-75 transition-colors cursor-pointer"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </StoreLayout>
  );
}
