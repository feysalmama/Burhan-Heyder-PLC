"use client";

import { useEffect, useState } from "react";
import { createPort, fetchPorts, updatePort, deletePort, type Port } from "@/lib/port-service";
import {
  getPortVessels,
  getPortStock,
  getPortStats,
  type PortVesselsResponse,
  type PortStockResponse,
  type PortStatsResponse,
  type PortVessel,
  type PortStockItem,
} from "@/lib/port-detail-service";
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
import { Progress } from "@/components/ui/progress";
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
  Anchor,
  Ship,
  Package,
  AlertTriangle,
  Building,
  Eye,
  List,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
} from "lucide-react";

export default function PortsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPortOpen, setIsAddPortOpen] = useState(false);
  const [isEditPortOpen, setIsEditPortOpen] = useState(false);
  const [isDeletePortOpen, setIsDeletePortOpen] = useState(false);
  const [selectedPortForEdit, setSelectedPortForEdit] = useState<Port | null>(null);
  const [selectedPortForDelete, setSelectedPortForDelete] = useState<Port | null>(null);
  const [newPort, setNewPort] = useState({
    name: "",
    code: "",
    capacity: "",
    country: "",
    location: "",
  });
  const [editPort, setEditPort] = useState({
    name: "",
    code: "",
    capacity: "",
    country: "",
    location: "",
  });
  const [ports, setPorts] = useState<Port[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Port detail states
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [portVessels, setPortVessels] = useState<PortVessel[]>([]);
  const [portStock, setPortStock] = useState<PortStockItem[]>([]);
  const [portStats, setPortStats] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"vessels" | "stock">("vessels");
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Port statistics for table display
  const [portStatsMap, setPortStatsMap] = useState<Record<number, any>>({});
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPorts();
        setPorts(data);
        await loadAllPortStats(data);
      } catch (e) {
        // ignore for now
      }
    };
    load();
  }, []);

  const loadAllPortStats = async (portsData: Port[]) => {
    try {
      setIsLoadingStats(true);

      const statsPromises = portsData.map(async (port) => {
        try {
          const statsResponse = await getPortStats(port.id);
          return { portId: port.id, stats: statsResponse.stats };
        } catch (error) {
          console.error(`Error loading stats for port ${port.id}:`, error);
          return {
            portId: port.id,
            stats: {
              active_vessels: 0,
              total_cargo_mt: 0,
              products_count: 0,
              recent_activity: 0,
            },
          };
        }
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap: Record<number, any> = {};
      statsResults.forEach(({ portId, stats }) => {
        statsMap[portId] = stats;
      });

      setPortStatsMap(statsMap);
    } catch (error) {
      console.error("Error loading port stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Summary data
  const summaryData = {
    totalPorts: 3,
    activeVessels: 4,
    totalCargo: "17,500",
    maintenance: 1,
  };

  // demo derived fields
  const demoCapacity = (p: Port) => "-";
  const demoStock = (p: Port) => "-";
  const demoUtil = (p: Port) => 0;
  const demoActive = (p: Port) => 0;
  const demoStatus = (p: Port) => "Operational";
  const demoUpdated = (p: Port) => "-";

  const filteredPorts = ports.filter(
    (port) =>
      port.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPorts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPorts = filteredPorts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Operational":
        return <Badge className="bg-black text-white">Operational</Badge>;
      case "Maintenance":
        return <Badge className="bg-red-500 text-white">Maintenance</Badge>;
      case "Closed":
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddPort = async () => {
    if (!newPort.name || !newPort.code) return;
    try {
      setIsSubmitting(true);
      const created = await createPort({
        name: newPort.name,
        code: newPort.code,
        capacity: newPort.capacity || undefined,
        country: newPort.country || undefined,
        location: newPort.location || undefined,
      });
      setPorts((prev) => [created, ...prev]);
      setNewPort({
        name: "",
        code: "",
        capacity: "",
        country: "",
        location: "",
      });
      setIsAddPortOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPort((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditPort((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditPort = async () => {
    if (!selectedPortForEdit || !editPort.name || !editPort.code) return;
    try {
      setIsSubmitting(true);
      const updated = await updatePort(selectedPortForEdit.id, {
        name: editPort.name,
        code: editPort.code,
        capacity: editPort.capacity || undefined,
        country: editPort.country || undefined,
        location: editPort.location || undefined,
      });
      setPorts((prev) =>
        prev.map((port) => (port.id === selectedPortForEdit.id ? updated : port))
      );
      setIsEditPortOpen(false);
      setSelectedPortForEdit(null);
      setEditPort({
        name: "",
        code: "",
        capacity: "",
        country: "",
        location: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePort = async () => {
    if (!selectedPortForDelete) return;
    try {
      setIsSubmitting(true);
      await deletePort(selectedPortForDelete.id);
      setPorts((prev) => prev.filter((port) => port.id !== selectedPortForDelete.id));
      setIsDeletePortOpen(false);
      setSelectedPortForDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (port: Port) => {
    setSelectedPortForEdit(port);
    setEditPort({
      name: port.name,
      code: port.code,
      capacity: port.capacity || "",
      country: port.country || "",
      location: port.location || "",
    });
    setIsEditPortOpen(true);
  };

  const openDeleteModal = (port: Port) => {
    setSelectedPortForDelete(port);
    setIsDeletePortOpen(true);
  };

  const loadPortDetails = async (port: Port) => {
    try {
      setIsLoadingDetails(true);
      setSelectedPort(port);

      // Load all port data in parallel
      const [vesselsResponse, stockResponse, statsResponse] = await Promise.all(
        [getPortVessels(port.id), getPortStock(port.id), getPortStats(port.id)]
      );

      setPortVessels(vesselsResponse.vessels);
      setPortStock(stockResponse.stock_summary);
      setPortStats(statsResponse.stats);
      setIsDetailOpen(true);
    } catch (error) {
      console.error("Error loading port details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Port Management</h2>
        <Button
          className="bg-black text-white"
          onClick={() => setIsAddPortOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Port
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Ports
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {summaryData.totalPorts}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Active port locations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Ship className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Vessels
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {summaryData.activeVessels}
                </p>
                <p className="text-xs text-gray-500 mt-1">Currently docked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Cargo
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {summaryData.totalCargo} MT
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all ports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Maintenance
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {summaryData.maintenance}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ports under maintenance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Port Operations */}
      <Card className="w-full card">
        <CardHeader>
          <CardTitle>Port Operations</CardTitle>
          <CardDescription>
            Monitor port activities and cargo operations
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <Table className="w-full table">
            <TableHeader>
              <TableRow>
                <TableHead>Port Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Active Vessels</TableHead>
                <TableHead>Current Metric Ton</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPorts.map((port) => {
                const stats = portStatsMap[port.id];
                return (
                  <TableRow key={port.id}>
                    <TableCell className="font-medium">{port.name}</TableCell>
                    <TableCell>{port.location || "N/A"}</TableCell>
                    <TableCell>{port.capacity || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{port.code}</Badge>
                    </TableCell>
                    <TableCell>{port.country || "N/A"}</TableCell>
                    <TableCell>
                      {isLoadingStats ? (
                        <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Ship className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">
                            {stats?.active_vessels || 0}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isLoadingStats ? (
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            {stats?.total_cargo_mt
                              ? `${stats.total_cargo_mt.toLocaleString()} MT`
                              : "0 MT"}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadPortDetails(port)}
                          disabled={isLoadingDetails}
                          title="View Port Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(port)}
                          disabled={isSubmitting}
                          title="Edit Port"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(port)}
                          disabled={isSubmitting}
                          title="Delete Port"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredPorts.length)} of {filteredPorts.length}{" "}
            results
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

      {/* Add New Port Dialog */}
      <Dialog open={isAddPortOpen} onOpenChange={setIsAddPortOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Port</DialogTitle>
            <DialogDescription>
              Register a new port for cargo operations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Port Name *
              </Label>
              <Input
                id="name"
                value={newPort.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Enter port name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code *
              </Label>
              <Input
                id="code"
                value={newPort.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="col-span-3"
                placeholder="Unique code"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={newPort.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="col-span-3"
                placeholder="Enter location"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                value={newPort.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                className="col-span-3"
                placeholder="e.g. 15,000 TEU or MT"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Input
                id="country"
                value={newPort.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="col-span-3"
                placeholder="Enter country"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddPortOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleAddPort}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Add Port"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Port Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Port Details - {selectedPort?.name}</DialogTitle>
            <DialogDescription>
              View vessels and stock information for this port.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Port Stats */}
              {portStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Ship className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Active Vessels</p>
                          <p className="text-2xl font-bold">
                            {portStats.active_vessels}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Total Cargo</p>
                          <p className="text-2xl font-bold">
                            {portStats.total_cargo_mt.toLocaleString()} MT
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium">Products</p>
                          <p className="text-2xl font-bold">
                            {portStats.products_count}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-medium">Recent Activity</p>
                          <p className="text-2xl font-bold">
                            {portStats.recent_activity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("vessels")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "vessels"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Ship className="h-4 w-4 inline mr-2" />
                  Vessels ({portVessels.length})
                </button>
                <button
                  onClick={() => setActiveTab("stock")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "stock"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Stock ({portStock.length})
                </button>
              </div>

              {/* Vessels Tab */}
              {activeTab === "vessels" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Vessels</h3>
                  {portVessels.length > 0 ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vessel Name</TableHead>
                            <TableHead>Capacity (MT)</TableHead>
                            <TableHead>Arrival Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {portVessels.map((vessel) => (
                            <TableRow key={vessel.id}>
                              <TableCell className="font-medium">
                                {vessel.name}
                              </TableCell>
                              <TableCell>
                                {vessel.capacity_mt.toLocaleString()} MT
                              </TableCell>
                              <TableCell>
                                {vessel.arrival_date
                                  ? new Date(
                                      vessel.arrival_date
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{vessel.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No active vessels at this port
                    </div>
                  )}
                </div>
              )}

              {/* Stock Tab */}
              {activeTab === "stock" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Stock</h3>
                  {portStock.length > 0 ? (
                    <div className="space-y-4">
                      {portStock.map((item) => (
                        <Card key={item.product_id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">
                                  {item.product_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {item.product_category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">
                                  {item.total_quantity_mt.toLocaleString()} MT
                                </p>
                                <p className="text-sm text-gray-600">
                                  from {item.vessel_count} vessel(s)
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">
                                Breakdown by Vessel:
                              </h5>
                              <div className="space-y-1">
                                {item.items.map((vesselItem) => (
                                  <div
                                    key={vesselItem.id}
                                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                  >
                                    <span>{vesselItem.vessel_name}</span>
                                    <div className="flex items-center space-x-2">
                                      <span>
                                        {vesselItem.quantity_mt.toLocaleString()}{" "}
                                        MT
                                      </span>
                                      <Badge
                                        className={
                                          vesselItem.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : vesselItem.status ===
                                              "discharging"
                                            ? "bg-orange-100 text-orange-800"
                                            : vesselItem.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {vesselItem.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No stock available at this port
                    </div>
                  )}
                </div>
              )}
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

      {/* Edit Port Modal */}
      <Dialog open={isEditPortOpen} onOpenChange={setIsEditPortOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Port</DialogTitle>
            <DialogDescription>
              Update the port information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editPort.name}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Enter port name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-code" className="text-right">
                Code
              </Label>
              <Input
                id="edit-code"
                value={editPort.code}
                onChange={(e) => handleEditInputChange("code", e.target.value)}
                className="col-span-3"
                placeholder="Enter port code"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="edit-capacity"
                value={editPort.capacity}
                onChange={(e) => handleEditInputChange("capacity", e.target.value)}
                className="col-span-3"
                placeholder="Enter capacity"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-country" className="text-right">
                Country
              </Label>
              <Input
                id="edit-country"
                value={editPort.country}
                onChange={(e) => handleEditInputChange("country", e.target.value)}
                className="col-span-3"
                placeholder="Enter country"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Input
                id="edit-location"
                value={editPort.location}
                onChange={(e) => handleEditInputChange("location", e.target.value)}
                className="col-span-3"
                placeholder="Enter location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPortOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditPort} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Port"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Port Modal */}
      <Dialog open={isDeletePortOpen} onOpenChange={setIsDeletePortOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Port</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPortForDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeletePortOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePort}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Port"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
