import apiClient from './api';

export type Customer = {
  id: number;
  company_name: string;
  tin: string;
  business_type: string;
  contact_number: string;
  contact_person: string;
  position?: string;
  address?: string;
  email?: string;
  status: 'active' | 'inactive';
  balance?: number;
  last_order_at?: string | null;
  total_pis?: number;
  pending_pis?: number;
  outstanding_amount?: number;
};

export type PaymentHistory = {
  id: number;
  customer_id: number;
  proforma_invoice_id: number;
  user_id?: number;
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  reference_number?: string;
  notes?: string;
  payment_date: string;
  previous_balance: number;
  new_balance: number;
  proforma_invoice?: {
    id: number;
    pi_number: string;
    total_amount: number;
  };
  user?: {
    id: number;
    name: string;
  };
};

export type CustomerDetails = {
  customer: Customer;
  proforma_invoices: any[];
  payment_history: PaymentHistory[];
  outstanding_items: {
    count: number;
    total_amount: number;
    invoices: any[];
  };
};

export async function fetchCustomers(query?: string) {
  const params = query ? { search: query } : undefined;
  const { data } = await apiClient.get('/customers', { params });
  return data as { data: Customer[] } | Customer[];
}

export async function createCustomer(payload: Partial<Customer>) {
  const { data } = await apiClient.post('/customers', payload);
  return data as Customer;
}

export async function updateCustomer(id: number, payload: Partial<Customer>) {
  const { data } = await apiClient.put(`/customers/${id}`, payload);
  return data as Customer;
}

export async function deleteCustomer(id: number) {
  await apiClient.delete(`/customers/${id}`);
}

export async function fetchCustomerDetails(id: number) {
  const { data } = await apiClient.get(`/customers/${id}/details`);
  return data as CustomerDetails;
}

export async function fetchCustomerPaymentHistory(id: number) {
  const { data } = await apiClient.get(`/customers/${id}/payment-history`);
  return data as PaymentHistory[];
}
