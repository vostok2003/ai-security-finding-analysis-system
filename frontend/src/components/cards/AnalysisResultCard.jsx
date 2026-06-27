import React from 'react';
import { FiAlertTriangle, FiFileText, FiShield, FiClock } from 'react-icons/fi';

const AnalysisResultCard = ({ result }) => {
  if (!result) return null;

  const {
    organization,
    asset,
    finding,
    severity,
    priority,
    importance,
    recommendation,
    timeline,
  } = result;

  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (pri) => {
    switch (pri?.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white shadow-sm shadow-red-500/20';
      case 'high':
        return 'bg-orange-500 text-white shadow-sm shadow-orange-500/20';
      case 'medium':
        return 'bg-yellow-500 text-slate-900 shadow-sm shadow-yellow-500/20';
      case 'low':
        return 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in duration-300">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
            AI-Powered Analysis Output
          </span>
          <h3 className="text-xl font-bold tracking-tight mt-0.5">Business Recommendation</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-100 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
            Severity: {severity}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Source metadata info row */}
        <div className="grid grid-cols-2 gap-4 pb-5 border-b border-slate-100 text-sm">
          <div>
            <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider">
              Target Organization
            </span>
            <span className="font-semibold text-slate-800 mt-1 block">{organization}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider">
              Affected Asset
            </span>
            <span className="font-semibold text-slate-800 mt-1 block">{asset}</span>
          </div>
        </div>

        {/* AI Priority and Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg mt-0.5">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-medium">Business Priority</span>
              <span className={`inline-block text-xs font-semibold mt-1 px-3 py-1 rounded-full ${getPriorityColor(priority)}`}>
                {priority}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg mt-0.5">
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-medium">Resolution Timeline</span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">{timeline}</span>
            </div>
          </div>
        </div>

        {/* Business Impact block */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-rose-700 font-semibold text-sm">
            <FiAlertTriangle className="w-4 h-4" />
            <span>Business Impact Analysis</span>
          </div>
          <div className="bg-rose-50/40 border border-rose-100/50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed">
            {importance}
          </div>
        </div>

        {/* Recommended Action block */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm">
            <FiFileText className="w-4 h-4" />
            <span>Recommended Actions</span>
          </div>
          <div className="bg-blue-50/40 border border-blue-100/50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultCard;
