"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ListingsTab } from "@/components/dashboard/ListingsTab";
import { DiscoverTab } from "@/components/dashboard/DiscoverTab";
import { MessagesTab } from "@/components/dashboard/MessagesTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { OrdersTab } from "@/components/dashboard/OrdersTab";
import { useAuth } from "@/context/AuthContext";

export type DashboardTab = "overview" | "listings" | "discover" | "messages" | "profile" | "orders";

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "listings": return <ListingsTab />;
      case "discover": return <DiscoverTab />;
      case "messages": return <MessagesTab />;
      case "profile": return <ProfileTab />;
      case "orders": return <OrdersTab />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
