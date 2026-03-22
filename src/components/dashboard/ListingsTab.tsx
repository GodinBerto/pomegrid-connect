import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  ApiError,
  createListing,
  deleteListing,
  fetchListings,
  updateListing,
  type Listing,
} from "@/lib/api";
import { toast } from "sonner";

const emptyForm = {
  title: "",
  category: "",
  price: "",
  quantity: "",
  description: "",
  image_url: "",
};

export const ListingsTab = () => {
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Listing | null>(null);
  const [form, setForm] = useState(emptyForm);

  const listingsQuery = useQuery({
    queryKey: ["connect-listings", accessToken],
    queryFn: () => fetchListings(accessToken!),
    enabled: !!accessToken && user?.role === "farmer",
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createListing(accessToken!, {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description,
        image_url: form.image_url || undefined,
      }),
    onSuccess: () => {
      toast.success("Listing created successfully.");
      queryClient.invalidateQueries({ queryKey: ["connect-listings"] });
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Unable to create listing.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateListing(accessToken!, editItem!.id, {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description,
        image_url: form.image_url || undefined,
      }),
    onSuccess: () => {
      toast.success("Listing updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["connect-listings"] });
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Unable to update listing.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (listingId: number) => deleteListing(accessToken!, listingId),
    onSuccess: () => {
      toast.success("Listing deleted.");
      queryClient.invalidateQueries({ queryKey: ["connect-listings"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Unable to delete listing.");
    },
  });

  useEffect(() => {
    if (!editItem) {
      return;
    }
    setForm({
      title: editItem.title,
      category: editItem.category,
      price: String(editItem.price),
      quantity: String(editItem.quantity),
      description: editItem.description,
      image_url: editItem.image_url ?? "",
    });
  }, [editItem]);

  const openNew = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (listing: Listing) => {
    setEditItem(listing);
    setShowForm(true);
  };

  const save = () => {
    if (!form.title || !form.price || !form.quantity) {
      toast.error("Title, price, and quantity are required.");
      return;
    }

    if (editItem) {
      updateMutation.mutate();
      return;
    }

    createMutation.mutate();
  };

  if (user?.role !== "farmer") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Listings are available for farmer accounts.
      </div>
    );
  }

  const listings = listingsQuery.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">My Listings</h2>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Add Listing
        </Button>
      </div>

      {showForm ? (
        <div
          className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg">
                {editItem ? "Edit Listing" : "New Listing"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, title: event.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="mt-1"
                    placeholder="e.g. Fruits"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, price: event.target.value }))
                    }
                    className="mt-1"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, quantity: event.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Image URL</Label>
                <Input
                  value={form.image_url}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, image_url: event.target.value }))
                  }
                  className="mt-1"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={save} disabled={isSaving}>
                  {isSaving
                    ? editItem
                      ? "Updating..."
                      : "Creating..."
                    : editItem
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {listingsQuery.isLoading ? (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-8 text-sm text-muted-foreground">Loading listings...</div>
        </div>
      ) : listingsQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
          {listingsQuery.error instanceof Error
            ? listingsQuery.error.message
            : "Unable to load listings."}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Origin
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{listing.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {listing.category || "Uncategorized"}
                    </td>
                    <td className="px-5 py-3">{listing.formatted_price}/{listing.unit}</td>
                    <td className="px-5 py-3 tabular-nums">
                      {listing.formatted_quantity} {listing.unit}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {listing.origin || "Not set"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(listing)}
                          className="p-1.5 rounded-md hover:bg-muted"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(listing.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {listings.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-3">No listings yet.</p>
              <Button variant="outline" onClick={openNew}>
                Add your first listing
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
