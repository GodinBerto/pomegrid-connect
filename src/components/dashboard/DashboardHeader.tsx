import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  onMenuClick: () => void;
}

export const DashboardHeader = ({ onMenuClick }: Props) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold hidden sm:block">Hey, Farmer 👋</h1>
      </div>

      <div className="flex items-center gap-3">
        {searchOpen ? (
          <Input
            placeholder="Search listings..."
            className="w-48 sm:w-64"
            autoFocus
            onBlur={() => setSearchOpen(false)}
          />
        ) : (
          <button className="p-2 rounded-lg hover:bg-muted" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
        )}

        <button className="p-2 rounded-lg hover:bg-muted relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
          AF
        </div>
      </div>
    </header>
  );
};
