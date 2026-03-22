import {
  Sprout,
  LayoutDashboard,
  Package,
  Compass,
  MessageSquare,
  User,
  LogOut,
  X,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import type { DashboardTab } from "@/screens/Dashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  open: boolean;
  onClose: () => void;
}

const farmerItems: { tab: DashboardTab; icon: typeof LayoutDashboard; label: string }[] = [
  { tab: "overview", icon: LayoutDashboard, label: "Overview" },
  { tab: "listings", icon: Package, label: "My Products" },
  { tab: "discover", icon: Compass, label: "Find Importers" },
  { tab: "messages", icon: MessageSquare, label: "Messages" },
  { tab: "profile", icon: User, label: "Profile" },
];

const importerItems: { tab: DashboardTab; icon: typeof LayoutDashboard; label: string }[] = [
  { tab: "overview", icon: LayoutDashboard, label: "Overview" },
  { tab: "discover", icon: Compass, label: "Find Farmers" },
  { tab: "orders", icon: ShoppingCart, label: "My Orders" },
  { tab: "messages", icon: MessageSquare, label: "Messages" },
  { tab: "profile", icon: User, label: "Profile" },
];

const defaultItems: { tab: DashboardTab; icon: typeof LayoutDashboard; label: string }[] = [
  { tab: "overview", icon: LayoutDashboard, label: "Overview" },
  { tab: "discover", icon: Compass, label: "Discover" },
  { tab: "messages", icon: MessageSquare, label: "Messages" },
  { tab: "profile", icon: User, label: "Profile" },
];

export const DashboardSidebar = ({ activeTab, onTabChange, open, onClose }: Props) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const items =
    user?.role === "importer"
      ? importerItems
      : user?.role === "farmer"
        ? farmerItems
        : defaultItems;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Pomegrid</span>
          </Link>
          <button className="lg:hidden p-1" onClick={onClose}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* User role badge */}
        {user && (
          <div className="px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  user.role === "farmer" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-4 px-3 space-y-1">
          {items.map((item) => (
            <button
              key={item.tab}
              onClick={() => { onTabChange(item.tab); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97] ${
                activeTab === item.tab
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
