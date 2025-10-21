import { publicApi } from './api';

export type VesselManifestItem = {
  id: number;
  vessel_id: number;
  product_id: number;
  discharge_port_id?: number;
  quantity_mt: number;
  bl_no?: string;
  arrival_date?: string;
  notes?: string;
  status: 'pending' | 'loading' | 'discharging' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
    category?: string;
    unit: string;
  };
  discharge_port?: {
    id: number;
    name: string;
    code: string;
  };
};

export type CreateManifestItemData = {
  product_id: number;
  discharge_port_id?: number;
  quantity_mt: number;
  bl_no?: string;
  arrival_date?: string;
  notes?: string;
};

export type UpdateManifestItemData = Partial<CreateManifestItemData>;

export async function getVesselManifests(vesselId: number): Promise<VesselManifestItem[]> {
  try {
    const { data } = await publicApi.get(`/vessels/${vesselId}/manifests`);
    console.log('Vessel manifests API response:', data);
    
    // Backend returns { vessel: {...}, manifests: [...] }
    // Extract the manifests array
    const manifests = data.manifests || [];
    console.log('Extracted manifests array:', manifests);
    return manifests as VesselManifestItem[];
  } catch (error) {
    console.error('Error fetching vessel manifests:', error);
    throw error;
  }
}

export async function addManifestLine(vesselId: number, payload: CreateManifestItemData): Promise<VesselManifestItem> {
  try {
    console.log('Adding manifest line:', { vesselId, payload });
    const { data } = await publicApi.post(`/vessels/${vesselId}/manifests`, payload);
    console.log('Add manifest line API response:', data);
    return data as VesselManifestItem;
  } catch (error) {
    console.error('Error adding manifest line:', error);
    throw error;
  }
}

export async function updateManifestLine(id: number, patch: UpdateManifestItemData): Promise<VesselManifestItem> {
  try {
    console.log('Updating manifest line:', { id, patch });
    const { data } = await publicApi.put(`/vessel-products/${id}`, patch);
    console.log('Update manifest line API response:', data);
    return data as VesselManifestItem;
  } catch (error) {
    console.error('Error updating manifest line:', error);
    throw error;
  }
}

export async function deleteManifestLine(id: number): Promise<void> {
  try {
    console.log('Deleting manifest line:', id);
    await publicApi.delete(`/vessel-products/${id}`);
    console.log('Delete manifest line successful');
  } catch (error) {
    console.error('Error deleting manifest line:', error);
    throw error;
  }
}

export async function updateManifestStatus(id: number, status: string): Promise<VesselManifestItem> {
  try {
    console.log('Updating manifest status:', { id, status });
    const { data } = await publicApi.patch(`/vessel-products/${id}/status`, { status });
    return data.manifest as VesselManifestItem;
  } catch (error) {
    console.error('Error updating manifest status:', error);
    throw error;
  }
}

// Status constants and helpers
export const MANIFEST_STATUSES = {
  PENDING: 'pending',
  LOADING: 'loading',
  DISCHARGING: 'discharging',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    loading: 'Loading',
    discharging: 'Discharging',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    loading: 'bg-blue-100 text-blue-800',
    discharging: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};