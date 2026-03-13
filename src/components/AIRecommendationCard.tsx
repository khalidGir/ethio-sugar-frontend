import React from 'react';
import { Brain, CheckCircle, XCircle, ChevronRight, Zap } from 'lucide-react';

export interface AIRecommendation {
  id: string;
  title: string;
  source: 'DeepSeek' | 'Gemini' | 'Custom AI' | 'ChatGPT';
  confidence: number;
  justification: string;
  actionRequired: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onApprove,
  onReject,
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getConfidenceTextColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700';
    if (score >= 70) return 'text-amber-700';
    return 'text-red-700';
  };

  const statusStyles = {
    PENDING: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md hover:border-blue-300',
    APPROVED: 'border-emerald-200 bg-emerald-50 opacity-75',
    REJECTED: 'border-gray-200 bg-gray-50 opacity-75',
  };

  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${statusStyles[recommendation.status]}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Source Icon & Title */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {recommendation.source} Analysis
              </span>
              {recommendation.status === 'APPROVED' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Approved
                </span>
              )}
              {recommendation.status === 'REJECTED' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                  Rejected
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-1 leading-tight">
              {recommendation.title}
            </h3>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className={`text-sm font-bold ${getConfidenceTextColor(recommendation.confidence)}`}>
            {recommendation.confidence}% Confidence
          </span>
          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-in-out ${getConfidenceColor(recommendation.confidence)}`}
              style={{ width: `${recommendation.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pl-13">
        {/* Justification String */}
        <div className="bg-white/60 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 mb-3">
          <strong className="text-gray-900 font-semibold block mb-1 text-xs uppercase tracking-wide">
            Justification
          </strong>
          {recommendation.justification}
        </div>

        {/* Action String */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-4">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Action: {recommendation.actionRequired}</span>
        </div>

        {/* Interactive Loop */}
        {recommendation.status === 'PENDING' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApprove(recommendation.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Execute
            </button>
            <button
              onClick={() => onReject(recommendation.id)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              title="Reject analysis to improve AI training"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
