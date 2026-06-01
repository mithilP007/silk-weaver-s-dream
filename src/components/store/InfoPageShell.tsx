import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { StoreLayout } from "./StoreLayout";

export function InfoPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <StoreLayout>
      <section className="bg-gradient-champagne">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <nav className="mb-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="text-foreground">{title}</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
          <div className="gold-divider mx-auto mt-6 w-24" />
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">{children}</section>
    </StoreLayout>
  );
}

export function PolicyBody({
  sections,
}: {
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="prose-luxury space-y-8">
      {sections.map((s, i) => (
        <div key={i}>
          <h2 className="text-xl font-semibold text-foreground">{s.heading}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
        </div>
      ))}
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        Last updated: May 2026. For any questions, contact care@srikamatchisilk.com.
      </p>
    </div>
  );
}
