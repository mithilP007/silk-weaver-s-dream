import { createFileRoute } from "@tanstack/react-router";
import { InfoPageShell, PolicyBody } from "@/components/store/InfoPageShell";

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [
      { title: "Return Policy — Sri Kamatchi Silk" },
      {
        name: "description",
        content: "Easy returns and exchange guidelines for Sri Kamatchi Silk.",
      },
    ],
  }),
  component: () => (
    <InfoPageShell title="Return Policy" subtitle="Shop with complete confidence.">
      <PolicyBody
        sections={[
          {
            heading: "7-Day Returns",
            body: "We offer a 7-day return window from the date of delivery. Items must be unused, unwashed and in original packaging with tags intact.",
          },
          {
            heading: "How to Return",
            body: "Initiate a return from your My Orders page or contact support. Our team will arrange a pickup at no extra cost.",
          },
          {
            heading: "Refunds",
            body: "Approved refunds are processed within 5–7 business days to your original payment method. COD orders are refunded via bank transfer.",
          },
          {
            heading: "Exchanges",
            body: "Prefer a different saree? We are happy to exchange your item subject to availability.",
          },
          {
            heading: "Non-Returnable Items",
            body: "Customised, altered or sale items marked final are not eligible for return.",
          },
        ]}
      />
    </InfoPageShell>
  ),
});
