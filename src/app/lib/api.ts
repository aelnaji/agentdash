// AICOMPANY API base — change to your server IP in .env
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  const json = await res.json();
  return json.data ?? json;
}

// ─── Agents ──────────────────────────────────────────────────────────────────

export interface ApiAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  isActive: boolean;
  model: { id: string; name: string; displayName: string } | null;
  provider: { id: string; name: string; type: string } | null;
  _count: { tasks: number };
}

export const getAgents = () => req<ApiAgent[]>('/api/v1/agents');

export const createAgent = (body: {
  name: string;
  role: string;
  description?: string;
  providerId: string;
  modelId: string;
  systemPrompt?: string;
  temperature?: number;
  isActive?: boolean;
}) => req<ApiAgent>('/api/v1/agents', { method: 'POST', body: JSON.stringify(body) });

// ─── Tasks ────────────────────────────────────────────────────────────────────

export interface ApiTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'failed';
  assignedAgentId: string;
  assignedAgent: { id: string; name: string; role: string } | null;
  createdAt: string;
  updatedAt: string;
}

export const getTasks = (agentId?: string) =>
  req<ApiTask[]>(`/api/v1/tasks${agentId ? `?agentId=${agentId}` : ''}`);

export const createTask = (body: {
  title: string;
  description?: string;
  assignedAgentId: string;
}) => req<ApiTask>('/api/v1/tasks', { method: 'POST', body: JSON.stringify(body) });

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface ApiStats {
  totalAgents: number;
  totalProviders: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
}

export const getStats = () => req<ApiStats>('/api/v1/stats');

// ─── Providers ────────────────────────────────────────────────────────────────

export interface ApiProvider {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
}

export const getProviders = () => req<ApiProvider[]>('/api/v1/providers');

// ─── Models ───────────────────────────────────────────────────────────────────

export interface ApiModel {
  id: string;
  name: string;
  displayName: string;
  providerId: string;
}

export const getModels = () => req<ApiModel[]>('/api/v1/models');
