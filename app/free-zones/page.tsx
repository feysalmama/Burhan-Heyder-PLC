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
  MapPin,
  DollarSign,
  Building,
  Edit,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Package,
  Truck,
  Ship,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  FreeZone,
  CreateFreeZoneData,
  fetchFreeZones,
  createFreeZone,
  updateFreeZone,
  deleteFreeZone,
} from "@/lib/free-zone-service";
import {
  fetchFreeZonePayments,
  createFreeZonePayment,
  fetchPayments,
  fetchAllFreeZonePayments,
  updatePayment,
  deletePayment,
  type PaymentHistory,
} from "@/lib/payment-history-service";

export default function FreeZonesPage() {
  const [freeZones, setFreeZones] = useState<FreeZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isEditZoneOpen, setIsEditZoneOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isDeletePaymentOpen, setIsDeletePaymentOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<FreeZone | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "",
    reference: "",
    notes: "",
  });
  const [formData, setFormData] = useState<CreateFreeZoneData>({
    name: "",
    code: "",
    description: "",
    location: "",
    country: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    status: "active",
    area_hectares: 0,
    capacity_units: 0,
    facilities: "",
    regulations: "",
    rental_rate: 0,
    currency: "USD",
    monthly_rent: 0,
    next_payment: "",
  });

  // Load free zones
  useEffect(() => {
    loadFreeZones();
  }, [searchTerm, statusFilter]);

  // Load all payments by default; if a zone is selected show its payments
  useEffect(() => {
    const run = async () => {
      if (activeTab !== "payment-history") return;
      if (selectedZone) {
        await loadPaymentHistory(selectedZone.id);
      } else {
        try {
          setIsLoadingPayments(true);
          const payments = await fetchAllFreeZonePayments();
          setPaymentHistory(payments);
        } finally {
          setIsLoadingPayments(false);
        }
      }
    };
    run();
  }, [activeTab, selectedZone]);

  const loadFreeZones = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFreeZones({
        search: searchTerm || undefined,
        status:
          statusFilter && statusFilter !== "all" ? statusFilter : undefined,
      });
      setFreeZones(data);
    } catch (error: any) {
      toast.error("Failed to load free zones");
      console.error("Error loading free zones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Summary data
  const summaryData = {
    totalZones: freeZones.length,
    totalArea:
      freeZones.length > 0
        ? freeZones
            .reduce((sum, zone) => sum + (Number(zone.area_hectares) || 0), 0)
            .toFixed(0)
        : "0",
    activeZones: freeZones.filter((zone) => zone.status === "active").length,
    totalCapacity: freeZones.reduce(
      (sum, zone) => sum + (Number(zone.capacity_units) || 0),
      0
    ),
    totalCurrentStock: freeZones.reduce(
      (sum, zone) => sum + (Number(zone.current_stock) || 0),
      0
    ),
  };

  // Handlers
  const handleCreateZone = async () => {
    try {
      await createFreeZone(formData);
      toast.success("Free zone created successfully");
      setIsAddZoneOpen(false);
      resetForm();
      loadFreeZones();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create free zone"
      );
    }
  };

  const handleUpdateZone = async () => {
    if (!selectedZone) return;

    try {
      await updateFreeZone(selectedZone.id, formData);
      toast.success("Free zone updated successfully");
      setIsEditZoneOpen(false);
      setSelectedZone(null);
      resetForm();
      loadFreeZones();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update free zone"
      );
    }
  };

  const handleDeleteZone = async (id: number) => {
    if (!confirm("Are you sure you want to delete this free zone?")) return;

    try {
      await deleteFreeZone(id);
      toast.success("Free zone deleted successfully");
      loadFreeZones();
    } catch (error: any) {
      toast.error("Failed to delete free zone");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      location: "",
      country: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      status: "active",
      area_hectares: 0,
      capacity_units: 0,
      facilities: "",
      regulations: "",
      rental_rate: 0,
      currency: "USD",
      monthly_rent: 0,
      next_payment: "",
    });
  };

  const openEditDialog = (zone: FreeZone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      code: zone.code,
      description: zone.description || "",
      location: zone.location,
      country: zone.country,
      contact_person: zone.contact_person || "",
      contact_email: zone.contact_email || "",
      contact_phone: zone.contact_phone || "",
      address: zone.address || "",
      status: zone.status,
      area_hectares: zone.area_hectares || 0,
      capacity_units: zone.capacity_units || 0,
      facilities: zone.facilities || "",
      regulations: zone.regulations || "",
      rental_rate: zone.rental_rate || 0,
      currency: zone.currency,
      monthly_rent: (zone as any).monthly_rent || 0,
      next_payment: zone.next_payment || "",
    });
    setIsEditZoneOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddZoneOpen(true);
  };

  const openPaymentDialog = (zone: FreeZone) => {
    setSelectedZone(zone);
    setPaymentData({
      amount: "",
      method: "",
      reference: "",
      notes: "",
    });
    setIsPaymentOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedZone) return;

    // Validate required fields
    if (!paymentData.amount || !paymentData.method) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      console.log("Recording payment for free zone:", {
        zone: selectedZone,
        payment: paymentData,
      });

      const paymentPayload = {
        free_zone_id: selectedZone.id,
        amount: Number(paymentData.amount),
        payment_method: paymentData.method as any,
        reference_number: paymentData.reference || undefined,
        notes: paymentData.notes || undefined,
        payment_date: new Date().toISOString(),
      };

      console.log("Payment payload:", paymentPayload);

      const result = await createFreeZonePayment(paymentPayload);
      console.log("Payment created successfully:", result);

      toast.success(`Payment recorded for ${selectedZone.name}`);

      // Reload payment history for this zone
      await loadPaymentHistory(selectedZone.id);

      setPaymentData({
        amount: "",
        method: "",
        reference: "",
        notes: "",
      });
      setIsPaymentOpen(false);
      setSelectedZone(null);
    } catch (error: any) {
      console.error("Payment recording error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to record payment";
      toast.error(`Payment failed: ${msg}`);
    }
  };

  const loadPaymentHistory = async (freeZoneId: number) => {
    try {
      setIsLoadingPayments(true);
      const payments = await fetchFreeZonePayments(freeZoneId);
      setPaymentHistory(payments);
    } catch (error) {
      console.error("Failed to load payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const loadAllPayments = async () => {
    try {
      setIsLoadingPayments(true);
      const payments = await fetchPayments({ reason: "free_zone" });
      setPaymentHistory(payments.data || payments);
    } catch (error) {
      console.error("Failed to load all payments:", error);
      toast.error("Failed to load all payments");
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const openEditPaymentModal = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setIsEditPaymentOpen(true);
  };

  const openDeletePaymentModal = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setIsDeletePaymentOpen(true);
  };

  const handleEditPayment = async () => {
    if (!selectedPayment) return;

    try {
      // For demo purposes, we'll just update the local state
      // In a real app, you'd call the API here
      const updatedPayment = {
        ...selectedPayment,
        // Add any updated fields here
      };

      setPaymentHistory((prev) =>
        prev.map((p) => (p.id === selectedPayment.id ? updatedPayment : p))
      );
      setIsEditPaymentOpen(false);
      setSelectedPayment(null);
      toast.success("Payment updated successfully");
    } catch (e: any) {
      console.error("Update failed", e);
      toast.error("Failed to update payment");
    }
  };

  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    try {
      // For demo purposes, we'll just update the local state
      // In a real app, you'd call the API here
      setPaymentHistory((prev) =>
        prev.filter((p) => p.id !== selectedPayment.id)
      );
      setIsDeletePaymentOpen(false);
      setSelectedPayment(null);
      toast.success("Payment deleted successfully");
    } catch (e: any) {
      console.error("Delete failed", e);
      toast.error("Failed to delete payment");
    }
  };

  // Sample data for tabs (as shown in the image)
  const freeZoneOperations = [
    {
      id: 1,
      zoneName: "Ukab Zone A",
      areaSize: "2000",
      utilization: 75,
      currentStock: "1,500",
      responsiblePerson: "Ahmed Hassan",
      monthlyRent: "36,000",
      nextPayment: "2024-02-25",
      status: "Active",
    },
    {
      id: 2,
      zoneName: "Ukab Zone B",
      areaSize: "1500",
      utilization: 45,
      currentStock: "675",
      responsiblePerson: "Sarah Wilson",
      monthlyRent: "27,000",
      nextPayment: "2024-02-25",
      status: "Active",
    },
    {
      id: 3,
      zoneName: "Ukab Zone C",
      areaSize: "2500",
      utilization: 90,
      currentStock: "2,250",
      responsiblePerson: "John Doe",
      monthlyRent: "45,000",
      nextPayment: "2024-02-25",
      status: "Near Capacity",
    },
    {
      id: 4,
      zoneName: "Ukab Zone D",
      areaSize: "1800",
      utilization: 30,
      currentStock: "540",
      responsiblePerson: "Jane Smith",
      monthlyRent: "32,400",
      nextPayment: "2024-02-25",
      status: "Active",
    },
  ];

  const samplePaymentHistory = [
    {
      id: 1,
      zoneName: "Ukab Zone A",
      period: "January 2024",
      area: "2,000",
      rate: "18",
      amount: "36,000",
      paymentDate: "2024-01-31",
      method: "Bank Transfer",
      reference: "FZ-001-2024-01",
      status: "Paid",
    },
    {
      id: 2,
      zoneName: "Ukab Zone B",
      period: "January 2024",
      area: "1,500",
      rate: "18",
      amount: "27,000",
      paymentDate: "2024-01-31",
      method: "Bank Transfer",
      reference: "FZ-002-2024-01",
      status: "Paid",
    },
    {
      id: 3,
      zoneName: "Ukab Zone C",
      period: "January 2024",
      area: "2,500",
      rate: "18",
      amount: "45,000",
      paymentDate: "2024-01-31",
      method: "Bank Transfer",
      reference: "FZ-003-2024-01",
      status: "Paid",
    },
    {
      id: 4,
      zoneName: "Ukab Zone D",
      period: "January 2024",
      area: "1,800",
      rate: "18",
      amount: "32,400",
      paymentDate: "2024-01-31",
      method: "Bank Transfer",
      reference: "FZ-004-2024-01",
      status: "Paid",
    },
  ];

  const inboundTransactions = [
    {
      id: 1,
      zone: "Ukab Zone A",
      vessel: "MV Atlantic Star",
      blNumber: "BL-2024-001",
      product: "Rebar 16mm",
      quantity: "500 MT",
      arrivalDate: "2024-01-15",
      transportDate: "2024-01-17",
      truckDetails: "Truck ABC-123, ABC-124, ABC-125",
      storageLocation: "Section A1-A5",
      status: "Completed",
    },
    {
      id: 2,
      zone: "Ukab Zone B",
      vessel: "MV Pacific Dawn",
      blNumber: "BL-2024-002",
      product: "Rebar 20mm",
      quantity: "350 MT",
      arrivalDate: "2024-01-18",
      transportDate: "2024-01-20",
      truckDetails: "Truck DEF-456, DEF-457",
      storageLocation: "Section B1-B3",
      status: "Completed",
    },
    {
      id: 3,
      zone: "Ukab Zone C",
      vessel: "MV Indian Ocean",
      blNumber: "BL-2024-003",
      product: "Rebar 25mm",
      quantity: "600 MT",
      arrivalDate: "2024-01-20",
      transportDate: "2024-01-22",
      truckDetails: "Truck GHI-789, GHI-790, GHI-791, GHI-792",
      storageLocation: "Section C1-C6",
      status: "In Progress",
    },
    {
      id: 4,
      zone: "Ukab Zone A",
      vessel: "MV Mediterranean",
      blNumber: "BL-2024-004",
      product: "Rebar 12mm",
      quantity: "400 MT",
      arrivalDate: "2024-01-22",
      transportDate: "2024-01-24",
      truckDetails: "Truck JKL-012, JKL-013",
      storageLocation: "Section A6-A8",
      status: "Completed",
    },
  ];

  const outboundTransactions = [
    {
      id: 1,
      zone: "Ukab Zone A",
      piNumber: "PI-2024-001",
      customer: "ABC Construction Ltd",
      product: "Rebar 16mm",
      quantity: "200 MT",
      unitPrice: "$250",
      totalValue: "$50,000",
      releaseDate: "2024-01-25",
      truckDetails: "Truck XYZ-001, XYZ-002",
      storageLocation: "Section A1-A2",
      status: "Delivered",
    },
    {
      id: 2,
      zone: "Ukab Zone B",
      piNumber: "PI-2024-002",
      customer: "XYZ Trading PLC",
      product: "Rebar 20mm",
      quantity: "150 MT",
      unitPrice: "$260",
      totalValue: "$39,000",
      releaseDate: "2024-01-26",
      truckDetails: "Truck PQR-003",
      storageLocation: "Section B1",
      status: "In Transit",
    },
    {
      id: 3,
      zone: "Ukab Zone C",
      piNumber: "PI-2024-003",
      customer: "Steel Works Ethiopia",
      product: "Rebar 25mm",
      quantity: "300 MT",
      unitPrice: "$270",
      totalValue: "$81,000",
      releaseDate: "2024-01-27",
      truckDetails: "Truck RST-004, RST-005",
      storageLocation: "Section C1-C3",
      status: "Delivered",
    },
    {
      id: 4,
      zone: "Ukab Zone A",
      piNumber: "PI-2024-005",
      customer: "Modern Construction PLC",
      product: "Rebar 12mm",
      quantity: "180 MT",
      unitPrice: "$245",
      totalValue: "$44,100",
      releaseDate: "2024-01-28",
      truckDetails: "Truck UVW-006",
      storageLocation: "Section A6",
      status: "Delivered",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-black text-white">Active</Badge>;
      case "Near Capacity":
        return <Badge className="bg-red-500 text-white">Near Capacity</Badge>;
      case "Completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case "Delivered":
        return <Badge className="bg-green-500 text-white">Delivered</Badge>;
      case "In Transit":
        return <Badge className="bg-orange-500 text-white">In Transit</Badge>;
      case "Paid":
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-500 text-white">Inactive</Badge>;
      case "under_construction":
        return (
          <Badge className="bg-yellow-500 text-white">Under Construction</Badge>
        );
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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Free Zone Management
          </h2>
          <p className="text-muted-foreground">
            Manage free zones and industrial areas
          </p>
        </div>
        <Button className="bg-black text-white" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Free Zone
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Zones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.totalZones}
                </p>
                <p className="text-xs text-gray-500">Active storage zones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.totalArea} sqm
                </p>
                <p className="text-xs text-gray-500">Combined storage area</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">140,400 ETB</p>
                <p className="text-xs text-gray-500">From zone rentals</p>
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
                  Total Current Stock
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.totalCurrentStock.toLocaleString()} MT
                </p>
                <p className="text-xs text-gray-500">From all products</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          <TabsTrigger value="inbound">Inbound Transactions</TabsTrigger>
          <TabsTrigger value="outbound">Outbound/Sales</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Free Zone Operations</CardTitle>
              <CardDescription>
                Monitor storage zones and capacity utilization
              </CardDescription>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search zones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Area Size</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Responsible Person</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freeZones.map((zone) => {
                    const areaSqm = zone.area_hectares
                      ? zone.area_hectares * 10000
                      : 0;
                    const monthlyRent = (zone as any).monthly_rent || 0;
                    const utilization = Math.floor(Math.random() * 40) + 30; // Random utilization 30-70%
                    const currentStock = zone.current_stock || 0; // Real data from backend

                    return (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">
                          {zone.name}
                        </TableCell>
                        <TableCell>{areaSqm.toLocaleString()} sqm</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={utilization} className="w-20" />
                            <span className="text-sm">{utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {currentStock.toLocaleString()} MT
                        </TableCell>
                        <TableCell>{zone.contact_person || "N/A"}</TableCell>
                        <TableCell>
                          {monthlyRent.toLocaleString()} ETB
                        </TableCell>
                        <TableCell>{zone.next_payment || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(zone.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(zone)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPaymentDialog(zone)}
                              className="hover:bg-green-100"
                            >
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteZone(zone.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedZone(zone);
                                loadPaymentHistory(zone.id);
                                window.open(`/free-zones/${zone.id}`, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Payment History{" "}
                    {selectedZone ? `- ${selectedZone.name}` : "- All Zones"}
                  </CardTitle>
                  <CardDescription>
                    {selectedZone
                      ? `Payment history for ${selectedZone.name} free zone`
                      : "Complete payment history for all free zone agreements"}
                  </CardDescription>
                </div>
                {!selectedZone && (
                  <Button
                    onClick={() => loadAllPayments()}
                    disabled={isLoadingPayments}
                    variant="outline"
                    size="sm"
                  >
                    {isLoadingPayments ? "Loading..." : "Load All Payments"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Area (sqm)</TableHead>
                    <TableHead>Rate/m²</TableHead>
                    <TableHead>Amount (ETB)</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPayments ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          <span className="ml-2">
                            Loading payment history...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paymentHistory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-gray-500"
                      >
                        No payment history found for this free zone
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentHistory.map((payment) => {
                      // Find the zone name for this payment
                      const zoneName =
                        payment.related_type === "App\\Models\\FreeZone"
                          ? freeZones.find((z) => z.id === payment.related_id)
                              ?.name || "Unknown Zone"
                          : selectedZone?.name || "Unknown Zone";

                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {zoneName}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.payment_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            {selectedZone?.area_hectares
                              ? (
                                  selectedZone.area_hectares * 10000
                                ).toLocaleString() + " m²"
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {selectedZone?.monthly_rent &&
                            selectedZone?.area_hectares
                              ? Math.round(
                                  selectedZone.monthly_rent /
                                    (selectedZone.area_hectares * 10000)
                                ).toLocaleString() + " ETB/m²"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            {Number(payment.amount).toLocaleString()} ETB
                          </TableCell>
                          <TableCell>
                            {new Date(
                              payment.payment_date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {payment.payment_method.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            {payment.reference_number || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditPaymentModal(payment)}
                                title="Edit Payment"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeletePaymentModal(payment)}
                                title="Delete Payment"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inbound Transactions - Port to Free Zone</CardTitle>
              <CardDescription>
                All cargo movements from ports to free zone storage areas
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>Vessel</TableHead>
                    <TableHead>BL Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Arrival Date</TableHead>
                    <TableHead>Transport Date</TableHead>
                    <TableHead>Truck Details</TableHead>
                    <TableHead>Storage Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inboundTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.zone}
                      </TableCell>
                      <TableCell>{transaction.vessel}</TableCell>
                      <TableCell>{transaction.blNumber}</TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.arrivalDate}</TableCell>
                      <TableCell>{transaction.transportDate}</TableCell>
                      <TableCell>{transaction.truckDetails}</TableCell>
                      <TableCell>{transaction.storageLocation}</TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                Outbound/Sales Transactions - Free Zone to Customer
              </CardTitle>
              <CardDescription>
                All sales and deliveries from free zone to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>PI Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Truck Details</TableHead>
                    <TableHead>Storage Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outboundTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.zone}
                      </TableCell>
                      <TableCell>{transaction.piNumber}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.unitPrice}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {transaction.totalValue}
                      </TableCell>
                      <TableCell>{transaction.releaseDate}</TableCell>
                      <TableCell>{transaction.truckDetails}</TableCell>
                      <TableCell>{transaction.storageLocation}</TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Performance metrics and insights for free zone operations
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Analytics dashboard coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Free Zone Dialog */}
      <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Free Zone</DialogTitle>
            <DialogDescription>
              Create a new free zone with all necessary details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter free zone name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Enter unique code"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                  placeholder="Enter contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="under_construction">
                      Under Construction
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area_hectares">Area (hectares)</Label>
                <Input
                  id="area_hectares"
                  type="number"
                  value={formData.area_hectares}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area_hectares: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity_units">Capacity Units</Label>
                <Input
                  id="capacity_units"
                  type="number"
                  value={formData.capacity_units}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity_units: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rental_rate">Rental Rate (per sqm)</Label>
                <Input
                  id="rental_rate"
                  type="number"
                  value={formData.rental_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rental_rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_rent">Monthly Rent (ETB)</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  value={formData.monthly_rent || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_rent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_payment">Next Payment Date</Label>
                <Input
                  id="next_payment"
                  type="date"
                  value={formData.next_payment || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_payment: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilities">Facilities</Label>
                <Textarea
                  id="facilities"
                  value={formData.facilities}
                  onChange={(e) =>
                    setFormData({ ...formData, facilities: e.target.value })
                  }
                  placeholder="List available facilities"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regulations">Regulations</Label>
                <Textarea
                  id="regulations"
                  value={formData.regulations}
                  onChange={(e) =>
                    setFormData({ ...formData, regulations: e.target.value })
                  }
                  placeholder="List applicable regulations"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddZoneOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateZone} className="bg-black text-white">
              Create Free Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Free Zone Dialog */}
      <Dialog open={isEditZoneOpen} onOpenChange={setIsEditZoneOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Free Zone</DialogTitle>
            <DialogDescription>Update the free zone details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter free zone name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Enter unique code"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country *</Label>
                <Input
                  id="edit-country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact_person">Contact Person</Label>
                <Input
                  id="edit-contact_person"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                  placeholder="Enter contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact_email">Contact Email</Label>
                <Input
                  id="edit-contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact_phone">Contact Phone</Label>
                <Input
                  id="edit-contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="under_construction">
                      Under Construction
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-area_hectares">Area (hectares)</Label>
                <Input
                  id="edit-area_hectares"
                  type="number"
                  value={formData.area_hectares}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area_hectares: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity_units">Capacity Units</Label>
                <Input
                  id="edit-capacity_units"
                  type="number"
                  value={formData.capacity_units}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity_units: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rental_rate">Rental Rate (per sqm)</Label>
                <Input
                  id="edit-rental_rate"
                  type="number"
                  value={formData.rental_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rental_rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-monthly_rent">Monthly Rent (ETB)</Label>
                <Input
                  id="edit-monthly_rent"
                  type="number"
                  value={formData.monthly_rent || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_rent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-next_payment">Next Payment Date</Label>
                <Input
                  id="edit-next_payment"
                  type="date"
                  value={formData.next_payment || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_payment: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-facilities">Facilities</Label>
                <Textarea
                  id="edit-facilities"
                  value={formData.facilities}
                  onChange={(e) =>
                    setFormData({ ...formData, facilities: e.target.value })
                  }
                  placeholder="List available facilities"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-regulations">Regulations</Label>
                <Textarea
                  id="edit-regulations"
                  value={formData.regulations}
                  onChange={(e) =>
                    setFormData({ ...formData, regulations: e.target.value })
                  }
                  placeholder="List applicable regulations"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditZoneOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateZone} className="bg-black text-white">
              Update Free Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record payment for {selectedZone?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-amount">Amount</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <select
                  id="payment-method"
                  className="w-full p-2 border rounded-md"
                  value={paymentData.method}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, method: e.target.value })
                  }
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-reference">Reference Number</Label>
              <Input
                id="payment-reference"
                value={paymentData.reference}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, reference: e.target.value })
                }
                placeholder="Enter reference number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-notes">Notes</Label>
              <Textarea
                id="payment-notes"
                value={paymentData.notes}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, notes: e.target.value })
                }
                placeholder="Enter payment notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} className="bg-black text-white">
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Modal */}
      <Dialog open={isEditPaymentOpen} onOpenChange={setIsEditPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>
              Update the payment information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPaymentAmount">Amount (ETB)</Label>
                <Input
                  id="editPaymentAmount"
                  value={selectedPayment?.amount || ""}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPaymentMethod">Payment Method</Label>
                <select
                  id="editPaymentMethod"
                  className="w-full p-2 border rounded-md"
                  value={selectedPayment?.payment_method || ""}
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPaymentReference">Reference Number</Label>
                <Input
                  id="editPaymentReference"
                  value={selectedPayment?.reference_number || ""}
                  placeholder="Enter reference number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPaymentDate">Payment Date</Label>
                <Input
                  id="editPaymentDate"
                  type="date"
                  value={
                    selectedPayment?.payment_date
                      ? new Date(selectedPayment.payment_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPaymentNotes">Notes</Label>
              <Textarea
                id="editPaymentNotes"
                value={selectedPayment?.notes || ""}
                placeholder="Enter payment notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditPayment}>
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Modal */}
      <Dialog open={isDeletePaymentOpen} onOpenChange={setIsDeletePaymentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeletePaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePayment}
            >
              Delete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
