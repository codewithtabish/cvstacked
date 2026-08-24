"use client";

import { ModeToggle } from "@/components/(app)/general/themes/mode-toggler";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type SVGProps,
} from "react";

// ============================================================
// CUSTOM SVG ICONS
// ============================================================

function IconDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function IconResumes(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
      <path d="M8 9h2" />
    </svg>
  );
}

function IconUpload(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconBot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
      <path d="M9 17h6" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1.5" />
    </svg>
  );
}

function IconTemplates(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function IconAccount(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconSparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M5.6 5.6l2.1 2.1" />
      <path d="M16.3 16.3l2.1 2.1" />
      <path d="M5.6 18.4l2.1-2.1" />
      <path d="M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconPanelLeftClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M16 15l-3-3 3-3" />
    </svg>
  );
}

function IconPanelLeftOpen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M13 9l3 3-3 3" />
    </svg>
  );
}

// ============================================================
// TYPES
// ============================================================

type NavItem = {
  label: string;
  description: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  exact?: boolean;
};

// ============================================================
// NAVIGATION
// ============================================================

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    description: "Your workspace overview",
    href: "/app",
    icon: IconDashboard,
    exact: true,
  },
  {
    label: "My Resumes",
    description: "Manage your resumes",
    href: "/app/resumes",
    icon: IconResumes,
  },
  {
    label: "Upload Resume",
    description: "Import an existing resume",
    href: "/app/upload",
    icon: IconUpload,
  },
  {
    label: "AI Optimizer",
    description: "Optimize for your next role",
    href: "/app/ai-optimizer",
    icon: IconBot,
  },
  {
    label: "Templates",
    description: "Explore resume designs",
    href: "/app/templates",
    icon: IconTemplates,
  },
  {
    label: "Account",
    description: "Manage your account",
    href: "/app/account",
    icon: IconAccount,
  },
];

// ============================================================
// COLLAPSED SIDEBAR STORE
// ============================================================

const STORAGE_KEY = "cvstacked-app-sidebar-collapsed";

