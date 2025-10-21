import apiClient from './api';
import axios from 'axios';
import { config } from './config';

// Create a separate client for public endpoints (no CSRF, no credentials)
const publicApiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

export type PaymentHistory = {
  id: number;
  reason: 'free_zone' | 'proforma_invoice' | 'product' | 'vessel' | 'port';
  related_id: number;
  related_type: string;
  amount: string; // from backend decimal
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  reference_number?: string | null;
  notes?: string | null;
  payment_date: string;
  previous_balance: string; // from backend decimal
  new_balance: string; // from backend decimal
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export type CreatePaymentData = {
  free_zone_id: number;
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  reference_number?: string;
  notes?: string;
  payment_date?: string;
};

export type FetchPaymentsParams = {
  reason?: string;
  related_id?: number;
  related_type?: string;
  page?: number;
};

export async function fetchPayments(params?: FetchPaymentsParams) {
  const { data } = await apiClient.get('/payment-history', { params });
  return data;
}

export async function fetchAllFreeZonePayments() {
  const { data } = await publicApiClient.get('/free-zones/payments');
  return data as PaymentHistory[];
}

export async function fetchFreeZonePayments(freeZoneId: number) {
  // Use public client for payment fetching (no CSRF required)
  const { data } = await publicApiClient.get(`/free-zones/${freeZoneId}/payments`);
  return data as PaymentHistory[];
}

export async function createFreeZonePayment(payload: CreatePaymentData) {
  // Use public client for payment recording (no CSRF required)
  const { data } = await publicApiClient.post('/free-zones/payments', payload);
  return data as PaymentHistory;
}

export async function updatePayment(id: number, payload: Partial<CreatePaymentData>) {
  const { data } = await apiClient.put(`/payment-history/${id}`, payload);
  return data as PaymentHistory;
}

export async function deletePayment(id: number) {
  await apiClient.delete(`/payment-history/${id}`);
}