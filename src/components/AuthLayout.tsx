import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOGIN_PATH } from "@/const";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Target,
  StickyNote,
  Sparkles,
  LogOut,
  PanelLeft,
  Zap,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthLayoutSkeleton } from "./AuthLayoutSkeleton";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Target, label: "Goals & Habits", path: "/goals" },
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: Sparkles, label: "AI Insights", path: "/ai" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isLoading, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeMenuItem = menuItems.find(item => item.path === location.pathname);

  if (isLoading) {
    return <AuthLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center px-6 text-white">
        <div className="glass-card flex w-full max-w-md flex-col items-center gap-6 rounded-[2rem] p-8 text-center text-slate-950 shadow-glow">
          <div className="gradient-primary flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-glow">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Sign in to continue</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Access to this dashboard requires authentication. Preview mode can still launch without production secrets.
            </p>
          </div>
          <Button onClick={() => { window.location.href = LOGIN_PATH; }} size="lg" variant="gradient" className="w-full">
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  const goTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {isMobile && (
        <div className="glass sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="rounded-xl">
            <PanelLeft className="h-5 w-5" />
          </Button>
          <span className="font-black tracking-tight text-gradient">{activeMenuItem?.label ?? "Life Organizer"}</span>
          <div className="h-10 w-10" />
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-[290px]" onClick={(e) => e.stopPropagation()}>
            <AppSidebar user={user} logout={logout} locationPath={location.pathname} navigate={goTo} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full">
        <aside className="sticky top-0 hidden h-screen w-[296px] shrink-0 md:block">
          <AppSidebar user={user} logout={logout} locationPath={location.pathname} navigate={goTo} />
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AppSidebar({
  user,
  logout,
  locationPath,
  navigate,
}: {
  user: { name?: string | null; email?: string | null } | null;
  logout: () => void;
  locationPath: string;
  navigate: (path: string) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col border-r border-white/60 bg-white/72 p-4 shadow-soft backdrop-blur-2xl">
      <div className="glass-card mb-8 flex items-center gap-3 rounded-2xl px-4 py-4">
        <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25">
          <Zap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-tight text-gradient">Life Organizer</p>
          <p className="truncate text-sm font-semibold text-muted-foreground">Command center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map(item => {
          const isActive = locationPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-bold transition-all ${
                isActive ? "bg-primary/10 text-primary shadow-sm" : "text-slate-700 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="glass-card mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-11 w-11 shrink-0 border border-primary/20 shadow-sm">
              <AvatarFallback className="gradient-primary text-xs font-black text-white">
                {user?.name?.charAt(0).toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-none">{user?.name || "Preview User"}</p>
              <p className="mt-1.5 truncate text-xs text-muted-foreground">{user?.email || "preview@example.com"}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
