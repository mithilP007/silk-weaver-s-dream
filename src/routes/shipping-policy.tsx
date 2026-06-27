import { createFileRoute } from "@tanstack/react-router";
import { InfoPageShell, PolicyBody } from "@/components/store/InfoPageShell";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Sri Kamatchi Silk" },
      {
        name: "description",
        content: "Delivery timelines, charges and coverage for Sri Kamatchi Silk.",
      },
    ],
  }),
  component: () => (
    <InfoPageShell title="Shipping Policy" subtitle="Safe and timely delivery, every time.">
      <PolicyBody
        sections={[
          {
            heading: "Delivery Timelines",
            body: "Orders are processed within 1–2 business days. Standard delivery takes 3–5 business days within India, depending on your location.",
          },
          {
            heading: "Shipping Charges",
            body: "We offer free shipping on all orders above ₹4,999. A flat charge of ₹99 applies to orders below this amount.",
          },
          {
            heading: "Coverage",
            body: "We currently ship across India. International shipping is available on request — please contact our support team.",
          },
          {
            heading: "Order Tracking",
            body: "Once your order is dispatched, you will receive a tracking link via SMS and email to follow your shipment.",
          },
          {
            heading: "Packaging",
            body: "Each saree is carefully packed in premium, protective packaging to ensure it reaches you in pristine condition.",
          },
        ]}
      />
    </InfoPageShell>
  ),
});
