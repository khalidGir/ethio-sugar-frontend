import { z } from 'zod';

// ==================== SOIL DATA SCHEMAS ====================
export const soilDataSchema = z.object({
  fieldId: z.string().uuid('Invalid field selection'),
  nitrogen: z.number()
    .min(0, 'Nitrogen cannot be negative')
    .max(1000, 'Invalid nitrogen level'),
  phosphorus: z.number()
    .min(0, 'Phosphorus cannot be negative')
    .max(1000, 'Invalid phosphorus level'),
  potassium: z.number()
    .min(0, 'Potassium cannot be negative')
    .max(1000, 'Invalid potassium level'),
  pH: z.number()
    .min(0, 'pH must be at least 0')
    .max(14, 'pH must be at most 14'),
  organicMatter: z.number()
    .min(0, 'Organic matter cannot be negative')
    .max(100, 'Organic matter cannot exceed 100%')
    .optional(),
  moisture: z.number()
    .min(0, 'Moisture cannot be negative')
    .max(100, 'Moisture cannot exceed 100%')
    .optional(),
  temperature: z.number()
    .min(-10, 'Invalid temperature')
    .max(60, 'Invalid temperature')
    .optional(),
  analyzedAt: z.string().or(z.date()),
  recommendations: z.array(z.string()).optional(),
});

export type SoilDataFormData = z.infer<typeof soilDataSchema>;

// ==================== DAILY LOG SCHEMAS ====================
export const dailyLogSchema = z.object({
  fieldId: z.string().uuid('Invalid field selection'),
  date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid date'
  ),
  startTime: z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    'Start time must be in HH:MM format'
  ),
  endTime: z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    'End time must be in HH:MM format'
  ),
  activities: z.array(z.string()).min(1, 'At least one activity is required'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  photoUrls: z.array(z.string()).optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return data.startTime < data.endTime;
    }
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export type DailyLogFormData = z.infer<typeof dailyLogSchema>;

export const verifyDailyLogSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export type VerifyDailyLogFormData = z.infer<typeof verifyDailyLogSchema>;

// ==================== FERTILIZER SCHEMAS ====================
export const fertilizerApplicationSchema = z.object({
  fieldId: z.string().uuid('Invalid field selection'),
  fertilizerType: z.enum([
    'UREA',
    'DAP',
    'NPS',
    'COMPOST',
    'MANURE',
    'UREA_46',
    'CAN',
    'OTHER',
  ]),
  quantity: z.number()
    .min(0.1, 'Quantity must be greater than 0')
    .max(10000, 'Quantity seems too high'),
  applicationRate: z.number()
    .min(0.1, 'Application rate must be greater than 0')
    .max(1000, 'Application rate seems too high'),
  cost: z.number()
    .min(0, 'Cost cannot be negative')
    .max(1000000, 'Cost seems too high'),
  growthStage: z.enum([
    'PRE_PLANTING',
    'PLANTING',
    'EARLY_GROWTH',
    'VEGETATIVE',
    'FLOWERING',
    'FRUITING',
    'MATURATION',
    'POST_HARVEST',
  ]),
  appliedAt: z.string().or(z.date()).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  weatherConditions: z.string().max(200, 'Weather description too long').optional(),
});

export type FertilizerApplicationFormData = z.infer<typeof fertilizerApplicationSchema>;

// ==================== CROP PLAN SCHEMAS ====================
export const cropPlanSchema = z.object({
  fieldId: z.string().uuid('Invalid field selection'),
  season: z.enum(['BELG', 'MEHER', 'BEGA', 'YEAR_ROUND']),
  cropType: z.string().min(2, 'Crop type must be at least 2 characters'),
  cropVariety: z.string().min(2, 'Crop variety must be at least 2 characters').optional(),
  plannedArea: z.number()
    .min(0.1, 'Area must be greater than 0')
    .max(10000, 'Area seems too large'),
  plantingDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid planting date'
  ),
  expectedHarvestDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid harvest date'
  ),
  plannedYield: z.number()
    .min(0.1, 'Yield must be greater than 0')
    .max(100000, 'Yield seems too high'),
  budget: z.number()
    .min(0, 'Budget cannot be negative')
    .max(10000000, 'Budget seems too high'),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
}).refine(
  (data) => {
    if (data.plantingDate && data.expectedHarvestDate) {
      return new Date(data.plantingDate) < new Date(data.expectedHarvestDate);
    }
    return true;
  },
  {
    message: 'Harvest date must be after planting date',
    path: ['expectedHarvestDate'],
  }
);

export type CropPlanFormData = z.infer<typeof cropPlanSchema>;

export const updateCropPlanSchema = z.object({
  actualHarvestDate: z.string().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    'Invalid harvest date'
  ).optional(),
  actualYield: z.number().min(0, 'Yield cannot be negative').optional(),
  actualCost: z.number().min(0, 'Cost cannot be negative').optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

export type UpdateCropPlanFormData = z.infer<typeof updateCropPlanSchema>;

// ==================== REPORT SCHEMAS ====================
export const generateReportSchema = z.object({
  type: z.enum([
    'DAILY_SUMMARY',
    'WEEKLY_SUMMARY',
    'MONTHLY_SUMMARY',
    'SOIL_ANALYSIS',
    'FERTILIZER_SUMMARY',
    'WORKER_PERFORMANCE',
    'WEATHER_ANALYTICS',
    'INCIDENT_REPORT',
    'TASK_COMPLETION',
    'YIELD_REPORT',
  ]),
  startDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid start date'
  ),
  endDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid end date'
  ),
  fieldId: z.string().uuid().optional(),
  workerId: z.string().uuid().optional(),
  format: z.enum(['PDF', 'EXCEL', 'CSV']),
  emailTo: z.array(z.string().email()).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type GenerateReportFormData = z.infer<typeof generateReportSchema>;

// ==================== IMAGE UPLOAD SCHEMA ====================
export const uploadImageSchema = z.object({
  fieldId: z.string().uuid('Invalid field selection'),
  caption: z.string().max(200, 'Caption cannot exceed 200 characters').optional(),
  imageType: z.enum([
    'GENERAL',
    'DISEASE',
    'PEST',
    'GROWTH',
    'IRRIGATION',
    'HARVEST',
    'DAMAGE',
    'OTHER',
  ]),
  tags: z.array(z.string().max(30)).max(10, 'Maximum 10 tags allowed').optional(),
  linkedIncidentId: z.string().uuid().optional(),
  linkedLogId: z.string().uuid().optional(),
});

export type UploadImageFormData = z.infer<typeof uploadImageSchema>;

// ==================== HELPER FUNCTIONS ====================
export const validateSoilData = (data: unknown): SoilDataFormData => {
  return soilDataSchema.parse(data);
};

export const validateDailyLog = (data: unknown): DailyLogFormData => {
  return dailyLogSchema.parse(data);
};

export const validateFertilizerApplication = (data: unknown): FertilizerApplicationFormData => {
  return fertilizerApplicationSchema.parse(data);
};

export const validateCropPlan = (data: unknown): CropPlanFormData => {
  return cropPlanSchema.parse(data);
};

export const validateReportRequest = (data: unknown): GenerateReportFormData => {
  return generateReportSchema.parse(data);
};

export const validateImageUpload = (data: unknown): UploadImageFormData => {
  return uploadImageSchema.parse(data);
};
