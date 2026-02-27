import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FieldsPage } from './features/fields/FieldsPage';
import { FieldDetailPage } from './features/fields/FieldDetailPage';
import { IncidentsPage } from './features/incidents/IncidentsPage';
import { TasksPage } from './features/tasks/TasksPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SkipLink } from './components/SkipLink';
import { UsersPage } from './features/users/UsersPage';
import { MyTasksPage } from './features/tasks/MyTasksPage';
import { ReportIssuePage } from './features/incidents/ReportIssuePage';
// Phase 1 Critical Gaps Pages
import { SoilDashboardPage } from './features/soil/SoilDashboardPage';
import { WeatherDashboardPage } from './features/weather/WeatherDashboardPage';
import { DailyLogsDashboardPage } from './features/daily-logs/DailyLogsDashboardPage';
import { FertilizerDashboardPage } from './features/fertilizer/FertilizerDashboardPage';
import { CropPlansDashboardPage } from './features/crop-plans/CropPlansDashboardPage';
import { ReportsDashboardPage } from './features/reports/ReportsDashboardPage';
import { GalleryDashboardPage } from './features/gallery/GalleryDashboardPage';
import { AuditLogsDashboardPage } from './features/audit/AuditLogsDashboardPage';
import { ApprovalsPage } from './features/approvals/ApprovalsPage';

function App() {
  return (
    <BrowserRouter>
      <>
        <SkipLink />
        <div id="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fields"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST']}>
                  <FieldsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fields/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST']}>
                  <FieldDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGRONOMIST']}>
                  <IncidentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute allowedRoles={['WORKER']}>
                  <MyTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-issue"
              element={
                <ProtectedRoute allowedRoles={['WORKER']}>
                  <ReportIssuePage />
                </ProtectedRoute>
              }
            />
            {/* New Phase 1 Critical Gaps Routes */}
            <Route
              path="/soil"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGRONOMIST']}>
                  <SoilDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST']}>
                  <WeatherDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daily-logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'WORKER']}>
                  <DailyLogsDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fertilizer"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGRONOMIST']}>
                  <FertilizerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-plans"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGRONOMIST']}>
                  <CropPlansDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <ReportsDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvals"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGRONOMIST']}>
                  <ApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST']}>
                  <GalleryDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditLogsDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </>
    </BrowserRouter>
  );
}

export default App;
