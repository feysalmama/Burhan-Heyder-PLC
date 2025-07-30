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
import { Plus, Search, Eye, Edit, FileText } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const customers = [
    {
      id: 1,
      companyName: "ABC Construction Ltd",
      tin: "TIN001234567",
      businessType: "Construction",
      contactNumber: "+251911234567",
      address: "Addis Ababa, Ethiopia",
      status: "Active",
      balance: "$45,000",
      lastOrder: "2024-01-15",
      totalPIs: 12,
      pendingPIs: 3,
      totalPayments: "$125,000",
      outstandingAmount: "$45,000",
    },
    {
      id: 2,
      companyName: "XYZ Trading PLC",
      tin: "TIN002345678",
      businessType: "Trading",
      contactNumber: "+251922345678",
      address: "Dire Dawa, Ethiopia",
      status: "Active",
      balance: "$12,500",
      lastOrder: "2024-01-10",
      totalPIs: 8,
      pendingPIs: 1,
      totalPayments: "$87,500",
      outstandingAmount: "$12,500",
    },
    {
      id: 3,
      companyName: "Steel Works Ethiopia",
      tin: "TIN003456789",
      businessType: "Manufacturing",
      contactNumber: "+251933456789",
      address: "Hawassa, Ethiopia",
      status: "Inactive",
      balance: "$0",
      lastOrder: "2023-12-20",
      totalPIs: 5,
      pendingPIs: 0,
      totalPayments: "$65,000",
      outstandingAmount: "$0",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tin.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <BreadcrumbLink href="/">Corbus Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Customers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Enter customer details to register a new customer.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyName" className="text-right">
                    Company Name
                  </Label>
                  <Input id="companyName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tin" className="text-right">
                    TIN
                  </Label>
                  <Input id="tin" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="businessType" className="text-right">
                    Business Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactNumber" className="text-right">
                    Contact Number
                  </Label>
                  <Input id="contactNumber" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input id="address" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>Manage your customer database and view customer information</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
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
                  <TableHead>Company Name</TableHead>
                  <TableHead>TIN</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Total PIs</TableHead>
                  <TableHead>Pending PIs</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.companyName}</TableCell>
                    <TableCell>{customer.tin}</TableCell>
                    <TableCell>{customer.businessType}</TableCell>
                    <TableCell>{customer.contactNumber}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "Active" ? "default" : "secondary"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>{customer.balance}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell>{customer.totalPIs}</TableCell>
                    <TableCell>
                      <Badge variant={customer.pendingPIs > 0 ? "destructive" : "default"}>{customer.pendingPIs}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-red-600">{customer.outstandingAmount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/customers/${customer.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
