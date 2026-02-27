import React from 'react';
import { SoilData } from '../../../types';
import { StatusBadge } from '../../../components/StatusBadge';

interface SoilDataTableProps {
  data: SoilData[];
  onViewDetails?: (id: string) => void;
}

const getNutrientStatus = (value: number, type: 'N' | 'P' | 'K'): 'NORMAL' | 'WARNING' | 'CRITICAL' => {
  const ranges = {
    N: { low: 20, high: 50 },
    P: { low: 10, high: 30 },
    K: { low: 100, high: 200 },
  };

  const range = ranges[type];
  if (value < range.low) return 'CRITICAL';
  if (value > range.high) return 'NORMAL';
  return 'WARNING';
};

const getpHStatus = (pH: number): 'NORMAL' | 'WARNING' | 'CRITICAL' => {
  if (pH < 5.5 || pH > 8.5) return 'CRITICAL';
  if (pH < 6.0 || pH > 8.0) return 'WARNING';
  return 'NORMAL';
};

export const SoilDataTable: React.FC<SoilDataTableProps> = ({ data, onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="table-header">Field</th>
            <th className="table-header">Date</th>
            <th className="table-header text-right">Nitrogen (ppm)</th>
            <th className="table-header text-right">Phosphorus (ppm)</th>
            <th className="table-header text-right">Potassium (ppm)</th>
            <th className="table-header text-right">pH</th>
            <th className="table-header">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => {
            const nStatus = getNutrientStatus(record.nitrogen, 'N');
            const pStatus = getNutrientStatus(record.phosphorus, 'P');
            const kStatus = getNutrientStatus(record.potassium, 'K');
            const phStatus = getpHStatus(record.pH);

            const hasCritical = [nStatus, pStatus, kStatus, phStatus].includes('CRITICAL');
            const hasWarning = [nStatus, pStatus, kStatus, phStatus].includes('WARNING');

            return (
              <tr
                key={record.id}
                className={`table-row ${hasCritical ? 'bg-red-50' : hasWarning ? 'bg-amber-50' : ''}`}
              >
                <td className="table-cell font-medium text-gray-900">
                  {record.fieldName || 'Unknown Field'}
                </td>
                <td className="table-cell text-gray-600">
                  {new Date(record.analyzedAt).toLocaleDateString()}
                </td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 font-medium">{record.nitrogen}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      nStatus === 'CRITICAL' ? 'bg-red-500' : nStatus === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} />
                  </div>
                </td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 font-medium">{record.phosphorus}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      pStatus === 'CRITICAL' ? 'bg-red-500' : pStatus === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} />
                  </div>
                </td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 font-medium">{record.potassium}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kStatus === 'CRITICAL' ? 'bg-red-500' : kStatus === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} />
                  </div>
                </td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 font-medium">{record.pH.toFixed(1)}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      phStatus === 'CRITICAL' ? 'bg-red-500' : phStatus === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} />
                  </div>
                </td>
                <td className="table-cell">
                  <StatusBadge status={hasCritical ? 'CRITICAL' : hasWarning ? 'WARNING' : 'NORMAL'} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
