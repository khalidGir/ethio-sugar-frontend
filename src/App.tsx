import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FieldsPage } from './features/fields/FieldsPage';
import { FieldDetailPage } from './features/fields/FieldDetailPage';
import { IncidentsPage } from './features/incidents/IncidentsPage';
import { IrrigationPage } from './features/irrigation/IrrigationPage';
import { TasksPage } from './features/tasks/TasksPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER']}>
              <FieldsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER']}>
              <FieldDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER']}>
              <IncidentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/irrigation"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER']}>
              <IrrigationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'WORKER']}>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
