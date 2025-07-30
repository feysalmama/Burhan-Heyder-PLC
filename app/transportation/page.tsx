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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Ship, Truck, Calendar } from "lucide-react"

export default function TransportationPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const vesselTransports = [
    {
      id: 1,
      vessel: "MV Atlantic Star",
      departureDate: "2024-01-10",
      arrivalDate: "2024-01-15",
      departurePort: "Shanghai Port",
      arrivalPort: "Port of Djibouti",
      dischargingStart: "2024-01-16",
      dischargingEnd: "2024-01-18",
      product: "Rebar 16mm",
      status: "Completed",
    },
    {
      id: 2,
      vessel: "MV Pacific Dawn",
      departureDate: "2024-01-20",
      arrivalDate: "2024-01-25",
      departurePort: "Qingdao Port",
      arrivalPort: "Port of Djibouti",
      dischargingStart: "2024-01-26",
      dischargingEnd: "2024-01-28",
      product: "Rebar 20mm",
      status: "In Transit",
    },
  ]

  const inboundTransports = [
    {
      id: 1,
      vessel: "MV Atlantic Star",
      bl: "BL001234",
      startDate: "2024-01-18",
      finishDate: "2024-01-19",
      carDetails: "Truck ABC-123",
      status: "Completed",
    },
    {
      id: 2,
      vessel: "MV Pacific Dawn",
      bl: "BL001235",
      startDate: "2024-01-28",
      finishDate: "2024-01-29",
      carDetails: "Truck DEF-456",
      status: "In Progress",
    },
  ]

  const outboundTransports = [
    {
      id: 1,
      pi: "PI001234",
      releaseDate: "2024-01-20",
      carDetails: "Truck GHI-789",
      customer: "ABC Construction Ltd",
      status: "Delivered",
    },
    {
      id: 2,
      pi: "PI001235",
      releaseDate: "2024-01-22",
      carDetails: "Truck JKL-012",
      customer: "XYZ Trading PLC",
      status: "In Transit",
    },
  ]

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
                <BreadcrumbPage>Transportation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Transportation Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transport
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Transport</DialogTitle>
                <DialogDescription>Schedule a new transportation operation.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transportType" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vessel">Vessel Transport</SelectItem>
                      <SelectItem value="inbound">Inbound (Port to Free Zone)</SelectItem>
                      <SelectItem value="outbound">Outbound (Free Zone to Customer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vessel" className="text-right">
                    Vessel/Vehicle
                  </Label>
                  <Input id="vessel" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input id="startDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input id="endDate" type="date" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Transport</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transportation Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vessels</CardTitle>
              <Ship className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Currently in transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Transports</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Awaiting dispatch</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vessel" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vessel">Vessel Transport</TabsTrigger>
            <TabsTrigger value="inbound">Inbound</TabsTrigger>
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
          </TabsList>

          <TabsContent value="vessel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vessel Transportation</CardTitle>
                <CardDescription>Track vessel movements from departure to arrival ports</CardDescription>
                <div className="flex items-center space-x-2">
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
                      <TableHead>Vessel</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Discharging Period</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vesselTransports.map((transport) => (
                      <TableRow key={transport.id}>
                        <TableCell className="font-medium">{transport.vessel}</TableCell>
                        <TableCell>{transport.departureDate}</TableCell>
                        <TableCell>{transport.arrivalDate}</TableCell>
                        <TableCell>
                          {transport.departurePort} → {transport.arrivalPort}
                        </TableCell>
                        <TableCell>
                          {transport.dischargingStart} - {transport.dischargingEnd}
                        </TableCell>
                        <TableCell>{transport.product}</TableCell>
                        <TableCell>
                          <Badge variant={transport.status === "Completed" ? "default" : "secondary"}>
                            {transport.status}
                          </Badge>
                        </TableCell>
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
                <CardTitle>Inbound Transportation</CardTitle>
                <CardDescription>Track cargo movement from port to free zone</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vessel</TableHead>
                      <TableHead>BL Number</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Finish Date</TableHead>
                      <TableHead>Vehicle Details</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inboundTransports.map((transport) => (
                      <TableRow key={transport.id}>
                        <TableCell className="font-medium">{transport.vessel}</TableCell>
                        <TableCell>{transport.bl}</TableCell>
                        <TableCell>{transport.startDate}</TableCell>
                        <TableCell>{transport.finishDate}</TableCell>
                        <TableCell>{transport.carDetails}</TableCell>
                        <TableCell>
                          <Badge variant={transport.status === "Completed" ? "default" : "secondary"}>
                            {transport.status}
                          </Badge>
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
                <CardTitle>Outbound Transportation</CardTitle>
                <CardDescription>Track deliveries from free zone to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PI Number</TableHead>
                      <TableHead>Release Date</TableHead>
                      <TableHead>Vehicle Details</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outboundTransports.map((transport) => (
                      <TableRow key={transport.id}>
                        <TableCell className="font-medium">{transport.pi}</TableCell>
                        <TableCell>{transport.releaseDate}</TableCell>
                        <TableCell>{transport.carDetails}</TableCell>
                        <TableCell>{transport.customer}</TableCell>
                        <TableCell>
                          <Badge variant={transport.status === "Delivered" ? "default" : "secondary"}>
                            {transport.status}
                          </Badge>
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
  )
}
