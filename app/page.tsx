"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Building2,
  Package,
  Ship,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      change: "+12%",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Active Vessels",
      value: "23",
      change: "+3",
      icon: Ship,
      color: "text-green-600",
    },
    {
      title: "Products in Stock",
      value: "45,678 MT",
      change: "-2%",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Monthly Revenue",
      value: "$2.4M",
      change: "+18%",
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Vessel Arrival",
      description: "MV Atlantic Star arrived at Port of Djibouti",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "Payment Received",
      description: "Payment of $125,000 received from ABC Construction",
      time: "4 hours ago",
      status: "success",
    },
    {
      id: 3,
      type: "Low Stock Alert",
      description: "Rebar 16mm stock below minimum threshold",
      time: "6 hours ago",
      status: "warning",
    },
    {
      id: 4,
      type: "New Customer",
      description: "XYZ Trading registered as new customer",
      time: "1 day ago",
      status: "info",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from your business operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {activity.status === "warning" && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    {activity.status === "info" && (
                      <Users className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Free Zone Utilization */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Free Zone Utilization</CardTitle>
            <CardDescription>Current storage capacity usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ukab Zone A</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ukab Zone B</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ukab Zone C</span>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ukab Zone D</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
