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
import { Plus, Search, Package, AlertTriangle } from "lucide-react"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const products = [
    {
      id: 1,
      name: "Rebar",
      size: "8mm",
      bundle: 8,
      metricTone: 15.91,
      stock: 1250,
      minStock: 500,
      location: "Ukab Zone A",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Rebar",
      size: "12mm",
      bundle: 10,
      metricTone: 19.89,
      stock: 850,
      minStock: 400,
      location: "Ukab Zone B",
      status: "In Stock",
    },
    {
      id: 3,
      name: "Rebar",
      size: "16mm",
      bundle: 6,
      metricTone: 11.93,
      stock: 150,
      minStock: 300,
      location: "Ukab Zone A",
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Rebar",
      size: "20mm",
      bundle: 8,
      metricTone: 15.91,
      stock: 0,
      minStock: 200,
      location: "Ukab Zone C",
      status: "Out of Stock",
    },
    {
      id: 5,
      name: "Rebar",
      size: "25mm",
      bundle: 10,
      metricTone: 19.89,
      stock: 750,
      minStock: 300,
      location: "Ukab Zone B",
      status: "In Stock",
    },
    {
      id: 6,
      name: "Rebar",
      size: "32mm",
      bundle: 8,
      metricTone: 15.91,
      stock: 450,
      minStock: 250,
      location: "Ukab Zone D",
      status: "In Stock",
    },
  ]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.size.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge variant="default">In Stock</Badge>
      case "Low Stock":
        return <Badge variant="destructive">Low Stock</Badge>
      case "Out of Stock":
        return <Badge variant="secondary">Out of Stock</Badge>
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
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter product details to add to inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productName" className="text-right">
                    Product Name
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rebar">Rebar</SelectItem>
                      <SelectItem value="wire-rod">Wire Rod</SelectItem>
                      <SelectItem value="steel-bar">Steel Bar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="size" className="text-right">
                    Size
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8mm">8mm</SelectItem>
                      <SelectItem value="10mm">10mm</SelectItem>
                      <SelectItem value="12mm">12mm</SelectItem>
                      <SelectItem value="16mm">16mm</SelectItem>
                      <SelectItem value="20mm">20mm</SelectItem>
                      <SelectItem value="25mm">25mm</SelectItem>
                      <SelectItem value="32mm">32mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bundle" className="text-right">
                    Bundle
                  </Label>
                  <Input id="bundle" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ukab-a">Ukab Zone A</SelectItem>
                      <SelectItem value="ukab-b">Ukab Zone B</SelectItem>
                      <SelectItem value="ukab-c">Ukab Zone C</SelectItem>
                      <SelectItem value="ukab-d">Ukab Zone D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stock Alerts */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active product variants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter((p) => p.status === "Low Stock").length}
              </div>
              <p className="text-xs text-muted-foreground">Items below minimum stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {products.filter((p) => p.status === "Out of Stock").length}
              </div>
              <p className="text-xs text-muted-foreground">Items requiring restock</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>Manage your product inventory and stock levels</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                  <TableHead>Product Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Bundle</TableHead>
                  <TableHead>Metric Tone</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell>{product.bundle}</TableCell>
                    <TableCell>{product.metricTone} MT</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
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
