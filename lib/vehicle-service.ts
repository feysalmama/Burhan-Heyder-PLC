import { publicApi } from './api';

export interface Vehicle {
  id: number;
  plate_number: string;
  truck_type: string;
  driver_name: string;
  driver_phone?: string;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  capacity_mt?: number;
  fuel_type: 'diesel' | 'petrol' | 'electric' | 'hybrid';
  year?: number;
  brand?: string;
  model?: string;
  last_service_date?: string;
  next_service_date?: string;
  insurance_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleData {
  plate_number: string;
  truck_type: string;
  driver_name: string;
  driver_phone?: string;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  capacity_mt?: number;
  fuel_type: 'diesel' | 'petrol' | 'electric' | 'hybrid';
  year?: number;
  brand?: string;
  model?: string;
  last_service_date?: string;
  next_service_date?: string;
  insurance_expiry?: string;
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const { data } = await publicApi.get('/vehicles');
    return data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

export async function createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle> {
  try {
    const { data } = await publicApi.post('/vehicles', vehicleData);
    return data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

export async function updateVehicle(id: number, vehicleData: UpdateVehicleData): Promise<Vehicle> {
  try {
    const { data } = await publicApi.put(`/vehicles/${id}`, vehicleData);
    return data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}

export async function deleteVehicle(id: number): Promise<void> {
  try {
    await publicApi.delete(`/vehicles/${id}`);
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
}

export async function getVehicle(id: number): Promise<Vehicle> {
  try {
    const { data } = await publicApi.get(`/vehicles/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
}



