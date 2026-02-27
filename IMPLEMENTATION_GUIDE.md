# EthioSugar Frontend - Phase 1 Critical Gaps Implementation Guide

## ✅ Completed Components

### 1. Core Infrastructure
- **TypeScript Types**: `/src/types/index.ts` - Complete type definitions for all features
- **API Service Layer**: `/src/services/api.ts` - RTK Query endpoints for all new features
- **Form Schemas**: `/src/schemas/index.ts` - Zod validation schemas
- **Chart Library**: Recharts installed and configured

### 2. Soil Management Dashboard ✅
**Location**: `/src/features/soil/`

**Files Created**:
- `SoilDashboardPage.tsx` - Main dashboard page
- `components/SoilHealthCard.tsx` - Health metrics display
- `components/SoilDeficiencyAlert.tsx` - Deficiency alerts
- `components/SoilDataTable.tsx` - Data table with status indicators
- `components/SoilChart.tsx` - NPK visualization with Recharts
- `components/SoilUploadForm.tsx` - Form for uploading soil data

**Features**:
- Color-coded nutrient levels (Green=Optimal, Yellow=Low, Red=Critical)
- Interactive NPK bar chart
- Deficiency alerts with recommendations
- Form validation with Zod
- Lab report upload (UI ready)

### 3. Weather Dashboard ✅
**Location**: `/src/features/weather/`

**Files Created**:
- `WeatherDashboardPage.tsx` - Main weather dashboard
- `components/CurrentWeatherCard.tsx` - Current conditions display
- `components/WeatherForecast.tsx` - 7-day forecast
- `components/WeatherHistoryChart.tsx` - Temperature trends
- `components/RainfallTrendChart.tsx` - Rainfall analysis

**Features**:
- Real-time weather display
- 7-day forecast with icons
- Temperature trend charts
- Rainfall analysis
- Weather alerts (UV index, etc.)
- Export data functionality (ready for backend integration)

---

## 📝 Remaining Dashboards - Implementation Templates

### 4. Worker Daily Logs Dashboard

**Location**: `/src/features/daily-logs/`

**Create these files**:

#### DailyLogDashboardPage.tsx
```tsx
import React, { useState } from 'react';
import { useGetDailyLogsQuery, useCreateDailyLogMutation } from '../../services/api';
import { Layout } from '../../components/Layout';
import { DailyLogForm } from './components/DailyLogForm';
import { DailyLogList } from './components/DailyLogList';
import { DailyLogVerification } from './components/DailyLogVerification';

export const DailyLogDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const { data: logs, isLoading, error } = useGetDailyLogsQuery(undefined);
  const [createLog] = useCreateDailyLogMutation();

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load logs" onRetry={() => window.location.reload()} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Daily Logs' }]} />
        
        <div className="flex justify-between">
          <h1 className="page-header">Worker Daily Logs</h1>
          {user?.role !== 'WORKER' && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Submit Log
            </button>
          )}
        </div>

        {user?.role === 'SUPERVISOR' && <DailyLogVerification logs={logs?.filter(l => l.status === 'PENDING')} />}
        
        <DailyLogList logs={logs} />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <DailyLogForm onSubmit={async (data) => { await createLog(data).unwrap(); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </div>
      )}
    </Layout>
  );
};
```

#### components/DailyLogForm.tsx
- Form with: field selection, date, start/end time, activities (multi-select), notes, photo upload
- Use react-hook-form + zod validation
- GPS location capture (optional)

#### components/DailyLogList.tsx
- Responsive list (cards on mobile, table on desktop)
- Filter by: worker, field, date, status
- Search functionality

#### components/DailyLogVerification.tsx
- For supervisors/agronomists
- Approve/Reject buttons
- Rejection reason input

---

### 5. Fertilizer Management Dashboard

**Location**: `/src/features/fertilizer/`

