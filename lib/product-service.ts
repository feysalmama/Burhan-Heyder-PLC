import apiClient, { publicApi } from "./api";

export type Product = {
  id: number;
  name: string;
  category?: string | null;
  unit: string;
  price: string; // from backend decimal
  currency: "USD" | "BIRR";
  status: "active" | "inactive";
  description?: string | null;
  free_zone_id?: number | null;
  location_type?: "vessel" | "freezone" | "port" | "transfer" | null;
  location_id?: number | null;
  size?: string | null;
  bundle?: string | null;
  metric_ton?: string | null; // from backend decimal
  free_zone?: {
    id: number;
    name: string;
    location: string;
  } | null;
  location?: {
    id: number;
    name: string;
    location?: string;
  } | null;
  location_name?: string | null;
  location_type_label?: string | null;
  committed_quantity?: number;
  available_quantity?: number;
  created_at: string;
  updated_at: string;
};

export type CreateProductData = {
  name: string;
  category?: string;
  unit?: string;
  price: number;
  currency?: "USD" | "BIRR";
  status?: "active" | "inactive";
  description?: string;
  free_zone_id?: number;
  location_type?: "vessel" | "freezone" | "port" | "transfer";
  location_id?: number;
  size?: string;
  bundle?: string;
  metric_ton?: number;
};

export type UpdateProductData = Partial<CreateProductData>;

export type FetchProductsParams = {
  search?: string;
  status?: "active" | "inactive";
  location_type?: LocationType;
  page?: number;
};

export type LocationType = "vessel" | "freezone" | "port" | "transfer";

export type Location = {
  id: number;
  name: string;
  location?: string;
};

export async function fetchProducts(params?: FetchProductsParams) {
  try {
    const { data } = await publicApi.get("/products", { params });
    console.log('Products API response:', data);
    return data as { data: Product[]; current_page: number; last_page: number; total: number };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function createProduct(payload: CreateProductData) {
  const { data } = await apiClient.post("/products", payload);
  return data as Product;
}

export async function updateProduct(id: number, payload: UpdateProductData) {
  const { data } = await apiClient.put(`/products/${id}`, payload);
  return data as Product;
}

export async function deleteProduct(id: number) {
  await apiClient.delete(`/products/${id}`);
}

export async function getProduct(id: number) {
  const { data } = await publicApi.get(`/products/${id}`);
  return data as Product;
}

export async function fetchLocationsByType(type: LocationType) {
  try {
    const { data } = await publicApi.get(`/products/locations`, { 
      params: { type } 
    });
    return data as Location[];
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}


