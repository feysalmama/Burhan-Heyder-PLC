"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Ship,
  Anchor,
  Package,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Vessel,
  CreateVesselData,
  fetchVessels,
  createVessel,
  updateVessel,
  deleteVessel,
} from "@/lib/vessel-service";
import { Port, fetchPorts } from "@/lib/port-service";
import { Product, fetchProducts } from "@/lib/product-service";
import {
  getVesselManifests,
  addManifestLine,
  updateManifestLine,
  deleteManifestLine,
  updateManifestStatus,
  VesselManifestItem,
  CreateManifestItemData,
  MANIFEST_STATUSES,
  getStatusLabel,
  getStatusColor,
} from "@/lib/vessel-manifest-service";

export default function VesselsPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddVesselOpen, setIsAddVesselOpen] = useState(false);
  const [isEditVesselOpen, setIsEditVesselOpen] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    delivery_status: "",
    arrival_date: "",
    discharge_date: "",
    port_transfer_date: "",
  });
  const [isViewVesselOpen, setIsViewVesselOpen] = useState(false);
  const [viewVessel, setViewVessel] = useState<Vessel | null>(null);

  // Manifest states
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [isAddManifestOpen, setIsAddManifestOpen] = useState(false);
  const [isEditManifestOpen, setIsEditManifestOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] =
    useState<VesselManifestItem | null>(null);
  const [manifests, setManifests] = useState<VesselManifestItem[]>([]);
  const [manifestFormData, setManifestFormData] =
    useState<CreateManifestItemData>({
      product_id: 0,
      discharge_port_id: 0,
      quantity_mt: 0,
      bl_no: "",
      arrival_date: "",
      notes: "",
    });

  // Multiple product selection states
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      product_id: number;
      quantity_mt: number;
      product_name: string;
    }>
  >([]);
  const [bulkManifestData, setBulkManifestData] = useState({
    discharge_port_id: 0,
    arrival_date: "",
    notes: "",
  });
  const [formData, setFormData] = useState<CreateVesselData>({
    name: "",
    bl_number: "",
    arrival_date: "",
    description: "",
    port_id: undefined,
    status: "active",
    delivery_status: "in_transit",
    discharge_date: "",
    port_transfer_date: "",
  });

  useEffect(() => {
    loadVessels();
    loadPorts();
    loadProducts();
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadVessels = async () => {
    try {
      setIsLoading(true);
      const data = await fetchVessels({
        search: searchTerm || undefined,
      });
      setVessels(data);
    } catch (error: any) {
      toast.error("Failed to load vessels");
      console.error("Error loading vessels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPorts = async () => {
    try {
      const data = await fetchPorts();
      setPorts(data);
    } catch (error: any) {
      console.error("Error loading ports:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (error: any) {
      console.error("Error loading products:", error);
    }
  };

  const summaryData = {
    totalVessels: vessels.length,
    totalCapacity: vessels.reduce((sum, vessel) => {
      const vesselProducts = vessel.vessel_products || [];
      const vesselStock = vesselProducts.reduce(
        (productSum, product) =>
          productSum + (Number(product.available_quantity) || 0),
        0
      );
      return sum + vesselStock;
    }, 0),
    arrivedVessels: vessels.filter((vessel) => vessel.arrival_date).length,
    dischargedVessels: vessels.filter((vessel) => vessel.discharge_date).length,
    movedToPortVessels: vessels.filter(
      (vessel) =>
        (!vessel.has_products &&
          vessel.delivery_status === "closed" &&
          (vessel.arrival_date ||
            vessel.discharge_date ||
            vessel.port_transfer_date)) ||
        vessel.delivery_status === "moved_to_port"
    ).length,
  };

  const handleCreateVessel = async () => {
    try {
      await createVessel(formData);
      toast.success("Vessel created successfully");
      resetForm();
      setIsAddVesselOpen(false);
      loadVessels();
    } catch (error: any) {
      toast.error("Failed to create vessel");
      console.error("Error creating vessel:", error);
    }
  };

  const handleUpdateVessel = async () => {
    if (!selectedVessel) return;
    try {
      await updateVessel(selectedVessel.id, formData);
      toast.success("Vessel updated successfully");
      resetForm();
      setIsEditVesselOpen(false);
      setSelectedVessel(null);
      loadVessels();
    } catch (error: any) {
      toast.error("Failed to update vessel");
      console.error("Error updating vessel:", error);
    }
  };

  const handleDeleteVessel = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vessel?")) {
      try {
        await deleteVessel(id);
        toast.success("Vessel deleted successfully");
        loadVessels();
      } catch (error: any) {
        toast.error("Failed to delete vessel");
        console.error("Error deleting vessel:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      bl_number: "",
      arrival_date: "",
      description: "",
      port_id: undefined,
      status: "active",
      delivery_status: "in_transit",
      discharge_date: "",
      port_transfer_date: "",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(vessels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVessels = vessels.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const openEditDialog = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setFormData({
      name: vessel.name,
      bl_number: vessel.bl_number || "",
      arrival_date: vessel.arrival_date || "",
      description: vessel.description || "",
      port_id: vessel.port_id,
      status: vessel.status || "active",
      delivery_status: vessel.delivery_status || "in_transit",
      discharge_date: vessel.discharge_date || "",
      port_transfer_date: vessel.port_transfer_date || "",
    });
    setIsEditVesselOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddVesselOpen(true);
  };

  const openStatusUpdateDialog = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setStatusUpdateData({
      delivery_status: vessel.delivery_status || "in_transit",
      arrival_date: vessel.arrival_date || "",
      discharge_date: vessel.discharge_date || "",
      port_transfer_date: vessel.port_transfer_date || "",
    });
    setIsStatusUpdateOpen(true);
  };

  const openViewVesselDialog = (vessel: Vessel) => {
    setViewVessel(vessel);
    setIsViewVesselOpen(true);
  };

  const handleVesselStatusUpdate = async () => {
    if (!selectedVessel) return;

    try {
      // Prepare the update data with required fields based on status
      const updateData: any = {
        delivery_status: statusUpdateData.delivery_status,
      };

      // Add required date fields based on status
      if (statusUpdateData.delivery_status === "arrived") {
        // Use the date from the form if provided, otherwise use the vessel's existing date
        updateData.arrival_date =
          statusUpdateData.arrival_date || selectedVessel.arrival_date;
      }
      if (statusUpdateData.delivery_status === "discharged") {
        // Use the date from the form if provided, otherwise use the vessel's existing date
        updateData.discharge_date =
          statusUpdateData.discharge_date || selectedVessel.discharge_date;
      }
      if (statusUpdateData.delivery_status === "moved_to_port") {
        // Use the date from the form if provided, otherwise use the vessel's existing date
        updateData.port_transfer_date =
          statusUpdateData.port_transfer_date ||
          selectedVessel.port_transfer_date;
      }

      console.log("Updating vessel with data:", updateData);

      await updateVessel(selectedVessel.id, updateData);
      toast.success("Vessel status updated successfully");
      setIsStatusUpdateOpen(false);
      setSelectedVessel(null);
      loadVessels();
    } catch (error: any) {
      console.error("Error updating vessel status:", error);
      const errorMessage =
        error?.response?.data?.error || "Failed to update vessel status";
      toast.error(errorMessage);
    }
  };

  // Manifest functions
  const loadManifests = async (vesselId: number) => {
    try {
      console.log("Loading manifests for vessel ID:", vesselId);
      const data = await getVesselManifests(vesselId);
      console.log("Manifests data received:", data);
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));

      // Ensure we always have an array
      const manifestsArray = Array.isArray(data) ? data : [];
      console.log("Number of manifests:", manifestsArray.length);

      if (manifestsArray.length > 0) {
        console.log("First manifest structure:", manifestsArray[0]);
        console.log(
          "First manifest discharge_port:",
          manifestsArray[0].discharge_port
        );
        console.log(
          "All manifests discharge_ports:",
          manifestsArray.map((m) => ({
            id: m.id,
            discharge_port: m.discharge_port,
          }))
        );
      }

      setManifests(manifestsArray);
      console.log("Manifests state set, current manifests:", manifestsArray);
    } catch (error: any) {
      console.error("Error loading manifests:", error);
      console.error("Error details:", error.response?.data);
      toast.error("Failed to load manifests");
      // Set empty array on error to prevent map error
      setManifests([]);
    }
  };

  const openAddManifestDialog = () => {
    setManifestFormData({
      product_id: 0,
      discharge_port_id: 0,
      quantity_mt: 0,
      bl_no: "",
      arrival_date: "",
      notes: "",
    });
    setIsAddManifestOpen(true);
  };

  const openEditManifestDialog = (manifest: VesselManifestItem) => {
    setSelectedManifest(manifest);
    setManifestFormData({
      product_id: manifest.product_id,
      discharge_port_id: manifest.discharge_port_id || 0,
      quantity_mt: manifest.quantity_mt,
      bl_no: manifest.bl_no || "",
      arrival_date: manifest.arrival_date || "",
      notes: manifest.notes || "",
    });
    setIsEditManifestOpen(true);
  };

  const handleCreateManifest = async () => {
    if (!selectedVessel) return;

    // Validate form data
    if (
      !manifestFormData.product_id ||
      !manifestFormData.discharge_port_id ||
      !manifestFormData.quantity_mt ||
      !manifestFormData.arrival_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate stock availability
    const product = products.find((p) => p.id === manifestFormData.product_id);
    if (
      product &&
      (Number(product.metric_ton) || 0) < manifestFormData.quantity_mt
    ) {
      toast.error(
        `Insufficient stock for ${product.name}. Available: ${
          product.metric_ton || 0
        } MT, Requested: ${manifestFormData.quantity_mt} MT`
      );
      return;
    }

    try {
      console.log("Creating manifest for vessel ID:", selectedVessel.id);
      console.log("Manifest form data:", manifestFormData);
      const newManifest = await addManifestLine(
        selectedVessel.id,
        manifestFormData
      );
      console.log("New manifest created:", newManifest);
      toast.success("Product added to manifest successfully");
      console.log("Reloading manifests...");
      await loadManifests(selectedVessel.id);
      setIsAddManifestOpen(false);
      resetManifestForm();
    } catch (error: any) {
      toast.error("Failed to add product to manifest");
      console.error("Error adding manifest:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const handleUpdateManifest = async () => {
    if (!selectedManifest) return;

    // Validate stock availability
    const product = products.find((p) => p.id === manifestFormData.product_id);
    if (product) {
      // For updates, we need to consider the current manifest quantity
      let availableStock = Number(product.metric_ton) || 0;

      // If updating the same product, add back the current quantity
      if (selectedManifest.product_id === manifestFormData.product_id) {
        availableStock += selectedManifest.quantity_mt;
      }

      if (availableStock < manifestFormData.quantity_mt) {
        toast.error(
          `Insufficient stock for ${product.name}. Available: ${availableStock} MT, Requested: ${manifestFormData.quantity_mt} MT`
        );
        return;
      }
    }

    try {
      await updateManifestLine(selectedManifest.id, manifestFormData);
      toast.success("Manifest updated successfully");
      if (selectedVessel) {
        await loadManifests(selectedVessel.id);
      }
      setIsEditManifestOpen(false);
      setSelectedManifest(null);
      resetManifestForm();
    } catch (error: any) {
      toast.error("Failed to update manifest");
      console.error("Error updating manifest:", error);
    }
  };

  const handleDeleteManifest = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this manifest item?")) {
      try {
        await deleteManifestLine(id);
        toast.success("Manifest item deleted successfully");
        if (selectedVessel) {
          await loadManifests(selectedVessel.id);
        }
      } catch (error: any) {
        toast.error("Failed to delete manifest item");
        console.error("Error deleting manifest:", error);
      }
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await updateManifestStatus(id, newStatus);
      toast.success("Status updated successfully");
      if (selectedVessel) {
        await loadManifests(selectedVessel.id);
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const resetManifestForm = () => {
    setManifestFormData({
      product_id: 0,
      discharge_port_id: 0,
      quantity_mt: 0,
      bl_no: "",
      arrival_date: "",
      notes: "",
    });
  };

  // Multiple product selection functions
  const addProductToSelection = (productId: number, productName: string) => {
    if (!selectedProducts.find((p) => p.product_id === productId)) {
      setSelectedProducts([
        ...selectedProducts,
        {
          product_id: productId,
          quantity_mt: 0,
          product_name: productName,
        },
      ]);
    }
  };

  const removeProductFromSelection = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.product_id !== productId)
    );
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.product_id === productId ? { ...p, quantity_mt: quantity } : p
      )
    );
  };

  const resetBulkManifestForm = () => {
    setSelectedProducts([]);
    setBulkManifestData({
      discharge_port_id: 0,
      arrival_date: "",
      notes: "",
    });
  };

  const handleBulkCreateManifest = async () => {
    if (!selectedVessel) return;

    // Validate form data
    if (
      !bulkManifestData.discharge_port_id ||
      !bulkManifestData.arrival_date ||
      selectedProducts.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and select at least one product"
      );
      return;
    }

    // Validate quantities
    const invalidProducts = selectedProducts.filter((p) => p.quantity_mt <= 0);
    if (invalidProducts.length > 0) {
      toast.error("Please enter valid quantities for all selected products");
      return;
    }

    // Validate stock availability
    const insufficientStockProducts = selectedProducts.filter((p) => {
      const product = products.find((prod) => prod.id === p.product_id);
      if (!product) return true; // Product not found
      return (Number(product.metric_ton) || 0) < p.quantity_mt;
    });

    if (insufficientStockProducts.length > 0) {
      const productNames = insufficientStockProducts
        .map((p) => p.product_name)
        .join(", ");
      toast.error(
        `Insufficient stock for products: ${productNames}. Please check available quantities.`
      );
      return;
    }

    try {
      console.log("Creating bulk manifest for vessel ID:", selectedVessel.id);
      console.log("Selected products:", selectedProducts);
      console.log("Bulk manifest data:", bulkManifestData);

      // Create manifests for each selected product
      for (const product of selectedProducts) {
        const manifestData = {
          product_id: product.product_id,
          discharge_port_id: bulkManifestData.discharge_port_id,
          quantity_mt: product.quantity_mt,
          arrival_date: bulkManifestData.arrival_date,
          notes: bulkManifestData.notes,
        };

        await addManifestLine(selectedVessel.id, manifestData);
      }

      toast.success(
        `${selectedProducts.length} products added to manifest successfully`
      );
      console.log("Reloading manifests...");
      await loadManifests(selectedVessel.id);
      setIsAddManifestOpen(false);
      resetBulkManifestForm();
    } catch (error: any) {
      toast.error("Failed to add products to manifest");
      console.error("Error adding bulk manifest:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-black text-white">In Transit</Badge>;
      case "inactive":
        return <Badge className="bg-blue-500 text-white">Loading</Badge>;
      case "under_repair":
        return <Badge className="bg-red-500 text-white">Maintenance</Badge>;
      case "scrapped":
        return <Badge className="bg-green-500 text-white">Docked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vessel Management</h2>
        <Button className="bg-black text-white" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vessel
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Ship className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Vessels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.totalVessels}
                </p>
                <p className="text-xs text-gray-500">Active fleet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Anchor className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Arrived Vessels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.arrivedVessels}
                </p>
                <p className="text-xs text-gray-500">With arrival dates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Capacity
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.totalCapacity.toLocaleString()} MT
                </p>
                <p className="text-xs text-gray-500">Combined fleet capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Discharged Vessels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.dischargedVessels}
                </p>
                <p className="text-xs text-gray-500">Discharge started</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Moved to Port
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.movedToPortVessels}
                </p>
                <p className="text-xs text-gray-500">Products relocated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vessels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vessels</CardTitle>
          <CardDescription>
            Manage and monitor all vessels in the fleet
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vessels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vessel Name</TableHead>
                <TableHead>BL Number</TableHead>
                <TableHead>Date Of Arrival</TableHead>
                <TableHead>Port of Unloading</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total Stock (MT)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVessels.map((vessel) => {
                const vesselProducts = vessel.vessel_products || [];
                const totalStock = vesselProducts.reduce(
                  (sum, product) =>
                    sum + (Number(product.available_quantity) || 0),
                  0
                );

                // Check if vessel has moved products to port (closed, no products, has delivery date)
                const hasMovedProductsToPort =
                  !vessel.has_products &&
                  vessel.delivery_status === "closed" &&
                  (vessel.arrival_date ||
                    vessel.discharge_date ||
                    vessel.port_transfer_date);

                // Alternative condition: vessel with moved_to_port status (for testing)
                const hasMovedToPortStatus =
                  vessel.delivery_status === "moved_to_port";

                return (
                  <TableRow
                    key={vessel.id}
                    className={
                      hasMovedProductsToPort || hasMovedToPortStatus
                        ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{vessel.name}</span>
                        {(hasMovedProductsToPort || hasMovedToPortStatus) && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-100 text-blue-700 border-blue-300"
                            title="Products moved to port"
                          >
                            <Package className="h-3 w-3 mr-1" />
                            Moved
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vessel.bl_number ? (
                        <Badge
                          variant="outline"
                          className="font-mono bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {vessel.bl_number}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-muted-foreground"
                        >
                          N/A
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {vessel.arrival_date
                        ? new Date(vessel.arrival_date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{vessel.port?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          !vessel.has_products
                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                            : "cursor-pointer hover:opacity-80 transition-opacity"
                        } ${
                          !vessel.has_products
                            ? "bg-gray-100 text-gray-600"
                            : vessel.delivery_status === "in_transit"
                            ? "bg-blue-100 text-blue-800"
                            : vessel.delivery_status === "arrived"
                            ? "bg-green-100 text-green-800"
                            : vessel.delivery_status === "discharged"
                            ? "bg-yellow-100 text-yellow-800"
                            : vessel.delivery_status === "moved_to_port"
                            ? "bg-purple-100 text-purple-800"
                            : vessel.delivery_status === "closed"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        onClick={() => {
                          if (vessel.has_products) {
                            openStatusUpdateDialog(vessel);
                          }
                        }}
                        title={
                          !vessel.has_products
                            ? "Vessel has no products - status cannot be changed"
                            : "Click to update delivery status"
                        }
                      >
                        {!vessel.has_products
                          ? "Closed"
                          : vessel.delivery_status_label || "In Transit"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {vesselProducts.length > 0 ? (
                          <div className="space-y-2">
                            {vesselProducts
                              .slice(0, 3)
                              .map((product, index) => (
                                <div
                                  key={product.id}
                                  className="flex flex-col space-y-1 p-2 bg-gray-50 rounded-md border"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-50 text-green-700 border-green-200 font-medium"
                                    >
                                      {product.name}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-mono"
                                    >
                                      {Number(
                                        product.available_quantity || 0
                                      ).toLocaleString()}{" "}
                                      {product.unit}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            {vesselProducts.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center py-1">
                                +{vesselProducts.length - 3} more products
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-muted-foreground"
                          >
                            No products
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {totalStock.toLocaleString()} MT
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          vessel.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : vessel.status === "inactive"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : vessel.status === "discharged"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : vessel.status === "arrived"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {vessel.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewVesselDialog(vessel)}
                          title="View Vessel Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(vessel)}
                          title="Edit Vessel"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVessel(vessel.id)}
                          title="Delete Vessel"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {vessels.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, vessels.length)} of {vessels.length}{" "}
                  vessels
                </span>
                <div className="flex items-center space-x-2">
                  <span>Rows per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Vessel Dialog */}
      <Dialog open={isAddVesselOpen} onOpenChange={setIsAddVesselOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Vessel</DialogTitle>
            <DialogDescription>
              Register a new vessel in the fleet management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vessel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter vessel name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bl_number">BL Number</Label>
                <Input
                  id="bl_number"
                  value={formData.bl_number || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bl_number: e.target.value })
                  }
                  placeholder="Leave empty for auto-generation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4"></div>

            <div className="space-y-2">
              <Label htmlFor="port_id">Port</Label>
              <Select
                value={formData.port_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    port_id: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a port" />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={port.id.toString()}>
                      {port.name} ({port.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter vessel description"
                rows={3}
              />
            </div>

            <div className="text-xs text-gray-500">
              <p>
                If BL Number is left empty, a unique BL number will be
                automatically generated
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddVesselOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleCreateVessel}
            >
              Add Vessel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vessel Dialog */}
      <Dialog open={isEditVesselOpen} onOpenChange={setIsEditVesselOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Vessel</DialogTitle>
            <DialogDescription>
              Update vessel information in the fleet management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Vessel Name *</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter vessel name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_bl_number">BL Number</Label>
              <Input
                id="edit_bl_number"
                value={formData.bl_number || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bl_number: e.target.value })
                }
                placeholder="Enter Bill of Lading number"
              />
              <p className="text-xs text-gray-500">
                BL Number is unique per vessel
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_port_id">Port</Label>
              <Select
                value={formData.port_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    port_id: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a port" />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={port.id.toString()}>
                      {port.name} ({port.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter vessel description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditVesselOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleUpdateVessel}
            >
              Update Vessel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vessel Manifests Dialog */}
      <Dialog open={isManifestOpen} onOpenChange={setIsManifestOpen}>
        <DialogContent className="sm:max-w-[1000px] overflow-x-auto">
          <DialogHeader>
            <DialogTitle>Manifests - {selectedVessel?.name}</DialogTitle>
            <DialogDescription>
              Manage product manifests for this vessel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Manifest Items</h3>
              <Button
                onClick={openAddManifestDialog}
                className="bg-black text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity (MT)</TableHead>
                    <TableHead>Discharge Port</TableHead>
                    <TableHead>BL Number</TableHead>
                    <TableHead>Arrival Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manifests && manifests.length > 0 ? (
                    manifests.map((manifest) => (
                      <TableRow key={manifest.id}>
                        <TableCell className="font-medium">
                          {manifest.product?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {manifest.quantity_mt.toLocaleString()} MT
                        </TableCell>
                        <TableCell>
                          {(() => {
                            console.log(
                              `Rendering manifest ${manifest.id} discharge_port:`,
                              manifest.discharge_port
                            );
                            return manifest.discharge_port?.name || "N/A";
                          })()}
                        </TableCell>
                        <TableCell>{manifest.bl_no || "N/A"}</TableCell>
                        <TableCell>
                          {manifest.arrival_date
                            ? new Date(
                                manifest.arrival_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(manifest.status)}>
                              {getStatusLabel(manifest.status)}
                            </Badge>
                            <Select
                              value={manifest.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(manifest.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={MANIFEST_STATUSES.PENDING}>
                                  Pending
                                </SelectItem>
                                <SelectItem value={MANIFEST_STATUSES.LOADING}>
                                  Loading
                                </SelectItem>
                                <SelectItem
                                  value={MANIFEST_STATUSES.DISCHARGING}
                                >
                                  Discharging
                                </SelectItem>
                                <SelectItem value={MANIFEST_STATUSES.COMPLETED}>
                                  Completed
                                </SelectItem>
                                <SelectItem value={MANIFEST_STATUSES.CANCELLED}>
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditManifestDialog(manifest)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteManifest(manifest.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No manifest items found. Click "Add Product" to get
                        started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsManifestOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Manifest Item Dialog */}
      <Dialog open={isAddManifestOpen} onOpenChange={setIsAddManifestOpen}>
        <DialogContent className="sm:max-w-[900px] overflow-x-auto">
          <DialogHeader>
            <DialogTitle>Add Products to Manifest</DialogTitle>
            <DialogDescription>
              Add multiple products to the vessel manifest with individual
              quantities.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label>Select Products *</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={selectedProducts.some(
                          (p) => p.product_id === product.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addProductToSelection(product.id, product.name);
                          } else {
                            removeProductFromSelection(product.id);
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm font-medium"
                      >
                        {product.name} ({product.category}) - Stock:{" "}
                        {product.metric_ton || 0} MT
                      </label>
                    </div>
                    {selectedProducts.some(
                      (p) => p.product_id === product.id
                    ) && (
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor={`qty-${product.id}`}
                          className="text-xs"
                        >
                          Qty (MT):
                        </Label>
                        <Input
                          id={`qty-${product.id}`}
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={product.metric_ton || 0}
                          value={
                            selectedProducts.find(
                              (p) => p.product_id === product.id
                            )?.quantity_mt || 0
                          }
                          onChange={(e) =>
                            updateProductQuantity(
                              product.id,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 h-8 text-xs"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Products Summary */}
            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Products ({selectedProducts.length})</Label>
                <div className="border rounded-lg p-3 bg-gray-50">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">{product.product_name}</span>
                      <span className="text-sm font-medium">
                        {product.quantity_mt} MT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk_discharge_port_id">Discharge Port *</Label>
                <Select
                  value={bulkManifestData.discharge_port_id.toString()}
                  onValueChange={(value) =>
                    setBulkManifestData({
                      ...bulkManifestData,
                      discharge_port_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a port" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.id.toString()}>
                        {port.name} ({port.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk_bl_no">BL Number</Label>
                <Input
                  id="bulk_bl_no"
                  value={selectedVessel?.bl_number || ""}
                  disabled
                  placeholder="BL Number from vessel"
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">
                  BL Number is automatically taken from the vessel
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk_arrival_date">Arrival Date *</Label>
                <Input
                  id="bulk_arrival_date"
                  type="date"
                  value={bulkManifestData.arrival_date}
                  onChange={(e) =>
                    setBulkManifestData({
                      ...bulkManifestData,
                      arrival_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk_notes">Notes</Label>
                <Input
                  id="bulk_notes"
                  value={bulkManifestData.notes}
                  onChange={(e) =>
                    setBulkManifestData({
                      ...bulkManifestData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddManifestOpen(false);
                resetBulkManifestForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleBulkCreateManifest}
              disabled={selectedProducts.length === 0}
            >
              Add {selectedProducts.length} Product
              {selectedProducts.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Manifest Item Dialog */}
      <Dialog open={isEditManifestOpen} onOpenChange={setIsEditManifestOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Manifest Item</DialogTitle>
            <DialogDescription>
              Update the manifest item details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_manifest_product_id">Product *</Label>
              <Select
                value={manifestFormData.product_id.toString()}
                onValueChange={(value) =>
                  setManifestFormData({
                    ...manifestFormData,
                    product_id: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} ({product.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_manifest_discharge_port_id">
                Discharge Port *
              </Label>
              <Select
                value={manifestFormData.discharge_port_id?.toString() || "0"}
                onValueChange={(value) =>
                  setManifestFormData({
                    ...manifestFormData,
                    discharge_port_id: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a port" />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={port.id.toString()}>
                      {port.name} ({port.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_manifest_quantity_mt">Quantity (MT) *</Label>
              <Input
                id="edit_manifest_quantity_mt"
                type="number"
                step="0.01"
                value={manifestFormData.quantity_mt || ""}
                onChange={(e) =>
                  setManifestFormData({
                    ...manifestFormData,
                    quantity_mt: e.target.value
                      ? parseFloat(e.target.value)
                      : 0,
                  })
                }
                placeholder="Enter quantity in metric tons"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_manifest_bl_no">BL Number</Label>
              <Input
                id="edit_manifest_bl_no"
                value={selectedVessel?.bl_number || ""}
                disabled
                placeholder="BL Number from vessel"
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                BL Number is automatically taken from the vessel
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_manifest_arrival_date">Arrival Date *</Label>
              <Input
                id="edit_manifest_arrival_date"
                type="date"
                value={manifestFormData.arrival_date}
                onChange={(e) =>
                  setManifestFormData({
                    ...manifestFormData,
                    arrival_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_manifest_notes">Notes</Label>
              <Textarea
                id="edit_manifest_notes"
                value={manifestFormData.notes || ""}
                onChange={(e) =>
                  setManifestFormData({
                    ...manifestFormData,
                    notes: e.target.value,
                  })
                }
                placeholder="Enter additional notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditManifestOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleUpdateManifest}
            >
              Update Manifest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update the delivery status for {selectedVessel?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status_delivery_status">Delivery Status</Label>
              <Select
                value={statusUpdateData.delivery_status}
                onValueChange={(value) =>
                  setStatusUpdateData({
                    ...statusUpdateData,
                    delivery_status: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Vessels Arrived</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                  <SelectItem value="moved_to_port">Moved to Port</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {statusUpdateData.delivery_status === "arrived" && (
              <div className="space-y-2">
                <Label htmlFor="status_arrival_date">Arrival Date</Label>
                <Input
                  id="status_arrival_date"
                  type="date"
                  value={
                    statusUpdateData.arrival_date ||
                    selectedVessel?.arrival_date ||
                    ""
                  }
                  onChange={(e) =>
                    setStatusUpdateData({
                      ...statusUpdateData,
                      arrival_date: e.target.value,
                    })
                  }
                  required
                />
                {selectedVessel?.arrival_date && (
                  <p className="text-xs text-gray-500">
                    Current date:{" "}
                    {new Date(selectedVessel.arrival_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {statusUpdateData.delivery_status === "discharged" && (
              <div className="space-y-2">
                <Label htmlFor="status_discharge_date">Discharge Date</Label>
                <Input
                  id="status_discharge_date"
                  type="date"
                  value={
                    statusUpdateData.discharge_date ||
                    selectedVessel?.discharge_date ||
                    ""
                  }
                  onChange={(e) =>
                    setStatusUpdateData({
                      ...statusUpdateData,
                      discharge_date: e.target.value,
                    })
                  }
                  required
                />
                {selectedVessel?.discharge_date && (
                  <p className="text-xs text-gray-500">
                    Current date:{" "}
                    {new Date(
                      selectedVessel.discharge_date
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {statusUpdateData.delivery_status === "moved_to_port" && (
              <div className="space-y-2">
                <Label htmlFor="status_port_transfer_date">
                  Port Transfer Date
                </Label>
                <Input
                  id="status_port_transfer_date"
                  type="date"
                  value={
                    statusUpdateData.port_transfer_date ||
                    selectedVessel?.port_transfer_date ||
                    ""
                  }
                  onChange={(e) =>
                    setStatusUpdateData({
                      ...statusUpdateData,
                      port_transfer_date: e.target.value,
                    })
                  }
                  required
                />
                {selectedVessel?.port_transfer_date && (
                  <p className="text-xs text-gray-500">
                    Current date:{" "}
                    {new Date(
                      selectedVessel.port_transfer_date
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsStatusUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white"
              onClick={handleVesselStatusUpdate}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Vessel Details Dialog */}
      <Dialog open={isViewVesselOpen} onOpenChange={setIsViewVesselOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vessel Details</DialogTitle>
            <DialogDescription>
              Complete information for {viewVessel?.name}
            </DialogDescription>
          </DialogHeader>

          {viewVessel && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Vessel Name
                  </Label>
                  <p className="text-lg font-semibold">{viewVessel.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    BL Number
                  </Label>
                  <p className="text-lg">{viewVessel.bl_number || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Port of Unloading
                  </Label>
                  <p className="text-lg">{viewVessel.port?.name || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <Badge
                    className={
                      viewVessel.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {viewVessel.status || "active"}
                  </Badge>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Delivery Status
                </Label>
                <Badge
                  className={`${
                    !viewVessel.has_products
                      ? "bg-gray-100 text-gray-600"
                      : viewVessel.delivery_status === "in_transit"
                      ? "bg-blue-100 text-blue-800"
                      : viewVessel.delivery_status === "arrived"
                      ? "bg-green-100 text-green-800"
                      : viewVessel.delivery_status === "discharged"
                      ? "bg-yellow-100 text-yellow-800"
                      : viewVessel.delivery_status === "moved_to_port"
                      ? "bg-purple-100 text-purple-800"
                      : viewVessel.delivery_status === "closed"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {!viewVessel.has_products
                    ? "Closed"
                    : viewVessel.delivery_status_label || "In Transit"}
                </Badge>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Arrival Date
                  </Label>
                  <p className="text-lg">
                    {viewVessel.arrival_date
                      ? new Date(viewVessel.arrival_date).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Discharge Date
                  </Label>
                  <p className="text-lg">
                    {viewVessel.discharge_date
                      ? new Date(viewVessel.discharge_date).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Port Transfer Date
                  </Label>
                  <p className="text-lg">
                    {viewVessel.port_transfer_date
                      ? new Date(
                          viewVessel.port_transfer_date
                        ).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {viewVessel.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Description
                  </Label>
                  <p className="text-lg">{viewVessel.description}</p>
                </div>
              )}

              {/* Products */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-500">
                  Products ({viewVessel.vessel_products?.length || 0})
                </Label>
                {viewVessel.vessel_products &&
                viewVessel.vessel_products.length > 0 ? (
                  <div className="space-y-3">
                    {viewVessel.vessel_products.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-500">
                              Product Name
                            </Label>
                            <p className="font-semibold">{product.name}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-500">
                              Available Quantity
                            </Label>
                            <p className="font-semibold">
                              {product.available_quantity} MT
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-500">
                              Price
                            </Label>
                            <p className="font-semibold">${product.price}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-500">
                              Unit
                            </Label>
                            <p className="font-semibold">{product.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No products assigned to this vessel
                  </p>
                )}
              </div>

              {/* Total Stock */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Total Stock
                </Label>
                <p className="text-2xl font-bold text-blue-600">
                  {viewVessel.vessel_products?.reduce(
                    (sum, product) =>
                      sum + (Number(product.available_quantity) || 0),
                    0
                  ) || 0}{" "}
                  MT
                </p>
              </div>

              {/* Product Location History */}
              {viewVessel.product_location_history &&
                viewVessel.product_location_history.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-500">
                      Product Location History
                    </Label>
                    <div className="space-y-3">
                      {viewVessel.product_location_history.map(
                        (history, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-500">
                                  Product
                                </Label>
                                <p className="font-semibold">
                                  {history.product_name}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-500">
                                  From
                                </Label>
                                <p className="font-semibold">
                                  {history.from_location_type === "vessel"
                                    ? "Vessel"
                                    : history.from_location_type === "port"
                                    ? "Port"
                                    : history.from_location_type === "freezone"
                                    ? "Free Zone"
                                    : history.from_location_type}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-500">
                                  To
                                </Label>
                                <p className="font-semibold">
                                  {history.to_location_type === "vessel"
                                    ? "Vessel"
                                    : history.to_location_type === "port"
                                    ? "Port"
                                    : history.to_location_type === "freezone"
                                    ? "Free Zone"
                                    : history.to_location_type}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-500">
                                  Moved At
                                </Label>
                                <p className="font-semibold">
                                  {new Date(history.moved_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Label className="text-xs font-medium text-gray-500">
                                Reason
                              </Label>
                              <p className="text-sm text-gray-600">
                                {history.reason}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Created/Updated Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Created
                  </Label>
                  <p className="text-sm text-gray-600">
                    {new Date(viewVessel.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </Label>
                  <p className="text-sm text-gray-600">
                    {new Date(viewVessel.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewVesselOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
