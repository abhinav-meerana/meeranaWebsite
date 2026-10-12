import SectionHeader from "@/components/ui/SectionHeader";
import { COMPANY } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import "../pages.css";

/* Route shell only. It is not linked from the footer (see lib/flags.ts
   PRIVACY_URL) and not indexed, and it carries no legal text: the notice has to
   be supplied and approved by the owner (DL-T06, UAE PDPL) before the enquiry
   form can be switched on. */
export const metadata = pageMeta({
  title: "Privacy notice",
  description: "Meerana Technologies privacy notice.",
  path: "/privacy/",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <main id="main" className="page">
      <div className="container page-narrow">
        <SectionHeader id="privacy-title" level={1} annotation="Legal">
          Privacy notice
        </SectionHeader>
        <p className="t-lede page-lede">
          For questions about personal data, write to {COMPANY.email}.
        </p>
      </div>
    </main>
  );
}
