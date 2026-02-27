import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
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
  SoilData,
  CreateSoilDataDto,
  SoilAnalysis,
  WeatherRecord,
  WeatherForecast,
  CurrentWeather,
  DailyLog,
  CreateDailyLogDto,
  VerifyDailyLogDto,
  DailyLogSummary,
  FertilizerApplication,
  CreateFertilizerApplicationDto,
  FertilizerSummary,
  FertilizerRecommendation,
  CropPlan,
  CreateCropPlanDto,
  UpdateCropPlanDto,
  CropPlanProgress,
  Report,
  GenerateReportDto,
  ScheduledReport,
  FieldImage,
  UploadImageDto,
  AuditLog,
  AuditLogFilters,
  Approval,
  ApprovalDecision,
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
  tagTypes: [
    'Fields',
    'Incidents',
    'Irrigation',
    'Tasks',
    'Dashboard',
    'Soil',
    'Weather',
    'DailyLogs',
    'Fertilizer',
    'CropPlans',
    'Reports',
    'Images',
    'AuditLogs',
    'Users',
    'Approvals',
  ],
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

    // ==================== SOIL MANAGEMENT ====================
    getSoilData: build.query<SoilData[], { fieldId?: string } | undefined>({
      query: (params) => ({
        url: '/soil-data',
        params: params || {},
      }),
      providesTags: ['Soil'],
    }),

    getSoilAnalysis: build.query<SoilAnalysis[], void>({
      query: () => '/soil-data/analysis',
      providesTags: ['Soil'],
    }),

    createSoilData: build.mutation<SoilData, CreateSoilDataDto>({
      query: (body) => ({
        url: '/soil-data',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Soil', 'Dashboard', 'Fields'],
    }),

    // ==================== WEATHER ====================
    getCurrentWeather: build.query<CurrentWeather, void>({
      query: () => '/weather/current',
      providesTags: ['Weather'],
    }),

    getWeatherForecast: build.query<WeatherForecast[], { days?: number } | undefined>({
      query: (params) => ({
        url: '/weather/forecast',
        params: params || {},
      }),
      providesTags: ['Weather'],
    }),

    getWeatherHistory: build.query<WeatherRecord[], { fieldId?: string; startDate?: string; endDate?: string } | undefined>({
      query: (params) => ({
        url: '/weather-records/history',
        params: params || {},
      }),
      providesTags: ['Weather'],
    }),

    // ==================== DAILY LOGS ====================
    getDailyLogs: build.query<DailyLog[], { workerId?: string; fieldId?: string; status?: string } | undefined>({
      query: (params) => ({
        url: '/daily-logs',
        params: params || {},
      }),
      providesTags: ['DailyLogs'],
    }),

    getDailyLogSummary: build.query<DailyLogSummary[], { startDate?: string; endDate?: string } | undefined>({
      query: (params) => ({
        url: '/daily-logs/summary',
        params: params || {},
      }),
      providesTags: ['DailyLogs'],
    }),

    createDailyLog: build.mutation<DailyLog, CreateDailyLogDto>({
      query: (body) => ({
        url: '/daily-logs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DailyLogs', 'Dashboard'],
    }),

    verifyDailyLog: build.mutation<DailyLog, { id: string; data: VerifyDailyLogDto }>({
      query: ({ id, ...body }) => ({
        url: `/daily-logs/${id}/verify`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['DailyLogs'],
    }),

    // ==================== FERTILIZER ====================
    getFertilizerApplications: build.query<FertilizerApplication[], { fieldId?: string } | undefined>({
      query: (params) => ({
        url: '/fertilizer-logs',
        params: params || {},
      }),
      providesTags: ['Fertilizer'],
    }),

    getFertilizerSummary: build.query<FertilizerSummary, void>({
      query: () => '/fertilizer-logs/summary',
      providesTags: ['Fertilizer'],
    }),

    getFertilizerRecommendations: build.query<FertilizerRecommendation[], void>({
      query: () => '/fertilizer-logs/recommendations',
      providesTags: ['Fertilizer'],
    }),

    createFertilizerApplication: build.mutation<FertilizerApplication, CreateFertilizerApplicationDto>({
      query: (body) => ({
        url: '/fertilizer-logs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Fertilizer', 'Dashboard', 'Fields'],
    }),

    // ==================== CROP PLANS ====================
    getCropPlans: build.query<CropPlan[], { season?: string; status?: string } | undefined>({
      query: (params) => ({
        url: '/crop-plans',
        params: params || {},
      }),
      providesTags: ['CropPlans'],
    }),

    getCropPlanProgress: build.query<CropPlanProgress[], void>({
      query: () => '/crop-plans/progress',
      providesTags: ['CropPlans'],
    }),

    createCropPlan: build.mutation<CropPlan, CreateCropPlanDto>({
      query: (body) => ({
        url: '/crop-plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CropPlans', 'Dashboard', 'Fields'],
    }),

    updateCropPlan: build.mutation<CropPlan, { id: string; data: UpdateCropPlanDto }>({
      query: ({ id, ...body }) => ({
        url: `/crop-plans/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['CropPlans'],
    }),

    // ==================== REPORTS ====================
    getReports: build.query<Report[], { type?: string } | undefined>({
      query: (params) => ({
        url: '/reports',
        params: params || {},
      }),
      providesTags: ['Reports'],
    }),

    generateReport: build.mutation<Report, GenerateReportDto>({
      query: (body) => ({
        url: '/reports/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reports'],
    }),

    getScheduledReports: build.query<ScheduledReport[], void>({
      query: () => '/reports/scheduled',
      providesTags: ['Reports'],
    }),

    // ==================== IMAGE GALLERY ====================
    getFieldImages: build.query<FieldImage[], { fieldId?: string; imageType?: string } | undefined>({
      query: (params) => ({
        url: '/uploads',
        params: params || {},
      }),
      providesTags: ['Images'],
    }),

    uploadImage: build.mutation<FieldImage, UploadImageDto & { image: File }>({
      query: (body) => {
        const formData = new FormData();
        formData.append('image', body.image);
        formData.append('fieldId', body.fieldId);
        if (body.caption) formData.append('caption', body.caption);
        if (body.imageType) formData.append('imageType', body.imageType);
        if (body.tags) formData.append('tags', JSON.stringify(body.tags));
        if (body.linkedIncidentId) formData.append('linkedIncidentId', body.linkedIncidentId);
        if (body.linkedLogId) formData.append('linkedLogId', body.linkedLogId);

        return {
          url: '/uploads/image',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Images', 'Fields'],
    }),

    deleteImage: build.mutation<void, string>({
      query: (id) => ({
        url: `/uploads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Images'],
    }),

    // ==================== AUDIT LOGS ====================
    getAuditLogs: build.query<AuditLog[], AuditLogFilters | undefined>({
      query: (params) => ({
        url: '/audit-logs',
        params: params || {},
      }),
      providesTags: ['AuditLogs'],
    }),

    // ==================== APPROVALS ====================
    getPendingApprovals: build.query<{ approvals: Approval[]; count: number }, { type?: string } | undefined>({
      query: (params) => ({
        url: '/approvals/pending',
        params: params || {},
      }),
      providesTags: ['Approvals'],
    }),

    getApprovalHistory: build.query<{ approvals: Approval[]; pagination: any }, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/approvals/history',
        params: params || {},
      }),
      providesTags: ['Approvals'],
    }),

    decideApproval: build.mutation<Approval, { id: string; decision: ApprovalDecision }>({
      query: ({ id, decision }) => ({
        url: `/approvals/${id}/decide`,
        method: 'POST',
        body: decision,
      }),
      invalidatesTags: ['Approvals'],
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
  // Soil
  useGetSoilDataQuery,
  useGetSoilAnalysisQuery,
  useCreateSoilDataMutation,
  // Weather
  useGetCurrentWeatherQuery,
  useGetWeatherForecastQuery,
  useGetWeatherHistoryQuery,
  // Daily Logs
  useGetDailyLogsQuery,
  useGetDailyLogSummaryQuery,
  useCreateDailyLogMutation,
  useVerifyDailyLogMutation,
  // Fertilizer
  useGetFertilizerApplicationsQuery,
  useGetFertilizerSummaryQuery,
  useGetFertilizerRecommendationsQuery,
  useCreateFertilizerApplicationMutation,
  // Crop Plans
  useGetCropPlansQuery,
  useGetCropPlanProgressQuery,
  useCreateCropPlanMutation,
  useUpdateCropPlanMutation,
  // Reports
  useGetReportsQuery,
  useGenerateReportMutation,
  useGetScheduledReportsQuery,
  // Images
  useGetFieldImagesQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
  // Audit Logs
  useGetAuditLogsQuery,
  // Approvals
  useGetPendingApprovalsQuery,
  useGetApprovalHistoryQuery,
  useDecideApprovalMutation,
} = api;
