import { createFileRoute } from "@tanstack/react-router";
import { InfoPageShell, PolicyBody } from "@/components/store/InfoPageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Sri Kamatchi Silk" },
      { name: "description", content: "The terms governing the use of Sri Kamatchi Silk." },
    ],
  }),
  component: () => (
    <InfoPageShell title="Terms & Conditions" subtitle="Please read these terms carefully.">
      <PolicyBody
        sections={[
          { heading: "Acceptance of Terms", body: "By accessing and using this website, you agree to be bound by these terms and conditions and all applicable laws." },
          { heading: "Products & Pricing", body: "All prices are listed in Indian Rupees and are inclusive of applicable taxes. We reserve the right to modify prices and availability at any time." },
          { heading: "Orders", body: "An order is confirmed only after successful payment or COD verification. We reserve the right to cancel any order due to stock or pricing errors." },
          { heading: "Intellectual Property", body: "All content, images and designs on this site are the property of Sri Kamatchi Silk and may not be reproduced without permission." },
          { heading: "Limitation of Liability", body: "Sri Kamatchi Silk shall not be liable for any indirect or consequential damages arising from the use of this website." },
        ]}
      />
    </InfoPageShell>
  ),
});
