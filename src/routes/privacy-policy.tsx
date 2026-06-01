import { createFileRoute } from "@tanstack/react-router";
import { InfoPageShell, PolicyBody } from "@/components/store/InfoPageShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Sri Kamatchi Silk" },
      { name: "description", content: "How Sri Kamatchi Silk collects, uses and protects your data." },
    ],
  }),
  component: () => (
    <InfoPageShell title="Privacy Policy" subtitle="Your trust matters to us.">
      <PolicyBody
        sections={[
          { heading: "Information We Collect", body: "We collect your name, contact details, shipping address and payment information solely to process your orders and improve your shopping experience." },
          { heading: "How We Use Your Data", body: "Your information is used to fulfil orders, provide customer support, send order updates and, with consent, share offers. We never sell your data to third parties." },
          { heading: "Cookies", body: "We use cookies to remember your cart, wishlist and preferences. You may disable cookies in your browser, though some features may not work as intended." },
          { heading: "Data Security", body: "All transactions are encrypted and payments are processed through secure gateways. We follow industry best practices to safeguard your information." },
          { heading: "Your Rights", body: "You may request access to, correction of, or deletion of your personal data at any time by contacting our support team." },
        ]}
      />
    </InfoPageShell>
  ),
});
