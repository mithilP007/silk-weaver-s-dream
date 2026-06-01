import { Truck, Sparkles, Phone } from "lucide-react";

const messages = [
  { icon: Truck, text: "Free shipping on orders above ₹4,999" },
  { icon: Sparkles, text: "Up to 30% off on the Wedding Collection" },
  { icon: Phone, text: "Personal styling assistance — +91 98400 12345" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-maroon text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 overflow-hidden px-4 py-2 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 whitespace-nowrap ${i > 0 ? "hidden sm:flex" : ""}`}
          >
            <m.icon size={13} className="text-gold" />
            <span className="tracking-wide">{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
