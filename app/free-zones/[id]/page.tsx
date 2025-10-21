"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  Edit,
  Plus,
  Search,
  TrendingUp,
  Package,
  Truck,
  Ship,
} from "lucide-react";
import { toast } from "sonner";
import { fetchFreeZones } from "@/lib/free-zone-service";
import {
  fetchFreeZonePayments,
  type PaymentHistory,
} from "@/lib/payment-history-service";

export default function FreeZoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const freeZoneId = params.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [freeZone, setFreeZone] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  useEffect(() => {
    const loadFreeZone = async () => {
      try {
        setIsLoading(true);
        // Fetch all free zones and find the one with matching ID
        const freeZones = await fetchFreeZones();
        const foundZone = freeZones.find(
          (zone) => zone.id === Number(freeZoneId)
        );

        if (foundZone) {
          setFreeZone(foundZone);
          // Load payment history for this zone
          await loadPaymentHistory(foundZone.id);
        } else {
          toast.error("Free zone not found");
        }
      } catch (error: any) {
        toast.error("Failed to load free zone details");
        console.error("Error loading free zone:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (freeZoneId) {
      loadFreeZone();
    }
  }, [freeZoneId]);

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

  // Sample data for demonstration (replace with real API calls)
  const zoneOperations = [
    {
      id: 1,
      operationType: "Inbound",
      vessel: "MV Atlantic Star",
      blNumber: "BL-2024-001",
      product: "Rebar 16mm",
      quantity: "500 MT",
      date: "2024-01-17",
      status: "Completed",
    },
    {
      id: 2,
      operationType: "Inbound",
      vessel: "MV Mediterranean",
      blNumber: "BL-2024-004",
      product: "Rebar 12mm",
      quantity: "400 MT",
      date: "2024-01-24",
      status: "Completed",
    },
    {
      id: 3,
      operationType: "Outbound",
      piNumber: "PI-2024-001",
      customer: "ABC Construction Ltd",
      product: "Rebar 16mm",
      quantity: "200 MT",
      date: "2024-01-25",
      status: "Delivered",
    },
    {
      id: 4,
      operationType: "Outbound",
      piNumber: "PI-2024-005",
      customer: "Modern Construction PLC",
      product: "Rebar 12mm",
      quantity: "180 MT",
      date: "2024-01-28",
      status: "Delivered",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case "Delivered":
        return <Badge className="bg-green-500 text-white">Delivered</Badge>;
      case "Paid":
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
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

  if (!freeZone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Free Zone not found</h2>
          <p className="text-gray-600">
            The free zone you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Burhan Haiders Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/free-zones">Free Zones</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{freeZone.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {freeZone.name}
            </h2>
            <p className="text-muted-foreground">
              Complete free zone profile with operations and financial details
            </p>
          </div>
          <div className="flex space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Operation
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Zone
            </Button>
          </div>
        </div>

        {/* Free Zone Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Area</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(freeZone.area_hectares) || 0} ha
              </div>
              <p className="text-xs text-muted-foreground">Zone coverage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(freeZone.capacity_units) || 0}
              </div>
              <p className="text-xs text-muted-foreground">Storage units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rental Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {freeZone.rental_rate
                  ? `$${Number(freeZone.rental_rate)}/${freeZone.currency}`
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Per unit rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {freeZone.status === "active"
                  ? "Active"
                  : freeZone.status === "inactive"
                  ? "Inactive"
                  : "Under Construction"}
              </div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </CardContent>
          </Card>
        </div>

        {/* Free Zone Information */}
        <Card>
          <CardHeader>
            <CardTitle>Free Zone Information</CardTitle>
            <CardDescription>
              Complete zone profile and operational details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Basic Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Zone Code:</span>
                      <span className="text-sm font-medium">
                        {freeZone.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">
                        {freeZone.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Country:</span>
                      <span className="text-sm font-medium">
                        {freeZone.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Area:</span>
                      <span className="text-sm font-medium">
                        {Number(freeZone.area_hectares) || 0} hectares
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <span className="text-sm font-medium">
                        {Number(freeZone.capacity_units) || 0} units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Contact Person:
                      </span>
                      <span className="text-sm font-medium">
                        {freeZone.contact_person || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">
                        {freeZone.contact_email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium">
                        {freeZone.contact_phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="text-sm font-medium">
                        {freeZone.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {freeZone.description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-700">{freeZone.description}</p>
              </div>
            )}
            {freeZone.facilities && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Facilities
                </h4>
                <p className="text-sm text-gray-700">{freeZone.facilities}</p>
              </div>
            )}
            {freeZone.regulations && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Regulations
                </h4>
                <p className="text-sm text-gray-700">{freeZone.regulations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="inbound">Inbound History</TabsTrigger>
            <TabsTrigger value="outbound">Outbound/Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History - {freeZone.name}</CardTitle>
                <CardDescription>
                  All rental payments for this zone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Area (sqm)</TableHead>
                      <TableHead>Rate/m²</TableHead>
                      <TableHead>Amount (ETB)</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPayments ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
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
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          No payment history found for this free zone
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {new Date(payment.payment_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            {freeZone?.area_hectares
                              ? (
                                  freeZone.area_hectares * 10000
                                ).toLocaleString() + " m²"
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {freeZone?.monthly_rent && freeZone?.area_hectares
                              ? Math.round(
                                  freeZone.monthly_rent /
                                    (freeZone.area_hectares * 10000)
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
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inbound" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inbound History - {freeZone.name}</CardTitle>
                <CardDescription>
                  All cargo received in this zone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vessel</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Transport Date</TableHead>
                      <TableHead>Storage Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zoneOperations
                      .filter((op) => op.operationType === "Inbound")
                      .map((operation) => (
                        <TableRow key={operation.id}>
                          <TableCell className="font-medium">
                            {operation.vessel}
                          </TableCell>
                          <TableCell>{operation.product}</TableCell>
                          <TableCell>{operation.quantity}</TableCell>
                          <TableCell>{operation.date}</TableCell>
                          <TableCell>
                            {operation.vessel === "MV Atlantic Star"
                              ? "Section A1-A5"
                              : "Section A6-A8"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(operation.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outbound" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Outbound/Sales - {freeZone.name}</CardTitle>
                <CardDescription>All sales from this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Release Date</TableHead>
                      <TableHead>Storage Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zoneOperations
                      .filter((op) => op.operationType === "Outbound")
                      .map((operation) => (
                        <TableRow key={operation.id}>
                          <TableCell className="font-medium">
                            {operation.customer}
                          </TableCell>
                          <TableCell>{operation.product}</TableCell>
                          <TableCell>{operation.quantity}</TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            {operation.product === "Rebar 16mm"
                              ? "$50,000"
                              : "$44,100"}
                          </TableCell>
                          <TableCell>{operation.date}</TableCell>
                          <TableCell>
                            {operation.product === "Rebar 16mm"
                              ? "Section A1-A2"
                              : "Section A6"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(operation.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
