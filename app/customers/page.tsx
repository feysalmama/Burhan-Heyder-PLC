"use client";

import { useEffect, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Edit, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

import {
  Customer,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/customer-service";
import { toast } from "sonner";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({
    company_name: "",
    tin: "",
    business_type: "",
    contact_number: "",
    email: "",
    contact_person: "",
    address: "",
  });
  const [editForm, setEditForm] = useState({
    company_name: "",
    tin: "",
    business_type: "",
    contact_number: "",
    email: "",
    contact_person: "",
    address: "",
    status: "active" as const,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchCustomers();
        const list = Array.isArray(res) ? res : (res as any).data;
        setCustomers(list || []);
      } catch (e) {
        console.error("Failed to load customers", e);
        toast.error("Failed to load customers");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const name = (customer.company_name || "").toLowerCase();
    const tin = (customer.tin || "").toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      tin.includes(searchTerm.toLowerCase())
    );
  });

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      company_name: customer.company_name,
      tin: customer.tin,
      business_type: customer.business_type,
      contact_number: customer.contact_number,
      email: customer.email || "",
      contact_person: customer.contact_person,
      address: customer.address || "",
      status: customer.status,
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const updated = await updateCustomer(selectedCustomer.id, editForm);
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? updated : c))
      );
      setIsEditOpen(false);
      setSelectedCustomer(null);
      toast.success("Customer updated successfully");
    } catch (e: any) {
      console.error("Update failed", e);
      const errorMessage =
        e.response?.data?.message || "Failed to update customer";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      await deleteCustomer(selectedCustomer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setIsDeleteOpen(false);
      setSelectedCustomer(null);
      toast.success("Customer deleted successfully");
    } catch (e: any) {
      console.error("Delete failed", e);
      const errorMessage =
        e.response?.data?.message || "Failed to delete customer";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="management-page w-full space-y-6 p-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Customer Management
        </h2>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter customer details to register a new customer.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="companyName" className="text-right">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={form.company_name}
                      onChange={(e) =>
                        setForm({ ...form, company_name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tin" className="text-right">
                      TIN
                    </Label>
                    <Input
                      id="tin"
                      value={form.tin}
                      onChange={(e) =>
                        setForm({ ...form, tin: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="businessType" className="text-right">
                      Business Type
                    </Label>
                    <Input
                      id="businessType"
                      value={form.business_type}
                      onChange={(e) =>
                        setForm({ ...form, business_type: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contactNumber" className="text-right">
                      Contact Number
                    </Label>
                    <Input
                      id="contactNumber"
                      value={form.contact_number}
                      onChange={(e) =>
                        setForm({ ...form, contact_number: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contactPerson" className="text-right">
                      Contact Person
                    </Label>
                    <Input
                      id="contactPerson"
                      value={form.contact_person}
                      onChange={(e) =>
                        setForm({ ...form, contact_person: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                      const created = await createCustomer({
                        company_name: form.company_name,
                        tin: form.tin,
                        business_type: form.business_type,
                        contact_number: form.contact_number,
                        contact_person: form.contact_person,
                        address: form.address,
                      });
                      setCustomers((prev) => [created as any, ...prev]);
                      setForm({
                        company_name: "",
                        tin: "",
                        business_type: "",
                        contact_number: "",
                        email: "",
                        contact_person: "",
                        address: "",
                      });
                      toast.success("Customer created successfully");
                    } catch (e: any) {
                      console.error("Create failed", e);
                      const errorMessage =
                        e.response?.data?.message ||
                        "Failed to create customer";
                      toast.error(errorMessage);
                    }
                  }}
                >
                  Save Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="w-full card">
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              Manage your customer database and view customer information
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            <Table className="w-full table">
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>TIN</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Total PIs</TableHead>
                  <TableHead>Pending PIs</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
                        Loading customers...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center py-8 text-gray-500"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.company_name}
                      </TableCell>
                      <TableCell>{customer.tin}</TableCell>
                      <TableCell>{customer.business_type}</TableCell>
                      <TableCell>
                        {customer.contact_number} <br />{" "}
                        {customer.contact_person}
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {customer.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.balance
                          ? `$${customer.balance.toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {customer.last_order_at
                          ? new Date(
                              customer.last_order_at
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>{customer.total_pis ?? "-"}</TableCell>
                      <TableCell>
                        <Badge>{customer.pending_pis ?? 0}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        {customer.outstanding_amount
                          ? `$${customer.outstanding_amount.toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/customers/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(customer)}
                            title="Edit Customer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(customer)}
                            title="Delete Customer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Customer Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCompanyName" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="editCompanyName"
                  value={editForm.company_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, company_name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTin" className="text-right">
                  TIN
                </Label>
                <Input
                  id="editTin"
                  value={editForm.tin}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tin: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editBusinessType" className="text-right">
                  Business Type
                </Label>
                <Input
                  id="editBusinessType"
                  value={editForm.business_type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, business_type: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editContactNumber" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="editContactNumber"
                  value={editForm.contact_number}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contact_number: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editContactPerson" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="editContactPerson"
                  value={editForm.contact_person}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contact_person: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="editAddress"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditCustomer}>
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCustomer?.company_name}
              "? This action cannot be undone.
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
              onClick={handleDeleteCustomer}
            >
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
