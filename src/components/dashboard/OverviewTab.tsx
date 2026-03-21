import { Package, TrendingUp, Eye, MessageSquare, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Active Listings", value: "12", change: "+3", up: true, icon: Package },
  { label: "Profile Views", value: "347", change: "+28%", up: true, icon: Eye },
  { label: "Inquiries", value: "23", change: "+5", up: true, icon: MessageSquare },
  { label: "Conversion Rate", value: "18%", change: "-2%", up: false, icon: TrendingUp },
];

const barData = [
  { month: "Jan", views: 120 }, { month: "Feb", views: 190 }, { month: "Mar", views: 240 },
  { month: "Apr", views: 180 }, { month: "May", views: 310 }, { month: "Jun", views: 347 },
];

const pieData = [
  { name: "Avocados", value: 35 }, { name: "Mangoes", value: 28 },
  { name: "Citrus", value: 22 }, { name: "Berries", value: 15 },
];

const pieColors = ["hsl(152, 58%, 38%)", "hsl(210, 60%, 50%)", "hsl(45, 70%, 55%)", "hsl(0, 65%, 55%)"];

const recentInquiries = [
  { name: "Sarah Chen", company: "Pacific Imports Ltd", product: "Avocados", time: "2h ago" },
  { name: "Marcus Weber", company: "EuroFresh Trading", product: "Mangoes", time: "5h ago" },
  { name: "Aisha Nkomo", company: "AfriTrade Co.", product: "Citrus", time: "1d ago" },
];

export const OverviewTab = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="font-display text-2xl font-bold">{s.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {s.up ? <ArrowUpRight className="h-3 w-3 text-primary" /> : <ArrowDownRight className="h-3 w-3 text-destructive" />}
            <span className={`text-xs font-medium ${s.up ? "text-primary" : "text-destructive"}`}>{s.change}</span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-card rounded-xl p-6 border border-border shadow-sm">
        <h3 className="font-display font-semibold mb-4">Profile Views</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} className="text-xs" />
            <Tooltip />
            <Bar dataKey="views" fill="hsl(152, 58%, 38%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-sm">
        <h3 className="font-display font-semibold mb-4">Product Split</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Inquiries */}
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="font-display font-semibold">Recent Inquiries</h3>
      </div>
      <div className="divide-y divide-border">
        {recentInquiries.map((inq) => (
          <div key={inq.name} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
                {inq.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium">{inq.name}</p>
                <p className="text-xs text-muted-foreground">{inq.company}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">{inq.product}</p>
              <p className="text-xs text-muted-foreground">{inq.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
