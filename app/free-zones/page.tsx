"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Warehouse, MapPin, Calendar, DollarSign } from "lucide-react"

export default function FreeZonesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState<any>(null)

  const freeZones = [
    {
      id: 1,
      name: "Ukab Zone A",
      areaSize: "2000 sqm",
      utilization: 75,
      responsiblePerson: "Ahmed Hassan",
      agreementRate: "18 ETB/m²",
      effectiveDate: "2024-01-01",
      paymentDate: "2024-01-31",
      nextPaymentAlert: "2024-02-25",
      currentStock: "1,500 MT",
      status: "Active",
      monthlyRent: 36000, // 2000 * 18
    },
    {
      id: 2,
      name: "Ukab Zone B",
      areaSize: "1500 sqm",
      utilization: 45,
      responsiblePerson: "Sarah Wilson",
      agreementRate: "18 ETB/m²",
      effectiveDate: "2024-01-01",
      paymentDate: "2024-01-31",
      nextPaymentAlert: "2024-02-25",
      currentStock: "675 MT",
      status: "Active",
      monthlyRent: 27000, // 1500 * 18
    },
    {
      id: 3,
      name: "Ukab Zone C",
      areaSize: "2500 sqm",
      utilization: 90,
      responsiblePerson: "John Doe",
      agreementRate: "18 ETB/m²",
      effectiveDate: "2024-01-01",
      paymentDate: "2024-01-31",
      nextPaymentAlert: "2024-02-25",
      currentStock: "2,250 MT",
      status: "Near Capacity",
      monthlyRent: 45000, // 2500 * 18
    },
    {
      id: 4,
      name: "Ukab Zone D",
      areaSize: "1800 sqm",
      utilization: 30,
      responsiblePerson: "Jane Smith",
      agreementRate: "18 ETB/m²",
      effectiveDate: "2024-01-01",
      paymentDate: "2024-01-31",
      nextPaymentAlert: "2024-02-25",
      currentStock: "540 MT",
      status: "Active",
      monthlyRent: 32400, // 1800 * 18
    },
  ]

  // Mock payment history data
  const paymentHistory = [
    {
      id: 1,
      zoneId: 1,
      zoneName: "Ukab Zone A",
      paymentDate: "2024-01-31",
      amount: 36000,
      period: "January 2024",
      areaSize: 2000,
      ratePerSqm: 18,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      reference: "FZ-001-2024-01",
    },
    {
      id: 2,
      zoneId: 2,
      zoneName: "Ukab Zone B",
      paymentDate: "2024-01-31",
      amount: 27000,
      period: "January 2024",
      areaSize: 1500,
      ratePerSqm: 18,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      reference: "FZ-002-2024-01",
    },
    {
      id: 3,
      zoneId: 3,
      zoneName: "Ukab Zone C",
      paymentDate: "2024-01-31",
      amount: 45000,
      period: "January 2024",
      areaSize: 2500,
      ratePerSqm: 18,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      reference: "FZ-003-2024-01",
    },
    {
      id: 4,
      zoneId: 4,
      zoneName: "Ukab Zone D",
      paymentDate: "2024-01-31",
      amount: 32400,
      period: "January 2024",
      areaSize: 1800,
      ratePerSqm: 18,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      reference: "FZ-004-2024-01",
    },
    {
      id: 5,
      zoneId: 1,
      zoneName: "Ukab Zone A",
      paymentDate: "2023-12-31",
      amount: 36000,
      period: "December 2023",
      areaSize: 2000,
      ratePerSqm: 18,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      reference: "FZ-001-2023-12",
    },
  ]

  // Mock inbound transaction data (Port to Free Zone)
  const inboundTransactions = [
    {
      id: 1,
      zoneId: 1,
      zoneName: "Ukab Zone A",
      vessel: "MV Atlantic Star",
      blNumber: "BL-2024-001",
      product: "Rebar 16mm",
      quantity: "500 MT",
      arrivalDate: "2024-01-15",
      dischargingDate: "2024-01-16",
      transportDate: "2024-01-17",
      truckDetails: "Truck ABC-123, ABC-124, ABC-125",
      status: "Completed",
      storageLocation: "Section A1-A5",
    },
    {
      id: 2,
      zoneId: 2,
      zoneName: "Ukab Zone B",
      vessel: "MV Pacific Dawn",
      blNumber: "BL-2024-002",
      product: "Rebar 20mm",
      quantity: "350 MT",
      arrivalDate: "2024-01-18",
      dischargingDate: "2024-01-19",
      transportDate: "2024-01-20",
      truckDetails: "Truck DEF-456, DEF-457",
      status: "Completed",
      storageLocation: "Section B1-B3",
    },
    {
      id: 3,
      zoneId: 3,
      zoneName: "Ukab Zone C",
      vessel: "MV Indian Ocean",
      blNumber: "BL-2024-003",
      product: "Rebar 25mm",
      quantity: "600 MT",
      arrivalDate: "2024-01-20",
      dischargingDate: "2024-01-21",
      transportDate: "2024-01-22",
      truckDetails: "Truck GHI-789, GHI-790, GHI-791, GHI-792",
      status: "In Progress",
      storageLocation: "Section C1-C6",
    },
    {
      id: 4,
      zoneId: 1,
      zoneName: "Ukab Zone A",
      vessel: "MV Mediterranean",
      blNumber: "BL-2024-004",
      product: "Rebar 12mm",
      quantity: "400 MT",
      arrivalDate: "2024-01-22",
      dischargingDate: "2024-01-23",
      transportDate: "2024-01-24",
      truckDetails: "Truck JKL-012, JKL-013",
      status: "Completed",
      storageLocation: "Section A6-A8",
    },
  ]

  // Mock outbound/sales transaction data (Free Zone to Customer)
  const outboundTransactions = [
    {
      id: 1,
      zoneId: 1,
      zoneName: "Ukab Zone A",
      piNumber: "PI-2024-001",
      customer: "ABC Construction Ltd",
      product: "Rebar 16mm",
      quantity: "200 MT",
      unitPrice: "$250",
      totalValue: "$50,000",
      releaseDate: "2024-01-25",
      truckDetails: "Truck XYZ-001, XYZ-002",
      deliveryAddress: "Addis Ababa Construction Site",
      status: "Delivered",
      storageLocation: "Section A1-A2",
    },
    {
      id: 2,
      zoneId: 2,
      zoneName: "Ukab Zone B",
      piNumber: "PI-2024-002",
      customer: "XYZ Trading PLC",
      product: "Rebar 20mm",
      quantity: "150 MT",
      unitPrice: "$260",
      totalValue: "$39,000",
      releaseDate: "2024-01-26",
      truckDetails: "Truck PQR-003",
      deliveryAddress: "Dire Dawa Warehouse",
      status: "In Transit",
      storageLocation: "Section B1",
    },
    {
      id: 3,
      zoneId: 3,
      zoneName: "Ukab Zone C",
      piNumber: "PI-2024-003",
      customer: "Steel Works Ethiopia",
      product: "Rebar 25mm",
      quantity: "300 MT",
      unitPrice: "$270",
      totalValue: "$81,000",
      releaseDate: "2024-01-27",
      truckDetails: "Truck RST-004, RST-005",
      deliveryAddress: "Hawassa Industrial Zone",
      status: "Delivered",
      storageLocation: "Section C1-C3",
    },
    {
      id: 4,
      zoneId: 1,
      zoneName: "Ukab Zone A",
      piNumber: "PI-2024-005",
      customer: "Modern Construction PLC",
      product: "Rebar 12mm",
      quantity: "180 MT",
      unitPrice: "$245",
      totalValue: "$44,100",
      releaseDate: "2024-01-28",
      truckDetails: "Truck UVW-006",
      deliveryAddress: "Bahir Dar Project Site",
      status: "Delivered",
      storageLocation: "Section A6",
    },
  ]

  const filteredZones = freeZones.filter(
    (zone) =>
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default">Active</Badge>
      case "Near Capacity":
        return <Badge variant="destructive">Near Capacity</Badge>
      case "Maintenance":
        return <Badge variant="secondary">Maintenance</Badge>
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "In Progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "In Transit":
        return <Badge className="bg-yellow-500">In Transit</Badge>
      case "Delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "Paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "Pending":
        return <Badge variant="destructive">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getZonePayments = (zoneId: number) => {
    return paymentHistory.filter((payment) => payment.zoneId === zoneId)
  }

  const getZoneInbound = (zoneId: number) => {
    return inboundTransactions.filter((transaction) => transaction.zoneId === zoneId)
  }

  const getZoneOutbound = (zoneId: number) => {
    return outboundTransactions.filter((transaction) => transaction.zoneId === zoneId)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Corbus Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Free Zones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Free Zone Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Free Zone</DialogTitle>
                <DialogDescription>Register a new free zone area for storage operations.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zoneName" className="text-right">
                    Zone Name
                  </Label>
                  <Input id="zoneName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="areaSize" className="text-right">
                    Area Size (sqm)
                  </Label>
                  <Input id="areaSize" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="responsible" className="text-right">
                    Responsible Person
                  </Label>
                  <Input id="responsible" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rate" className="text-right">
                    Rate (ETB/m²)
                  </Label>
                  <Input id="rate" type="number" defaultValue="18" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="effectiveDate" className="text-right">
                    Effective Date
                  </Label>
                  <Input id="effectiveDate" type="date" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Zone</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Free Zone Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
              <Warehouse className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freeZones.length}</div>
              <p className="text-xs text-muted-foreground">Active storage zones</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Area</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7,800 sqm</div>
              <p className="text-xs text-muted-foreground">Combined storage area</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">140,400 ETB</div>
              <p className="text-xs text-muted-foreground">From zone rentals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Alerts</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Upcoming payments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="inbound">Inbound Transactions</TabsTrigger>
            <TabsTrigger value="outbound">Outbound/Sales</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Free Zone Operations</CardTitle>
                <CardDescription>Monitor storage zones and capacity utilization</CardDescription>
                <div className="flex items-center space-x-2">
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
              <CardContent>
                <Table>
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
                    {filteredZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>{zone.areaSize}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={zone.utilization} className="w-16 h-2" />
                            <span className="text-sm">{zone.utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{zone.currentStock}</TableCell>
                        <TableCell>{zone.responsiblePerson}</TableCell>
                        <TableCell className="font-medium">{zone.monthlyRent.toLocaleString()} ETB</TableCell>
                        <TableCell>{zone.nextPaymentAlert}</TableCell>
                        <TableCell>{getStatusBadge(zone.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setSelectedZone(zone)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History - All Zones</CardTitle>
                <CardDescription>Complete payment history for all free zone agreements</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.zoneName}</TableCell>
                        <TableCell>{payment.period}</TableCell>
                        <TableCell>{payment.areaSize.toLocaleString()}</TableCell>
                        <TableCell>{payment.ratePerSqm} ETB</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {payment.amount.toLocaleString()} ETB
                        </TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inbound" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inbound Transactions - Port to Free Zone</CardTitle>
                <CardDescription>All cargo movements from ports to free zone storage areas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
                        <TableCell className="font-medium">{transaction.zoneName}</TableCell>
                        <TableCell>{transaction.vessel}</TableCell>
                        <TableCell>{transaction.blNumber}</TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell className="font-medium">{transaction.quantity}</TableCell>
                        <TableCell>{transaction.arrivalDate}</TableCell>
                        <TableCell>{transaction.transportDate}</TableCell>
                        <TableCell>{transaction.truckDetails}</TableCell>
                        <TableCell>{transaction.storageLocation}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
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
                <CardTitle>Outbound/Sales Transactions - Free Zone to Customer</CardTitle>
                <CardDescription>All sales and deliveries from free zone to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
                        <TableCell className="font-medium">{transaction.zoneName}</TableCell>
                        <TableCell>{transaction.piNumber}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell className="font-medium">{transaction.quantity}</TableCell>
                        <TableCell>{transaction.unitPrice}</TableCell>
                        <TableCell className="font-medium text-green-600">{transaction.totalValue}</TableCell>
                        <TableCell>{transaction.releaseDate}</TableCell>
                        <TableCell>{transaction.truckDetails}</TableCell>
                        <TableCell>{transaction.storageLocation}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Zone Performance Summary</CardTitle>
                  <CardDescription>Key metrics for each free zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {freeZones.map((zone) => {
                      const zoneInbound = getZoneInbound(zone.id)
                      const zoneOutbound = getZoneOutbound(zone.id)
                      const totalInbound = zoneInbound.reduce(
                        (sum, t) => sum + Number.parseFloat(t.quantity.replace(" MT", "")),
                        0,
                      )
                      const totalOutbound = zoneOutbound.reduce(
                        (sum, t) => sum + Number.parseFloat(t.quantity.replace(" MT", "")),
                        0,
                      )

                      return (
                        <div key={zone.id} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{zone.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total Inbound:</span>
                              <span className="ml-2 font-medium text-blue-600">{totalInbound} MT</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total Outbound:</span>
                              <span className="ml-2 font-medium text-green-600">{totalOutbound} MT</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Current Stock:</span>
                              <span className="ml-2 font-medium">{zone.currentStock}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Utilization:</span>
                              <span className="ml-2 font-medium">{zone.utilization}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Revenue and payment tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Monthly Rent</span>
                      <span className="font-medium">
                        {freeZones.reduce((sum, zone) => sum + zone.monthlyRent, 0).toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payments Received (Jan 2024)</span>
                      <span className="font-medium text-green-600">
                        {paymentHistory
                          .filter((p) => p.period === "January 2024")
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString()}{" "}
                        ETB
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Sales Value</span>
                      <span className="font-medium text-blue-600">
                        {outboundTransactions
                          .reduce(
                            (sum, t) => sum + Number.parseFloat(t.totalValue.replace("$", "").replace(",", "")),
                            0,
                          )
                          .toLocaleString()}{" "}
                        USD
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Utilization</span>
                      <span className="font-medium">
                        {Math.round(freeZones.reduce((sum, zone) => sum + zone.utilization, 0) / freeZones.length)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Zone Detail Modal */}
      {selectedZone && (
        <Dialog open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedZone.name} - Detailed View</DialogTitle>
              <DialogDescription>Complete transaction history and zone details</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="payments" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="payments">Payment History</TabsTrigger>
                <TabsTrigger value="inbound">Inbound History</TabsTrigger>
                <TabsTrigger value="outbound">Outbound/Sales</TabsTrigger>
              </TabsList>

              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History - {selectedZone.name}</CardTitle>
                    <CardDescription>All rental payments for this zone</CardDescription>
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
                        {getZonePayments(selectedZone.id).map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.period}</TableCell>
                            <TableCell>{payment.areaSize.toLocaleString()}</TableCell>
                            <TableCell>{payment.ratePerSqm} ETB</TableCell>
                            <TableCell className="font-medium text-green-600">
                              {payment.amount.toLocaleString()} ETB
                            </TableCell>
                            <TableCell>{payment.paymentDate}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inbound" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inbound History - {selectedZone.name}</CardTitle>
                    <CardDescription>All cargo received in this zone</CardDescription>
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
                        {getZoneInbound(selectedZone.id).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.vessel}</TableCell>
                            <TableCell>{transaction.product}</TableCell>
                            <TableCell className="font-medium">{transaction.quantity}</TableCell>
                            <TableCell>{transaction.transportDate}</TableCell>
                            <TableCell>{transaction.storageLocation}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
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
                    <CardTitle>Outbound/Sales - {selectedZone.name}</CardTitle>
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
                        {getZoneOutbound(selectedZone.id).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.customer}</TableCell>
                            <TableCell>{transaction.product}</TableCell>
                            <TableCell className="font-medium">{transaction.quantity}</TableCell>
                            <TableCell className="font-medium text-green-600">{transaction.totalValue}</TableCell>
                            <TableCell>{transaction.releaseDate}</TableCell>
                            <TableCell>{transaction.storageLocation}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedZone(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
