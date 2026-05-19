import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Link, Outlet } from "react-router-dom";


export function GuestLayout() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="surface-card hero-grid overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-5">
              <span className="tag-pill">
                <Sparkles className="h-3.5 w-3.5" />
                Guest Photo Discovery
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Find every wedding photo you are in with one selfie.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600">
                Scan the event QR or enter your event code, upload a selfie, and let the AI matching engine pull together your personal wedding gallery.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="tag-pill">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  Guest-friendly flow
                </span>
                <span className="tag-pill">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure event access
                </span>
              </div>
            </div>

            <div className="surface-card self-stretch bg-[linear-gradient(135deg,rgba(187,90,43,0.12),rgba(203,151,48,0.14))]">
              <p className="eyebrow">For Photographers</p>
              <h2 className="mt-3 text-2xl font-semibold">Admin tools are ready too</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Create an event, generate a QR, upload wedding images, and monitor processing from the dashboard.
              </p>
              <Link to="/admin/login" className="button-primary mt-5">
                Open Admin Portal
              </Link>
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

