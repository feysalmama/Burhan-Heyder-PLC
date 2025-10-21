"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { fetchFreeZones, type FreeZone } from "@/lib/free-zone-service";
import {
  updatePayment,
  deletePayment,
  type PaymentHistory,
} from "@/lib/payment-history-service";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("proforma");
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [freeZones, setFreeZones] = useState<FreeZone[]>([]);
  const [selectedFreeZone, setSelectedFreeZone] = useState<number | null>(null);
  const [selectedFreeZones, setSelectedFreeZones] = useState<number[]>([]);
  const [allowMultipleSelection, setAllowMultipleSelection] = useState(false);
  const [record, setRecord] = useState({
    piNumber: "",
    amount: "",
    method: "",
    reason: "proforma_invoice" as
      | "free_zone"
      | "proforma_invoice"
      | "product"
      | "vessel"
      | "port",
    reference: "",
    notes: "",
  });

  // Load free zones on component mount
  useEffect(() => {
    const loadFreeZones = async () => {
      try {
        const zones = await fetchFreeZones();
        setFreeZones(zones);
      } catch (error) {
        console.error("Failed to load free zones:", error);
      }
    };
    loadFreeZones();
  }, []);

  const summary = {
    totalOutstanding: "$254,200",
    paymentsReceived: "$209,300",
    pendingPls: 1,
    collectionRate: 82,
  };

  // Proforma invoices (payments view)
  const proformaRows = [
    {
      piNumber: "GH-2024-001",
      customer: "ABC Construction Ltd",
      totalAmount: "$125,000",
      paidAmount: "$75,000",
      remaining: "$50,000",
      paidBy: "Feysal MAma",
      progress: 60,
      dueDate: "2024-02-10",
      status: "Partial Payment",
    },
    {
      piNumber: "GH-2024-002",
      customer: "XYZ Trading PLC",
      totalAmount: "$87,500",
      paidAmount: "$87,500",
      remaining: "$0",
      paidBy: "Feysal MAma",
      progress: 100,
      dueDate: "2024-02-08",
      status: "Fully Paid",
    },
    {
      piNumber: "GH-2024-003",
      customer: "Steel Works Ethiopia",
      totalAmount: "$95,000",
      paidAmount: "$0",
      remaining: "$95,000",
      paidBy: "Feysal MAma",
      progress: 0,
      dueDate: "2024-02-12",
      status: "Pending",
    },
    {
      piNumber: "BH-2024-001",
      customer: "ABC Construction Ltd",
      totalAmount: "$156,000",
      paidAmount: "$46,800",
      remaining: "$109,200",
      paidBy: "Feysal MAma",
      progress: 30,
      dueDate: "2024-02-15",
      status: "Partial Payment",
    },
  ];

  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 1,
      piNumber: "BH-2024-002",
      customer: "ABC Construction Ltd",
      amount: "$25,000",
      paymentDate: "2024-01-15",
      method: "Bank Transfer",
      paidBy: "Feysal MAma",
      reference: "TXN-001234",
      status: "Completed",
    },
    {
      id: 2,
      piNumber: "AU-2024-001",
      customer: "ABC Construction Ltd",
      amount: "$50,000",
      paymentDate: "2024-01-20",
      method: "Bank Transfer",
      paidBy: "Feysal MAma",
      reference: "TXN-001235",
      status: "Completed",
    },
    {
      id: 3,
      piNumber: "AU-2024-002",
      customer: "XYZ Trading PLC",
      amount: "$87,500",
      paymentDate: "2024-01-18",
      method: "Cash",
      paidBy: "Feysal MAma",
      reference: "CASH-001",
      status: "Completed",
    },
    {
      id: 4,
      piNumber: "GH-2024-004",
      customer: "ABC Construction Ltd",
      amount: "$46,800",
      paymentDate: "2024-01-22",
      method: "Bank Transfer",
      paidBy: "Feysal MAma",
      reference: "TXN-001236",
      status: "Completed",
    },
  ]);

  const outstandingPayments = [
    {
      piNumber: "GH-2024-001",
      customer: "ABC Construction Ltd",
      totalAmount: "$125,000",
      outstanding: "$50,000",
      daysOverdue: 611,
      lastPayment: "No payments",
      status: "Partial Payment",
    },
    {
      piNumber: "GH-2024-003",
      customer: "Steel Works Ethiopia",
      totalAmount: "$95,000",
      outstanding: "$95,000",
      daysOverdue: 609,
      lastPayment: "No payments",
      status: "Pending",
    },
    {
      piNumber: "BH-2024-001",
      customer: "ABC Construction Ltd",
      totalAmount: "$156,000",
      outstanding: "$109,200",
      daysOverdue: 606,
      lastPayment: "No payments",
      status: "Partial Payment",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-red-500 text-white">Pending</Badge>;
      case "Fully Paid":
        return <Badge className="bg-green-500 text-white">Fully Paid</Badge>;
      case "Partial Payment":
        return (
          <Badge className="bg-yellow-400 text-black">Partial Payment</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRecord = () => {
    // Validate free zone selection if reason is "free_zone"
    if (record.reason === "free_zone") {
      if (!allowMultipleSelection && !selectedFreeZone) {
        alert("Please select a free zone");
        return;
      }
      if (allowMultipleSelection && selectedFreeZones.length === 0) {
        alert("Please select at least one free zone");
        return;
      }
    }

    console.log("Record payment", {
      ...record,
      selectedFreeZone: selectedFreeZone,
      selectedFreeZones: selectedFreeZones,
      allowMultipleSelection: allowMultipleSelection,
    });

    setRecord({
      piNumber: "",
      amount: "",
      method: "",
      reason: "proforma_invoice" as
        | "free_zone"
        | "proforma_invoice"
        | "product"
        | "vessel"
        | "port",
      reference: "",
      notes: "",
    });
    setSelectedFreeZone(null);
    setSelectedFreeZones([]);
    setAllowMultipleSelection(false);
    setIsRecordOpen(false);
  };

  const openEditModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsEditOpen(true);
  };

  const openDeleteModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsDeleteOpen(true);
  };

  const handleEditPayment = async () => {
    if (!selectedPayment) return;

    try {
      // For demo purposes, we'll just update the local state
      // In a real app, you'd call the API here
      const updatedPayment = {
        ...selectedPayment,
        // Add any updated fields here
      };

      setPaymentHistory((prev) =>
        prev.map((p) => (p.id === selectedPayment.id ? updatedPayment : p))
      );
      setIsEditOpen(false);
      setSelectedPayment(null);
      toast.success("Payment updated successfully");
    } catch (e: any) {
      console.error("Update failed", e);
      toast.error("Failed to update payment");
    }
  };

  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    try {
      // For demo purposes, we'll just update the local state
      // In a real app, you'd call the API here
      setPaymentHistory((prev) =>
        prev.filter((p) => p.id !== selectedPayment.id)
      );
      setIsDeleteOpen(false);
      setSelectedPayment(null);
      toast.success("Payment deleted successfully");
    } catch (e: any) {
      console.error("Delete failed", e);
      toast.error("Failed to delete payment");
    }
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Payment Management
        </h2>
        <Button
          className="bg-black text-white"
          onClick={() => setIsRecordOpen(true)}
        >
          + Record Payment
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">
              Total Outstanding
            </p>
            <p className="text-2xl font-bold text-red-600">
              {summary.totalOutstanding}
            </p>
            <p className="text-xs text-gray-500">Across all customers</p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">
              Payments Received
            </p>
            <p className="text-2xl font-bold text-green-600">
              {summary.paymentsReceived}
            </p>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Pending PIs</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.pendingPls}
            </p>
            <p className="text-xs text-gray-500">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card className="w-full card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Collection Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.collectionRate}%
            </p>
            <p className="text-xs text-gray-500">Payment collection rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proforma">Proforma Invoices</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="proforma" className="space-y-6">
          <Card className="w-full card">
            <CardHeader>
              <CardTitle>Proforma Invoices</CardTitle>
              <CardDescription>
                Track all proforma invoices and their payment status
              </CardDescription>
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search PIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full table">
                <TableHeader>
                  <TableRow>
                    <TableHead>PI Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Payment Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proformaRows
                    .filter(
                      (r) =>
                        r.piNumber
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        r.customer
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((r) => (
                      <TableRow key={r.piNumber}>
                        <TableCell className="font-medium">
                          {r.piNumber}
                        </TableCell>
                        <TableCell>{r.customer}</TableCell>
                        <TableCell>{r.totalAmount}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {r.paidAmount}
                        </TableCell>
                        <TableCell className="text-red-500">
                          {r.remaining}
                        </TableCell>
                        <TableCell>{r.paidBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={r.progress} className="w-20" />
                            <span className="text-sm">{r.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{r.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(r.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="w-full card">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All recorded payments from customers
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full table">
                <TableHeader>
                  <TableRow>
                    <TableHead>PI Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.piNumber}
                      </TableCell>
                      <TableCell>{p.customer}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {p.amount}
                      </TableCell>
                      <TableCell>{p.paymentDate}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell>{p.paidBy}</TableCell>
                      <TableCell>{p.reference}</TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(p)}
                            title="Edit Payment"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(p)}
                            title="Delete Payment"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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

        <TabsContent value="outstanding" className="space-y-6">
          <Card className="w-full card">
            <CardHeader>
              <CardTitle>Outstanding Payments</CardTitle>
              <CardDescription>
                Proforma invoices with pending or partial payments
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Table className="w-full table">
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
                  {outstandingPayments.map((o) => (
                    <TableRow key={o.piNumber}>
                      <TableCell className="font-medium">
                        {o.piNumber}
                      </TableCell>
                      <TableCell>{o.customer}</TableCell>
                      <TableCell>{o.totalAmount}</TableCell>
                      <TableCell className="text-red-500">
                        {o.outstanding}
                      </TableCell>
                      <TableCell className="text-red-500">
                        {o.daysOverdue} days
                      </TableCell>
                      <TableCell>{o.lastPayment}</TableCell>
                      <TableCell>{getStatusBadge(o.status)}</TableCell>
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

      {/* Record Payment Dialog */}
      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for any service or product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Payment Reason</Label>
              <select
                id="reason"
                className="w-full p-2 border rounded-md"
                value={record.reason}
                onChange={(e) => {
                  const newReason = e.target.value as
                    | "free_zone"
                    | "proforma_invoice"
                    | "product"
                    | "vessel"
                    | "port";
                  setRecord({
                    ...record,
                    reason: newReason,
                  });
                  // Reset selected free zone when changing reason
                  if (newReason !== "free_zone") {
                    setSelectedFreeZone(null);
                    setSelectedFreeZones([]);
                    setAllowMultipleSelection(false);
                  }
                }}
              >
                <option value="free_zone">Free Zone</option>
                <option value="proforma_invoice">Proforma Invoice</option>
                <option value="product">Product</option>
                <option value="vessel">Vessel</option>
                <option value="port">Port</option>
              </select>
            </div>

            {/* Free Zone Selection - Only show when reason is "free_zone" */}
            {record.reason === "free_zone" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowMultiple"
                    checked={allowMultipleSelection}
                    onChange={(e) => {
                      setAllowMultipleSelection(e.target.checked);
                      if (!e.target.checked) {
                        setSelectedFreeZones([]);
                      } else {
                        setSelectedFreeZone(null);
                      }
                    }}
                  />
                  <Label htmlFor="allowMultiple">
                    Allow multiple free zone selection
                  </Label>
                </div>

                {!allowMultipleSelection ? (
                  <div className="space-y-2">
                    <Label htmlFor="freeZone">Select Free Zone</Label>
                    <select
                      id="freeZone"
                      className="w-full p-2 border rounded-md"
                      value={selectedFreeZone || ""}
                      onChange={(e) =>
                        setSelectedFreeZone(Number(e.target.value))
                      }
                    >
                      <option value="">Select a free zone</option>
                      {freeZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} - {zone.location}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Select Free Zones (Multiple)</Label>
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                      {freeZones.map((zone) => (
                        <div
                          key={zone.id}
                          className="flex items-center space-x-2 py-1"
                        >
                          <input
                            type="checkbox"
                            id={`zone-${zone.id}`}
                            checked={selectedFreeZones.includes(zone.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFreeZones([
                                  ...selectedFreeZones,
                                  zone.id,
                                ]);
                              } else {
                                setSelectedFreeZones(
                                  selectedFreeZones.filter(
                                    (id) => id !== zone.id
                                  )
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`zone-${zone.id}`}
                            className="text-sm"
                          >
                            {zone.name} - {zone.location}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedFreeZones.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFreeZones.length} free zone(s)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="piNumber">Reference Number</Label>
                <Input
                  id="piNumber"
                  value={record.piNumber}
                  onChange={(e) =>
                    setRecord({ ...record, piNumber: e.target.value })
                  }
                  placeholder="Enter reference number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={record.amount}
                  onChange={(e) =>
                    setRecord({ ...record, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  className="w-full p-2 border rounded-md"
                  value={record.method}
                  onChange={(e) =>
                    setRecord({ ...record, method: e.target.value })
                  }
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Code</Label>
                <Input
                  id="reference"
                  value={record.reference}
                  onChange={(e) =>
                    setRecord({ ...record, reference: e.target.value })
                  }
                  placeholder="Enter reference code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={record.notes}
                onChange={(e) =>
                  setRecord({ ...record, notes: e.target.value })
                }
                placeholder="Enter payment notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black text-white" onClick={handleRecord}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>
              Update the payment information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPiNumber">PI Number</Label>
                <Input
                  id="editPiNumber"
                  value={selectedPayment?.piNumber || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCustomer">Customer</Label>
                <Input
                  id="editCustomer"
                  value={selectedPayment?.customer || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editAmount">Amount</Label>
                <Input
                  id="editAmount"
                  value={selectedPayment?.amount || ""}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMethod">Payment Method</Label>
                <select
                  id="editMethod"
                  className="w-full p-2 border rounded-md"
                  value={selectedPayment?.method || ""}
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editReference">Reference Code</Label>
                <Input
                  id="editReference"
                  value={selectedPayment?.reference || ""}
                  placeholder="Enter reference code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDate">Payment Date</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={selectedPayment?.paymentDate || ""}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditPayment}>
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete payment for "
              {selectedPayment?.piNumber}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePayment}
            >
              Delete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
