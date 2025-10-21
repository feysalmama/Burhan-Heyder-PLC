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
  Car,
  Truck,
  User,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Fuel,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

export interface Vehicle {
  id: number;
  plate_number: string;
  truck_type: string;
  driver_name: string;
  driver_phone?: string;
  status: "active" | "maintenance" | "inactive" | "retired";
  capacity_mt?: number;
  fuel_type?: "diesel" | "petrol" | "electric" | "hybrid";
  year?: number;
  brand?: string;
  model?: string;
  last_service_date?: string;
  next_service_date?: string;
  insurance_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleData {
  plate_number: string;
  truck_type: string;
  driver_name: string;
  driver_phone?: string;
  status: "active" | "maintenance" | "inactive" | "retired";
  capacity_mt?: number;
  fuel_type?: "diesel" | "petrol" | "electric" | "hybrid";
  year?: number;
  brand?: string;
  model?: string;
  last_service_date?: string;
  next_service_date?: string;
  insurance_expiry?: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState<CreateVehicleData>({
    plate_number: "",
    truck_type: "",
    driver_name: "",
    driver_phone: "",
    status: "active",
    capacity_mt: 0,
    fuel_type: "diesel",
    year: new Date().getFullYear(),
    brand: "",
    model: "",
    last_service_date: "",
    next_service_date: "",
    insurance_expiry: "",
  });

  // Mock data for development
  useEffect(() => {
    const mockVehicles: Vehicle[] = [
      {
        id: 1,
        plate_number: "ET-1234-AB",
        truck_type: "Heavy Duty",
        driver_name: "Ahmed Hassan",
        driver_phone: "+251912345678",
        status: "active",
        capacity_mt: 25,
        fuel_type: "diesel",
        year: 2020,
        brand: "Volvo",
        model: "FH16",
        last_service_date: "2024-01-15",
        next_service_date: "2024-07-15",
        insurance_expiry: "2024-12-31",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        plate_number: "ET-5678-CD",
        truck_type: "Medium Duty",
        driver_name: "Mohammed Ali",
        driver_phone: "+251987654321",
        status: "maintenance",
        capacity_mt: 15,
        fuel_type: "diesel",
        year: 2019,
        brand: "Mercedes",
        model: "Actros",
        last_service_date: "2024-02-10",
        next_service_date: "2024-08-10",
        insurance_expiry: "2024-11-30",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
      {
        id: 3,
        plate_number: "ET-9012-EF",
        truck_type: "Light Duty",
        driver_name: "Omar Ibrahim",
        driver_phone: "+251923456789",
        status: "active",
        capacity_mt: 8,
        fuel_type: "petrol",
        year: 2021,
        brand: "Isuzu",
        model: "NPR",
        last_service_date: "2024-03-05",
        next_service_date: "2024-09-05",
        insurance_expiry: "2025-01-15",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      },
    ];

    setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.truck_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Analytics calculation
  const analytics = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === "active").length,
    maintenanceVehicles: vehicles.filter((v) => v.status === "maintenance")
      .length,
    totalCapacity: vehicles.reduce((sum, v) => sum + (v.capacity_mt || 0), 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
        );
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "retired":
        return <Badge className="bg-red-100 text-red-800">Retired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTruckTypeBadge = (type: string) => {
    switch (type) {
      case "Heavy Duty":
        return <Badge className="bg-blue-100 text-blue-800">Heavy Duty</Badge>;
      case "Medium Duty":
        return (
          <Badge className="bg-orange-100 text-orange-800">Medium Duty</Badge>
        );
      case "Light Duty":
        return (
          <Badge className="bg-green-100 text-green-800">Light Duty</Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleInputChange = (
    field: keyof CreateVehicleData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddVehicle = async () => {
    if (
      !formData.plate_number ||
      !formData.driver_name ||
      !formData.truck_type
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newVehicle: Vehicle = {
        id: vehicles.length + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setVehicles((prev) => [newVehicle, ...prev]);
      setFormData({
        plate_number: "",
        truck_type: "",
        driver_name: "",
        driver_phone: "",
        status: "active",
        capacity_mt: 0,
        fuel_type: "diesel",
        year: new Date().getFullYear(),
        brand: "",
        model: "",
        last_service_date: "",
        next_service_date: "",
        insurance_expiry: "",
      });
      setIsAddOpen(false);
      toast.success("Vehicle added successfully");
    } catch (error) {
      toast.error("Failed to add vehicle");
    }
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailOpen(true);
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Vehicle Management
        </h2>
        <Button
          className="bg-black text-white"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Vehicles
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.totalVehicles}
                </p>
                <p className="text-xs text-gray-500 mt-1">Fleet size</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Vehicles
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.activeVehicles}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Currently operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Under Maintenance
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.maintenanceVehicles}
                </p>
                <p className="text-xs text-gray-500 mt-1">Requires service</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Fuel className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Capacity
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.totalCapacity} MT
                </p>
                <p className="text-xs text-gray-500 mt-1">Combined capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card className="w-full card mx-4 mt-12 px-6 pt-6">
        <CardHeader>
          <CardTitle>Vehicle Fleet Overview</CardTitle>
          <CardDescription>
            Manage your vehicle fleet and track their status
          </CardDescription>
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="w-full pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Truck Type</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : paginatedVehicles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No vehicles found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.plate_number}
                    </TableCell>
                    <TableCell>
                      {getTruckTypeBadge(vehicle.truck_type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{vehicle.driver_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.brand && vehicle.model
                        ? `${vehicle.brand} ${vehicle.model}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {vehicle.capacity_mt
                        ? `${vehicle.capacity_mt} MT`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(vehicle)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 mx-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredVehicles.length)} of{" "}
            {filteredVehicles.length} results
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

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Register a new vehicle in your fleet
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plate_number">Plate Number *</Label>
                <Input
                  id="plate_number"
                  value={formData.plate_number}
                  onChange={(e) =>
                    handleInputChange("plate_number", e.target.value)
                  }
                  placeholder="ET-1234-AB"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="truck_type">Truck Type *</Label>
                <Select
                  value={formData.truck_type}
                  onValueChange={(value) =>
                    handleInputChange("truck_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heavy Duty">Heavy Duty</SelectItem>
                    <SelectItem value="Medium Duty">Medium Duty</SelectItem>
                    <SelectItem value="Light Duty">Light Duty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver_name">Driver Name *</Label>
                <Input
                  id="driver_name"
                  value={formData.driver_name}
                  onChange={(e) =>
                    handleInputChange("driver_name", e.target.value)
                  }
                  placeholder="Ahmed Hassan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver_phone">Driver Phone</Label>
                <Input
                  id="driver_phone"
                  value={formData.driver_phone}
                  onChange={(e) =>
                    handleInputChange("driver_phone", e.target.value)
                  }
                  placeholder="+251912345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Volvo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="FH16"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    handleInputChange(
                      "year",
                      parseInt(e.target.value) || new Date().getFullYear()
                    )
                  }
                  placeholder="2020"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity_mt">Capacity (MT)</Label>
                <Input
                  id="capacity_mt"
                  type="number"
                  value={formData.capacity_mt}
                  onChange={(e) =>
                    handleInputChange(
                      "capacity_mt",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select
                  value={formData.fuel_type}
                  onValueChange={(value) =>
                    handleInputChange("fuel_type", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_service_date">Last Service Date</Label>
                <Input
                  id="last_service_date"
                  type="date"
                  value={formData.last_service_date}
                  onChange={(e) =>
                    handleInputChange("last_service_date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_service_date">Next Service Date</Label>
                <Input
                  id="next_service_date"
                  type="date"
                  value={formData.next_service_date}
                  onChange={(e) =>
                    handleInputChange("next_service_date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_expiry">Insurance Expiry</Label>
                <Input
                  id="insurance_expiry"
                  type="date"
                  value={formData.insurance_expiry}
                  onChange={(e) =>
                    handleInputChange("insurance_expiry", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleAddVehicle}
            >
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vehicle Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Vehicle Details - {selectedVehicle?.plate_number}
            </DialogTitle>
            <DialogDescription>
              Complete information about this vehicle
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-6">
              {/* Vehicle Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Plate Number
                        </Label>
                        <p className="text-lg font-semibold">
                          {selectedVehicle.plate_number}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Truck Type
                        </Label>
                        <p className="text-lg">
                          {getTruckTypeBadge(selectedVehicle.truck_type)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Brand/Model
                        </Label>
                        <p className="text-lg">
                          {selectedVehicle.brand} {selectedVehicle.model}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Year
                        </Label>
                        <p className="text-lg">{selectedVehicle.year}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Capacity
                        </Label>
                        <p className="text-lg">
                          {selectedVehicle.capacity_mt} MT
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Fuel Type
                        </Label>
                        <p className="text-lg capitalize">
                          {selectedVehicle.fuel_type}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Driver Name
                      </Label>
                      <p className="text-lg font-semibold">
                        {selectedVehicle.driver_name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Phone Number
                      </Label>
                      <p className="text-lg">
                        {selectedVehicle.driver_phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <p className="text-lg">
                        {getStatusBadge(selectedVehicle.status)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Maintenance & Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Maintenance & Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Last Service
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {selectedVehicle.last_service_date || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Next Service
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {selectedVehicle.next_service_date || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Insurance Expiry
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{selectedVehicle.insurance_expiry || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDetailOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



