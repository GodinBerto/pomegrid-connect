import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchOrders } from "@/lib/api";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export const OrdersTab = () => {
  const { accessToken, user } = useAuth();
  const scope = user?.role === "farmer" ? "seller" : "buyer";

  const ordersQuery = useQuery({
    queryKey: ["connect-orders", accessToken, scope],
    queryFn: () => fetchOrders(accessToken!, scope),
    enabled: !!accessToken,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">
          {user?.role === "farmer" ? "Orders for My Listings" : "My Orders"}
        </h2>
        <Button asChild className="gap-2">
          <Link href="/discover">
            <ShoppingCart className="h-4 w-4" /> Browse Partners
          </Link>
        </Button>
      </div>

      {ordersQuery.isLoading ? (
        <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-sm text-muted-foreground">
          Loading orders...
        </div>
      ) : ordersQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
          {ordersQuery.error instanceof Error
            ? ordersQuery.error.message
            : "Unable to load orders."}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Order ID
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    {user?.role === "farmer" ? "Buyer" : "Supplier"}
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(ordersQuery.data ?? []).map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium font-mono text-xs">
                      {order.reference}
                    </td>
                    <td className="px-5 py-3">{order.product}</td>
                    <td className="px-5 py-3">
                      <div>
                        <p>{order.counterparty_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.counterparty_company}
                        </p>
                        {order.counterparty_country ? (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.counterparty_country}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 tabular-nums">{order.quantity}</td>
                    <td className="px-5 py-3 tabular-nums font-medium">
                      {order.price}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          statusStyles[order.status] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(ordersQuery.data ?? []).length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="mb-3">No orders yet.</p>
              <Button asChild variant="outline">
                <Link href="/discover">Discover trade partners</Link>
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
