import React, { useState } from 'react';
import { useGetSoilDataQuery, useCreateSoilDataMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { SoilDataTable } from './components/SoilDataTable';
import { SoilUploadForm } from './components/SoilUploadForm';
import { SoilHealthCard } from './components/SoilHealthCard';
import { SoilDeficiencyAlert } from './components/SoilDeficiencyAlert';
import { SoilChart } from './components/SoilChart';
import { Beaker, AlertTriangle, TrendingUp, FileText } from 'lucide-react';

export const SoilDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { data: soilData, isLoading, error } = useGetSoilDataQuery(
    selectedFieldId ? { fieldId: selectedFieldId } : undefined
  );
  const [createSoilData] = useCreateSoilDataMutation();

  const canUpload = user?.role === 'ADMIN' || user?.role === 'AGRONOMIST';

  // Debug logging
  React.useEffect(() => {
    console.log('[SoilDashboard] Loading:', isLoading, 'Error:', error, 'Data:', soilData);
  }, [isLoading, error, soilData]);

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load soil data"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  const handleUpload = async (data: any) => {
    try {
      await createSoilData(data).unwrap();
      setShowUploadForm(false);
    } catch (err) {
      console.error('Failed to upload soil data:', err);
    }
  };

  // Calculate soil health metrics
  const totalRecords = soilData?.length || 0;
  const deficientRecords = soilData?.filter(
    (d) => d.deficiencyFlags?.nitrogen === 'LOW' ||
           d.deficiencyFlags?.phosphorus === 'LOW' ||
           d.deficiencyFlags?.potassium === 'LOW'
  ).length || 0;
  const healthyRecords = totalRecords - deficientRecords;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Soil Management' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Soil Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Monitor soil health and nutrient levels across your fields
            </p>
          </div>
          {canUpload && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Beaker className="w-4 h-4" />
              Upload Soil Analysis
            </button>
          )}
        </div>

        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SoilHealthCard
            title="Total Analyses"
            value={totalRecords}
            icon={FileText}
            color="blue"
          />
          <SoilHealthCard
            title="Healthy Samples"
            value={healthyRecords}
            icon={TrendingUp}
            color="green"
          />
          <SoilHealthCard
            title="Deficient Samples"
            value={deficientRecords}
            icon={AlertTriangle}
            color="red"
          />
          <SoilHealthCard
            title="Health Score"
            value={totalRecords > 0 ? Math.round((healthyRecords / totalRecords) * 100) : 0}
            suffix="%"
            icon={TrendingUp}
            color="green"
          />
        </div>

        {/* Deficiency Alerts */}
        {deficientRecords > 0 && (
          <div className="space-y-3">
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Nutrient Deficiency Alerts
            </h2>
            {soilData
              ?.filter(
                (d) => d.deficiencyFlags?.nitrogen === 'LOW' ||
                       d.deficiencyFlags?.phosphorus === 'LOW' ||
                       d.deficiencyFlags?.potassium === 'LOW'
              )
              .slice(0, 3)
              .map((record) => (
                <SoilDeficiencyAlert key={record.id} soilData={record} />
              ))}
          </div>
        )}

        {/* NPK Chart */}
        {soilData && soilData.length > 0 && (
          <div className="card">
            <h2 className="section-title mb-4">NPK Levels Overview</h2>
            <SoilChart soilData={soilData} />
          </div>
        )}

        {/* Data Table */}
        <div className="card">
          <h2 className="section-title mb-4">Soil Analysis Records</h2>
          {soilData && soilData.length > 0 ? (
            <SoilDataTable
              data={soilData}
              onViewDetails={(id) => console.log('View:', id)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmptyState
                message="No soil data available"
                description="Upload soil analysis data to monitor nutrient levels and soil health across your fields"
                actionLabel={canUpload ? 'Upload Soil Analysis' : undefined}
                onAction={() => setShowUploadForm(true)}
                icon={Beaker}
              />
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Why Track Soil Data?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-700 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Monitor Nutrient Levels</p>
                      <p className="text-sm text-gray-600">Track NPK levels to optimize fertilizer use</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-700 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Detect Deficiencies Early</p>
                      <p className="text-sm text-gray-600">Get alerts before crops are affected</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-700 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Improve Yields</p>
                      <p className="text-sm text-gray-600">Data-driven decisions for better harvests</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadForm && canUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <SoilUploadForm
              onSubmit={handleUpload}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};