#### FertilizerDashboardPage.tsx
```tsx
export const FertilizerDashboardPage: React.FC = () => {
  const { data: applications, isLoading } = useGetFertilizerApplicationsQuery(undefined);
  const { data: recommendations } = useGetFertilizerRecommendationsQuery(undefined);
  const { data: summary } = useGetFertilizerSummaryQuery(undefined);
  const [createApplication] = useCreateFertilizerApplicationMutation();

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Fertilizer Management' }]} />
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={applications?.length || 0} />
          <StatCard title="Total Cost" value={summary?.reduce((s, i) => s + i.totalCost, 0) || 0} prefix="ETB " />
          <StatCard title="Total Quantity" value={summary?.reduce((s, i) => s + i.totalQuantity, 0) || 0} suffix=" kg" />
          <StatCard title="Avg per Field" value={applications ? Math.round(applications.length / summary?.length || 1) : 0} suffix=" kg/ha" />
        </div>

        {/* Recommendations */}
        {recommendations && <FertilizerRecommendations recommendations={recommendations} />}

        {/* Application Form & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FertilizerApplicationForm onSubmit={...} />
          </div>
          <div className="lg:col-span-2">
            <FertilizerHistoryTable applications={applications} />
          </div>
        </div>

        {/* Charts */}
        <FertilizerCostChart summary={summary} />
        <NutrientSummaryChart applications={applications} />
      </div>
    </Layout>
  );
};
```

#### components/FertilizerApplicationForm.tsx
- Dropdown: fertilizer types (Urea, DAP, NPS, Compost, etc.)
- Calculator: application rate (kg/hectare)
- Cost tracking (ETB)
- Growth stage selector
- Field selection

#### components/FertilizerHistoryTable.tsx
- Table with sortable columns
- Filter by field, date range, fertilizer type
- Export to CSV

#### components/FertilizerCostChart.tsx
- Pie chart: cost by field
- Bar chart: monthly usage trend

#### components/NutrientSummaryChart.tsx
- Stacked bar: nutrient application by type
- Comparison: planned vs actual

#### components/FertilizerRecommendations.tsx
- AI-based recommendations display
- Action buttons: "Apply Now", "Schedule"

---

### 6. Crop Planning Dashboard

**Location**: `/src/features/crop-plans/`

#### CropPlanDashboardPage.tsx
```tsx
export const CropPlanDashboardPage: React.FC = () => {
  const { data: plans, isLoading } = useGetCropPlansQuery(undefined);
  const { data: progress } = useGetCropPlanProgressQuery(undefined);
  const [createPlan] = useCreateCropPlanMutation();
  const [updatePlan] = useUpdateCropPlanMutation();

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Crop Planning' }]} />
        
        <div className="flex justify-between">
          <div>
            <h1 className="page-header">Crop Plans</h1>
            <p className="text-sm text-gray-500">Plan and track seasonal crop production</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Create Plan
          </button>
        </div>

        {/* Season Selector */}
        <SeasonSelector />

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map(plan => <CropPlanCard key={plan.id} plan={plan} onUpdate={updatePlan} />)}
        </div>

        {/* Progress Timeline */}
        {progress && <CropPlanTimeline progress={progress} />}

        {/* Yield & Budget Charts */}
        <YieldComparisonChart plans={plans} />
        <BudgetVarianceChart plans={plans} />
      </div>
    </Layout>
  );
};
```

#### components/CropPlanForm.tsx
- Season selector (BelG, Meher, Bega, Year-round)
- Field selection
- Crop type & variety
- Planting & harvest dates
- Planned yield & budget
- Notes

#### components/CropPlanCard.tsx
- Plan overview
- Progress bar
- Status badge (Planned, In Progress, Completed)
- Quick actions (Edit, Update Yield, Complete)

#### components/CropPlanTimeline.tsx
- Visual timeline for all plans
- Planting to harvest progression
- Current stage indicator

#### components/YieldComparisonChart.tsx
- Bar chart: planned vs actual yield
- Variance percentage

#### components/BudgetVarianceChart.tsx
- Waterfall chart: budget vs actual cost
- Variance analysis

#### components/SeasonSelector.tsx
- Tabs or dropdown for season selection
- Filter plans by season

---

### 7. Reports & Analytics Dashboard

**Location**: `/src/features/reports/`

