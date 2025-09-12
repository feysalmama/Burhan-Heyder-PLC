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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, MapPin, Ship, Package, AlertTriangle } from "lucide-react"

export default function PortsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const ports = [
    {
      id: 1,
      name: "Port of Djibouti",
      description: "Main port for Ethiopian imports",
      location: "Djibouti City, Djibouti",
      capacity: "15,000 TEU",
      currentStock: "12,500 MT",
      availableSpace: "85%",
      activeVessels: 3,
      status: "Operational",
      lastUpdate: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "Berbera Port",
      description: "Alternative port for cargo operations",
      location: "Berbera, Somaliland",
      capacity: "8,000 TEU",
      currentStock: "3,200 MT",
      availableSpace: "40%",
      activeVessels: 1,
      status: "Operational",
      lastUpdate: "2024-01-15 12:15",
    },
    {
      id: 3,
      name: "Port Sudan",
      description: "Secondary port for special cargo",
      location: "Port Sudan, Sudan",
      capacity: "5,000 TEU",
      currentStock: "1,800 MT",
      availableSpace: "36%",
      activeVessels: 0,
      status: "Maintenance",
      lastUpdate: "2024-01-14 09:45",
    },
  ]

  const filteredPorts = ports.filter(
    (port) =>
      port.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Burhan Haiders Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Ports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Port Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Port
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Port</DialogTitle>
                <DialogDescription>Register a new port for cargo operations.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="portName" className="text-right">
                    Port Name
                  </Label>
                  <Input id="portName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input id="capacity" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Port</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Port Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ports</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ports.length}</div>
              <p className="text-xs text-muted-foreground">Active port locations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vessels</CardTitle>
              <Ship className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ports.reduce((sum, port) => sum + port.activeVessels, 0)}</div>
              <p className="text-xs text-muted-foreground">Currently docked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cargo</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17,500 MT</div>
              <p className="text-xs text-muted-foreground">Across all ports</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ports.filter((port) => port.status === "Maintenance").length}</div>
              <p className="text-xs text-muted-foreground">Ports under maintenance</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Port Operations</CardTitle>
            <CardDescription>Monitor port activities and cargo operations</CardDescription>
            <div className="flex items-center space-x-2">
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
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Port Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Active Vessels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPorts.map((port) => (
                  <TableRow key={port.id}>
                    <TableCell className="font-medium">{port.name}</TableCell>
                    <TableCell>{port.location}</TableCell>
                    <TableCell>{port.capacity}</TableCell>
                    <TableCell>{port.currentStock}</TableCell>
                    <TableCell>{port.availableSpace}</TableCell>
                    <TableCell>{port.activeVessels}</TableCell>
                    <TableCell>
                      <Badge variant={port.status === "Operational" ? "default" : "destructive"}>{port.status}</Badge>
                    </TableCell>
                    <TableCell>{port.lastUpdate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
