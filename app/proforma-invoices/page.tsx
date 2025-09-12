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
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Eye, Send, CheckCircle, FileText, Download, DollarSign } from "lucide-react"

export default function ProformaInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPI, setSelectedPI] = useState<any>(null)
  const [showCreatePIDialog, setShowCreatePIDialog] = useState(false)

  // Mock data for customers and products to use in PI creation form
  const customers = [
    { id: 1, name: "ABC Construction Ltd" },
    { id: 2, name: "XYZ Trading PLC" },
    { id: 3, name: "Steel Works Ethiopia" },
  ]

  const products = [
    { id: 1, name: "Rebar 8mm", unitPrice: 240 },
    { id: 2, name: "Rebar 12mm", unitPrice: 260 },
    { id: 3, name: "Rebar 16mm", unitPrice: 250 },
    { id: 4, name: "Rebar 20mm", unitPrice: 265 },
    { id: 5, name: "Rebar 25mm", unitPrice: 270 },
    { id: 6, name: "Rebar 32mm", unitPrice: 280 },
  ]

  // Mock PI data
  const [proformaInvoices, setProformaInvoices] = useState([
    {
      id: 1,
      piNumber: "BH-2024-001",
      customer: "ABC Construction Ltd",
      customerId: 1,
      totalAmount: 125000,
      paidAmount: 75000,
      remainingAmount: 50000,
      paymentProgress: 60,
      orderedby: "Gannoo Hasen",
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      status: "Partial Payment",
      sentDate: "2024-01-11",
      confirmedDate: null,
      products: [{ name: "Rebar 16mm", quantity: "500 MT", unitPrice: 250, total: 125000 }],
      paymentHistory: [
        { date: "2024-01-15", amount: 25000, method: "Bank Transfer", reference: "TXN-001234" },
        { date: "2024-01-20", amount: 50000, method: "Bank Transfer", reference: "TXN-001235" },
      ],
    },
    {
      id: 2,
      piNumber: "BH-2024-001",
      customer: "XYZ Trading PLC",
      customerId: 2,
      totalAmount: 87500,
      paidAmount: 87500,
      remainingAmount: 0,
      paymentProgress: 100,
      orderedby: "Ali Mohammed",
      issueDate: "2024-01-08",
      dueDate: "2024-02-08",
      status: "Fully Paid",
      sentDate: "2024-01-09",
      confirmedDate: "2024-01-10",
      products: [{ name: "Rebar 20mm", quantity: "350 MT", unitPrice: 250, total: 87500 }],
      paymentHistory: [{ date: "2024-01-18", amount: 87500, method: "Cash", reference: "CASH-001" }],
    },
    {
      id: 3,
      piNumber: "BH-2024-001",
      customer: "Steel Works Ethiopia",
      customerId: 3,
      totalAmount: 95000,
      paidAmount: 0,
      remainingAmount: 95000,
      paymentProgress: 0,
      orderedby: "Burhan Haider",
      issueDate: "2024-01-12",
      dueDate: "2024-02-12",
      status: "Pending",
      sentDate: "2024-01-13",
      confirmedDate: null,
      products: [{ name: "Rebar 25mm", quantity: "400 MT", unitPrice: 237.5, total: 95000 }],
      paymentHistory: [],
    },
    {
      id: 4,
      piNumber: "BH-2024-001",
      customer: "ABC Construction Ltd",
      customerId: 1,
      totalAmount: 156000,
      paidAmount: 46800,
      remainingAmount: 109200,
      paymentProgress: 30,
         orderedby: "AbdulGefar Umer",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "Partial Payment",
      sentDate: "2024-01-16",
      confirmedDate: null,
      products: [{ name: "Rebar 12mm", quantity: "600 MT", unitPrice: 260, total: 156000 }],
      paymentHistory: [{ date: "2024-01-22", amount: 46800, method: "Bank Transfer", reference: "TXN-001236" }],
    },
    {
      id: 5,
      piNumber: "BH-2024-002",
      customer: "XYZ Trading PLC",
      customerId: 2,
      totalAmount: 70000,
      paidAmount: 0,
      remainingAmount: 70000,
      paymentProgress: 0,
      orderedby: "Gannoo Hasen",
      issueDate: "2024-02-01",
      dueDate: "2024-03-01",
      status: "Draft", // New PI created as a draft
      sentDate: null,
      confirmedDate: null,
      products: [{ name: "Rebar 8mm", quantity: "300 MT", unitPrice: 240, total: 72000 }],
      paymentHistory: [],
    },
  ])

  const [newPI, setNewPI] = useState({
    customer: "",
    customerId: null,
    issueDate: "",
    dueDate: "",
    products: [{ productId: "", quantity: "", unitPrice: "" }],
    notes: "",
  })

  const handleProductChange = (index: number, field: string, value: string) => {
    const updatedProducts = [...newPI.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setNewPI({ ...newPI, products: updatedProducts })
  }

  const addProductRow = () => {
    setNewPI({
      ...newPI,
      products: [...newPI.products, { productId: "", quantity: "", unitPrice: "" }],
    })
  }

  const removeProductRow = (index: number) => {
    const updatedProducts = newPI.products.filter((_, i) => i !== index)
    setNewPI({ ...newPI, products: updatedProducts })
  }

  const calculatePITotal = () => {
    return newPI.products.reduce((sum, item) => {
      const quantity = Number.parseFloat(item.quantity) || 0
      const unitPrice = Number.parseFloat(item.unitPrice) || 0
      return sum + quantity * unitPrice
    }, 0)
  }

  const handleCreatePI = () => {
    const totalAmount = calculatePITotal()
    const customerName = customers.find((c) => c.id === newPI.customerId)?.name || "Unknown Customer"

    const newPiEntry = {
      id: proformaInvoices.length + 1,
      piNumber: `PI-${new Date().getFullYear()}-${(proformaInvoices.length + 1).toString().padStart(3, "0")}`,
      customer: customerName,
      customerId: newPI.customerId,
      totalAmount: totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      paymentProgress: 0,
      issueDate: newPI.issueDate,
      dueDate: newPI.dueDate,
      status: "Draft",
      sentDate: null,
      confirmedDate: null,
      products: newPI.products.map((item) => ({
        name: products.find((p) => p.id === Number.parseInt(item.productId))?.name || "N/A",
        quantity: `${item.quantity} MT`,
        unitPrice: Number.parseFloat(item.unitPrice),
        total: Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice),
      })),
      paymentHistory: [],
    }
    setProformaInvoices([...proformaInvoices, newPiEntry])
    setShowCreatePIDialog(false)
    setNewPI({
      customer: "",
      customerId: null,
      issueDate: "",
      dueDate: "",
      products: [{ productId: "", quantity: "", unitPrice: "" }],
      notes: "",
    })
  }

  const handleSendPI = (piId: number) => {
    setProformaInvoices((prevPIs) =>
      prevPIs.map((pi) =>
        pi.id === piId ? { ...pi, status: "Sent", sentDate: new Date().toISOString().split("T")[0] } : pi,
      ),
    )
  }

  const handleConfirmPI = (piId: number) => {
    setProformaInvoices((prevPIs) =>
      prevPIs.map((pi) =>
        pi.id === piId ? { ...pi, status: "Confirmed", confirmedDate: new Date().toISOString().split("T")[0] } : pi,
      ),
    )
  }

  const handleRecordPayment = (piId: number, amount: number) => {
    setProformaInvoices((prevPIs) =>
      prevPIs.map((pi) => {
        if (pi.id === piId) {
          const newPaidAmount = pi.paidAmount + amount
          const newRemainingAmount = pi.totalAmount - newPaidAmount
          const newProgress = (newPaidAmount / pi.totalAmount) * 100
          let newStatus = pi.status

          if (newRemainingAmount <= 0) {
            newStatus = "Fully Paid"
          } else if (newPaidAmount > 0) {
            newStatus = "Partial Payment"
          } else {
            newStatus = "Pending"
          }

          const newPaymentEntry = {
            date: new Date().toISOString().split("T")[0],
            amount: amount,
            method: "Bank Transfer", // Default for mock, could be dynamic
            reference: `REC-${Date.now()}`, // Simple mock reference
          }

          return {
            ...pi,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            paymentProgress: newProgress,
            status: newStatus,
            paymentHistory: [...pi.paymentHistory, newPaymentEntry],
          }
        }
        return pi
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fully Paid":
        return <Badge className="bg-green-500">Fully Paid</Badge>
      case "Partial Payment":
        return <Badge className="bg-yellow-500">Partial Payment</Badge>
      case "Pending":
        return <Badge variant="destructive">Pending</Badge>
      case "Draft":
        return <Badge variant="outline">Draft</Badge>
      case "Sent":
        return <Badge className="bg-blue-500">Sent</Badge>
      case "Confirmed":
        return <Badge className="bg-purple-500">Confirmed</Badge>
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredPIs = proformaInvoices.filter(
    (pi) =>
      pi.piNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pi.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingPIsCount = proformaInvoices.filter(
    (pi) => pi.status === "Pending" || pi.status === "Partial Payment" || pi.status === "Sent",
  ).length

  const totalOutstandingAmount = proformaInvoices.reduce((sum, pi) => sum + pi.remainingAmount, 0)

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
                <BreadcrumbPage>Proforma Invoices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Proforma Invoice Management</h2>
          <Dialog open={showCreatePIDialog} onOpenChange={setShowCreatePIDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowCreatePIDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New PI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Proforma Invoice</DialogTitle>
                <DialogDescription>Generate a new PI with detailed product items.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerSelect" className="text-right">
                    Customer
                  </Label>
                  <Select
                    onValueChange={(value) => setNewPI({ ...newPI, customerId: Number.parseInt(value) })}
                    value={newPI.customerId?.toString() || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="issueDate" className="text-right">
                    Issue Date
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    className="col-span-3"
                    value={newPI.issueDate}
                    onChange={(e) => setNewPI({ ...newPI, issueDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    className="col-span-3"
                    value={newPI.dueDate}
                    onChange={(e) => setNewPI({ ...newPI, dueDate: e.target.value })}
                  />
                </div>
                <Separator className="my-4" />
                <Label className="text-lg font-semibold">Products</Label>
                {newPI.products.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 items-center gap-2 border-b pb-2 mb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="col-span-2">
                      <Select
                        onValueChange={(value) => handleProductChange(index, "productId", value)}
                        value={product.productId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((prod) => (
                            <SelectItem key={prod.id} value={prod.id.toString()}>
                              {prod.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      placeholder="Quantity (MT)"
                      type="number"
                      className="col-span-2"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    />
                    <Input
                      placeholder="Unit Price ($)"
                      type="number"
                      className="col-span-2"
                      value={product.unitPrice}
                      onChange={(e) => handleProductChange(index, "unitPrice", e.target.value)}
                    />
                    {newPI.products.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeProductRow(index)}>
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addProductRow}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product Line
                </Button>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label className="text-right font-bold">Total Amount</Label>
                  <div className="col-span-3 text-lg font-bold">
                    $
                    {calculatePITotal().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    className="col-span-3"
                    value={newPI.notes}
                    onChange={(e) => setNewPI({ ...newPI, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreatePIDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleCreatePI}>
                  Create PI
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* PI Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total PIs</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proformaInvoices.length}</div>
              <p className="text-xs text-muted-foreground">All time PIs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending PIs</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingPIsCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment or confirmation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fully Paid PIs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {proformaInvoices.filter((pi) => pi.status === "Fully Paid").length}
              </div>
              <p className="text-xs text-muted-foreground">Completed invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalOutstandingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total amount due</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Proforma Invoices Overview</CardTitle>
            <CardDescription>Manage all proforma invoices and their current status</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search PIs or customers..."
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
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Ordered By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPIs.map((pi) => (
                  <TableRow key={pi.id}>
                    <TableCell className="font-medium">{pi.piNumber}</TableCell>
                    <TableCell>{pi.customer}</TableCell>
                    <TableCell>{pi.issueDate}</TableCell>
                    <TableCell>{pi.dueDate}</TableCell>
                    <TableCell>${pi.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">${pi.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">${pi.remainingAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={pi.paymentProgress} className="w-16 h-2" />
                        <span className="text-sm">{pi.paymentProgress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{pi.orderedby}</TableCell>
                    <TableCell>{getStatusBadge(pi.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPI(pi)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(pi.status === "Draft" || pi.status === "Pending") && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleSendPI(pi.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleConfirmPI(pi.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {(pi.status === "Pending" ||
                          pi.status === "Partial Payment" ||
                          pi.status === "Sent" ||
                          pi.status === "Confirmed") && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Record Payment for {pi.piNumber}</DialogTitle>
                                <DialogDescription>Enter payment details for this Proforma Invoice.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Outstanding</Label>
                                  <div className="col-span-3 font-medium text-red-600">
                                    ${pi.remainingAmount.toLocaleString()}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="paymentAmount" className="text-right">
                                    Amount
                                  </Label>
                                  <Input
                                    id="paymentAmount"
                                    type="number"
                                    max={pi.remainingAmount}
                                    className="col-span-3"
                                    defaultValue={pi.remainingAmount}
                                    onBlur={(e) => handleRecordPayment(pi.id, Number.parseFloat(e.target.value))}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="paymentMethod" className="text-right">
                                    Method
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
                              </div>
                              <DialogFooter>
                                <Button type="submit">Record Payment</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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

      {/* PI Detail Modal */}
      {selectedPI && (
        <Dialog open={!!selectedPI} onOpenChange={() => setSelectedPI(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Proforma Invoice Details - {selectedPI.piNumber}</DialogTitle>
              <DialogDescription>Complete PI information and payment breakdown</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Customer</Label>
                  <p className="text-sm font-medium">{selectedPI.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">PI Number</Label>
                  <p className="text-sm font-medium">{selectedPI.piNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Issue Date</Label>
                  <p className="text-sm">{selectedPI.issueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Due Date</Label>
                  <p className="text-sm">{selectedPI.dueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  {getStatusBadge(selectedPI.status)}
                </div>
                {selectedPI.sentDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Sent Date</Label>
                    <p className="text-sm">{selectedPI.sentDate}</p>
                  </div>
                )}
                {selectedPI.confirmedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Confirmed Date</Label>
                    <p className="text-sm">{selectedPI.confirmedDate}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Products</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPI.products.map((product: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>${product.unitPrice.toLocaleString()}</TableCell>
                        <TableCell>${product.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Payment History</Label>
                {selectedPI.paymentHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPI.paymentHistory.map((payment: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell className="text-green-600">${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">No payments recorded yet</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
                    <p className="text-lg font-bold">${selectedPI.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Paid Amount</Label>
                    <p className="text-lg font-bold text-green-600">${selectedPI.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Remaining</Label>
                    <p className="text-lg font-bold text-red-600">${selectedPI.remainingAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-600">Payment Progress</Label>
                    <span className="text-sm font-medium">{selectedPI.paymentProgress}%</span>
                  </div>
                  <Progress value={selectedPI.paymentProgress} className="h-3" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPI(null)}>
                Close
              </Button>
              <Button>Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

import { MinusCircle } from "lucide-react" // Added for product row removal
