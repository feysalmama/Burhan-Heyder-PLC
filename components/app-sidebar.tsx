"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Building2,
  Package,
  MapPin,
  Ship,
  Truck,
  BarChart3,
  Settings,
  Home,
  CreditCard,
  Warehouse,
  FileText,
  ClipboardList,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "Overview and analytics",
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
    description: "Manage system users",
  },
  {
    title: "Customer Management",
    url: "/customers",
    icon: Building2,
    description: "Customer database",
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    description: "Product catalog",
  },
  {
    title: "Free Zones",
    url: "/free-zones",
    icon: Warehouse,
    description: "Free zone management",
  },
  {
    title: "Ports",
    url: "/ports",
    icon: MapPin,
    description: "Port operations",
  },
  {
    title: "Vessels",
    url: "/vessels",
    icon: Ship,
    description: "Vessel tracking",
  },
  {
    title: "Manifest Products",
    url: "/manifest-products",
    icon: ClipboardList,
    description: "Manage vessel manifests",
  },
  {
    title: "Transportation",
    url: "/transportation",
    icon: Truck,
    description: "Logistics management",
  },
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: Car,
    description: "Vehicle fleet management",
  },
  {
    title: "Proforma Invoices",
    url: "/proforma-invoices",
    icon: FileText,
    description: "Invoice management",
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
    description: "Payment processing",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    description: "Analytics and reports",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white font-bold text-sm">BH</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Burhan Heyder
            </h1>
            <p className="text-xs text-gray-500">PLC</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.url;
          const Icon = item.icon;

          return (
            <Link key={item.url} href={item.url}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3 text-left",
                  isActive
                    ? "bg-black text-white hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="text-sm font-medium">{item.title}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
