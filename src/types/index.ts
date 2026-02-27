// Soil Management Types
export interface SoilData {
  id: string;
  fieldId: string;
  fieldName?: string;
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  pH: number;
  organicMatter?: number; // percentage
  moisture?: number; // percentage
  temperature?: number; // Celsius
  analyzedAt: string;
  createdAt: string;
  createdBy: string;
  creatorName?: string;
  labReportUrl?: string;
  recommendations?: string[];
  deficiencyFlags?: {
    nitrogen: 'LOW' | 'OPTIMAL' | 'HIGH';
    phosphorus: 'LOW' | 'OPTIMAL' | 'HIGH';
    potassium: 'LOW' | 'OPTIMAL' | 'HIGH';
    pH: 'ACIDIC' | 'OPTIMAL' | 'ALKALINE';
  };
}

export interface CreateSoilDataDto {
  fieldId: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  organicMatter?: number;
  moisture?: number;
  temperature?: number;
  analyzedAt?: string;
  recommendations?: string[];
}

export interface SoilAnalysis {
  fieldId: string;
  fieldName: string;
  latestSoilData: SoilData | null;
  averageNPK: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  healthScore: number; // 0-100
}

// Weather Types
export interface WeatherRecord {
  id: string;
  fieldId?: string;
  fieldName?: string;
  temperature: number; // Celsius
  feelsLike?: number;
  humidity: number; // percentage
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection?: string;
  rainfall: number; // mm
  cloudCover?: number; // percentage
  uvIndex?: number;
  visibility?: number; // km
  description: string;
  icon: string;
  recordedAt: string;
  createdAt: string;
}

export interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
  description: string;
  icon: string;
}

export interface WeatherHistory {
  date: string;
  tempAvg: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  condition?: string;
  updatedAt?: string;
  uvIndex?: number;
  windSpeed?: number;
  feelsLike?: number;
}

