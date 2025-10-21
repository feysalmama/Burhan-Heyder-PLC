"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchProducts,
  createProduct,
  fetchLocationsByType,
  type Product,
  type LocationType,
  type Location,
} from "@/lib/product-service";
import { fetchFreeZones, type FreeZone } from "@/lib/free-zone-service";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [freeZones, setFreeZones] = useState<FreeZone[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    unit: "unit",
    price: "",
    currency: "USD" as "USD" | "BIRR",
    status: "active" as "active" | "inactive",
    description: "",
    free_zone_id: "",
    location_type: "" as LocationType | "",
    location_id: "",
    size: "",
    bundle: "",
    metric_ton: "",
    arrival_date: "",
  });
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "unit",
    price: "",
    currency: "USD",
    status: "active",
    description: "",
    free_zone_id: "",
    location_type: "" as LocationType | "",
    location_id: "",
    size: "",
    bundle: "",
    metric_ton: "",
    arrival_date: "",
  });

  useEffect(() => {
    loadProducts();
    loadFreeZones();
  }, [searchTerm, activeTab]);

  async function loadFreeZones() {
    try {
      const zones = await fetchFreeZones();
      setFreeZones(zones);
    } catch (e: any) {
      toast.error("Failed to load free zones");
    }
  }

  async function loadLocationsByType(type: LocationType) {
    try {
      const locs = await fetchLocationsByType(type);
      setLocations(locs);
    } catch (e: any) {
      toast.error("Failed to load locations");
    }
  }

  async function loadProducts() {
    try {
      console.log(
        "Loading products with search term:",
        searchTerm,
        "active tab:",
        activeTab
      );
      const params: any = { search: searchTerm };

      // Add location_type filter based on active tab
      if (activeTab !== "all") {
        params.location_type = activeTab;
      }

      const res = await fetchProducts(params);
      console.log("Products loaded:", res.data);
      setProducts(res.data);
    } catch (e: any) {
      console.error("Failed to load products:", e);
      toast.error("Failed to load products");
    }
  }

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      const payload = {
        name: form.name.trim(),
        category: form.category || undefined,
        unit: form.unit || undefined,
        price: Number(form.price || 0),
        currency: form.currency || undefined,
        status: form.status as "active" | "inactive",
        description: form.description || undefined,
        free_zone_id: form.free_zone_id ? Number(form.free_zone_id) : undefined,
        location_type: form.location_type || undefined,
        location_id: form.location_id ? Number(form.location_id) : undefined,
        size: form.size || undefined,
        bundle: form.bundle || undefined,
        metric_ton: form.metric_ton ? Number(form.metric_ton) : undefined,
        arrival_date: form.arrival_date || undefined,
      };
      if (!payload.name) {
        toast.error("Name is required");
        return;
      }
      if (!payload.price || payload.price <= 0) {
        toast.error("Price is required and must be greater than 0");
        return;
      }
      console.log("Creating product with payload:", payload);
      const createdProduct = await createProduct(payload);
      console.log("Product created successfully:", createdProduct);
      toast.success("Product created successfully");
      setIsDialogOpen(false);
      setForm({
        name: "",
        category: "",
        unit: "unit",
        price: "",
        currency: "USD" as "USD" | "BIRR",
        status: "active",
        description: "",
        free_zone_id: "",
        location_type: "" as LocationType | "",
        location_id: "",
        size: "",
        bundle: "",
        metric_ton: "",
        arrival_date: "",
      });
      loadProducts();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to create product";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleViewProduct(product: Product) {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
    setIsEditMode(false);
  }

  function handleCloseModal() {
    setIsDetailModalOpen(false);
    setIsEditMode(false);
    setSelectedProduct(null);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsDetailModalOpen(true); // Add this line to open the modal
    setEditForm({
      name: product.name,
      category: product.category || "",
      unit: product.unit || "unit",
      price: product.price,
      currency: product.currency,
      status: product.status,
      description: product.description || "",
      free_zone_id: product.free_zone_id?.toString() || "",
      location_type: product.location_type || "",
      location_id: product.location_id?.toString() || "",
      size: product.size || "",
      bundle: product.bundle || "",
      metric_ton: product.metric_ton || "",
      arrival_date: "",
    });

    // Load locations if product has a location type
    if (product.location_type) {
      loadLocationsByType(product.location_type);
    }
  }

  async function handleUpdateProduct() {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      const { updateProduct } = await import("@/lib/product-service");

      const payload = {
        name: editForm.name.trim(),
        category: editForm.category || undefined,
        unit: editForm.unit || undefined,
        price: Number(editForm.price || 0),
        currency: editForm.currency || undefined,
        status: editForm.status,
        description: editForm.description || undefined,
        free_zone_id: editForm.free_zone_id
          ? Number(editForm.free_zone_id)
          : undefined,
        location_type: editForm.location_type || undefined,
        location_id: editForm.location_id
          ? Number(editForm.location_id)
          : undefined,
        size: editForm.size || undefined,
        bundle: editForm.bundle || undefined,
        metric_ton: editForm.metric_ton
          ? Number(editForm.metric_ton)
          : undefined,
        arrival_date: editForm.arrival_date || undefined,
      };

      if (!payload.name) {
        toast.error("Name is required");
        return;
      }

      await updateProduct(selectedProduct.id, payload);
      toast.success("Product updated successfully");
      setIsEditMode(false);
      setIsDetailModalOpen(false);
      loadProducts();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update product";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteProduct(productId: number) {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      // Import deleteProduct from the service
      const { deleteProduct } = await import("@/lib/product-service");
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to delete product";
      toast.error(msg);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.size || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.bundle || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleLocationTypeChange(type: LocationType | "", isEdit = false) {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        location_type: type,
        location_id: "",
        arrival_date: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        location_type: type,
        location_id: "",
        arrival_date: "",
      }));
    }

    if (type) {
      loadLocationsByType(type);
    } else {
      setLocations([]);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-black text-white">In Stock</Badge>;
      case "Low Stock":
        return <Badge className="bg-red-500 text-white">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge className="bg-gray-400 text-black">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Product Management
        </h2>
        <Button
          className="bg-black text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="w-full card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Package className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {activeTab === "all"
                    ? "Total Products"
                    : activeTab === "freezone"
                    ? "Free Zone Products"
                    : activeTab === "vessel"
                    ? "Vessel Products"
                    : activeTab === "port"
                    ? "Port Products"
                    : "Delivered Products"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredProducts.length}
                </p>
                <p className="text-xs text-gray-500">
                  {activeTab === "all"
                    ? "All product variants"
                    : `Products in ${
                        activeTab === "transfer"
                          ? "customer delivery"
                          : activeTab
                      }`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    filteredProducts.filter(
                      (p) => (Number(p.metric_ton) || 0) < 100
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">
                  Items below minimum stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    filteredProducts.filter(
                      (p) => (Number(p.metric_ton) || 0) === 0
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">Items requiring restock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full card">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product inventory and stock levels
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="freezone">Free Zone</TabsTrigger>
              <TabsTrigger value="vessel">Vessels</TabsTrigger>
              <TabsTrigger value="port">Ports</TabsTrigger>
              <TabsTrigger value="transfer">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Table className="w-full table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Bundle</TableHead>
                    <TableHead>Metric Ton</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.size || "-"}</TableCell>
                      <TableCell>{product.bundle || "-"}</TableCell>
                      <TableCell>
                        {product.metric_ton
                          ? `${Number(product.metric_ton).toFixed(2)} MT`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {Number(product.price).toLocaleString()}{" "}
                        {product.currency}
                      </TableCell>
                      <TableCell>
                        {product.location_type_label || "-"}
                      </TableCell>
                      <TableCell>
                        {product.location_name ||
                          product.free_zone?.name ||
                          "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProduct(product)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="h-8 w-8 p-0 hover:bg-green-100"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter product details to add to inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Enter category"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="e.g., unit, kg, piece"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currency: e.target.value as "USD" | "BIRR",
                    })
                  }
                >
                  <option value="USD">USD</option>
                  <option value="BIRR">BIRR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  placeholder="e.g., 8mm, 12mm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundle">Bundle</Label>
                <Input
                  id="bundle"
                  value={form.bundle}
                  onChange={(e) => setForm({ ...form, bundle: e.target.value })}
                  placeholder="e.g., 50, 40, 30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metric_ton">Metric Ton</Label>
              <Input
                id="metric_ton"
                type="number"
                step="0.01"
                value={form.metric_ton}
                onChange={(e) =>
                  setForm({ ...form, metric_ton: e.target.value })
                }
                placeholder="e.g., 15.91, 12.73"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={form.location_type}
                onChange={(e) =>
                  handleLocationTypeChange(e.target.value as LocationType | "")
                }
              >
                <option value="">Select location type</option>
                <option value="vessel">Vessel</option>
                <option value="freezone">Free Zone</option>
                <option value="port">Port</option>
                <option value="transfer">Customer Transfer</option>
              </select>
            </div>

            {form.location_type && (
              <div className="space-y-2">
                <Label htmlFor="location_id">Location</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={form.location_id}
                  onChange={(e) =>
                    setForm({ ...form, location_id: e.target.value })
                  }
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}{" "}
                      {location.location ? `- ${location.location}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.location_type === "vessel" && form.location_id && (
              <div className="space-y-2">
                <Label htmlFor="arrival_date">Arrival Date</Label>
                <Input
                  id="arrival_date"
                  type="date"
                  value={form.arrival_date}
                  onChange={(e) =>
                    setForm({ ...form, arrival_date: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Enter product description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-black text-white"
            >
              {isSubmitting ? "Saving..." : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Product" : "Product Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update product information"
                : "View detailed information about the product"}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6 py-4">
              {isEditMode ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Product Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Input
                        id="edit-category"
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        placeholder="Enter category"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-unit">Unit</Label>
                      <Input
                        id="edit-unit"
                        value={editForm.unit}
                        onChange={(e) =>
                          setEditForm({ ...editForm, unit: e.target.value })
                        }
                        placeholder="Enter unit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            status: e.target.value as "active" | "inactive",
                          })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        placeholder="Enter price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-currency">Currency</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={editForm.currency}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            currency: e.target.value as "USD" | "BIRR",
                          })
                        }
                      >
                        <option value="USD">USD</option>
                        <option value="BIRR">BIRR</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-location-type">Location Type</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={editForm.location_type}
                      onChange={(e) =>
                        handleLocationTypeChange(
                          e.target.value as LocationType | "",
                          true
                        )
                      }
                    >
                      <option value="">Select location type</option>
                      <option value="vessel">Vessel</option>
                      <option value="freezone">Free Zone</option>
                      <option value="port">Port</option>
                      <option value="transfer">Customer Transfer</option>
                    </select>
                  </div>

                  {editForm.location_type && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-location-id">Location</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={editForm.location_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            location_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Select location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}{" "}
                            {location.location ? `- ${location.location}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {editForm.location_type === "vessel" &&
                    editForm.location_id && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-arrival-date">Arrival Date</Label>
                        <Input
                          id="edit-arrival-date"
                          type="date"
                          value={editForm.arrival_date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              arrival_date: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-size">Size</Label>
                      <Input
                        id="edit-size"
                        value={editForm.size}
                        onChange={(e) =>
                          setEditForm({ ...editForm, size: e.target.value })
                        }
                        placeholder="Enter size"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-bundle">Bundle</Label>
                      <Input
                        id="edit-bundle"
                        value={editForm.bundle}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bundle: e.target.value })
                        }
                        placeholder="Enter bundle"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-metric-ton">Metric Ton</Label>
                    <Input
                      id="edit-metric-ton"
                      type="number"
                      step="0.01"
                      value={editForm.metric_ton}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          metric_ton: e.target.value,
                        })
                      }
                      placeholder="Enter metric ton"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter product description"
                    />
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Product Name
                      </Label>
                      <p className="text-sm font-semibold">
                        {selectedProduct.name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Category
                      </Label>
                      <p className="text-sm">
                        {selectedProduct.category || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Unit
                      </Label>
                      <p className="text-sm">{selectedProduct.unit || "-"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <div>{getStatusBadge(selectedProduct.status)}</div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Price
                      </Label>
                      <p className="text-sm font-semibold">
                        {Number(selectedProduct.price).toLocaleString()}{" "}
                        {selectedProduct.currency}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Location Type
                      </Label>
                      <p className="text-sm">
                        {selectedProduct.location_type_label || "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Location
                      </Label>
                      <p className="text-sm">
                        {selectedProduct.location_name ||
                          selectedProduct.free_zone?.name ||
                          "-"}
                      </p>
                    </div>
                  </div>

                  {/* Physical Properties */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Size
                      </Label>
                      <p className="text-sm">{selectedProduct.size || "-"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Bundle
                      </Label>
                      <p className="text-sm">{selectedProduct.bundle || "-"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Metric Ton
                    </Label>
                    <p className="text-sm">
                      {selectedProduct.metric_ton
                        ? `${Number(selectedProduct.metric_ton).toFixed(2)} MT`
                        : "-"}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Description
                      </Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Created At
                      </Label>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          selectedProduct.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Updated At
                      </Label>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          selectedProduct.updated_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProduct}
                  disabled={isSubmitting}
                  className="bg-black text-white"
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
