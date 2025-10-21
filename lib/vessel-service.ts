import apiClient, { publicApi } from "./api";

export type Vessel = {
  id: number;
  name: string;
  bl_number?: string;
  arrival_date?: string;
  description?: string;
  port_id?: number;
  status?: string;
  delivery_status?: 'in_transit' | 'arrived' | 'discharged' | 'moved_to_port' | 'closed';
  discharge_date?: string;
  port_transfer_date?: string;
  delivery_status_label?: string;
  has_products?: boolean;
  port?: {
    id: number;
    name: string;
  };
  vessel_products?: Array<{
    id: number;
    name: string;
    metric_ton: number;
    unit: string;
    price: number;
    category: string;
    available_quantity: number;
  }>;
  product_location_history?: Array<{
    product_name: string;
    product_id: number;
    from_location_type: string;
    from_location_id: number;
    to_location_type: string;
    to_location_id: number;
    moved_at: string;
    reason: string;
  }>;
  created_at: string;
  updated_at: string;
};

export type CreateVesselData = Omit<Vessel, 'id' | 'created_at' | 'updated_at'>;

export type UpdateVesselData = Partial<CreateVesselData>;

export type FetchVesselsParams = {
  search?: string;
  status?: string;
  vessel_type?: string;
};

export async function fetchVessels(params?: FetchVesselsParams) {
  const { data } = await publicApi.get('/vessels', { params });
  return data as Vessel[];
}

export async function createVessel(vesselData: CreateVesselData) {
  const { data } = await apiClient.post('/vessels', vesselData);
  return data as Vessel;
}

export async function updateVessel(id: number, vesselData: UpdateVesselData) {
  const { data } = await apiClient.put(`/vessels/${id}`, vesselData);
  return data as Vessel;
}

export async function deleteVessel(id: number) {
  await apiClient.delete(`/vessels/${id}`);
}

export async function getVessel(id: number) {
  const { data } = await apiClient.get(`/vessels/${id}`);
  return data as Vessel;
}