#### ReportsDashboardPage.tsx
```tsx
export const ReportsDashboardPage: React.FC = () => {
  const { data: reports, isLoading } = useGetReportsQuery(undefined);
  const [generateReport] = useGenerateReportMutation();
  const { data: scheduled } = useGetScheduledReportsQuery(undefined);

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Reports & Analytics' }]} />
        
        <div className="flex justify-between">
          <div>
            <h1 className="page-header">Reports & Analytics</h1>
            <p className="text-sm text-gray-500">Generate and view farm performance reports</p>
          </div>
          <button className="btn-primary" onClick={() => setShowGenerator(true)}>
            Generate Report
          </button>
        </div>

        {/* Report Type Tabs */}
        <div className="card">
          <ReportGenerator onGenerate={generateReport} />
        </div>

        {/* Recent Reports */}
        <div className="card">
          <h2 className="section-title mb-4">Recent Reports</h2>
          <ReportViewer reports={reports} />
        </div>

        {/* Scheduled Reports */}
        <div className="card">
          <h2 className="section-title mb-4">Scheduled Reports</h2>
          {/* List scheduled reports with enable/disable toggle */}
        </div>
      </div>
    </Layout>
  );
};
```

#### components/ReportGenerator.tsx
- Report type selector (tabs or dropdown)
- Date range picker
- Field/worker filters
- Format selector (PDF, Excel, CSV)
- Email recipients
- Generate button

#### components/ReportViewer.tsx
- List of generated reports
- Preview modal
- Download buttons
- Email report option
- Delete button

#### components/DailyReport.tsx
- Today's summary
- Incidents, tasks, weather
- Worker activity

#### components/WeeklyReport.tsx
- Week overview
- Trends and comparisons
- Key metrics

#### components/MonthlyReport.tsx
- Monthly summary
- Comprehensive analytics
- Charts and graphs

#### components/SoilAnalyticsReport.tsx
- Soil health trends
- Nutrient analysis
- Deficiency summary

#### components/WorkerPerformanceReport.tsx
- Worker statistics
- Task completion rates
- Log verification status

#### components/ReportExport.tsx
- Export to PDF (use library like react-pdf or html2pdf)
- Export to Excel (use xlsx library)
- Export to CSV
- Print-friendly layout

---

### 8. Image Gallery

**Location**: `/src/features/gallery/`

#### ImageGalleryPage.tsx
```tsx
export const ImageGalleryPage: React.FC = () => {
  const { data: images, isLoading } = useGetFieldImagesQuery(undefined);
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [selectedImage, setSelectedImage] = useState<FieldImage | null>(null);

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Image Gallery' }]} />
        
        <div className="flex justify-between">
          <div>
            <h1 className="page-header">Field Image Gallery</h1>
            <p className="text-sm text-gray-500">Upload and manage field photos</p>
          </div>
          <button className="btn-primary" onClick={() => setShowUpload(true)}>
            Upload Images
          </button>
        </div>

        {/* Filters */}
        <ImageFilter />

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map(image => (
            <ImageCard key={image.id} image={image} onClick={() => setSelectedImage(image)} />
          ))}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <ImageUpload onUpload={uploadImage} onCancel={() => setShowUpload(false)} />
        )}

        {/* Preview Modal */}
        {selectedImage && (
          <ImagePreview image={selectedImage} onClose={() => setSelectedImage(null)} onDelete={deleteImage} />
        )}
      </div>
    </Layout>
  );
};
```

#### components/ImageUpload.tsx
- Drag-and-drop upload
- File input
- Preview before upload
- Field selection
- Image type selector (General, Disease, Pest, Growth, etc.)
- Tags input
- Caption input
- Upload progress indicator

#### components/ImageCard.tsx
- Thumbnail display
- Image type badge
- Upload date
- Hover effects
- Click to preview

#### components/ImagePreview.tsx
- Full-screen image view
- Zoom in/out
- Image details (field, date, type, tags)
- Delete button with confirmation
- Before/after comparison (if linked)
- Close button

#### components/ImageFilter.tsx
- Filter by field
- Filter by image type
- Filter by date range
- Search by tags
- Sort by date (newest/oldest)

