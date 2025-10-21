import apiClient from './api';

export type FreeZone = {
  id: number;
  name: string;
  code: string;
  description?: string;
  location: string;
  country: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'under_construction';
  area_hectares?: number;
  capacity_units?: number;
  facilities?: string;
  regulations?: string;
  rental_rate?: number;
  currency: string;
  monthly_rent?: number;
  next_payment?: string;
  current_stock?: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
};

export type CreateFreeZoneData = {
  name: string;
  code: string;
  description?: string;
  location: string;
  country: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'under_construction';
  area_hectares?: number;
  capacity_units?: number;
  facilities?: string;
  regulations?: string;
  rental_rate?: number;
  currency?: string;
  next_payment?: string;
};

export async function fetchFreeZones(params?: {
  search?: string;
  status?: string;
}) {
  const { data } = await apiClient.get('/free-zones', { params });
  return data as FreeZone[];
}

export async function createFreeZone(payload: CreateFreeZoneData) {
  const { data } = await apiClient.post('/free-zones', payload);
  return data as FreeZone;
}

export async function updateFreeZone(id: number, payload: Partial<CreateFreeZoneData>) {
  const { data } = await apiClient.put(`/free-zones/${id}`, payload);
  return data as FreeZone;
}

export async function deleteFreeZone(id: number) {
  await apiClient.delete(`/free-zones/${id}`);
}

export async function getFreeZone(id: number) {
  const { data } = await apiClient.get(`/free-zones/${id}`);
  return data as FreeZone;
}
