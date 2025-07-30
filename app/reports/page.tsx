"use client"

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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Users, Package, Ship } from "lucide-react"

export default function ReportsPage() {
  const reportTypes = [
    {
      id: "sales",
      title: "Sales Reports",
      description: "Track sales performance and revenue",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      id: "payments",
      title: "Payment Reports",
      description: "Monitor payment collections and outstanding balances",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      id: "customers",
      title: "Customer Reports",
      description: "Analyze customer behavior and performance",
      icon: Users,
      color: "text-purple-600",
    },
    {
      id: "inventory",
      title: "Inventory Reports",
      description: "Track stock levels and product movement",
      icon: Package,
      color: "text-orange-600",
    },
    {
      id: "logistics",
      title: "Logistics Reports",
      description: "Monitor transportation and delivery performance",
      icon: Ship,
      color: "text-cyan-600",
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
                <BreadcrumbPage>Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        </div>

        {/* Report Type Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => (
            <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                <report.icon className={`h-4 w-4 ${report.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Monthly sales trends and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Month</span>
                      <span className="text-2xl font-bold">$2.4M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Month</span>
                      <span className="text-lg">$2.1M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Growth</span>
                      <span className="text-sm text-green-600">+14.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Collections</CardTitle>
                  <CardDescription>Payment status and collection rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Collected</span>
                      <span className="text-2xl font-bold text-green-600">$1.8M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Outstanding</span>
                      <span className="text-lg text-orange-600">$600K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Collection Rate</span>
                      <span className="text-sm text-green-600">75%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Highest performing customers by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ABC Construction Ltd</span>
                      <span className="text-sm font-medium">$450K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">XYZ Trading PLC</span>
                      <span className="text-sm font-medium">$320K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Steel Works Ethiopia</span>
                      <span className="text-sm font-medium">$280K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current stock levels and movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Stock Value</span>
                      <span className="text-sm font-medium">$3.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Stock Items</span>
                      <span className="text-sm font-medium text-yellow-600">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Out of Stock</span>
                      <span className="text-sm font-medium text-red-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>Create customized reports based on your specific requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Report</SelectItem>
                        <SelectItem value="payments">Payment Report</SelectItem>
                        <SelectItem value="customers">Customer Report</SelectItem>
                        <SelectItem value="inventory">Inventory Report</SelectItem>
                        <SelectItem value="inbound">Inbound Report</SelectItem>
                        <SelectItem value="outbound">Outbound Report</SelectItem>
                        <SelectItem value="freezone">Free Zone Report</SelectItem>
                        <SelectItem value="ports">Ports Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Set up automated reports to be generated and sent regularly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Daily Sales Summary</h4>
                      <p className="text-sm text-muted-foreground">Sent every day at 9:00 AM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600">Active</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Weekly Inventory Report</h4>
                      <p className="text-sm text-muted-foreground">Sent every Monday at 8:00 AM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600">Active</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Monthly Financial Summary</h4>
                      <p className="text-sm text-muted-foreground">Sent on the 1st of each month</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Inactive</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule New Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