#### components/BeforeAfterComparison.tsx
- Side-by-side comparison slider
- For tracking field changes over time

---

### 9. Audit Log Viewer (Admin Only)

**Location**: `/src/features/audit/`

#### AuditLogPage.tsx
```tsx
export const AuditLogPage: React.FC = () => {
  const { user } = useAuth();
  const { data: logs, isLoading, error } = useGetAuditLogsQuery(undefined);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load audit logs" onRetry={() => window.location.reload()} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Audit Logs' }]} />
        
        <div className="flex justify-between">
          <div>
            <h1 className="page-header">Audit Trail</h1>
            <p className="text-sm text-gray-500">System activity log and change tracking</p>
          </div>
          <button className="btn-ghost" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AuditLogFilters />
          </div>

          {/* Logs Table */}
          <div className="lg:col-span-3">
            <AuditLogTable logs={logs} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
```

#### components/AuditLogTable.tsx
- Table with sortable columns (Date, User, Action, Entity, Details)
- Expandable rows for change details
- User avatar/name display
- Timestamp formatting (relative time: "2 hours ago")
- Pagination

#### components/AuditLogDetail.tsx
- Modal or expanded row view
- Before/after comparison for updates
- Full metadata display
- IP address and user agent (for security audits)

#### components/AuditLogFilters.tsx
- Filter by user (dropdown)
- Filter by action (Create, Update, Delete, View, etc.)
- Filter by entity type (Field, Incident, Task, etc.)
- Date range picker
- Search input (by entity ID or user name)

#### components/AuditLogExport.tsx
- Export to CSV
- Include/exclude filters
- Date range selection

---

## 10. Dashboard Home Enhancements

**Update**: `/src/features/dashboard/DashboardPage.tsx`

**Add these widgets**:

#### components/WeatherWidget.tsx
```tsx
export const WeatherWidget: React.FC = () => {
  const { data: weather } = useGetCurrentWeatherQuery();
  
  return (
    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <h3 className="text-sm font-medium opacity-80">Current Weather</h3>
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-3xl font-bold">{weather?.temperature.toFixed(0)}°C</p>
          <p className="text-sm opacity-80 mt-1">{weather?.description}</p>
        </div>
        <Sun className="w-12 h-12 opacity-80" />
      </div>
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
        <div>
          <p className="text-xs opacity-60">Humidity</p>
          <p className="font-semibold">{weather?.humidity}%</p>
        </div>
        <div>
          <p className="text-xs opacity-60">Wind</p>
          <p className="font-semibold">{weather?.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};
```

#### components/SoilHealthWidget.tsx
- Summary of soil health across fields
- Deficiency alerts count
- Link to soil dashboard

#### components/TaskProgressWidget.tsx
- Gauge chart for task completion rate
- Today's tasks vs completed
- Overdue tasks count

#### components/RecentLogsWidget.tsx
- Latest worker daily logs
- Verification status
- Quick approve/reject

#### components/QuickActions.tsx
```tsx
export const QuickActions: React.FC = () => {
  const { user } = useAuth();
  
  const actions: QuickAction[] = [
    { id: '1', label: 'Log Irrigation', icon: Droplets, route: '/fields', allowedRoles: ['ADMIN', 'SUPERVISOR'] },
    { id: '2', label: 'Submit Daily Log', icon: ClipboardList, route: '/daily-logs', allowedRoles: ['WORKER'] },
    { id: '3', label: 'Upload Soil Data', icon: Beaker, route: '/soil', allowedRoles: ['ADMIN', 'AGRONOMIST'] },
    { id: '4', label: 'Create Crop Plan', icon: Leaf, route: '/crop-plans', allowedRoles: ['ADMIN', 'MANAGER'] },
  ];

  const visibleActions = actions.filter(a => user?.role && a.allowedRoles.includes(user.role));

  return (
    <div className="card">
      <h3 className="section-title mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {visibleActions.map(action => (
          <Link key={action.id} to={action.route} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center text-center">
            <action.icon className="w-6 h-6 text-forest-600 mb-2" />
            <span className="text-xs font-medium text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
```

---

## 11. Field Detail Page Enhancement

