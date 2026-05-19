import { BarChart3, CalendarPlus2, Images, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";


const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/events/new", label: "Create Event", icon: CalendarPlus2 },
  { to: "/admin/uploads", label: "Upload Photos", icon: Images },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 }
];


export function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="page-shell">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card h-fit">
          <div className="hero-grid rounded-[24px] border border-white/50 bg-[var(--c-ink)] p-5 text-white">
            <p className="eyebrow text-white/60">Admin Space</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">FindMyShaadi Pics</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Manage wedding events, bulk uploads, and guest discovery from one dashboard.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {adminLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--c-accent)] text-white"
                      : "text-stone-700 hover:bg-stone-100"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
            <p className="text-sm font-semibold text-stone-800">{user?.full_name || user?.email || "Admin user"}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">Photographer Account</p>
            <button type="button" className="button-secondary mt-4 w-full gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
