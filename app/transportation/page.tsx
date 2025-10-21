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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Truck,
  Package,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Transportation,
  TransportationItem,
  CreateTransportationData,
  getTransportations,
  createTransportation,
  updateTransportationStatus,
  updateTransportation,
  deleteTransportation,
  getTransportationLocations,
  TransportationFilters,
} from "@/lib/transportation-service";
import { Product, fetchProducts } from "@/lib/product-service";
import {
  fetchProformaInvoices,
  ProformaInvoice,
} from "@/lib/proforma-invoice-service";
import { fetchVehicles, type Vehicle } from "@/lib/vehicle-service";

export default function TransportationPage() {
  const [transportations, setTransportations] = useState<Transportation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<{
    vessels: any[];
    free_zones: any[];
    ports: any[];
  }>({ vessels: [], free_zones: [], ports: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TransportationFilters>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransportation, setSelectedTransportation] =
    useState<Transportation | null>(null);
  const [selectedForEdit, setSelectedForEdit] = useState<Transportation | null>(
    null
  );
  const [selectedForDelete, setSelectedForDelete] =
    useState<Transportation | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState<CreateTransportationData>({
    type: "inbound",
    from_location_type: "vessel",
    from_location_id: 0,
    to_location_type: "free_zone",
    to_location_id: 0,
    vehicle_id: undefined,
    scheduled_date: "",
    notes: "",
    items: [],
  });
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      product_id: number;
      quantity_mt: number;
      product_name: string;
    }>
  >([]);

  // Outbound transportation states
  const [invoices, setInvoices] = useState<ProformaInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProformaInvoice | null>(null);
  const [outboundProducts, setOutboundProducts] = useState<
    Array<{
      product_id: number;
      product_name: string;
      unit_price: number;
      quantity: number;
      selected_quantity: number;
    }>
  >([]);
  const [totalTransportValue, setTotalTransportValue] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  // Load data
  useEffect(() => {
    loadData();
    loadInvoices();
  }, []);

  // Test vehicles loading
  useEffect(() => {
    const testVehicles = async () => {
      try {
        const testData = await fetchVehicles();
        console.log("Test vehicles fetch:", testData);
      } catch (error) {
        console.error("Test vehicles error:", error);
      }
    };
    testVehicles();
  }, []);

  // Filter products based on source location
  useEffect(() => {
    if (formData.from_location_type && formData.from_location_id) {
      filterProductsByLocation();
    }
  }, [formData.from_location_type, formData.from_location_id]);

  // Test API connecivity
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        console.log("API test response:", response.status, response.ok);
        if (!response.ok) {
          console.error(
            "API not responding properly:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("API connection failed:", error);
      }
    };
    testAPI();
  }, []);

  const filterProductsByLocation = () => {
    if (!formData.from_location_type || !formData.from_location_id) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      // Check new location system
      if (product.location_type && product.location_id) {
        // Handle freezone vs free_zone inconsistency
        if (
          product.location_type === "freezone" &&
          formData.from_location_type === "free_zone"
        ) {
          return product.location_id === formData.from_location_id;
        } else {
          return (
            product.location_type === formData.from_location_type &&
            product.location_id === formData.from_location_id
          );
        }
      }
      // Check legacy free_zone_id system
      else if (
        formData.from_location_type === "free_zone" &&
        product.free_zone_id
      ) {
        return product.free_zone_id === formData.from_location_id;
      }

      return false;
    });

    setFilteredProducts(filtered);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Loading data...");

      let transportationsData,
        productsData,
        locationsData,
        vehiclesData: Vehicle[];

      try {
        transportationsData = await getTransportations(filters);
        console.log("Transportations loaded:", transportationsData);
      } catch (error) {
        console.error("Transportations error:", error);
        transportationsData = { data: [] };
      }

      try {
        productsData = await fetchProducts();
        console.log("Products loaded:", productsData);
      } catch (error) {
        console.error("Products error:", error);
        productsData = { data: [] };
      }

      try {
        locationsData = await getTransportationLocations();
        console.log("Locations loaded:", locationsData);
      } catch (error) {
        console.error("Locations error:", error);
        locationsData = { vessels: [], free_zones: [], ports: [] };
      }

      try {
        vehiclesData = await fetchVehicles();
        console.log("Vehicles loaded:", vehiclesData);
      } catch (error) {
        console.error("Vehicles error:", error);
        vehiclesData = [] as Vehicle[];
      }

      setTransportations(transportationsData.data || []);
      setProducts(productsData.data || []);
      setFilteredProducts(productsData.data || []);
      setLocations(locationsData || { vessels: [], free_zones: [], ports: [] });
      setVehicles(vehiclesData || []);

      console.log("Final vehicles state:", vehiclesData);
      console.log("Vehicles array length:", vehiclesData?.length || 0);
    } catch (error: any) {
      console.error("General error loading data:", error);
      toast.error("Failed to load transportation data");
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    try {
      const invoicesData = await fetchProformaInvoices();
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Failed to load invoices");
    }
  };

  // Handle invoice selection for outbound transportation
  const handleInvoiceSelection = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id.toString() === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);

      // Calculate current balance (paid_amount only, no holded amount)
      const balance = invoice.paid_amount || 0;
      setCurrentBalance(balance);

      // Set outbound products from invoice items
      const products =
        invoice.items?.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price: item.unit_price,
          quantity: item.quantity,
          selected_quantity: 0,
        })) || [];
      setOutboundProducts(products);
      setTotalTransportValue(0);

      // Auto-set To Location Type to Customer and set customer as destination
      setFormData((prev) => ({
        ...prev,
        to_location_type: "customer",
        to_location_id: invoice.customer_id,
      }));
    } else {
      setSelectedInvoice(null);
      setOutboundProducts([]);
      setCurrentBalance(0);
      setTotalTransportValue(0);
    }
  };

  // Handle outbound product quantity change
  const handleOutboundProductQuantityChange = (
    productId: number,
    quantity: number
  ) => {
    setOutboundProducts((prev) =>
      prev.map((product) =>
        product.product_id === productId
          ? { ...product, selected_quantity: quantity }
          : product
      )
    );

    // Recalculate total transport value
    const updatedProducts = outboundProducts.map((product) =>
      product.product_id === productId
        ? { ...product, selected_quantity: quantity }
        : product
    );

    const total = updatedProducts.reduce(
      (sum, product) => sum + product.selected_quantity * product.unit_price,
      0
    );
    setTotalTransportValue(total);
  };

  // Reset form when transportation type changes
  const handleTypeChange = (type: string) => {
    setFormData({ ...formData, type: type as any });

    // Reset outbound-specific states
    if (type !== "outbound") {
      setSelectedInvoice(null);
      setOutboundProducts([]);
      setTotalTransportValue(0);
      setCurrentBalance(0);
    }
  };

  // Filter transportations based on active tab
  const getFilteredTransportations = () => {
    let filtered = transportations;

    if (activeTab !== "all") {
      if (activeTab === "delivered") {
        // Show only completed outbound transportations
        filtered = transportations.filter(
          (t) => t.type === "outbound" && t.status === "completed"
        );
      } else {
        filtered = transportations.filter((t) => t.type === activeTab);
      }
    }

    return filtered.filter(
      (transportation) =>
        transportation.reference_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transportation.from_location?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transportation.to_location?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  };

  const filteredTransportations = getFilteredTransportations();

  // Pagination logic
  const totalPages = Math.ceil(filteredTransportations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransportations = filteredTransportations.slice(
    startIndex,
    endIndex
  );

  const summary = {
    total: filteredTransportations.length,
    pending: filteredTransportations.filter((t) => t.status === "pending")
      .length,
    inTransit: filteredTransportations.filter((t) => t.status === "in_transit")
      .length,
    completed: filteredTransportations.filter((t) => t.status === "completed")
      .length,
    delivered: transportations.filter(
      (t) => t.type === "outbound" && t.status === "completed"
    ).length,
  };

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Helper functions
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

  const resetForm = () => {
    setFormData({
      type: "inbound",
      from_location_type: "vessel",
      from_location_id: 0,
      to_location_type: "free_zone",
      to_location_id: 0,
      scheduled_date: "",
      notes: "",
      items: [],
    });
    setSelectedProducts([]);
    setFilteredProducts(products);

    // Reset outbound-specific states
    setSelectedInvoice(null);
    setOutboundProducts([]);
    setTotalTransportValue(0);
    setCurrentBalance(0);
  };

  const handleCreateTransportation = async () => {
    // Validation for outbound transportation
    if (formData.type === "outbound") {
      if (!selectedInvoice) {
        toast.error("Please select an invoice for outbound transportation");
        return;
      }

      // Check if invoice has release number
      const hasReleaseNumber = selectedInvoice.payment_history?.some(
        (payment) =>
          payment.release_number && payment.release_number.trim() !== ""
      );

      if (!hasReleaseNumber) {
        toast.error(
          "Cannot create transportation: Invoice must have a release number"
        );
        return;
      }

      // Check if any products are selected
      const selectedOutboundProducts = outboundProducts.filter(
        (p) => p.selected_quantity > 0
      );
      if (selectedOutboundProducts.length === 0) {
        toast.error("Please select at least one product to transport");
        return;
      }

      // Check balance validation
      if (totalTransportValue > currentBalance) {
        toast.error(
          "Insufficient balance: Total transport value exceeds current balance"
        );
        return;
      }

      // Validate quantities
      const invalidProducts = selectedOutboundProducts.filter(
        (p) => p.selected_quantity <= 0
      );
      if (invalidProducts.length > 0) {
        toast.error("Please enter valid quantities for all selected products");
        return;
      }

      // Check stock availability at source location
      const insufficientStockProducts = selectedOutboundProducts.filter((p) => {
        const product = products.find((prod) => prod.id === p.product_id);
        if (!product) return true;

        // Check if product is at the source location
        if (
          product.location_type !== formData.from_location_type ||
          product.location_id !== formData.from_location_id
        ) {
          return true;
        }

        // Check if sufficient stock is available
        return (Number(product.metric_ton) || 0) < p.selected_quantity;
      });

      if (insufficientStockProducts.length > 0) {
        const productNames = insufficientStockProducts
          .map((p) => p.product_name)
          .join(", ");
        toast.error(
          `Insufficient stock for products: ${productNames}. Please check stock levels at the source location.`
        );
        return;
      }

      try {
        const transportationData = {
          ...formData,
          proforma_invoice_id: selectedInvoice.id,
          items: selectedOutboundProducts.map((p) => ({
            product_id: p.product_id,
            quantity_mt: p.selected_quantity,
            unit: "MT",
          })),
        };

        console.log(
          "Creating outbound transportation with data:",
          transportationData
        );
        console.log(
          "Number of outbound items:",
          transportationData.items.length
        );
        const result = await createTransportation(transportationData);
        console.log("Outbound transportation created successfully:", result);
        console.log("Created outbound transportation ID:", result.id);
        toast.success("Outbound transportation created successfully");
        setIsAddOpen(false);
        resetForm();
        loadData();
      } catch (error: any) {
        console.error("Error creating outbound transportation:", error);
        toast.error(
          `Failed to create transportation: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } else {
      // Validation for inbound/transfer transportation
      if (
        !formData.from_location_id ||
        !formData.to_location_id ||
        selectedProducts.length === 0
      ) {
        toast.error(
          "Please fill in all required fields and select at least one product"
        );
        return;
      }

      const invalidProducts = selectedProducts.filter(
        (p) => p.quantity_mt <= 0
      );
      if (invalidProducts.length > 0) {
        toast.error("Please enter valid quantities for all selected products");
        return;
      }

      try {
        const transportationData = {
          ...formData,
          items: selectedProducts.map((p) => ({
            product_id: p.product_id,
            quantity_mt: p.quantity_mt,
            unit: "MT",
          })),
        };

        console.log("Creating transportation with data:", transportationData);
        console.log("Number of items:", transportationData.items.length);
        const result = await createTransportation(transportationData);
        console.log("Transportation created successfully:", result);
        console.log("Created transportation ID:", result.id);
        toast.success("Transportation created successfully");
        setIsAddOpen(false);
        resetForm();
        loadData();
      } catch (error: any) {
        console.error("Error creating transportation:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        toast.error(
          `Failed to create transportation: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateTransportationStatus(id, { status: status as any });
      toast.success("Transportation status updated successfully");
      loadData();
    } catch (error: any) {
      toast.error("Failed to update transportation status");
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "inbound":
        return <Badge className="bg-green-100 text-green-800">Inbound</Badge>;
      case "outbound":
        return <Badge className="bg-red-100 text-red-800">Outbound</Badge>;
      case "transfer":
        return <Badge className="bg-blue-100 text-blue-800">Transfer</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  const getLocationOptions = (locationType: string) => {
    const locationKey =
      locationType === "vessel"
        ? "vessels"
        : locationType === "free_zone"
        ? "free_zones"
        : "ports";
    return locations[locationKey] || [];
  };

  const openEditModal = (transportation: Transportation) => {
    setSelectedForEdit(transportation);
    setFormData({
      type: transportation.type,
      from_location_type: transportation.from_location_type,
      from_location_id: transportation.from_location_id,
      to_location_type: transportation.to_location_type,
      to_location_id: transportation.to_location_id,
      vehicle_id: transportation.vehicle_id,
      proforma_invoice_id: transportation.proforma_invoice_id,
      scheduled_date: transportation.scheduled_date || "",
      actual_date: transportation.actual_date || "",
      notes: transportation.notes || "",
      items:
        transportation.items?.map((item) => ({
          product_id: item.product_id,
          quantity_mt: item.quantity_mt,
          unit: item.unit || "MT",
          notes: item.notes || "",
        })) || [],
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (transportation: Transportation) => {
    setSelectedForDelete(transportation);
    setIsDeleteOpen(true);
  };

  const handleEditTransportation = async () => {
    if (!selectedForEdit) return;

    try {
      const updated = await updateTransportation(selectedForEdit.id, formData);
      setTransportations((prev) =>
        prev.map((t) => (t.id === selectedForEdit.id ? updated : t))
      );
      setIsEditOpen(false);
      setSelectedForEdit(null);
      toast.success("Transportation updated successfully");
    } catch (e: any) {
      console.error("Update failed", e);
      const errorMessage =
        e.response?.data?.message || "Failed to update transportation";
      toast.error(errorMessage);
    }
  };

  const handleDeleteTransportation = async () => {
    if (!selectedForDelete) return;

    try {
      await deleteTransportation(selectedForDelete.id);
      setTransportations((prev) =>
        prev.filter((t) => t.id !== selectedForDelete.id)
      );
      setIsDeleteOpen(false);
      setSelectedForDelete(null);
      toast.success("Transportation deleted successfully");
    } catch (e: any) {
      console.error("Delete failed", e);
      const errorMessage =
        e.response?.data?.message || "Failed to delete transportation";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading transportation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Transportation Management
        </h2>
        <Button
          className="bg-black text-white"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Transportation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transportations
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.inTransit}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Transport</TabsTrigger>
          <TabsTrigger value="inbound">Inbound Transport</TabsTrigger>
          <TabsTrigger value="outbound">Outbound Transport</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transportations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                status: value === "all" ? undefined : (value as any),
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transportation Table */}
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all" && "All Transportations"}
                {activeTab === "inbound" && "Inbound Transportations"}
                {activeTab === "outbound" && "Outbound Transportations"}
                {activeTab === "transfer" && "Transfer Transportations"}
                {activeTab === "delivered" && "Delivered Products"}
              </CardTitle>
              <CardDescription>
                Manage transportation movements and track their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransportations.map((transportation) => (
                    <TableRow key={transportation.id}>
                      <TableCell className="font-medium">
                        {transportation.reference_number}
                      </TableCell>
                      <TableCell>{getTypeBadge(transportation.type)}</TableCell>
                      <TableCell>
                        {transportation.from_location?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {transportation.to_location?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {transportation.vehicle ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {transportation.vehicle.plate_number}
                            </div>
                            <div className="text-gray-500">
                              {transportation.vehicle.driver_name}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {transportation.scheduled_date
                          ? new Date(
                              transportation.scheduled_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transportation.status)}
                      </TableCell>
                      <TableCell>
                        {transportation.items?.length || 0} items
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTransportation(transportation);
                              setIsDetailOpen(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(transportation)}
                            title="Edit Transportation"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(transportation)}
                            title="Delete Transportation"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          {transportation.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(
                                  transportation.id,
                                  "in_transit"
                                )
                              }
                            >
                              Start
                            </Button>
                          )}
                          {transportation.status === "in_transit" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(
                                  transportation.id,
                                  "completed"
                                )
                              }
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredTransportations.length)} of{" "}
                {filteredTransportations.length} results
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
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
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Transportation Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Transportation</DialogTitle>
            <DialogDescription>
              Record a new transportation movement between locations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduled_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_location_type">From Location Type</Label>
                <Select
                  value={formData.from_location_type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      from_location_type: value as any,
                      from_location_id: 0,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vessel">Vessel</SelectItem>
                    <SelectItem value="free_zone">Free Zone</SelectItem>
                    <SelectItem value="port">Port</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="from_location_id">From Location</Label>
                <Select
                  value={
                    formData.from_location_id
                      ? formData.from_location_id.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      from_location_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const locationKey =
                        formData.from_location_type === "vessel"
                          ? "vessels"
                          : formData.from_location_type === "free_zone"
                          ? "free_zones"
                          : "ports";
                      const locationList = locations[locationKey] || [];
                      console.log(
                        "From Location - Type:",
                        formData.from_location_type,
                        "Key:",
                        locationKey,
                        "Data:",
                        locationList,
                        "Total locations:",
                        locationList.length
                      );
                      return locationList.map((location: any) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="to_location_type">To Location Type</Label>
                <Select
                  value={formData.to_location_type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      to_location_type: value as any,
                      to_location_id: 0,
                    })
                  }
                  disabled={formData.type === "outbound"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vessel">Vessel</SelectItem>
                    <SelectItem value="free_zone">Free Zone</SelectItem>
                    <SelectItem value="port">Port</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to_location_id">To Location</Label>
                <Select
                  value={
                    formData.to_location_id
                      ? formData.to_location_id.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      to_location_id: parseInt(value),
                    })
                  }
                  disabled={formData.type === "outbound"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      if (formData.to_location_type === "customer") {
                        // Show customers from invoices
                        const uniqueCustomers = invoices.reduce(
                          (acc: any[], invoice) => {
                            if (
                              invoice.customer &&
                              !acc.find((c) => c.id === invoice.customer?.id)
                            ) {
                              acc.push(invoice.customer);
                            }
                            return acc;
                          },
                          []
                        );

                        return uniqueCustomers.map((customer: any) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.company_name}
                          </SelectItem>
                        ));
                      } else {
                        const locationKey =
                          formData.to_location_type === "vessel"
                            ? "vessels"
                            : formData.to_location_type === "free_zone"
                            ? "free_zones"
                            : "ports";
                        const locationList = locations[locationKey] || [];
                        console.log(
                          "To Location - Type:",
                          formData.to_location_type,
                          "Key:",
                          locationKey,
                          "Data:",
                          locationList,
                          "Total locations:",
                          locationList.length
                        );
                        return locationList.map((location: any) => (
                          <SelectItem
                            key={location.id}
                            value={location.id.toString()}
                          >
                            {location.name}
                          </SelectItem>
                        ));
                      }
                    })()}
                  </SelectContent>
                </Select>
                {formData.type === "outbound" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically set to selected invoice's customer
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_id">Vehicle</Label>
                <div className="text-xs text-gray-500 mb-2">
                  Debug: {vehicles.length} vehicles loaded
                </div>
                <Select
                  value={
                    formData.vehicle_id
                      ? formData.vehicle_id.toString()
                      : undefined
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      vehicle_id: value ? parseInt(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length === 0 ? (
                      <SelectItem value="no-vehicles" disabled>
                        No vehicles available
                      </SelectItem>
                    ) : (
                      vehicles.map((vehicle) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                        >
                          {vehicle.plate_number} - {vehicle.driver_name} (
                          {vehicle.truck_type})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div></div>
            </div>

            {/* Outbound Transportation - Invoice Selection */}
            {formData.type === "outbound" && (
              <div>
                <Label>Select Invoice</Label>
                <Select onValueChange={handleInvoiceSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proforma invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.map((invoice) => (
                      <SelectItem
                        key={invoice.id}
                        value={invoice.id.toString()}
                      >
                        {invoice.pi_number} - {invoice.customer?.company_name} -
                        ${invoice.total_amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedInvoice && (
                  <div className="mt-4 space-y-4">
                    {/* Invoice Details */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Invoice Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">PI Number:</span>{" "}
                          {selectedInvoice.pi_number}
                        </div>
                        <div>
                          <span className="font-medium">Customer:</span>{" "}
                          {selectedInvoice.customer?.company_name}
                        </div>
                        <div>
                          <span className="font-medium">Total Amount:</span> $
                          {selectedInvoice.total_amount?.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Paid Amount:</span> $
                          {selectedInvoice.paid_amount?.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Holded Amount:</span> $
                          {selectedInvoice.holded_amount?.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Current Balance:</span>{" "}
                          ${currentBalance.toLocaleString()}
                        </div>
                      </div>

                      {/* Release Number Check */}
                      {(() => {
                        const hasReleaseNumber =
                          selectedInvoice.payment_history?.some((payment) => {
                            return (
                              payment.release_number &&
                              payment.release_number.trim() !== ""
                            );
                          });
                        const releaseNumber =
                          selectedInvoice.payment_history?.find(
                            (payment) =>
                              payment.release_number &&
                              payment.release_number.trim() !== ""
                          )?.release_number;

                        return hasReleaseNumber ? (
                          <div className="mt-2">
                            <span className="font-medium">Release Number:</span>{" "}
                            {releaseNumber}
                          </div>
                        ) : (
                          <div className="mt-2 text-red-600 font-medium">
                            ⚠️ No release number found. Transportation cannot be
                            created.
                          </div>
                        );
                      })()}
                    </div>

                    {/* Product Selection for Outbound */}
                    <div>
                      <Label>Select Products to Transport</Label>
                      <div className="border rounded-lg p-4 space-y-4">
                        {outboundProducts.map((product) => (
                          <div
                            key={product.product_id}
                            className="flex items-center space-x-4 p-3 border rounded"
                          >
                            <div className="flex-1">
                              <div className="font-medium">
                                {product.product_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                Unit Price: $
                                {product.unit_price.toLocaleString()} |
                                Available: {product.quantity} units
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">Quantity:</Label>
                              <Input
                                type="number"
                                min="0"
                                max={product.quantity}
                                value={product.selected_quantity}
                                onChange={(e) =>
                                  handleOutboundProductQuantityChange(
                                    product.product_id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-24"
                              />
                            </div>
                          </div>
                        ))}

                        {/* Total Calculation */}
                        {totalTransportValue > 0 && (
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Total Transport Value:
                              </span>
                              <span className="font-bold text-lg">
                                ${totalTransportValue.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium">
                                Current Balance:
                              </span>
                              <span className="font-bold">
                                ${currentBalance.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium">
                                Remaining Balance:
                              </span>
                              <span
                                className={`font-bold ${
                                  currentBalance - totalTransportValue < 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                $
                                {(
                                  currentBalance - totalTransportValue
                                ).toLocaleString()}
                              </span>
                            </div>
                            {currentBalance - totalTransportValue < 0 && (
                              <div className="mt-2 text-red-600 font-medium">
                                ⚠️ Insufficient Balance! Total transport value
                                exceeds current balance.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Product Selection for Inbound/Transfer */}
            {formData.type !== "outbound" && (
              <div>
                <Label>Products</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Select
                      onValueChange={(value) => {
                        const product = products.find(
                          (p) => p.id === parseInt(value)
                        );
                        if (product)
                          addProductToSelection(product.id, product.name);
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select products to transport" />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          console.log(
                            "Filtered products for selection:",
                            filteredProducts,
                            "Count:",
                            filteredProducts.length
                          );
                          return filteredProducts.map((product) => {
                            // Create location description
                            let locationDesc = "";
                            if (product.location_type && product.location_id) {
                              const locationTypeLabel =
                                product.location_type === "vessel"
                                  ? "Vessel"
                                  : product.location_type === "freezone"
                                  ? "Free Zone"
                                  : product.location_type === "port"
                                  ? "Port"
                                  : product.location_type === "transfer"
                                  ? "Customer"
                                  : product.location_type;
                              locationDesc = ` (${locationTypeLabel} ${product.location_id})`;
                            } else if (product.free_zone_id) {
                              locationDesc = ` (Free Zone ${product.free_zone_id})`;
                            } else {
                              locationDesc = " (No Location)";
                            }

                            return (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                {product.name}
                                {locationDesc} - Stock:{" "}
                                {product.metric_ton || 0} MT
                              </SelectItem>
                            );
                          });
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Products</Label>
                      {selectedProducts.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex items-center space-x-2 p-2 border rounded"
                        >
                          <span className="flex-1">{item.product_name}</span>
                          <Input
                            type="number"
                            placeholder="Quantity (MT)"
                            value={item.quantity_mt}
                            onChange={(e) =>
                              updateProductQuantity(
                                item.product_id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeProductFromSelection(item.product_id)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTransportation}>
              Create Transportation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transportation Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Transportation Details -{" "}
              {selectedTransportation?.reference_number}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this transportation movement.
            </DialogDescription>
          </DialogHeader>
          {selectedTransportation && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Reference Number
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransportation.reference_number}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">
                    {getTypeBadge(selectedTransportation.type)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {getStatusBadge(selectedTransportation.status)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Scheduled Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransportation.scheduled_date
                      ? new Date(
                          selectedTransportation.scheduled_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">From</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransportation.from_location?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">To</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransportation.to_location?.name || "N/A"}
                  </p>
                </div>
              </div>

              {selectedTransportation.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransportation.notes}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransportation.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product?.name || "N/A"}</TableCell>
                        <TableCell>{item.quantity_mt}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transportation Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Transportation</DialogTitle>
            <DialogDescription>
              Update the transportation details below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Same form structure as create modal but with edit functionality */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Transportation Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vehicle">Vehicle</Label>
                <Select
                  value={formData.vehicle_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      vehicle_id: value ? parseInt(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem
                        key={vehicle.id}
                        value={vehicle.id.toString()}
                      >
                        {vehicle.plate_number} - {vehicle.driver_name} (
                        {vehicle.truck_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-from-location-type">
                  From Location Type
                </Label>
                <Select
                  value={formData.from_location_type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, from_location_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select from location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vessel">Vessel</SelectItem>
                    <SelectItem value="free_zone">Free Zone</SelectItem>
                    <SelectItem value="port">Port</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-from-location">From Location</Label>
                <Select
                  value={formData.from_location_id.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      from_location_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select from location" />
                  </SelectTrigger>
                  <SelectContent>
                    {getLocationOptions(formData.from_location_type).map(
                      (location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-to-location-type">To Location Type</Label>
                <Select
                  value={formData.to_location_type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, to_location_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select to location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vessel">Vessel</SelectItem>
                    <SelectItem value="free_zone">Free Zone</SelectItem>
                    <SelectItem value="port">Port</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-to-location">To Location</Label>
                <Select
                  value={formData.to_location_id.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      to_location_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select to location" />
                  </SelectTrigger>
                  <SelectContent>
                    {getLocationOptions(formData.to_location_type).map(
                      (location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-scheduled-date">Scheduled Date</Label>
                <Input
                  id="edit-scheduled-date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduled_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-actual-date">Actual Date</Label>
                <Input
                  id="edit-actual-date"
                  type="date"
                  value={formData.actual_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, actual_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter transportation notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditTransportation}>
              Update Transportation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Transportation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Transportation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete transportation "
              {selectedForDelete?.reference_number}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteTransportation}
            >
              Delete Transportation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