**Update**: `/src/features/fields/FieldDetailPage.tsx`

**Add tabs**:

```tsx
export const FieldDetailPage: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'soil' | 'weather' | 'activities' | 'fertilizer' | 'images' | 'plans'>('overview');

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Fields', href: '/fields' }, { label: 'Field Detail' }]} />
        
        {/* Field Header */}
        <div className="card">
          <div className="flex justify-between">
            <div>
              <h1 className="page-header">{field.name}</h1>
              <p className="text-sm text-gray-500">{field.cropType} • {field.area} ha</p>
            </div>
            <StatusBadge status={field.status} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'soil', label: 'Soil Data' },
              { id: 'weather', label: 'Weather' },
              { id: 'activities', label: 'Activities' },
              { id: 'fertilizer', label: 'Fertilizer' },
              { id: 'images', label: 'Images' },
              { id: 'plans', label: 'Crop Plans' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-forest-500 text-forest-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <FieldOverview field={field} />}
        {activeTab === 'soil' && <FieldSoilHistory fieldId={id!} />}
        {activeTab === 'weather' && <FieldWeather fieldId={id!} />}
        {activeTab === 'activities' && <FieldActivities fieldId={id!} />}
        {activeTab === 'fertilizer' && <FieldFertilizerHistory fieldId={id!} />}
        {activeTab === 'images' && <FieldImageGallery fieldId={id!} />}
        {activeTab === 'plans' && <FieldCropPlans fieldId={id!} />}
      </div>
    </Layout>
  );
};
```

#### components/FieldSoilHistory.tsx
- Historical soil data for this field
- NPK trends chart
- Latest recommendations

#### components/FieldWeather.tsx
- Field-specific weather
- Microclimate data (if available)

#### components/FieldActivities.tsx
- Timeline of daily logs for this field
- Worker activity
- Photos from the field

#### components/FieldFertilizerHistory.tsx
- Fertilizer applications for this field
- Cost summary
- Nutrient application chart

#### components/FieldImageGallery.tsx
- Images tagged with this field
- Upload button
- Grid view

#### components/FieldCropPlans.tsx
- Current and past crop plans for this field
- Plan progress
- Yield history

---

## 12. Navigation Updates

**Update**: `/src/components/Sidebar.tsx`

Add these menu items:

```tsx
const menuItems = [
  // ... existing items
  {
    path: '/soil',
    label: 'Soil Management',
    icon: Beaker,
    roles: ['ADMIN', 'AGRONOMIST', 'SUPERVISOR'],
  },
  {
    path: '/weather',
    label: 'Weather',
    icon: Cloud,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/daily-logs',
    label: 'Daily Logs',
    icon: ClipboardCheck,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/fertilizer',
    label: 'Fertilizer',
    icon: Sprout,
    roles: ['ADMIN', 'AGRONOMIST', 'SUPERVISOR'],
  },
  {
    path: '/crop-plans',
    label: 'Crop Planning',
    icon: Calendar,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: BarChart3,
    roles: ['ADMIN', 'SUPERVISOR', 'MANAGER'],
  },
  {
    path: '/gallery',
    label: 'Image Gallery',
    icon: Image,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: ShieldCheck,
    roles: ['ADMIN'],
  },
];
```

---

## 13. Routing Updates

**Update**: `/src/App.tsx`

Add these routes:

```tsx
import { SoilDashboardPage } from './features/soil/SoilDashboardPage';
import { WeatherDashboardPage } from './features/weather/WeatherDashboardPage';
import { DailyLogDashboardPage } from './features/daily-logs/DailyLogDashboardPage';
import { FertilizerDashboardPage } from './features/fertilizer/FertilizerDashboardPage';
import { CropPlanDashboardPage } from './features/crop-plans/CropPlanDashboardPage';
import { ReportsDashboardPage } from './features/reports/ReportsDashboardPage';
import { ImageGalleryPage } from './features/gallery/ImageGalleryPage';
import { AuditLogPage } from './features/audit/AuditLogPage';

// Add routes:
<Route
  path="/soil"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'AGRONOMIST', 'SUPERVISOR']}>
      <SoilDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/weather"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER', 'AGRONOMIST']}>
      <WeatherDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/daily-logs"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER', 'AGRONOMIST']}>
      <DailyLogDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/fertilizer"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'AGRONOMIST', 'SUPERVISOR']}>
      <FertilizerDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/crop-plans"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGRONOMIST']}>
      <CropPlanDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/reports"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'MANAGER']}>
      <ReportsDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/gallery"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER', 'AGRONOMIST']}>
      <ImageGalleryPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/audit-logs"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AuditLogPage />
    </ProtectedRoute>
  }
/>
```