const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(onChange: () => void) {
  collapsedListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    collapsedListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getCollapsedSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function getCollapsedServerSnapshot() {
  return false;
}

function setCollapsedStore(next: boolean) {
  window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  collapsedListeners.forEach((listener) => listener());
}

// ============================================================
// SIDEBAR
// ============================================================

export function AppSidebar() {
  return (
    <Suspense fallback={<AppSidebarSkeleton />}>
      <AppSidebarContent />
    </Suspense>
  );
}

// ============================================================
// SIDEBAR CONTENT
// ============================================================

function AppSidebarContent() {
  const pathname = usePathname();

  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const [marker, setMarker] = useState({
    top: 0,
    height: 0,
    ready: false,
  });

  const toggleCollapsed = () => {
    setCollapsedStore(!collapsed);
  };

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href) ?? false;
  };

  // Precise active marker calculation
  useLayoutEffect(() => {
    const activeItem = NAV_ITEMS.find(isActive);
    const activeElement = activeItem ? itemRefs.current.get(activeItem.href) : null;

    if (!activeElement || !listRef.current) {
      setMarker((prev) => ({ ...prev, ready: false }));
      return;
    }

    // Use offsetTop relative to the list for perfect positioning
    const top = activeElement.offsetTop;
    const height = activeElement.offsetHeight;

    setMarker({
      top,
      height,
      ready: true,
    });
  }, [pathname, collapsed]);

  return (
    <aside
      className={cn(
        "group/sidebar relative sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden",
        "border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[76px]" : "w-[272px]",
      )}
    >
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/6 blur-3xl dark:bg-primary/9" />
        <div className="absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-primary/[0.035] blur-3xl dark:bg-primary/6" />
        <div className="absolute bottom-0 left-0 h-64 w-full bg-linear-to-t from-primary/[0.035] to-transparent" />
      </div>

      {/* Brand */}
      <div className="relative flex h-[76px] shrink-0 items-center border-b border-sidebar-border/80 px-4">
        <Link
          href="/app"
          aria-label="CVStacked workspace"
          className={cn(
            "group/brand flex min-w-0 items-center",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <span
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-xl border border-primary/15",
              "bg-linear-to-br from-primary/10 via-primary/5 to-transparent",
              "shadow-sm transition-all duration-300",
              "group-hover/brand:border-primary/30",
              "group-hover/brand:shadow-[0_0_24px_-10px] group-hover/brand:shadow-primary/40",
            )}
          >
            <span className="absolute inset-0 rounded-xl bg-primary/6 blur-md" />
            <span className="relative text-sm font-bold tracking-tight text-primary">CV</span>
          </span>

          <span
            className={cn(
              "flex min-w-0 flex-col overflow-hidden transition-all duration-300",
              collapsed ? "w-0 translate-x-2 opacity-0" : "w-auto translate-x-0 opacity-100",
            )}
          >
            <span className="truncate text-[15px] font-semibold tracking-[-0.02em]">CVStacked</span>
            <span className="mt-0.5 truncate text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Resume workspace
            </span>
          </span>
        </Link>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className={cn(
            "absolute top-1/2 -right-3.5 z-20 flex h-7 w-7",
            "-translate-y-1/2 items-center justify-center",
            "rounded-full border border-sidebar-border",
            "bg-sidebar shadow-sm text-muted-foreground",
            "transition-all duration-200",
            "hover:border-primary/30 hover:bg-sidebar-accent hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {collapsed ? (
            <IconPanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <IconPanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Workspace label */}
      <div
        className={cn("relative px-5 pt-6 pb-3 transition-all duration-300", collapsed && "px-0")}
      >
        <div
          className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            collapsed ? "justify-center opacity-0" : "opacity-100",
          )}
        >
          <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Workspace
          </span>
          <span className="h-px flex-1 bg-linear-to-r from-border/80 to-transparent" />
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="CVStacked workspace navigation" className="relative flex-1 px-3">
        <ul ref={listRef} className="relative flex flex-col gap-1">
          {/* Active background pill */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 rounded-xl",
              "bg-linear-to-r from-primary/12 via-primary/6 to-transparent",
              "ring-1 ring-inset ring-primary/10",
              "transition-all duration-300 ease-in-out",
              marker.ready ? "opacity-100" : "opacity-0",
            )}
            style={{
              top: marker.top,
              height: marker.height,
            }}
          />

          {/* Active left indicator bar */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-0 z-10 w-[3px]",
              "rounded-full bg-linear-to-b from-primary to-primary/70",
              "shadow-[0_0_14px_-2px] shadow-primary/60",
              "transition-all duration-300 ease-in-out",
              marker.ready ? "opacity-100" : "opacity-0",
            )}
            style={{
              top: marker.top + 10,
              height: Math.max(marker.height - 20, 18),
            }}
          />

          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <li
                key={item.href}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.href, el);
                  else itemRefs.current.delete(item.href);
                }}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-12 items-center rounded-xl px-3",
                    "transition-all duration-200",
                    collapsed ? "justify-center" : "gap-3",
                    active
                      ? "text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  {/* Icon container */}
                  <span
                    className={cn(
                      "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      "transition-all duration-200",
                      active
                        ? "bg-primary/12 text-primary"
                        : "bg-transparent text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] transition-transform duration-200",
                        "group-hover:scale-[1.07]",
                      )}
                    />
                    {active && (
                      <span className="absolute inset-0 rounded-lg bg-primary/10 blur-md" />
                    )}
                  </span>

                  {/* Label + description */}
                  <span
                    className={cn(
                      "flex min-w-0 flex-1 flex-col overflow-hidden",
                      "transition-all duration-300",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                    )}
                  >
                    <span className="truncate text-[13px] font-medium leading-tight">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 truncate text-[10px] leading-tight",
                        active ? "text-primary/55" : "text-muted-foreground/65",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>

                  {/* Chevron */}
                  {!collapsed && (
                    <IconChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-muted-foreground/25",
                        "transition-all duration-200",
                        "group-hover:translate-x-0.5 group-hover:text-muted-foreground/60",
                        active && "text-primary/50",
                      )}
                    />
                  )}

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <span
                      className={cn(
                        "pointer-events-none absolute left-full top-1/2 z-50",
                        "ml-3.5 -translate-y-1/2",
                        "rounded-lg border border-border/70",
                        "bg-popover/95 px-3 py-2",
                        "text-xs text-popover-foreground",
                        "shadow-xl backdrop-blur-md",
                        "translate-x-[-6px] scale-95 opacity-0",
                        "transition-all duration-150 ease-out",
                        "group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100",
                      )}
                    >
                      <span className="block whitespace-nowrap font-medium">{item.label}</span>
                      <span className="mt-0.5 block whitespace-nowrap text-[10px] text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* AI Callout */}
      <div
        className={cn(
          "relative mx-3 mb-3 overflow-hidden rounded-xl",
          "border border-primary/12",
          "bg-linear-to-br from-primary/10 via-primary/4 to-transparent",
          "transition-all duration-300",
          collapsed ? "h-12" : "h-auto p-3.5",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl"
        />

        <div
          className={cn(
            "relative flex items-start gap-2.5",
            collapsed && "items-center justify-center",
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12">
            <IconSparkles className="h-4 w-4 text-primary" />
          </span>

          <div
            className={cn(
              "min-w-0 transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <p className="text-[11px] font-semibold tracking-tight">Build a better resume</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
              Use AI to tailor your resume for your next opportunity.
            </p>
            <Link
              href="/app/ai-optimizer"
              className="mt-2 inline-flex items-center text-[10px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              Try AI Optimizer
              <IconChevronRight className="ml-0.5 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          "relative flex items-center gap-3 border-t border-sidebar-border/80 p-3",
          collapsed ? "flex-col" : "flex-row justify-between",
        )}
      >
        <div
          className={cn(
            "min-w-0 transition-all duration-300",
            collapsed ? "hidden opacity-0" : "block opacity-100",
          )}
        >
          <p className="truncate text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            CVStacked
          </p>
          <p className="mt-0.5 text-[9px] text-muted-foreground/55">Your career, stacked better.</p>
        </div>

        <ModeToggle />
      </div>
    </aside>
  );
}

// ============================================================
// SKELETON
// ============================================================

function AppSidebarSkeleton() {
  return (
    <aside className="relative sticky top-0 flex h-screen w-[272px] shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-[76px] shrink-0 items-center border-b border-sidebar-border/80 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-sidebar-accent" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 animate-pulse rounded bg-sidebar-accent" />
            <div className="h-2.5 w-28 animate-pulse rounded bg-sidebar-accent" />
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-3">
        <div className="h-2.5 w-20 animate-pulse rounded bg-sidebar-accent" />
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <div className="flex min-h-12 items-center gap-3 rounded-xl px-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-sidebar-accent" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 animate-pulse rounded bg-sidebar-accent" />
                  <div className="h-2 w-32 animate-pulse rounded bg-sidebar-accent" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-3 mb-3 h-[88px] animate-pulse rounded-xl bg-sidebar-accent" />

      <div className="flex items-center justify-between border-t border-sidebar-border/80 p-3">
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 animate-pulse rounded bg-sidebar-accent" />
          <div className="h-2 w-24 animate-pulse rounded bg-sidebar-accent" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-sidebar-accent" />
      </div>
    </aside>
  );
}

export default AppSidebar;
