import apiClient from './api';

export type ProformaInvoice = {
  id: number;
  customer_id: number;
  pi_number: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  holded_amount: number;
  notes?: string;
  currency: string;
  customer?: {
    id: number;
    company_name: string;
    tin: string;
  };
  items?: {
    id: number;
    proforma_invoice_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_amount: number;
    description?: string;
  }[];
  payment_history?: {
    id: number;
    amount: number;
    payment_method: string;
    reference_number: string;
    payment_receipt_path?: string;
    release_number?: string;
    release_receipt_path?: string;
    payment_date: string;
  }[];
};

export type CreateProformaInvoiceData = {
  customer_id: number;
  pi_number: string;
  issue_date: string;
  due_date: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_amount?: number;
  total_amount: number;
  paid_amount?: number;
  outstanding_amount?: number;
  notes?: string;
  currency?: string;
  items?: {
    product_id: number;
    quantity: number;
    unit_price: number;
    description?: string;
  }[];
  // Payment recording fields
  payment_amount?: number;
  payment_method?: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  payment_reference?: string;
  payment_notes?: string;
  payment_receipt_path?: string | null;
  release_number?: string | null;
  release_receipt_path?: string | null;
};

export async function fetchProformaInvoices(params?: {
  customer_id?: number;
  status?: string;
}) {
  const { data } = await apiClient.get('/proforma-invoices', { params });
  return data as ProformaInvoice[];
}

export async function createProformaInvoice(payload: CreateProformaInvoiceData) {
  const { data } = await apiClient.post('/proforma-invoices', payload);
  return data as ProformaInvoice;
}

export async function updateProformaInvoice(id: number, payload: Partial<CreateProformaInvoiceData>) {
  const { data } = await apiClient.put(`/proforma-invoices/${id}`, payload);
  return data as ProformaInvoice;
}

export async function deleteProformaInvoice(id: number) {
  await apiClient.delete(`/proforma-invoices/${id}`);
}

export async function getProformaInvoice(id: number) {
  const { data } = await apiClient.get(`/proforma-invoices/${id}`);
  return data as ProformaInvoice;
}