---

## 14. Mobile Responsiveness Checklist

For all new components:

- [ ] Use responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- [ ] Mobile-first approach
- [ ] Touch targets: `min-h-[44px] min-w-[44px]`
- [ ] Collapsible sections on mobile
- [ ] Horizontal scroll for tables: `overflow-x-auto`
- [ ] Card view alternative for tables on mobile
- [ ] Responsive charts (use ResponsiveContainer from Recharts)
- [ ] Mobile-friendly modals (full-screen on small screens)
- [ ] Hamburger menu for navigation
- [ ] Test on iPhone SE, iPhone 14, iPad, Android devices

---

## 15. Required Additional Dependencies

Install these libraries for full functionality:

```bash
# For date picking
npm install react-datepicker

# For PDF generation
npm install react-pdf html2pdf.js

# For Excel export
npm install xlsx

# For image compression
npm install browser-image-compression

# For rich text editing (optional, for report notes)
npm install react-quill
```

---

## 16. Testing Checklist

### Unit Tests
- [ ] Form validation schemas
- [ ] API service functions
- [ ] Utility functions

### Integration Tests
- [ ] Dashboard data loading
- [ ] Form submissions
- [ ] Chart rendering

### E2E Tests (if using Playwright/Cypress)
- [ ] User login
- [ ] Navigate to each dashboard
- [ ] Create soil data
- [ ] Submit daily log
- [ ] Generate report
- [ ] Upload image

### Manual Testing
- [ ] All forms validate correctly
- [ ] All charts render with data
- [ ] All filters work
- [ ] Export functions work
- [ ] Mobile responsive on all screen sizes
- [ ] Role-based access works
- [ ] No console errors

---

## 17. Performance Optimization

### Code Splitting
```tsx
// In App.tsx
const SoilDashboardPage = lazy(() => import('./features/soil/SoilDashboardPage'));
const WeatherDashboardPage = lazy(() => import('./features/weather/WeatherDashboardPage'));
// ... etc

// Wrap routes with Suspense
<Suspense fallback={<LoadingSpinner fullPage />}>
  <Route path="/soil" element={<SoilDashboardPage />} />
</Suspense>
```

### Image Optimization
- Lazy load images
- Use thumbnails in gallery
- Compress uploads

### Chart Optimization
- Limit data points (show max 30 days by default)
- Use memoization for chart data
- Debounce filter changes

---

## 18. Accessibility Checklist

- [ ] All buttons have aria-labels
- [ ] All icons have aria-hidden or labels
- [ ] Form inputs have associated labels
- [ ] Status conveyed by text + color
- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader testing completed

---

## 19. Next Steps

1. **Implement remaining dashboards** using the templates above
2. **Test each dashboard** thoroughly
3. **Coordinate with backend** to ensure API endpoints match
4. **Add email templates** for reports (HTML templates in `/src/email-templates/`)
5. **Create user documentation** for each feature
6. **Deploy to staging** for user testing
7. **Gather feedback** and iterate

---

## 20. Success Criteria

- [ ] All 8 new dashboards functional
- [ ] All forms with validation working
- [ ] All charts rendering correctly
- [ ] Mobile responsive on all screen sizes
- [ ] Role-based access working
- [ ] No console errors
- [ ] Fast loading (<3s initial load)
- [ ] Consistent design with existing pages
- [ ] All API integrations working
- [ ] Error handling user-friendly

---

**Implementation Date**: February 26, 2026
**Status**: In Progress - Core Infrastructure Complete
**Next**: Implement remaining 6 dashboards using templates above
