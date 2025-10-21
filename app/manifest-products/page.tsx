"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Ship,
  Package,
  MapPin,
  Calendar,
  FileText,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Vessel {
  id: number;
  name: string;
  capacity_mt: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  price: string;
  currency: string;
  status: string;
}

interface Port {
  id: number;
  name: string;
  code: string;
  country: string;
  location: string;
}

interface ManifestProduct {
  id: number;
  vessel_id: number;
  product_id: number;
  discharge_port_id: number;
  quantity_mt: string;
  bl_no: string;
  arrival_date: string;
  notes: string;
  status: string;
  vessel?: Vessel;
  product?: Product;
  discharge_port?: Port;
}

interface CreateManifestProductData {
  vessel_id: number;
  product_id: number;
  discharge_port_id: number;
  quantity_mt: number;
  bl_no: string;
  arrival_date: string;
  notes: string;
  status: string;
}

// API functions
const fetchVessels = async (): Promise<Vessel[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/vessels`
  );
  if (!response.ok) throw new Error("Failed to fetch vessels");
  const data = await response.json();
  return data.value || [];
};

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/products`
  );
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.data || [];
};

const fetchPorts = async (): Promise<Port[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ports`
  );
  if (!response.ok) throw new Error("Failed to fetch ports");
  return response.json();
};

const fetchManifestProducts = async (): Promise<ManifestProduct[]> => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/api/vessel-products`
  );
  if (!response.ok) throw new Error("Failed to fetch manifest products");
  const data = await response.json();
  return data.data || [];
};

const createManifestProduct = async (
  data: CreateManifestProductData
): Promise<ManifestProduct> => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/api/vessel-products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Failed to create manifest product");
  return response.json();
};

const updateManifestProduct = async (
  id: number,
  data: Partial<CreateManifestProductData>
): Promise<ManifestProduct> => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/api/vessel-products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Failed to update manifest product");
  return response.json();
};

const deleteManifestProduct = async (id: number): Promise<void> => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/api/vessel-products/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete manifest product");
};

