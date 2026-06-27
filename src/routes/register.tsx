import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import saree2 from "@/assets/saree-2.jpg";

import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — Sri Kamatchi Silk" }] }),
  component: RegisterPage,
});

const field =
  "w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      // Save token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Account created successfully!");
      navigate({ to: "/" });
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
        <div className="mx-auto w-full max-w-md lg:order-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Join Sri Kamatchi Silk
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account for a personalised experience.
          </p>
          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                placeholder="Full name"
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                placeholder="Phone number"
                className={field}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground flex items-center justify-center gap-2 hover:bg-primary/95 disabled:opacity-75 transition-colors cursor-pointer"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="hidden overflow-hidden rounded-3xl lg:block">
          <img src={saree2} alt="Saree" className="h-full max-h-[560px] w-full object-cover" />
        </div>
      </div>
    </StoreLayout>
  );
}
