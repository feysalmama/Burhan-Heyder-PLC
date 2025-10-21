import { publicApi } from './api';

export type PortVessel = {
  id: number;
  name: string;
  capacity_mt: number;
  arrival_date: string;
  status: string;
  port?: {
    id: number;
    name: string;
    code: string;
  };
};

export type PortStockItem = {
  product_id: number;
  product_name: string;
  product_category: string;
  total_quantity_mt: number;
  vessel_count: number;
  items: Array<{
    id: number;
    vessel_name: string;
    quantity_mt: number;
    status: string;
    arrival_date: string;
    bl_no?: string;
  }>;
};

export type PortStats = {
  active_vessels: number;
  total_cargo_mt: number;
  products_count: number;
  recent_activity: number;
};

export type PortVesselsResponse = {
  port: {
    id: number;
    name: string;
    code: string;
    location?: string;
    capacity?: string;
    country?: string;
  };
  vessels: PortVessel[];
};

export type PortStockResponse = {
  port: {
    id: number;
    name: string;
    code: string;
    location?: string;
    capacity?: string;
    country?: string;
  };
  stock_summary: PortStockItem[];
  total_products: number;
  total_quantity_mt: number;
};

export type PortStatsResponse = {
  port: {
    id: number;
    name: string;
    code: string;
    location?: string;
    capacity?: string;
    country?: string;
  };
  stats: PortStats;
};

export async function getPortVessels(portId: number): Promise<PortVesselsResponse> {
  try {
    const { data } = await publicApi.get(`/ports/${portId}/vessels`);
    return data as PortVesselsResponse;
  } catch (error) {
    console.error('Error fetching port vessels:', error);
    throw error;
  }
}

export async function getPortStock(portId: number): Promise<PortStockResponse> {
  try {
    const { data } = await publicApi.get(`/ports/${portId}/stock`);
    return data as PortStockResponse;
  } catch (error) {
    console.error('Error fetching port stock:', error);
    throw error;
  }
}

export async function getPortStats(portId: number): Promise<PortStatsResponse> {
  try {
    const { data } = await publicApi.get(`/ports/${portId}/stats`);
    return data as PortStatsResponse;
  } catch (error) {
    console.error('Error fetching port stats:', error);
    throw error;
  }
}
