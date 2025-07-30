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
import { Progress } from "@/components/ui/progress"
import { Plus, Search, DollarSign, CreditCard, AlertTriangle, CheckCircle } from "lucide-react"

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const proformaInvoices = [
    {
      id: 1,
      piNumber: "PI-2024-001",
      customer: "ABC Construction Ltd",
      amount: "$125,000",
      paidAmount: "$75,000",
      remainingAmount: "$50,000",
      paymentProgress: 60,
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      status: "Partial Payment",
      products: "Rebar 16mm - 500 MT",
    },
    {
      id: 2,
      piNumber: "PI-2024-002",
      customer: "XYZ Trading PLC",
      amount: "$87,500",
      paidAmount: "$87,500",
      remainingAmount: "$0",
      paymentProgress: 100,
      issueDate: "2024-01-08",
      dueDate: "2024-02-08",
      status: "Fully Paid",
      products: "Rebar 20mm - 350 MT",
    },
    {
      id: 3,
      piNumber: "PI-2024-003",
      customer: "Steel Works Ethiopia",
      amount: "$95,000",
      paidAmount: "$0",
      remainingAmount: "$95,000",
      paymentProgress: 0,
      issueDate: "2024-01-12",
      dueDate: "2024-02-12",
      status: "Pending",
      products: "Rebar 25mm - 400 MT",
    },
    {
      id: 4,
      piNumber: "PI-2024-004",
      customer: "ABC Construction Ltd",
      amount: "$156,000",
      paidAmount: "$46,800",
      remainingAmount: "$109,200",
      paymentProgress: 30,
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "Partial Payment",
      products: "Rebar 12mm - 600 MT",
    },
  ]

  const paymentHistory = [
    {
      id: 1,
      piNumber: "PI-2024-001",
      customer: "ABC Construction Ltd",
      amount: "$25,000",
      paymentDate: "2024-01-15",
      paymentMethod: "Bank Transfer",
      reference: "TXN-001234",
      status: "Completed",
    },
    {
      id: 2,
      piNumber: "PI-2024-001",
      customer: "ABC Construction Ltd",
      amount: "$50,000",
      paymentDate: "2024-01-20",
      paymentMethod: "Bank Transfer",
      reference: "TXN-001235",
      status: "Completed",
    },
    {
      id: 3,
      piNumber: "PI-2024-002",
      customer: "XYZ Trading PLC",
      amount: "$87,500",
      paymentDate: "2024-01-18",
      paymentMethod: "Cash",
      reference: "CASH-001",
      status: "Completed",
    },
    {
      id: 4,
      piNumber: "PI-2024-004",
      customer: "ABC Construction Ltd",
      amount: "$46,800",
      paymentDate: "2024-01-22",
      paymentMethod: "Bank Transfer",
      reference: "TXN-001236",
      status: "Completed",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fully Paid":
        return <Badge className="bg-green-500">Fully Paid</Badge>
      case "Partial Payment":
        return <Badge className="bg-yellow-500">Partial Payment</Badge>
      case "Pending":
        return <Badge variant="destructive">Pending</Badge>
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>
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
                <BreadcrumbLink href="/">Corbus Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Payment Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>Record a payment received from customer.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="piSelect" className="text-right">
                    PI Number
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select PI" />
                    </SelectTrigger>
                    <SelectContent>
                      {proformaInvoices
                        .filter((pi) => pi.status !== "Fully Paid")
                        .map((pi) => (
                          <SelectItem key={pi.id} value={pi.piNumber}>
                            {pi.piNumber} - {pi.customer}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input id="amount" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Payment Method
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reference" className="text-right">
                    Reference
                  </Label>
                  <Input id="reference" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentDate" className="text-right">
                    Payment Date
                  </Label>
                  <Input id="paymentDate" type="date" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payment Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$254,200</div>
              <p className="text-xs text-muted-foreground">Across all customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$209,300</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending PIs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {proformaInvoices.filter((pi) => pi.status === "Pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">82%</div>
              <p className="text-xs text-muted-foreground">Payment collection rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="proforma" className="space-y-4">
          <TabsList>
            <TabsTrigger value="proforma">Proforma Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="outstanding">Outstanding Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="proforma" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proforma Invoices</CardTitle>
                <CardDescription>Track all proforma invoices and their payment status</CardDescription>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search PIs..."
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
                      <TableHead>PI Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Payment Progress</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proformaInvoices.map((pi) => (
                      <TableRow key={pi.id}>
                        <TableCell className="font-medium">{pi.piNumber}</TableCell>
                        <TableCell>{pi.customer}</TableCell>
                        <TableCell>{pi.amount}</TableCell>
                        <TableCell className="text-green-600">{pi.paidAmount}</TableCell>
                        <TableCell className="text-red-600">{pi.remainingAmount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={pi.paymentProgress} className="w-16 h-2" />
                            <span className="text-sm">{pi.paymentProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{pi.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(pi.status)}</TableCell>
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
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All recorded payments from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PI Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.piNumber}</TableCell>
                        <TableCell>{payment.customer}</TableCell>
                        <TableCell className="text-green-600">{payment.amount}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{payment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outstanding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Payments</CardTitle>
                <CardDescription>Proforma invoices with pending or partial payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PI Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proformaInvoices
                      .filter((pi) => pi.status !== "Fully Paid")
                      .map((pi) => (
                        <TableRow key={pi.id}>
                          <TableCell className="font-medium">{pi.piNumber}</TableCell>
                          <TableCell>{pi.customer}</TableCell>
                          <TableCell>{pi.amount}</TableCell>
                          <TableCell className="text-red-600 font-medium">{pi.remainingAmount}</TableCell>
                          <TableCell>
                            {new Date(pi.dueDate) < new Date() ? (
                              <span className="text-red-600 font-medium">
                                {Math.floor(
                                  (new Date().getTime() - new Date(pi.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                                )}{" "}
                                days
                              </span>
                            ) : (
                              <span className="text-green-600">Not due</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {paymentHistory
                              .filter((p) => p.piNumber === pi.piNumber)
                              .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]
                              ?.paymentDate || "No payments"}
                          </TableCell>
                          <TableCell>{getStatusBadge(pi.status)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Send Reminder
                            </Button>
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
