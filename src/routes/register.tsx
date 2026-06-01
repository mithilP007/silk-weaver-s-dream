import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, Lock, User, Phone } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import saree2 from "@/assets/saree-2.jpg";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — Sri Kamatchi Silk" }] }),
  component: RegisterPage,
});

const field = "w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold";

function RegisterPage() {
  return (
    <StoreLayout>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="mx-auto w-full max-w-md lg:order-1">
          <h1 className="font-display text-3xl font-bold text-foreground">Join Sri Kamatchi Silk</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create an account for a personalised experience.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Account created (demo)"); }} className="mt-8 space-y-4">
            <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required placeholder="Full name" className={field} /></div>
            <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="email" placeholder="Email address" className={field} /></div>
            <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required placeholder="Phone number" className={field} /></div>
            <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="password" placeholder="Password" className={field} /></div>
            <button className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground">Create Account</button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
        </div>
        <div className="hidden overflow-hidden rounded-3xl lg:block">
          <img src={saree2} alt="Saree" className="h-full max-h-[560px] w-full object-cover" />
        </div>
      </div>
    </StoreLayout>
  );
}
