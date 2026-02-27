import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickStartStep {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: () => void;
  actionLabel?: string;
}

interface QuickStartGuideProps {
  title: string;
  steps: QuickStartStep[];
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ title, steps }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
    <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{step.title}</p>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              {step.action && step.actionLabel && (
                <button
                  onClick={step.action}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {step.actionLabel} →
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
