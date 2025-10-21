import axios from "axios";
import { config } from "./config";

export type Port = {
  id: number;
  name: string;
  code: string;
  capacity?: string | null;
  country?: string | null;
  location?: string | null;
  created_at: string;
  updated_at: string;
};

const publicApi = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  withCredentials: false,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export async function fetchPorts(): Promise<Port[]> {
  const { data } = await publicApi.get("/ports");
  return data as Port[];
}

export async function createPort(payload: {
  name: string;
  code: string;
  capacity?: string;
  country?: string;
  location?: string;
}): Promise<Port> {
  const { data } = await publicApi.post("/ports", payload);
  return data as Port;
}

export async function updatePort(id: number, payload: {
  name: string;
  code: string;
  capacity?: string;
  country?: string;
  location?: string;
}): Promise<Port> {
  const { data } = await publicApi.put(`/ports/${id}`, payload);
  return data as Port;
}

export async function deletePort(id: number): Promise<void> {
  await publicApi.delete(`/ports/${id}`);
}