// Worker Daily Log Types
export interface DailyLog {
  id: string;
  workerId: string;
  workerName: string;
  fieldId: string;
  fieldName?: string;
  date: string;
  startTime: string;
  endTime: string;
  activities: string[];
  hoursWorked: number;
  notes?: string;
  photoUrls?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifierName?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface CreateDailyLogDto {
  fieldId: string;
  date: string;
  startTime: string;
  endTime: string;
  activities: string[];
  notes?: string;
  photoUrls?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface VerifyDailyLogDto {
  status: 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
}

export interface DailyLogSummary {
  workerId: string;
  workerName: string;
  totalLogs: number;
  verifiedLogs: number;
  pendingLogs: number;
  rejectedLogs: number;
  totalHours: number;
  averageHoursPerDay: number;
}

// Fertilizer Management Types
export interface FertilizerApplication {
  id: string;
  fieldId: string;
  fieldName?: string;
  fertilizerType: FertilizerType;
  quantity: number; // kg
  applicationRate: number; // kg/hectare
  cost: number; // ETB
  growthStage: GrowthStage;
  appliedBy: string;
  applierName?: string;
  appliedAt: string;
  notes?: string;
  weatherConditions?: string;
  createdAt: string;
}

export type FertilizerType = 
  | 'UREA'
  | 'DAP'
  | 'NPS'
  | 'COMPOST'
  | 'MANURE'
  | 'UREA_46'
  | 'CAN'
  | 'OTHER';

export type GrowthStage = 
  | 'PRE_PLANTING'
  | 'PLANTING'
  | 'EARLY_GROWTH'
  | 'VEGETATIVE'
  | 'FLOWERING'
  | 'FRUITING'
  | 'MATURATION'
  | 'POST_HARVEST';

export interface CreateFertilizerApplicationDto {
  fieldId: string;
  fertilizerType: FertilizerType;
  quantity: number;
  applicationRate: number;
  cost: number;
  growthStage: GrowthStage;
  appliedAt?: string;
  notes?: string;
  weatherConditions?: string;
}

export interface FertilizerSummary {
  fieldId: string;
  fieldName: string;
  totalApplications: number;
  totalQuantity: number;
  totalCost: number;
  applicationsByType: Record<FertilizerType, number>;
  lastApplication: FertilizerApplication | null;
}

export interface FertilizerRecommendation {
  fieldId: string;
  fieldName: string;
  recommendedFertilizer: FertilizerType;
  recommendedQuantity: number;
  recommendedTiming: string;
  growthStage: GrowthStage;
  reason: string;
  expectedYieldIncrease: number; // percentage
}

// Crop Planning Types
export interface CropPlan {
  id: string;
  fieldId: string;
  fieldName?: string;
  season: Season;
  cropType: string;
  cropVariety?: string;
  plannedArea: number; // hectares
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  plannedYield: number; // tons
  actualYield?: number; // tons
  budget: number; // ETB
  actualCost?: number; // ETB
  status: CropPlanStatus;
  notes?: string;
  createdBy: string;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export type Season = 'BELG' | 'MEHER' | 'BEGA' | 'YEAR_ROUND';
export type CropPlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface CreateCropPlanDto {
  fieldId: string;
  season: Season;
  cropType: string;
  cropVariety?: string;
  plannedArea: number;
  plantingDate: string;
  expectedHarvestDate: string;
  plannedYield: number;
  budget: number;
  notes?: string;
}

export interface UpdateCropPlanDto {
  actualHarvestDate?: string;
  actualYield?: number;
  actualCost?: number;
  status?: CropPlanStatus;
  notes?: string;
}

export interface CropPlanProgress {
  planId: string;
  fieldName: string;
  cropType: string;
  status: CropPlanStatus;
  daysElapsed: number;
  daysRemaining: number;
  progressPercentage: number;
  yieldVariance: number; // percentage
  budgetVariance: number; // percentage
}

// Approval Types
export type ApprovalType = 'CROP_PLAN' | 'FERTILIZER' | 'IRRIGATION' | 'BUDGET' | 'DISEASE_ALERT' | 'SOIL_DATA' | 'AI_RECOMMENDATION';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Approval {
  id: string;
  type: ApprovalType;
  referenceId: string;
  requestedById: string;
  requestedBy?: {
    id: string;
    fullName: string;
    email: string;
  };
  requiredRole: UserRole;
  status: ApprovalStatus;
  confidenceScore?: number;
  reason?: string;
  approvedById?: string;
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
  };
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  reference?: any;
}

export interface ApprovalDecision {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

// Report Types
export interface Report {
  id: string;
  type: ReportType;
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  generatedBy: string;
  generatorName?: string;
  data: any;
  fileUrl?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  scheduledAt?: string;
  generatedAt: string;
  expiresAt?: string;
}

export type ReportType = 
  | 'DAILY_SUMMARY'
  | 'WEEKLY_SUMMARY'
  | 'MONTHLY_SUMMARY'
  | 'SOIL_ANALYSIS'
  | 'FERTILIZER_SUMMARY'
  | 'WORKER_PERFORMANCE'
  | 'WEATHER_ANALYTICS'
  | 'INCIDENT_REPORT'
  | 'TASK_COMPLETION'
  | 'YIELD_REPORT';

export interface GenerateReportDto {
  type: ReportType;
  startDate: string;
  endDate: string;
  fieldId?: string;
  workerId?: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  emailTo?: string[];
}

export interface ScheduledReport {
  id: string;
  type: ReportType;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recipients: string[];
  format: 'PDF' | 'EXCEL' | 'CSV';
  lastGenerated?: string;
  nextScheduled: string;
  isActive: boolean;
  createdBy: string;
}

// Image Gallery Types
export interface FieldImage {
  id: string;
  fieldId: string;
  fieldName?: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption?: string;
  imageType: ImageType;
  tags: string[];
  uploadedBy: string;
  uploaderName?: string;
  uploadedAt: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  linkedIncidentId?: string;
  linkedLogId?: string;
}

export type ImageType = 
  | 'GENERAL'
  | 'DISEASE'
  | 'PEST'
  | 'GROWTH'
  | 'IRRIGATION'
  | 'HARVEST'
  | 'DAMAGE'
  | 'OTHER';

export interface UploadImageDto {
  fieldId: string;
  caption?: string;
  imageType: ImageType;
  tags?: string[];
  linkedIncidentId?: string;
  linkedLogId?: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  entity: EntityType;
  entityId: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'WORKER' | 'AGRONOMIST';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT';
export type EntityType = 
  | 'USER'
  | 'FIELD'
  | 'INCIDENT'
  | 'TASK'
  | 'IRRIGATION'
  | 'SOIL_DATA'
  | 'FERTILIZER'
  | 'CROP_PLAN'
  | 'DAILY_LOG'
  | 'REPORT';

export interface AuditLogFilters {
  userId?: string;
  action?: AuditAction;
  entity?: EntityType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  data: any;
  loading: boolean;
  error?: string;
  lastUpdated: string;
}

export type WidgetType = 
  | 'WEATHER'
  | 'SOIL_HEALTH'
  | 'TASK_PROGRESS'
  | 'RECENT_LOGS'
  | 'FERTILIZER_ALERTS'
  | 'QUICK_ACTIONS';

export interface WeatherWidgetData {
  current: CurrentWeather;
  forecast: WeatherForecast[];
}

export interface SoilHealthWidgetData {
  totalFields: number;
  healthyFields: number;
  deficientFields: number;
  alerts: SoilDeficiencyAlert[];
}

export interface SoilDeficiencyAlert {
  fieldId: string;
  fieldName: string;
  deficiency: 'NITROGEN' | 'PHOSPHORUS' | 'POTASSIUM' | 'PH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
}

export interface TaskProgressWidgetData {
  totalTasks: number;
  completedToday: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number; // percentage
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  allowedRoles: UserRole[];
}

// Additional types needed for API and components
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Field {
  id: string;
  name: string;
  size: number;
  location?: string;
  soilType?: string;
  irrigationType?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}

export interface FieldDetail extends Field {
  currentCrop?: CropPlan;
  recentSoilData?: SoilData[];
  recentIrrigationLogs?: IrrigationLog[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  fieldId?: string;
  fieldName?: string;
  assignedTo?: string;
  assigneeName?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  completedAt?: string;
  createdBy: string;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  fieldId?: string;
  assignedTo?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  fieldId?: string;
  fieldName?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedBy: string;
  reporterName?: string;
  assignedTo?: string;
  assigneeName?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  fieldId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface IrrigationLog {
  id: string;
  fieldId: string;
  fieldName?: string;
  startTime: string;
  endTime: string;
  duration: number;
  waterUsed: number;
  irrigationType: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  notes?: string;
  createdBy: string;
  creatorName?: string;
  createdAt: string;
}

export interface CreateIrrigationLogDto {
  fieldId: string;
  startTime: string;
  endTime: string;
  waterUsed: number;
  irrigationType: string;
  notes?: string;
}

export interface DashboardSummary {
  totalFields: number;
  activeFields: number;
  totalTasks: number;
  pendingTasks: number;
  totalIncidents: number;
  criticalIncidents: number;
  weatherSummary?: CurrentWeather;
  recentActivities: any[];
}
