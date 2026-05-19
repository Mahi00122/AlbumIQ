import { Link } from "react-router-dom";

import { SectionCard } from "../components/common/SectionCard";


export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-2xl">
        <SectionCard
          eyebrow="404"
          title="This route wandered away from the wedding album"
          subtitle="Use one of the primary entry points below to continue."
        >
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="button-primary">
              Guest Portal
            </Link>
            <Link to="/admin/dashboard" className="button-secondary">
              Admin Dashboard
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

