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
import { Plus, Search, Ship, Anchor, Package, AlertTriangle } from "lucide-react"

export default function VesselsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const vessels = [
    {
      id: 1,
      name: "MV Atlantic Star",
      description: "Large cargo vessel for metal transportation",
      capacity: "25,000 MT",
      currentCargo: "22,500 MT",
      utilization: 90,
      status: "In Transit",
      currentLocation: "Red Sea",
      eta: "2024-01-20 14:00",
      dateOfDischargeStarted: "2024-01-15 16:30",
    },
    {
      id: 2,
      name: "MV Pacific Dawn",
      description: "Medium cargo vessel for regional routes",
      capacity: "15,000 MT",
      currentCargo: "12,000 MT",
      utilization: 80,
      status: "Loading",
      currentLocation: "Shanghai Port",
      eta: "2024-01-25 09:00",
      dateOfDischargeStarted: "2024-01-15 14:15",
    },
    {
      id: 3,
      name: "MV Indian Ocean",
      description: "Specialized vessel for steel products",
      capacity: "20,000 MT",
      currentCargo: "0 MT",
      utilization: 0,
      status: "Maintenance",
      currentLocation: "Djibouti Port",
      eta: "N/A",
      dateOfDischargeStarted: "2024-01-14 10:20",
    },
    {
      id: 4,
      name: "MV Mediterranean",
      description: "Fast cargo vessel for urgent deliveries",
      capacity: "18,000 MT",
      currentCargo: "15,500 MT",
      utilization: 86,
      status: "Docked",
      currentLocation: "Port of Djibouti",
      eta: "Arrived",
      dateOfDischargeStarted: "2024-01-15 18:45",
    },
  ]

  const filteredVessels = vessels.filter(
    (vessel) =>
      vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Transit":
        return <Badge variant="default">In Transit</Badge>
      case "Loading":
        return <Badge className="bg-blue-500">Loading</Badge>
      case "Docked":
        return <Badge className="bg-green-500">Docked</Badge>
      case "Maintenance":
        return <Badge variant="destructive">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
                <BreadcrumbLink href="/">Burhan Haiders Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Vessels</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Vessel Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vessel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add New Vessel</DialogTitle>
                <DialogDescription>Register a new vessel for cargo operations.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vesselName" className="text-right">
                    Vessel Name
                  </Label>
                  <Input id="vesselName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity (MT)
                  </Label>
                  <Input id="capacity" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateOfArrival" className="text-right">
                    Date Of Arrival
                  </Label>
                  <Input id="dateOfArrival" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateOfDischargeStarted" className="text-right">
                    Date Of Discharge Started
                  </Label>
                  <Input id="dateOfDischargeStarted" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Vessel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vessel Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vessels</CardTitle>
              <Ship className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vessels.length}</div>
              <p className="text-xs text-muted-foreground">Active fleet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Anchor className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vessels.filter((v) => v.status === "In Transit").length}</div>
              <p className="text-xs text-muted-foreground">Currently sailing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78,000 MT</div>
              <p className="text-xs text-muted-foreground">Combined fleet capacity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vessels.filter((v) => v.status === "Maintenance").length}</div>
              <p className="text-xs text-muted-foreground">Under maintenance</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Operations</CardTitle>
            <CardDescription>Monitor vessel locations and cargo status</CardDescription>
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
                  <TableHead>Vessel Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Current Cargo</TableHead>
                 
                  <TableHead>Status</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Date Of Discharge Started </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVessels.map((vessel) => (
                  <TableRow key={vessel.id}>
                    <TableCell className="font-medium">{vessel.name}</TableCell>
                    <TableCell>{vessel.capacity}</TableCell>
                    <TableCell>{vessel.currentCargo}</TableCell>
                    <TableCell>{getStatusBadge(vessel.status)}</TableCell>
                    <TableCell>{vessel.currentLocation}</TableCell>
                    <TableCell>{vessel.eta}</TableCell>
                    <TableCell>{vessel.dateOfDischargeStarted}</TableCell>
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