// Status constants
const MANIFEST_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "loading", label: "Loading", color: "bg-blue-100 text-blue-800" },
  {
    value: "discharging",
    label: "Discharging",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const getStatusLabel = (status: string) => {
  const statusObj = MANIFEST_STATUSES.find((s) => s.value === status);
  return statusObj?.label || status;
};

const getStatusColor = (status: string) => {
  const statusObj = MANIFEST_STATUSES.find((s) => s.value === status);
  return statusObj?.color || "bg-gray-100 text-gray-800";
};

export default function ManifestProductsPage() {
  const [manifestProducts, setManifestProducts] = useState<ManifestProduct[]>(
    []
  );
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingManifest, setEditingManifest] =
    useState<ManifestProduct | null>(null);
  const [formData, setFormData] = useState<CreateManifestProductData>({
    vessel_id: 0,
    product_id: 0,
    discharge_port_id: 0,
    quantity_mt: 0,
    bl_no: "",
    arrival_date: "",
    notes: "",
    status: "pending",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [manifestProductsData, vesselsData, productsData, portsData] =
        await Promise.all([
          fetchManifestProducts(),
          fetchVessels(),
          fetchProducts(),
          fetchPorts(),
        ]);

      console.log("Vessels data:", vesselsData);
      console.log("Products data:", productsData);
      console.log("Ports data:", portsData);

      setManifestProducts(manifestProductsData);
      setVessels(vesselsData);
      setProducts(productsData);
      setPorts(portsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateManifestProduct = async () => {
    try {
      if (
        !formData.vessel_id ||
        !formData.product_id ||
        !formData.discharge_port_id
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      await createManifestProduct(formData);
      toast.success("Manifest product created successfully");
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error creating manifest product:", error);
      toast.error("Failed to create manifest product");
    }
  };

  const handleUpdateManifestProduct = async () => {
    if (!editingManifest) return;

    try {
      await updateManifestProduct(editingManifest.id, formData);
      toast.success("Manifest product updated successfully");
      setIsEditDialogOpen(false);
      setEditingManifest(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error updating manifest product:", error);
      toast.error("Failed to update manifest product");
    }
  };

  const handleDeleteManifestProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this manifest product?"))
      return;

    try {
      await deleteManifestProduct(id);
      toast.success("Manifest product deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting manifest product:", error);
      toast.error("Failed to delete manifest product");
    }
  };

  const resetForm = () => {
    setFormData({
      vessel_id: 0,
      product_id: 0,
      discharge_port_id: 0,
      quantity_mt: 0,
      bl_no: "",
      arrival_date: "",
      notes: "",
      status: "pending",
    });
  };

  const openEditDialog = (manifest: ManifestProduct) => {
    setEditingManifest(manifest);
    setFormData({
      vessel_id: manifest.vessel_id,
      product_id: manifest.product_id,
      discharge_port_id: manifest.discharge_port_id,
      quantity_mt: parseFloat(manifest.quantity_mt),
      bl_no: manifest.bl_no,
      arrival_date: manifest.arrival_date.split("T")[0], // Convert to YYYY-MM-DD format
      notes: manifest.notes,
      status: manifest.status,
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manifest Products
          </h1>
          <p className="text-gray-600">
            Manage vessel manifest products and cargo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Manifest Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Manifest Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vessel_id">Vessel *</Label>
                  <Select
                    value={
                      formData.vessel_id > 0
                        ? formData.vessel_id.toString()
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData({ ...formData, vessel_id: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      {vessels.map((vessel) => (
                        <SelectItem
                          key={vessel.id}
                          value={vessel.id.toString()}
                        >
                          {vessel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="product_id">Product *</Label>
                  <Select
                    value={
                      formData.product_id > 0
                        ? formData.product_id.toString()
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData({ ...formData, product_id: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discharge_port_id">Discharge Port *</Label>
                  <Select
                    value={
                      formData.discharge_port_id > 0
                        ? formData.discharge_port_id.toString()
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        discharge_port_id: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      {ports.map((port) => (
                        <SelectItem key={port.id} value={port.id.toString()}>
                          {port.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity_mt">Quantity (MT) *</Label>
                  <Input
                    id="quantity_mt"
                    type="number"
                    step="0.01"
                    value={formData.quantity_mt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_mt: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bl_no">BL Number *</Label>
                  <Input
                    id="bl_no"
                    value={formData.bl_no}
                    onChange={(e) =>
                      setFormData({ ...formData, bl_no: e.target.value })
                    }
                    placeholder="Enter BL number"
                  />
                </div>
                <div>
                  <Label htmlFor="arrival_date">Arrival Date *</Label>
                  <Input
                    id="arrival_date"
                    type="date"
                    value={formData.arrival_date}
                    onChange={(e) =>
                      setFormData({ ...formData, arrival_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANIFEST_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Enter notes"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateManifestProduct}>
                  Create Manifest Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Manifests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {manifestProducts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ship className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Vessels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    manifestProducts.filter((m) => m.status !== "cancelled")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cargo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {manifestProducts
                    .filter((m) => m.status !== "cancelled")
                    .reduce((sum, m) => sum + parseFloat(m.quantity_mt), 0)
                    .toLocaleString()}{" "}
                  MT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ports Involved
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    new Set(manifestProducts.map((m) => m.discharge_port_id))
                      .size
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manifest Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Manifest Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Discharge Port</TableHead>
                  <TableHead>Quantity (MT)</TableHead>
                  <TableHead>BL Number</TableHead>
                  <TableHead>Arrival Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manifestProducts.map((manifest) => (
                  <TableRow key={manifest.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Ship className="mr-2 h-4 w-4 text-blue-600" />
                        {manifest.vessel?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Package className="mr-2 h-4 w-4 text-green-600" />
                        {manifest.product?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-purple-600" />
                        {manifest.discharge_port?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {parseFloat(manifest.quantity_mt).toLocaleString()} MT
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-gray-600" />
                        {manifest.bl_no}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                        {new Date(manifest.arrival_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(manifest.status)}>
                        {getStatusLabel(manifest.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(manifest)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteManifestProduct(manifest.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Manifest Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_vessel_id">Vessel *</Label>
                <Select
                  value={
                    formData.vessel_id > 0
                      ? formData.vessel_id.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    setFormData({ ...formData, vessel_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {vessels.map((vessel) => (
                      <SelectItem key={vessel.id} value={vessel.id.toString()}>
                        {vessel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_product_id">Product *</Label>
                <Select
                  value={
                    formData.product_id > 0
                      ? formData.product_id.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    setFormData({ ...formData, product_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_discharge_port_id">Discharge Port *</Label>
                <Select
                  value={
                    formData.discharge_port_id > 0
                      ? formData.discharge_port_id.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      discharge_port_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select port" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.id.toString()}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_quantity_mt">Quantity (MT) *</Label>
                <Input
                  id="edit_quantity_mt"
                  type="number"
                  step="0.01"
                  value={formData.quantity_mt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity_mt: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_bl_no">BL Number *</Label>
                <Input
                  id="edit_bl_no"
                  value={formData.bl_no}
                  onChange={(e) =>
                    setFormData({ ...formData, bl_no: e.target.value })
                  }
                  placeholder="Enter BL number"
                />
              </div>
              <div>
                <Label htmlFor="edit_arrival_date">Arrival Date *</Label>
                <Input
                  id="edit_arrival_date"
                  type="date"
                  value={formData.arrival_date}
                  onChange={(e) =>
                    setFormData({ ...formData, arrival_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {MANIFEST_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_notes">Notes</Label>
              <Textarea
                id="edit_notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateManifestProduct}>
                Update Manifest Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
