import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, MapPin, Clock, Check, X } from "lucide-react";

interface Order {
  id: string;
  product: string;
  farmer: string;
  country: string;
  quantity: string;
  price: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  date: string;
}

const mockOrders: Order[] = [
  { id: "ORD-001", product: "Hass Avocados", farmer: "Green Valley Farms", country: "Kenya", quantity: "2,000 kg", price: "$4,800", status: "shipped", date: "Mar 12, 2026" },
  { id: "ORD-002", product: "Medjool Dates", farmer: "MediterFarm Co.", country: "Morocco", quantity: "500 kg", price: "$3,250", status: "confirmed", date: "Mar 15, 2026" },
  { id: "ORD-003", product: "Cocoa Beans", farmer: "West Africa Harvest", country: "Ghana", quantity: "5,000 kg", price: "$12,500", status: "pending", date: "Mar 18, 2026" },
  { id: "ORD-004", product: "Cavendish Bananas", farmer: "SunFresh Exports", country: "Colombia", quantity: "8,000 kg", price: "$6,400", status: "delivered", date: "Feb 28, 2026" },
];

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-emerald-100 text-emerald-700",
};

export const OrdersTab = () => {
  const [orders] = useState(mockOrders);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">My Orders</h2>
        <Button className="gap-2"><ShoppingCart className="h-4 w-4" /> New Order</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Farmer</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-medium font-mono text-xs">{o.id}</td>
                  <td className="px-5 py-3">{o.product}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p>{o.farmer}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{o.country}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 tabular-nums">{o.quantity}</td>
                  <td className="px-5 py-3 tabular-nums font-medium">{o.price}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
