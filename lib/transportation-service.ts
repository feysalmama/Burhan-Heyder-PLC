import { publicApi } from './api';

export type Transportation = {
  id: number;
  reference_number: string;
  type: 'inbound' | 'outbound' | 'transfer';
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  from_location_type: 'vessel' | 'free_zone' | 'port' | 'customer';
  from_location_id: number;
  to_location_type: 'vessel' | 'free_zone' | 'port' | 'customer';
  to_location_id: number;
  vehicle_id?: number;
  proforma_invoice_id?: number;
  scheduled_date?: string;
  actual_date?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  from_location?: {
    id: number;
    name: string;
    type: string;
  };
  to_location?: {
    id: number;
    name: string;
    type: string;
  };
  vehicle?: {
    id: number;
    plate_number: string;
    truck_type: string;
    driver_name: string;
  };
  items?: TransportationItem[];
};

export type TransportationItem = {
  id: number;
  transportation_id: number;
  product_id: number;
  quantity_mt: number;
  unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
    category: string;
  };
};

export type CreateTransportationData = {
  type: 'inbound' | 'outbound' | 'transfer';
  from_location_type: 'vessel' | 'free_zone' | 'port' | 'customer';
  from_location_id: number;
  vehicle_id?: number;
  proforma_invoice_id?: number;
  to_location_type: 'vessel' | 'free_zone' | 'port' | 'customer';
  to_location_id: number;
  scheduled_date?: string;
  actual_date?: string;
  notes?: string;
  items: Array<{
    product_id: number;
    quantity_mt: number;
    unit?: string;
    notes?: string;
  }>;
};

export type UpdateTransportationStatusData = {
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  actual_date?: string;
};

export type Location = {
  id: number;
  name: string;
  type: 'vessel' | 'free_zone' | 'port';
  type_label: string;
};

export type TransportationFilters = {
  type?: string;
  status?: string;
  from_location_type?: string;
  to_location_type?: string;
  search?: string;
  page?: number;
};

export async function getTransportations(filters?: TransportationFilters) {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.from_location_type) params.append('from_location_type', filters.from_location_type);
  if (filters?.to_location_type) params.append('to_location_type', filters.to_location_type);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());

  const { data } = await publicApi.get(`/transportations?${params.toString()}`);
  return data;
}

export async function getTransportation(id: number) {
  const { data } = await publicApi.get(`/transportations/${id}`);
  return data as Transportation;
}

export async function createTransportation(transportationData: CreateTransportationData) {
  try {
    console.log('Sending transportation data to API:', transportationData);
    const { data } = await publicApi.post('/transportations', transportationData);
    console.log('Transportation API response:', data);
    return data as Transportation;
  } catch (error) {
    console.error('Error in createTransportation API call:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
}

export async function updateTransportationStatus(id: number, statusData: UpdateTransportationStatusData) {
  const { data } = await publicApi.put(`/transportations/${id}/status`, statusData);
  return data as Transportation;
}

export async function updateTransportation(id: number, transportationData: Partial<CreateTransportationData>) {
  const { data } = await publicApi.put(`/transportations/${id}`, transportationData);
  return data as Transportation;
}

export async function deleteTransportation(id: number) {
  await publicApi.delete(`/transportations/${id}`);
}

export async function getTransportationLocations() {
  try {
    const { data } = await publicApi.get('/transportations/locations');
    console.log('Transportation locations API response:', data);
    return data as {
      vessels: Location[];
      free_zones: Location[];
      ports: Location[];
    };
  } catch (error) {
    console.error('Error fetching transportation locations:', error);
    throw error;
  }
}

