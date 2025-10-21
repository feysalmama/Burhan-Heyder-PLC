"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FileText,
  DollarSign,
  Eye,
  Download,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchCustomers } from "@/lib/customer-service";
import {
  fetchProformaInvoices,
  createProformaInvoice,
  updateProformaInvoice,
  deleteProformaInvoice,
  ProformaInvoice as APIProformaInvoice,
} from "@/lib/proforma-invoice-service";
import { fetchProducts, Product } from "@/lib/product-service";

type Customer = {
  id: number;
  company_name: string;
  tin: string;
};

type ProductLine = {
  id: string;
  product_id: number;
  product_name: string;
  quantity: string;
  unitPrice: string;
  total: number;
};

export default function ProformaInvoicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<APIProformaInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedForEdit, setSelectedForEdit] = useState<any>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<any>(null);
  const [selectedForPayment, setSelectedForPayment] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.pi_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.company_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Calculate analytics based on filtered invoices
  const analytics = {
    totalPIs: filteredInvoices.length,
    pendingPIs: filteredInvoices.filter(
      (inv) => inv.status === "draft" || inv.status === "sent"
    ).length,
    fullyPaidPIs: filteredInvoices.filter((inv) => inv.status === "paid")
      .length,
    totalOutstanding: filteredInvoices.reduce(
      (sum, inv) => sum + Number(inv.outstanding_amount || 0),
      0
    ),
    totalAmount: filteredInvoices.reduce(
      (sum, inv) => sum + Number(inv.total_amount || 0),
      0
    ),
    paidAmount: filteredInvoices.reduce(
      (sum, inv) => sum + Number(inv.paid_amount || 0),
      0
    ),
  };

  // Debug logging
  console.log("Analytics values:", {
    totalOutstanding: analytics.totalOutstanding,
    totalAmount: analytics.totalAmount,
    paidAmount: analytics.paidAmount,
    sampleInvoice: invoices[0]
      ? {
          outstanding_amount: invoices[0].outstanding_amount,
          total_amount: invoices[0].total_amount,
          paid_amount: invoices[0].paid_amount,
        }
      : null,
  });

  // Form state for creating new PI
  const [form, setForm] = useState({
    customer_id: "",
    issue_date: "",
    due_date: "",
    status: "draft",
    notes: "",
  });

  const [productLines, setProductLines] = useState<ProductLine[]>([
    {
      id: "1",
      product_id: 0,
      product_name: "",
      quantity: "",
      unitPrice: "",
      total: 0,
    },
  ]);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    reference: "",
    paymentReceipt: null as File | null,
    releaseNumber: "",
    releaseReceipt: null as File | null,
  });

  // Calculate summary data from real invoices
  const summary = {
    total: invoices.length,
    pending: invoices.filter((inv) =>
      ["draft", "sent", "overdue"].includes(inv.status)
    ).length,
    fullyPaid: invoices.filter((inv) => inv.status === "paid").length,
    totalOutstanding: invoices.reduce(
      (sum, inv) =>
        sum +
        (typeof inv.outstanding_amount === "number"
          ? inv.outstanding_amount
          : parseFloat(inv.outstanding_amount || 0)),
      0
    ),
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Load customers, products and invoices
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load customers
        const customersRes = await fetchCustomers();
        const customersList = Array.isArray(customersRes)
          ? customersRes
          : (customersRes as any).data;
        setCustomers(customersList || []);

        // Load products
        const productsRes = await fetchProducts();
        setProducts(productsRes.data || []);

        // Load proforma invoices
        const invoicesRes = await fetchProformaInvoices();
        setInvoices(invoicesRes || []);
      } catch (e) {
        console.error("Failed to load data", e);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addProductLine = () => {
    const newLine: ProductLine = {
      id: Date.now().toString(),
      product_id: 0,
      product_name: "",
      quantity: "",
      unitPrice: "",
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    if (productLines.length > 1) {
      setProductLines(productLines.filter((line) => line.id !== id));
    }
  };

  const updateProductLine = (
    id: string,
    field: keyof ProductLine,
    value: string | number
  ) => {
    setProductLines(
      productLines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, [field]: value };

          // If product is selected, update product_name and unit_price
          if (field === "product_id") {
            const product = products.find((p) => p.id === value);
            if (product) {
              updated.product_name = product.name;
              updated.unitPrice = product.price;
            }
          }

          if (field === "quantity" || field === "unitPrice") {
            const quantity = parseFloat(updated.quantity) || 0;
            const unitPrice = parseFloat(updated.unitPrice) || 0;
            updated.total = quantity * unitPrice;
          }
          return updated;
        }
        return line;
      })
    );
  };

  const calculateSubtotal = () => {
    return productLines.reduce((sum, line) => sum + line.total, 0);
  };

  const calculateTotal = () => {
    return productLines.reduce((sum, line) => sum + line.total, 0);
  };

  const handleCreatePI = async () => {
    try {
      const totalAmount = calculateTotal();

      // Validate that all product lines have required data
      const validProductLines = productLines.filter(
        (line) =>
          line.product_id > 0 &&
          line.quantity &&
          line.unitPrice &&
          line.product_name &&
          line.product_name.trim() !== ""
      );

      if (validProductLines.length === 0) {
        toast.error("Please add at least one product with quantity and price");
        return;
      }

      // Validate stock availability
      for (const line of validProductLines) {
        const product = products.find((p) => p.id === line.product_id);
        if (
          product &&
          parseFloat(line.quantity) > (Number(product.available_quantity) || 0)
        ) {
          toast.error(
            `Quantity for ${product.name} exceeds available stock (${
              product.available_quantity || 0
            } MT available, ${product.committed_quantity || 0} MT committed)`
          );
          return;
        }
      }

      const piData = {
        customer_id: parseInt(form.customer_id),
        pi_number: `PI-${new Date().getFullYear()}-${String(Date.now()).slice(
          -6
        )}`,
        issue_date: form.issue_date,
        due_date: form.due_date,
        status: form.status as
          | "draft"
          | "sent"
          | "paid"
          | "overdue"
          | "cancelled",
        subtotal: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,
        paid_amount: 0,
        notes: form.notes,
        currency: "USD",
        items: validProductLines.map((line) => ({
          product_id: line.product_id,
          quantity: parseFloat(line.quantity),
          unit_price: parseFloat(line.unitPrice),
          description: line.product_name,
        })),
      };

      const createdInvoice = await createProformaInvoice(piData);
      setInvoices((prev) => [createdInvoice, ...prev]);

      // Reset form
      setForm({
        customer_id: "",
        issue_date: "",
        due_date: "",
        status: "draft",
        notes: "",
      });
      setProductLines([
        {
          id: "1",
          product_id: 0,
          product_name: "",
          quantity: "",
          unitPrice: "",
          total: 0,
        },
      ]);

      setIsCreateOpen(false);
      toast.success("Proforma Invoice created successfully");
    } catch (e: any) {
      console.error("Create failed", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.errors ||
        "Failed to create proforma invoice";
      toast.error(errorMessage);
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

  const openDetails = (inv: any) => {
    router.push(`/proforma-invoices/${inv.id}`);
  };

  const openPaymentDialog = (inv: any) => {
    setSelectedForPayment(inv);
    setPaymentForm({
      amount: inv.outstanding_amount?.toString() || "0",
      method: "",
      reference: "",
      paymentReceipt: null,
      releaseNumber: "",
      releaseReceipt: null,
    });
    setPaymentOpen(true);
  };

  const openEditDialog = (inv: any) => {
    setSelectedForEdit(inv);
    setForm({
      customer_id: inv.customer_id.toString(),
      issue_date: inv.issue_date,
      due_date: inv.due_date,
      status: inv.status,
      notes: inv.notes || "",
    });

    // Set product lines from invoice items
    if (inv.items && inv.items.length > 0) {
      const lines = inv.items.map((item: any, index: number) => ({
        id: (index + 1).toString(),
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity.toString(),
        unitPrice: item.unit_price.toString(),
        total: Number(item.total_amount) || 0,
      }));
      setProductLines(lines);
    } else {
      setProductLines([
        {
          id: "1",
          product_id: 0,
          product_name: "",
          quantity: "",
          unitPrice: "",
          total: 0,
        },
      ]);
    }

    setIsEditOpen(true);
  };

  const openDeleteDialog = (inv: any) => {
    setSelectedForDelete(inv);
    setIsDeleteOpen(true);
  };

  const handleEditPI = async () => {
    if (!selectedForEdit) return;

    try {
      setIsLoading(true);

      const piData = {
        customer_id: parseInt(form.customer_id),
        pi_number: selectedForEdit.pi_number,
        issue_date: form.issue_date,
        due_date: form.due_date,
        status: form.status as any,
        subtotal: calculateSubtotal(),
        tax_amount: 0,
        total_amount: calculateTotal(),
        notes: form.notes,
        currency: "USD",
        items: productLines
          .filter((line) => line.product_id && line.quantity && line.unitPrice)
          .map((line) => ({
            product_id: line.product_id,
            quantity: parseFloat(line.quantity),
            unit_price: parseFloat(line.unitPrice),
            description: line.product_name,
          })),
      };

      const updatedInvoice = await updateProformaInvoice(
        selectedForEdit.id,
        piData
      );
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedForEdit.id ? updatedInvoice : inv
        )
      );

      setIsEditOpen(false);
      setSelectedForEdit(null);
      toast.success("Proforma Invoice updated successfully");
    } catch (e: any) {
      console.error("Update failed", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.errors ||
        "Failed to update proforma invoice";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePI = async () => {
    if (!selectedForDelete) return;

    try {
      setIsLoading(true);
      await deleteProformaInvoice(selectedForDelete.id);
      setInvoices((prev) =>
        prev.filter((inv) => inv.id !== selectedForDelete.id)
      );
      setIsDeleteOpen(false);
      setSelectedForDelete(null);
      toast.success("Proforma Invoice deleted successfully");
    } catch (e: any) {
      console.error("Delete failed", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.errors ||
        "Failed to delete proforma invoice";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleRecordPayment = async () => {
    if (!paymentForm.amount || !paymentForm.method || !paymentForm.reference) {
      toast.error(
        "Please fill in all required fields including reference number"
      );
      return;
    }

    const paymentAmount = parseFloat(paymentForm.amount);

    // Validate payment amount
    if (paymentAmount <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    // Validate minimum payment amount ($100)
    if (paymentAmount < 100) {
      toast.error("Payment amount must be at least $100");
      return;
    }

    // Validate maximum payment amount (cannot exceed total invoice amount)
    if (selectedForPayment && paymentAmount > selectedForPayment.total_amount) {
      toast.error(
        `Payment amount cannot exceed the total invoice amount of $${selectedForPayment.total_amount.toLocaleString()}`
      );
      return;
    }

    setIsPaymentLoading(true);
    try {
      // Use the new payment recording API
      const updatedInvoice = await updateProformaInvoice(
        selectedForPayment.id,
        {
          payment_amount: paymentAmount,
          payment_method:
            (paymentForm.method as
              | "cash"
              | "bank_transfer"
              | "check"
              | "credit_card"
              | "other") || "cash",
          payment_reference: paymentForm.reference || "",
          payment_notes: "",
          payment_receipt_path: paymentForm.paymentReceipt
            ? paymentForm.paymentReceipt.name
            : null,
          release_number: paymentForm.releaseNumber || null,
          release_receipt_path: paymentForm.releaseReceipt
            ? paymentForm.releaseReceipt.name
            : null,
        }
      );

      // Update the invoices list immediately
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedForPayment.id
            ? {
                ...inv,
                paid_amount: updatedInvoice.paid_amount,
                outstanding_amount: updatedInvoice.outstanding_amount,
                holded_amount: updatedInvoice.holded_amount,
                status: updatedInvoice.status,
              }
            : inv
        )
      );

      // Reset form and close dialog
      setPaymentForm({
        amount: "",
        method: "",
        reference: "",
        paymentReceipt: null,
        releaseNumber: "",
        releaseReceipt: null,
      });
      setPaymentOpen(false);
      setSelectedForPayment(null);

      toast.success("Payment recorded successfully");
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || "Failed to record payment";
      toast.error(errorMessage);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Proforma Invoice Management
        </h2>
        <Button
          className="bg-black text-white"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New PI
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {/* Total PIs Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">PI</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total PIs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.totalPIs}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time PIs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending PIs Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">⏳</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending PIs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.pendingPIs}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Awaiting payment or confirmation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fully Paid PIs Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Fully Paid PIs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.fullyPaidPIs}
                </p>
                <p className="text-xs text-gray-500 mt-1">Completed invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Outstanding Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">$</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Outstanding
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics.totalOutstanding.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total amount due</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Total Revenue Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">💰</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics.totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All time revenue generated
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paid Amount Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 font-bold text-lg">💳</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Paid Amount
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics.paidAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Amount received</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="ml-4 mr-4">
        <CardHeader>
          <CardTitle>Proforma Invoices Overview</CardTitle>
          <CardDescription>
            Manage all proforma invoices and their current status
          </CardDescription>
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search PIs or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="w-full pt-6">
          <Table className="w-full table">
            <TableHeader>
              <TableRow>
                <TableHead>PI Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
                      Loading invoices...
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedInvoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-gray-500"
                  >
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">
                      {inv.pi_number}
                    </TableCell>
                    <TableCell>{inv.customer?.company_name || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(inv.issue_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(inv.due_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${inv.total_amount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      ${inv.paid_amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-red-500">
                      ${inv.outstanding_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(inv.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-gray-600">
                        <button
                          onClick={() => openDetails(inv)}
                          aria-label="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditDialog(inv)}
                          aria-label="Edit Invoice"
                          className="hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(inv)}
                          aria-label="Delete Invoice"
                          className="hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openPaymentDialog(inv)}
                          aria-label="Record Payment"
                          className="hover:text-green-600"
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>
                        <button aria-label="Download">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {filteredInvoices.length > 0 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </span>
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create New PI Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Proforma Invoice</DialogTitle>
            <DialogDescription>
              Generate a new PI with detailed product items.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select
                      value={form.customer_id}
                      onValueChange={(value) =>
                        setForm({ ...form, customer_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(value) =>
                        setForm({ ...form, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <div className="relative">
                      <Input
                        id="issue_date"
                        type="date"
                        value={form.issue_date}
                        onChange={(e) =>
                          setForm({ ...form, issue_date: e.target.value })
                        }
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <div className="relative">
                      <Input
                        id="due_date"
                        type="date"
                        value={form.due_date}
                        onChange={(e) =>
                          setForm({ ...form, due_date: e.target.value })
                        }
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Products</h3>
                <div className="space-y-3">
                  {productLines.map((line, index) => (
                    <div
                      key={line.id}
                      className="grid grid-cols-12 gap-4 items-start p-6 border rounded-lg bg-gray-50/50 mb-4"
                    >
                      <div className="col-span-5">
                        <Label>Product</Label>
                        <Select
                          value={line.product_id.toString()}
                          onValueChange={(value) =>
                            updateProductLine(
                              line.id,
                              "product_id",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => {
                              const availableQty =
                                product.available_quantity || 0;
                              const committedQty =
                                product.committed_quantity || 0;
                              const totalQty = Number(product.metric_ton) || 0;

                              return (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                  disabled={availableQty <= 0}
                                  className="py-3"
                                >
                                  <div className="font-medium text-sm">
                                    {product.name} - ${product.price} (
                                    {product.unit})
                                    {availableQty <= 0 && (
                                      <span className="text-red-500 ml-2">
                                        (Out of Stock)
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {line.product_id > 0 && (
                          <div className="mt-2 space-y-2">
                            {(() => {
                              const selectedProduct = products.find(
                                (p) => p.id === line.product_id
                              );
                              if (!selectedProduct) return null;

                              const availableQty =
                                selectedProduct.available_quantity || 0;
                              const committedQty =
                                selectedProduct.committed_quantity || 0;
                              const totalQty =
                                Number(selectedProduct.metric_ton) || 0;

                              return (
                                <div className="flex flex-wrap gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-200 bg-green-50 px-3 py-1 text-xs font-medium"
                                  >
                                    Available: {availableQty} MT
                                  </Badge>
                                  {committedQty > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-orange-600 border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium"
                                    >
                                      Committed: {committedQty} MT
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium"
                                  >
                                    Total: {totalQty} MT
                                  </Badge>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label>Quantity (MT)</Label>
                        <Input
                          type="number"
                          value={line.quantity}
                          onChange={(e) =>
                            updateProductLine(
                              line.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          max={
                            line.product_id > 0
                              ? Number(
                                  products.find((p) => p.id === line.product_id)
                                    ?.available_quantity || 0
                                )
                              : undefined
                          }
                        />
                        {line.product_id > 0 &&
                          line.quantity &&
                          parseFloat(line.quantity) >
                            (Number(
                              products.find((p) => p.id === line.product_id)
                                ?.available_quantity
                            ) || 0) && (
                            <p className="text-sm text-red-500 mt-1">
                              Quantity exceeds available stock
                            </p>
                          )}
                      </div>
                      <div className="col-span-2">
                        <Label>Unit Price ($)</Label>
                        <Input
                          type="number"
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateProductLine(
                              line.id,
                              "unitPrice",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Total</Label>
                        <Input
                          value={`$${(Number(line.total) || 0).toFixed(2)}`}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="col-span-1 flex gap-2">
                        {productLines.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeProductLine(line.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {index === productLines.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addProductLine}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addProductLine}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product Line
                    </Button>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Financial Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Amount</span>
                    <span className="text-2xl font-bold">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Add any additional notes or terms..."
                  rows={3}
                />
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black text-white" onClick={handleCreatePI}>
              Create PI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Proforma Invoice Details - {selected?.pi_number}
            </DialogTitle>
            <DialogDescription>
              Complete PI information and payment breakdown
            </DialogDescription>
          </DialogHeader>

          {/* Top two-column info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Customer</span>
                <br />
                <span className="font-medium">
                  {selected?.customer?.company_name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Issue Date</span>
                <br />
                <span>
                  {selected
                    ? new Date(selected.issue_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <br />
                {selected ? getStatusBadge(selected.status) : null}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">PI Number</span>
                <br />
                <span className="font-medium">{selected?.pi_number}</span>
              </div>
              <div>
                <span className="text-gray-500">Due Date</span>
                <br />
                <span>
                  {selected
                    ? new Date(selected.due_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Created Date</span>
                <br />
                <span>
                  {selected
                    ? new Date(selected.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Products table */}
          <div className="mt-4">
            <div className="font-medium mb-2">Products</div>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected?.items && selected.items.length > 0 ? (
                  selected.items.map((item: any, index: number) => {
                    const product = products.find(
                      (p) => p.id === item.product_id
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>
                          ${item.unit_price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${item.total_amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {product ? (
                            <span
                              className={
                                (Number(product.metric_ton) || 0) <= 10
                                  ? "text-red-500 font-semibold"
                                  : ""
                              }
                            >
                              {product.metric_ton || 0} MT
                              {(Number(product.metric_ton) || 0) <= 10 &&
                                " (Low Stock)"}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Stock Impact Summary */}
          {selected?.items && selected.items.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Stock Impact Summary
              </h4>
              <div className="space-y-1 text-sm">
                {selected.items.map((item: any, index: number) => {
                  const product = products.find(
                    (p) => p.id === item.product_id
                  );
                  if (!product) return null;

                  const remainingStock =
                    (Number(product.metric_ton) || 0) - item.quantity;
                  return (
                    <div key={index} className="flex justify-between">
                      <span>{item.product_name}:</span>
                      <span
                        className={
                          remainingStock < 0
                            ? "text-red-600 font-semibold"
                            : remainingStock <= 10
                            ? "text-orange-600"
                            : "text-green-600"
                        }
                      >
                        {remainingStock < 0
                          ? "Oversold!"
                          : `${remainingStock} remaining`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment summary */}
          <div className="mt-6 rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-xl font-bold">
                  ${selected?.total_amount?.toLocaleString() || "0"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Paid Amount</div>
                <div className="text-xl font-bold text-green-600">
                  ${selected?.paid_amount?.toLocaleString() || "0"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Outstanding</div>
                <div className="text-xl font-bold text-red-600">
                  ${selected?.outstanding_amount?.toLocaleString() || "0"}
                </div>
              </div>
            </div>
            {selected?.notes && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Notes</div>
                <div className="text-sm">{selected.notes}</div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            <Button className="bg-black text-white">Download PDF</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Record Payment for {selectedForPayment?.pi_number}
            </DialogTitle>
            <DialogDescription>
              Enter payment details for this Proforma Invoice.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6 py-4">
              {/* Outstanding Amount Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-600">
                  Outstanding
                </Label>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {selectedForPayment?.outstanding_amount?.toLocaleString() ||
                    "0"}
                </p>
              </div>

              {/* Payment Summary */}
              {selectedForPayment && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Outstanding Amount
                      </span>
                      <span className="font-bold text-red-700">
                        $
                        {(
                          selectedForPayment.outstanding_amount || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Payment Amount
                      </span>
                      <span className="font-bold text-blue-700">
                        $
                        {paymentForm.amount
                          ? parseFloat(paymentForm.amount).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">
                          Remaining After Payment
                        </span>
                        <span className="font-bold text-green-700">
                          $
                          {paymentForm.amount
                            ? Math.max(
                                0,
                                (selectedForPayment.outstanding_amount || 0) -
                                  parseFloat(paymentForm.amount)
                              ).toLocaleString()
                            : (
                                selectedForPayment.outstanding_amount || 0
                              ).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Outstanding amount minus this payment
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Amount and Method Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Amount</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    placeholder="Enter payment amount (minimum $100)"
                    min="100"
                    step="0.01"
                    max={selectedForPayment?.total_amount || 0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Method</Label>
                  <Select
                    value={paymentForm.method}
                    onValueChange={(value) =>
                      setPaymentForm({ ...paymentForm, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reference and Release Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-reference">Reference *</Label>
                  <Input
                    id="payment-reference"
                    value={paymentForm.reference}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        reference: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter payment reference number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="release-number">Release Number</Label>
                  <Input
                    id="release-number"
                    value={paymentForm.releaseNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        releaseNumber: e.target.value,
                      })
                    }
                    placeholder="Enter release number"
                  />
                </div>
              </div>

              {/* File Upload Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-receipt">
                    Upload Payment Receipt
                  </Label>
                  <Input
                    id="payment-receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentReceipt: e.target.files?.[0] || null,
                      })
                    }
                  />
                  {paymentForm.paymentReceipt && (
                    <p className="text-sm text-gray-600">
                      Selected: {paymentForm.paymentReceipt.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="release-receipt">
                    Upload Release Receipt
                  </Label>
                  <Input
                    id="release-receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        releaseReceipt: e.target.files?.[0] || null,
                      })
                    }
                  />
                  {paymentForm.releaseReceipt && (
                    <p className="text-sm text-gray-600">
                      Selected: {paymentForm.releaseReceipt.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-black text-white"
              onClick={handleRecordPayment}
              disabled={
                !paymentForm.amount || !paymentForm.method || isPaymentLoading
              }
            >
              {isPaymentLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Proforma Invoice</DialogTitle>
            <DialogDescription>
              Update the proforma invoice details below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-customer">Customer *</Label>
              <Select
                value={form.customer_id}
                onValueChange={(value) =>
                  setForm({ ...form, customer_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.company_name} ({customer.tin})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-issue-date">Issue Date *</Label>
                <Input
                  id="edit-issue-date"
                  type="date"
                  value={form.issue_date}
                  onChange={(e) =>
                    setForm({ ...form, issue_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date *</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={form.due_date}
                  onChange={(e) =>
                    setForm({ ...form, due_date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Products & Services</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProductLine}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="space-y-3">
                {productLines.map((line, index) => (
                  <div
                    key={line.id}
                    className="grid grid-cols-6 gap-2 items-end"
                  >
                    <div className="col-span-2">
                      <Label>Product</Label>
                      <Select
                        value={line.product_id.toString()}
                        onValueChange={(value) =>
                          updateProductLine(line.id, "product_id", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => {
                            const availableQty =
                              product.available_quantity || 0;
                            const committedQty =
                              product.committed_quantity || 0;
                            const totalQty = Number(product.metric_ton) || 0;

                            return (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                                disabled={availableQty <= 0}
                              >
                                <div className="flex flex-col items-start">
                                  <span>
                                    {product.name} - ${product.price} (
                                    {product.unit})
                                  </span>
                                  <div className="flex gap-2 text-xs">
                                    <Badge
                                      variant="outline"
                                      className="text-green-600"
                                    >
                                      Available: {availableQty} MT
                                    </Badge>
                                    {committedQty > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="text-orange-600"
                                      >
                                        Committed: {committedQty} MT
                                      </Badge>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className="text-blue-600"
                                    >
                                      Total: {totalQty} MT
                                    </Badge>
                                  </div>
                                  {availableQty <= 0 && (
                                    <span className="text-red-500 text-xs">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={Number(
                          products.find((p) => p.id === line.product_id)
                            ?.available_quantity || 0
                        )}
                        value={line.quantity}
                        onChange={(e) =>
                          updateProductLine(line.id, "quantity", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateProductLine(
                            line.id,
                            "unitPrice",
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        value={`$${line.total.toFixed(2)}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProductLine(line.id)}
                        disabled={productLines.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="text-right space-y-1">
                  <div className="text-sm text-gray-600">
                    Subtotal: ${calculateSubtotal().toFixed(2)}
                  </div>
                  <div className="text-lg font-semibold">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditPI} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Invoice Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Proforma Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedForDelete?.pi_number}"?
              This action cannot be undone.
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
              onClick={handleDeletePI}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
