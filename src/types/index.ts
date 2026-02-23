export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'WORKER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type Status = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface Field {
  id: string;
  name: string;
  cropType: string;
  status: Status;
  area?: number;
  location?: string;
}

export interface FieldDetail extends Field {
  thresholds: {
    moistureMin: number;
    moistureMax: number;
  };
  lastIrrigation?: IrrigationLog;
  openIncidentsCount: number;
}

export interface Incident {
  id: string;
  fieldId: string;
  fieldName?: string;
  type: string;
  severity: Status;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CreateIncidentDto {
  fieldId: string;
  type: string;
  severity: Status;
  description: string;
}

export interface IrrigationLog {
  id: string;
  fieldId: string;
  fieldName?: string;
  moistureDeficit: number;
  status: Status;
  createdAt: string;
  createdBy: string;
}

export interface CreateIrrigationLogDto {
  fieldId: string;
  moistureDeficit: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  fieldId: string;
  fieldName?: string;
  priority: Status;
  status: 'OPEN' | 'COMPLETED';
  dueDate?: string;
  assignedTo?: string;
  assignedToId?: string;
  createdAt: string;
}

export interface CreateTaskDto {
  fieldId: string;
  assignedToId?: string;
  title: string;
  description: string;
  priority?: 'NORMAL' | 'WARNING' | 'CRITICAL';
  dueDate?: string;
}

export interface UpdateTaskStatusDto {
  status: 'COMPLETED';
}

export interface DashboardSummary {
  totalIncidentsToday: number;
  openIncidents: number;
  criticalFieldsCount: number;
  pendingTasksCount: number;
  latestIncidents: Incident[];
  latestTasks: Task[];
}
