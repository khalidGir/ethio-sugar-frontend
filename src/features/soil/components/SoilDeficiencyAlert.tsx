import React from 'react';
import { SoilData } from '../../../types';
import { AlertTriangle, Beaker } from 'lucide-react';

interface SoilDeficiencyAlertProps {
  soilData: SoilData;
}

const nutrientLabels = {
  nitrogen: 'Nitrogen',
  phosphorus: 'Phosphorus',
  potassium: 'Potassium',
  pH: 'pH Level',
};

const severityColors = {
  LOW: 'bg-amber-50 border-amber-200 text-amber-800',
  MEDIUM: 'bg-orange-50 border-orange-200 text-orange-800',
  HIGH: 'bg-red-50 border-red-200 text-red-800',
};

export const SoilDeficiencyAlert: React.FC<SoilDeficiencyAlertProps> = ({ soilData }) => {
  const deficiencies = [];

  if (soilData.deficiencyFlags?.nitrogen === 'LOW') {
    deficiencies.push({ nutrient: 'nitrogen', severity: 'LOW' as const });
  }
  if (soilData.deficiencyFlags?.phosphorus === 'LOW') {
    deficiencies.push({ nutrient: 'phosphorus', severity: 'MEDIUM' as const });
  }
  if (soilData.deficiencyFlags?.potassium === 'LOW') {
    deficiencies.push({ nutrient: 'potassium', severity: 'HIGH' as const });
  }
  if (soilData.deficiencyFlags?.pH === 'ACIDIC' || soilData.deficiencyFlags?.pH === 'ALKALINE') {
    deficiencies.push({ nutrient: 'pH', severity: 'MEDIUM' as const });
  }

  if (deficiencies.length === 0) return null;

  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900">{soilData.fieldName || 'Field'}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Analyzed on {new Date(soilData.analyzedAt).toLocaleDateString()}
            </p>
          </div>
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
            {deficiencies.length} Deficiencies
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {deficiencies.map(({ nutrient, severity }) => (
            <span
              key={nutrient}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${severityColors[severity]}`}
            >
              {nutrientLabels[nutrient as keyof typeof nutrientLabels]} - {severity}
            </span>
          ))}
        </div>

        {soilData.recommendations && soilData.recommendations.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Beaker className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">Recommendations:</p>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  {soilData.recommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
