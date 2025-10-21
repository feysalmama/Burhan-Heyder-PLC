"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  DollarSign,
  Users,
  Package,
  Truck,
  Calendar,
} from "lucide-react";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dummy metrics
  const salesPerformance = {
    thisMonth: "$2.4M",
    lastMonth: "$2.1M",
    growth: "+14.3%",
  };

  const paymentCollections = {
    collected: "$1.8M",
    outstanding: "$600K",
    rate: 75,
  };

  const topCustomers = [
    { name: "ABC Construction Ltd", value: "$450K" },
    { name: "XYZ Trading PLC", value: "$380K" },
    { name: "Steel Works Ethiopia", value: "$320K" },
  ];

  const inventoryStatus = {
    totalStockValue: "$3.2M",
    lowStockItems: 12,
    outOfStock: 3,
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h2>
      </div>

      {/* Quick categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="font-medium">Sales Reports</p>
            <p className="text-sm text-gray-500">
              Track sales performance and revenue
            </p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="font-medium">Payment Reports</p>
            <p className="text-sm text-gray-500">
              Monitor payment collections and outstanding balances
            </p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="font-medium">Customer Reports</p>
            <p className="text-sm text-gray-500">
              Analyze customer behavior and performance
            </p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="font-medium">Inventory Reports</p>
            <p className="text-sm text-gray-500">
              Track stock levels and product movement
            </p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="font-medium">Logistics Reports</p>
            <p className="text-sm text-gray-500">
              Monitor transportation and delivery performance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full card">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>
                  Monthly sales trends and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="text-2xl font-bold">
                    {salesPerformance.thisMonth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Month</span>
                  <span>{salesPerformance.lastMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Growth</span>
                  <span className="text-green-600 font-semibold">
                    {salesPerformance.growth}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full card">
              <CardHeader>
                <CardTitle>Payment Collections</CardTitle>
                <CardDescription>
                  Payment status and collection rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Collected</span>
                  <span className="text-2xl font-bold text-green-600">
                    {paymentCollections.collected}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Outstanding</span>
                  <span className="text-red-500">
                    {paymentCollections.outstanding}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Collection Rate</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={paymentCollections.rate}
                      className="w-24"
                    />
                    <span>{paymentCollections.rate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full card">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>
                  Highest performing customers by revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCustomers.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="font-medium">{c.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="w-full card">
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>
                  Current stock levels and movement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Stock Value</span>
                  <span className="font-medium">
                    {inventoryStatus.totalStockValue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Low Stock Items</span>
                  <span className="text-orange-600 font-medium">
                    {inventoryStatus.lowStockItems}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="text-red-600 font-medium">
                    {inventoryStatus.outOfStock}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Reports */}
        <TabsContent value="custom" className="space-y-6">
          <Card className="w-full card">
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>
                Create customized reports based on your specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Report Type</Label>
                  <div className="mt-2 border rounded-md p-2 text-sm text-gray-500">
                    Select report type
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Date Range</Label>
                  <div className="mt-2 border rounded-md p-2 text-sm text-gray-500">
                    Select date range
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Start Date</Label>
                  <div className="mt-2 border rounded-md p-2 text-sm text-gray-500">
                    mm/dd/yyyy
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">End Date</Label>
                  <div className="mt-2 border rounded-md p-2 text-sm text-gray-500">
                    mm/dd/yyyy
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-black text-white">Generate Report</Button>
                <Button variant="outline">Export to Excel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card className="w-full card">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Set up automated reports to be generated and sent regularly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Daily Sales Summary",
                  subtitle: "Sent every day at 9:00 AM",
                  status: "Active",
                },
                {
                  title: "Weekly Inventory Report",
                  subtitle: "Sent every Monday at 8:00 AM",
                  status: "Active",
                },
                {
                  title: "Monthly Financial Summary",
                  subtitle: "Sent on the 1st of each month",
                  status: "Inactive",
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="flex items-center justify-between border rounded-md p-4"
                >
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-gray-500">{r.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        r.status === "Active"
                          ? "text-green-600 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      {r.status}
                    </span>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
