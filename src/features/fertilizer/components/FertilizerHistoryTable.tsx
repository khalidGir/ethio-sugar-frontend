import React from 'react';
import { FertilizerApplication } from '../../../types';
import { Calendar, Sprout, MapPin, User, DollarSign } from 'lucide-react';

interface FertilizerHistoryTableProps {
  applications: FertilizerApplication[];
  onViewDetails?: (id: string) => void;
}

export const FertilizerHistoryTable: React.FC<FertilizerHistoryTableProps> = ({
  applications,
  onViewDetails,
}) => {
  const formatFertilizerType = (type: string) => {
    return type.replace('_', ' ');
  };

  const formatGrowthStage = (stage: string) => {
    return stage.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No fertilizer applications</p>
        <p className="text-sm text-gray-400 mt-1">
          Applications will appear here once logged
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Field
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Fertilizer
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Growth Stage
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rate
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cost
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Applied By
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onViewDetails?.(app.id)}
            >
              <td className="py-3 px-4 text-sm text-gray-900">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {app.fieldName || app.fieldId}
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                <span className="px-2.5 py-1 bg-forest-50 text-forest-700 rounded-md text-xs font-medium">
                  {formatFertilizerType(app.fertilizerType)}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatGrowthStage(app.growthStage)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                {app.quantity} kg
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                {app.applicationRate} kg/ha
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                <div className="flex items-center justify-end gap-1">
                  <DollarSign className="w-3 h-3 text-gray-400" />
                  {app.cost.toFixed(2)}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {app.applierName || app.appliedBy}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
