"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  FileText,
  Download,
  DollarSign,
  Calendar,
  User,
  Package,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ProformaInvoice as APIProformaInvoice } from "@/lib/proforma-invoice-service";

export default function ProformaInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<APIProformaInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadInvoiceDetails(Number(params.id));
    }
  }, [params.id]);

  const loadInvoiceDetails = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/proforma-invoices/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        toast.error("Failed to load invoice details");
        router.push("/proforma-invoices");
      }
    } catch (error) {
      console.error("Error loading invoice details:", error);
      toast.error("Failed to load invoice details");
      router.push("/proforma-invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Fully Paid</Badge>;
      case "sent":
        return (
          <Badge className="bg-yellow-400 text-black">Partial Payment</Badge>
        );
      case "overdue":
        return <Badge className="bg-red-500 text-white">Overdue</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-500 text-white">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `$${numAmount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading invoice details...</div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Invoice not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/proforma-invoices")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Invoices</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Proforma Invoice Details</h1>
            <p className="text-gray-600">Invoice #{invoice.pi_number}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Record Payment</span>
          </Button>
        </div>
      </div>

      {/* Invoice Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Invoice Information</span>
              </CardTitle>
              <CardDescription>
                Complete details for Proforma Invoice #{invoice.pi_number}
              </CardDescription>
            </div>
            <div className="text-right">{getStatusBadge(invoice.status)}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Customer</span>
              </div>
              <div className="font-semibold">
                {invoice.customer?.company_name || "N/A"}
              </div>
              {invoice.customer?.tin && (
                <div className="text-sm text-gray-500">
                  TIN: {invoice.customer.tin}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Issue Date</span>
              </div>
              <div className="font-semibold">
                {new Date(invoice.issue_date).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Due Date</span>
              </div>
              <div className="font-semibold">
                {new Date(invoice.due_date).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>Total Amount</span>
              </div>
              <div className="font-semibold text-lg">
                {formatCurrency(invoice.total_amount)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(invoice.paid_amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(invoice.outstanding_amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(invoice.total_amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Holded Amount
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(invoice.holded_amount || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Amount held from client
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Balance
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    (invoice.paid_amount || 0) - (invoice.holded_amount || 0)
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Paid amount minus holded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Products Requested By Customers</span>
          </CardTitle>
          <CardDescription>
            Items included in this proforma invoice
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoice.items && invoice.items.length > 0 ? (
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
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.product_name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit || "MT"}
                    </TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(item.total_amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No products found for this invoice</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Impact Summary Table */}

      {/* Payment History Table */}
      {invoice.payment_history && invoice.payment_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Payment History</span>
            </CardTitle>
            <CardDescription>
              Payment records and release information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment #</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Release Number</TableHead>
                  <TableHead>Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.payment_history.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {payment.payment_method.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.reference_number}
                    </TableCell>
                    <TableCell>
                      {payment.release_number ? (
                        <span className="font-medium">
                          {payment.release_number}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {payment.payment_receipt_path && (
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600">
                              Payment
                            </span>
                          </div>
                        )}
                        {payment.release_receipt_path && (
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">
                              Release
                            </span>
                          </div>
                        )}
                        {!payment.payment_receipt_path &&
                          !payment.release_receipt_path && (
                            <span className="text-gray-400 text-xs">
                              No documents
                            </span>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
