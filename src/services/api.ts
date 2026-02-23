import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AuthResponse,
  LoginCredentials,
  Field,
  FieldDetail,
  Incident,
  CreateIncidentDto,
  IrrigationLog,
  CreateIrrigationLogDto,
  Task,
  CreateTaskDto,
  DashboardSummary,
} from '../types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { token: string | null } }).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithUnwrap = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.data && (result.data as any).success) {
    return { ...result, data: (result.data as any).data };
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithUnwrap,
  tagTypes: ['Fields', 'Incidents', 'Irrigation', 'Tasks', 'Dashboard'],
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getDashboardSummary: build.query<DashboardSummary, void>({
      query: () => '/users/summary',
      providesTags: ['Dashboard'],
    }),

    getFields: build.query<Field[], void>({
      query: () => '/fields',
      providesTags: ['Fields'],
    }),

    getFieldDetail: build.query<FieldDetail, string>({
      query: (id) => `/fields/${id}`,
      providesTags: ['Fields'],
    }),

    getIncidents: build.query<Incident[], { status?: string } | undefined>({
      query: (params) => ({
        url: '/incidents',
        params: params || {},
      }),
      providesTags: ['Incidents'],
    }),

    createIncident: build.mutation<Incident, CreateIncidentDto>({
      query: (body) => ({
        url: '/incidents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Incidents', 'Dashboard', 'Fields'],
    }),

    updateIncidentStatus: build.mutation<Incident, { id: string; status: string }>({
      query: ({ id, ...body }) => ({
        url: `/incidents/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Incidents', 'Dashboard', 'Fields'],
    }),

    createIrrigationLog: build.mutation<IrrigationLog, CreateIrrigationLogDto>({
      query: (body) => ({
        url: '/irrigation',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Irrigation', 'Dashboard', 'Fields'],
    }),

    getIrrigationLogs: build.query<IrrigationLog[], { fieldId?: string } | undefined>({
      query: (params) => ({
        url: '/irrigation',
        params: params || {},
      }),
      providesTags: ['Irrigation'],
    }),

    getTasks: build.query<Task[], { status?: string } | undefined>({
      query: (params) => ({
        url: '/tasks',
        params: params || {},
      }),
      providesTags: ['Tasks'],
    }),

    updateTaskStatus: build.mutation<Task, { id: string; status: string }>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),

    createTask: build.mutation<Task, CreateTaskDto>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),

    getMyTasks: build.query<Task[], void>({
      query: () => '/tasks/my',
      providesTags: ['Tasks'],
    }),

    getUsers: build.query<any[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardSummaryQuery,
  useGetFieldsQuery,
  useGetFieldDetailQuery,
  useGetIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentStatusMutation,
  useCreateIrrigationLogMutation,
  useGetIrrigationLogsQuery,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
  useCreateTaskMutation,
  useGetMyTasksQuery,
  useGetUsersQuery,
} = api;
