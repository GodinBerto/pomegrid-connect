import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface Listing {
  id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: string;
  origin: string;
  description: string;
}

const initialListings: Listing[] = [
  { id: "1", name: "Hass Avocados", category: "Fruits", price: "$2.40", unit: "kg", quantity: "5,000", origin: "Kenya", description: "Grade A export quality, organically grown." },
  { id: "2", name: "Kent Mangoes", category: "Fruits", price: "$1.80", unit: "kg", quantity: "8,000", origin: "Kenya", description: "Sweet, fiber-free variety. Available Mar-Jun." },
  { id: "3", name: "Valencia Oranges", category: "Citrus", price: "$0.90", unit: "kg", quantity: "12,000", origin: "South Africa", description: "Juicing grade, minimal seeds." },
];

export const ListingsTab = () => {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", unit: "kg", quantity: "", origin: "", description: "" });

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const openNew = () => {
    setForm({ name: "", category: "", price: "", unit: "kg", quantity: "", origin: "", description: "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (l: Listing) => {
    setForm({ name: l.name, category: l.category, price: l.price, unit: l.unit, quantity: l.quantity, origin: l.origin, description: l.description });
    setEditId(l.id);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.price) return;
    if (editId) {
      setListings(listings.map(l => l.id === editId ? { ...l, ...form } : l));
    } else {
      setListings([...listings, { id: Date.now().toString(), ...form }]);
    }
    setShowForm(false);
  };

  const remove = (id: string) => setListings(listings.filter(l => l.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">My Listings</h2>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Listing</Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg">{editId ? "Edit Listing" : "New Listing"}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Product Name *</Label><Input value={form.name} onChange={e => update("name", e.target.value)} className="mt-1" /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={e => update("category", e.target.value)} className="mt-1" placeholder="e.g. Fruits" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Price *</Label><Input value={form.price} onChange={e => update("price", e.target.value)} className="mt-1" placeholder="$0.00" /></div>
                <div><Label>Unit</Label><Input value={form.unit} onChange={e => update("unit", e.target.value)} className="mt-1" /></div>
                <div><Label>Quantity</Label><Input value={form.quantity} onChange={e => update("quantity", e.target.value)} className="mt-1" /></div>
              </div>
              <div><Label>Origin Country</Label><Input value={form.origin} onChange={e => update("origin", e.target.value)} className="mt-1" /></div>
              <div>
                <Label>Description</Label>
                <textarea rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" value={form.description} onChange={e => update("description", e.target.value)} />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={save}>{editId ? "Update" : "Create"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Origin</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map(l => (
                <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-medium">{l.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.category}</td>
                  <td className="px-5 py-3">{l.price}/{l.unit}</td>
                  <td className="px-5 py-3 tabular-nums">{l.quantity} {l.unit}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.origin}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(l)} className="p-1.5 rounded-md hover:bg-muted"><Edit2 className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => remove(l.id)} className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {listings.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-3">No listings yet</p>
            <Button variant="outline" onClick={openNew}>Add your first listing</Button>
          </div>
        )}
      </div>
    </div>
  );
};
