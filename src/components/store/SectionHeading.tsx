import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"}
    >
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
      )}
      <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl md:text-[2.6rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={align === "center" ? "gold-divider mx-auto mt-6 w-24" : "gold-divider mt-6 w-24"}
      />
    </motion.div>
  );
}
