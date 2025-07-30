"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  DollarSign,
  CreditCard,
  Download,
  Send,
  Eye,
  Edit,
} from "lucide-react"

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPI, setSelectedPI] = useState<any>(null)

  // Mock customer data - in real app, this would come from API based on customerId
  const customer = {
    id: customerId,
    companyName: "ABC Construction Ltd",
    tin: "TIN001234567",
    businessType: "Construction",
    contactNumber: "+251911234567",
    email: "contact@abcconstruction.com",
    address: "Bole Sub City, Addis Ababa, Ethiopia",
    status: "Active",
    registrationDate: "2023-06-15",
    creditLimit: "$500,000",
    paymentTerms: "30 Days",
    contactPerson: "Mr. Ahmed Ali",
    contactPersonPhone: "+251911234567",
  }

  const customerPIs = [
    {
      id: 1,
      piNumber: "PI-2024-001",
      totalAmount: 125000,
      paidAmount: 75000,
      remainingAmount: 50000,
      paymentProgress: 60,
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      status: "Partial Payment",
      products: [{ name: "Rebar 16mm", quantity: "500 MT", unitPrice: "$250", total: "$125,000" }],
      paymentHistory: [
        { date: "2024-01-15", amount: 25000, method: "Bank Transfer", reference: "TXN-001234" },
        { date: "2024-01-20", amount: 50000, method: "Bank Transfer", reference: "TXN-001235" },
      ],
    },
    {
      id: 2,
      piNumber: "PI-2024-004",
      totalAmount: 156000,
      paidAmount: 46800,
      remainingAmount: 109200,
      paymentProgress: 30,
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "Partial Payment",
      products: [{ name: "Rebar 12mm", quantity: "600 MT", unitPrice: "$260", total: "$156,000" }],
      paymentHistory: [{ date: "2024-01-22", amount: 46800, method: "Bank Transfer", reference: "TXN-001236" }],
    },
    {
      id: 3,
      piNumber: "PI-2023-045",
      totalAmount: 89000,
      paidAmount: 89000,
      remainingAmount: 0,
      paymentProgress: 100,
      issueDate: "2023-12-20",
      dueDate: "2024-01-20",
      status: "Fully Paid",
      products: [{ name: "Rebar 20mm", quantity: "350 MT", unitPrice: "$254", total: "$89,000" }],
      paymentHistory: [{ date: "2024-01-18", amount: 89000, method: "Cash", reference: "CASH-001" }],
    },
    {
      id: 4,
      piNumber: "PI-2024-007",
      totalAmount: 95000,
      paidAmount: 0,
      remainingAmount: 95000,
      paymentProgress: 0,
      issueDate: "2024-01-25",
      dueDate: "2024-02-25",
      status: "Pending",
      products: [{ name: "Rebar 25mm", quantity: "380 MT", unitPrice: "$250", total: "$95,000" }],
      paymentHistory: [],
    },
  ]

  const allPayments = customerPIs
    .flatMap((pi) =>
      pi.paymentHistory.map((payment) => ({
        ...payment,
        piNumber: pi.piNumber,
        piTotal: pi.totalAmount,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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

  const totalOutstanding = customerPIs.reduce((sum, pi) => sum + pi.remainingAmount, 0)
  const totalPaid = customerPIs.reduce((sum, pi) => sum + pi.paidAmount, 0)
  const totalInvoiced = customerPIs.reduce((sum, pi) => sum + pi.totalAmount, 0)

  const filteredPIs = customerPIs.filter(
    (pi) =>
      pi.piNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pi.products.some((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
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
                <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{customer.companyName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{customer.companyName}</h2>
            <p className="text-muted-foreground">Complete customer profile with PI and payment details</p>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Proforma Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Proforma Invoice</DialogTitle>
                  <DialogDescription>Generate a new PI for {customer.companyName}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="piNumber" className="text-right">
                      PI Number
                    </Label>
                    <Input id="piNumber" defaultValue="PI-2024-008" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">
                      Product
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rebar-8mm">Rebar 8mm</SelectItem>
                        <SelectItem value="rebar-12mm">Rebar 12mm</SelectItem>
                        <SelectItem value="rebar-16mm">Rebar 16mm</SelectItem>
                        <SelectItem value="rebar-20mm">Rebar 20mm</SelectItem>
                        <SelectItem value="rebar-25mm">Rebar 25mm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity (MT)
                    </Label>
                    <Input id="quantity" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unitPrice" className="text-right">
                      Unit Price ($)
                    </Label>
                    <Input id="unitPrice" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date
                    </Label>
                    <Input id="dueDate" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea id="notes" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create PI</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </div>
        </div>

        {/* Customer Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Payments received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalOutstanding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Amount due</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active PIs</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerPIs.filter((pi) => pi.status !== "Fully Paid").length}</div>
              <p className="text-xs text-muted-foreground">Pending payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((totalPaid / totalInvoiced) * 100)}%</div>
              <p className="text-xs text-muted-foreground">Payment efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Complete customer profile and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">Company Name</Label>
                <p className="text-sm font-medium">{customer.companyName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">TIN</Label>
                <p className="text-sm">{customer.tin}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Business Type</Label>
                <p className="text-sm">{customer.businessType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Contact Person</Label>
                <p className="text-sm">{customer.contactPerson}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                <p className="text-sm">{customer.contactNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="text-sm">{customer.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Address</Label>
                <p className="text-sm">{customer.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Credit Limit</Label>
                <p className="text-sm font-medium text-green-600">{customer.creditLimit}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Payment Terms</Label>
                <p className="text-sm">{customer.paymentTerms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="proforma" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="proforma">Proforma Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="outstanding">Outstanding Items</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="proforma" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Proforma Invoices</CardTitle>
                <CardDescription>Complete history of PIs sent to this customer</CardDescription>
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
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPIs.map((pi) => (
                      <TableRow key={pi.id}>
                        <TableCell className="font-medium">{pi.piNumber}</TableCell>
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
                        <TableCell>{getStatusBadge(pi.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPI(pi)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
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
                <CardTitle>Complete Payment History</CardTitle>
                <CardDescription>All payments received from this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>PI Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>PI Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPayments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className="font-medium">{payment.piNumber}</TableCell>
                        <TableCell className="text-green-600 font-medium">${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>${payment.piTotal.toLocaleString()}</TableCell>
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
                <CardDescription>PIs requiring immediate attention or follow-up</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PI Number</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Outstanding Amount</TableHead>
                      <TableHead>Days Since Issue</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerPIs
                      .filter((pi) => pi.status !== "Fully Paid")
                      .map((pi) => {
                        const daysSinceIssue = Math.floor(
                          (new Date().getTime() - new Date(pi.issueDate).getTime()) / (1000 * 60 * 60 * 24),
                        )
                        const daysOverdue = getDaysOverdue(pi.dueDate)
                        const lastPayment =
                          pi.paymentHistory.length > 0
                            ? pi.paymentHistory[pi.paymentHistory.length - 1].date
                            : "No payments"

                        return (
                          <TableRow key={pi.id}>
                            <TableCell className="font-medium">{pi.piNumber}</TableCell>
                            <TableCell>{pi.products.map((p) => p.name).join(", ")}</TableCell>
                            <TableCell className="text-red-600 font-medium">
                              ${pi.remainingAmount.toLocaleString()}
                            </TableCell>
                            <TableCell>{daysSinceIssue} days</TableCell>
                            <TableCell>
                              {daysOverdue > 0 ? (
                                <span className="text-red-600 font-medium">{daysOverdue} days</span>
                              ) : (
                                <span className="text-green-600">Not overdue</span>
                              )}
                            </TableCell>
                            <TableCell>{lastPayment}</TableCell>
                            <TableCell>{getStatusBadge(pi.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="outline" size="sm">
                                  <Send className="h-4 w-4 mr-1" />
                                  Remind
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Plus className="h-4 w-4 mr-1" />
                                      Pay
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Record Payment</DialogTitle>
                                      <DialogDescription>Record a payment for {pi.piNumber}</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Outstanding</Label>
                                        <div className="col-span-3 text-red-600 font-medium">
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
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Behavior</CardTitle>
                  <CardDescription>Customer payment patterns and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Payment Time</span>
                      <span className="font-medium">15 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">On-time Payment Rate</span>
                      <span className="font-medium text-green-600">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Partial Payment Frequency</span>
                      <span className="font-medium text-yellow-600">50%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Order Value</span>
                      <span className="font-medium">${(totalInvoiced / customerPIs.length).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                  <CardDescription>Current month performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New PIs This Month</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payments Received</span>
                      <span className="font-medium text-green-600">${(totalPaid * 0.6).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Outstanding This Month</span>
                      <span className="font-medium text-red-600">${(totalOutstanding * 0.8).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Collection Efficiency</span>
                      <span className="font-medium text-blue-600">82%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PI Detail Modal */}
      {selectedPI && (
        <Dialog open={!!selectedPI} onOpenChange={() => setSelectedPI(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Proforma Invoice Details - {selectedPI.piNumber}</DialogTitle>
              <DialogDescription>Complete PI information and payment breakdown</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                        <TableCell>{product.unitPrice}</TableCell>
                        <TableCell>{product.total}</TableCell>
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
