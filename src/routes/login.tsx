import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import heroSaree from "@/assets/hero-saree.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Sri Kamatchi Silk" }] }),
  component: LoginPage,
});

const field = "w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold";

function LoginPage() {
  return (
    <StoreLayout>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="hidden overflow-hidden rounded-3xl lg:block">
          <img src={heroSaree} alt="Saree" className="h-full max-h-[560px] w-full object-cover" />
        </div>
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your shopping journey.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Logged in (demo)"); }} className="mt-8 space-y-4">
            <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="email" placeholder="Email address" className={field} /></div>
            <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="password" placeholder="Password" className={field} /></div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="accent-[var(--primary)]" /> Remember me</label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
            <button className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground">Sign In</button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link></p>
        </div>
      </div>
    </StoreLayout>
  );
}
