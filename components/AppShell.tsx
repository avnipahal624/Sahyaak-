import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { House, LayoutGrid, Play, Settings, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom navigation — persistent, identical position, identical icon set,
 * fixed order, never reflows. Predictability of navigation matters more
 * here than anywhere else in the app.
 */
const NAV_ITEMS = [
  { to: "/home", en: "Home", hi: "घर", icon: House },
  { to: "/board", en: "Board", hi: "बोर्ड", icon: LayoutGrid },
  { to: "/learn", en: "Learn", hi: "सीखो", icon: Play },
  { to: "/progress", en: "Progress", hi: "प्रगति", icon: Target },
  { to: "/settings", en: "Settings", hi: "सेटिंग", icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-card"
    >
      <div className="mx-auto grid w-full max-w-2xl grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.en}
              className={({ isActive }) =>
                cn(
                  "flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs font-bold focus-visible:outline-none",
                  isActive ? "text-primary" : "text-ink-soft",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn("size-6 stroke-[2.25]", isActive && "fill-primary/15")}
                    aria-hidden
                  />
                  <span className="leading-none">{item.en}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

/** Page container: keeps content clear of the fixed bottom nav. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
