import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  MessageSquare,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchDashboardOverview } from "@/lib/api";

const iconMap = {
  active_listings: Package,
  orders_received: ShoppingCart,
  orders_placed: ShoppingCart,
  buyers: Users,
  suppliers: Users,
  markets: Eye,
  revenue: TrendingUp,
  total_spend: TrendingUp,
  default: MessageSquare,
} as const;

const pieColors = [
  "hsl(152, 58%, 38%)",
  "hsl(210, 60%, 50%)",
  "hsl(45, 70%, 55%)",
  "hsl(0, 65%, 55%)",
  "hsl(24, 75%, 52%)",
  "hsl(266, 52%, 54%)",
];

export const OverviewTab = () => {
  const { accessToken } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard-overview", accessToken],
    queryFn: () => fetchDashboardOverview(accessToken!),
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 h-80 rounded-xl border border-border bg-card animate-pulse" />
          <div className="lg:col-span-2 h-80 rounded-xl border border-border bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Unable to load your dashboard overview."}
      </div>
    );
  }

  const recentItems = data.recent.items ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.id as keyof typeof iconMap] ?? iconMap.default;
          const isUp = stat.direction === "up";
          const isDown = stat.direction === "down";

          return (
            <div
              key={stat.id}
              className="bg-card rounded-xl p-5 border border-border shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {isUp ? (
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                ) : isDown ? (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                ) : null}
                <span
                  className={`text-xs font-medium ${
                    isUp
                      ? "text-primary"
                      : isDown
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.helpText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-display font-semibold mb-4">{data.chart.label}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.chart.data}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="hsl(152, 58%, 38%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-display font-semibold mb-4">
            {data.distribution.label}
          </h3>
          {data.distribution.data.length ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.distribution.data}
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {data.distribution.data.map((_, index) => (
                      <Cell
                        key={index}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {data.distribution.data.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: pieColors[index % pieColors.length],
                      }}
                    />
                    {item.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
              No category data yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">{data.recent.label}</h3>
        </div>
        <div className="divide-y divide-border">
          {recentItems.length ? (
            recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
                    {item.title
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{item.detail}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-muted-foreground">
              Activity will show up here as soon as orders start flowing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
