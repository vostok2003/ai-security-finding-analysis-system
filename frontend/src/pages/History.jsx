import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiCalendar, FiClock, FiShield, FiAlertTriangle, FiFileText, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import { getHistory, deleteHistory } from '../services/api';

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getHistory();
      if (response.success) {
        setHistoryList(response.data);
      } else {
        toast.error('Failed to retrieve history list.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering card toggle expand
    if (!window.confirm('Are you sure you want to delete this analysis from database history?')) {
      return;
    }

    try {
      const response = await deleteHistory(id);
      if (response.success) {
        toast.success('Analysis record deleted successfully.');
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error('Failed to delete history record.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting analysis record.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Filter history list based on search query
  const filteredHistory = historyList.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.organization?.toLowerCase().includes(query) ||
      item.asset?.toLowerCase().includes(query) ||
      item.finding?.toLowerCase().includes(query) ||
      item.priority?.toLowerCase().includes(query)
    );
  });

  const getPriorityColor = (pri) => {
    switch (pri?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[calc(100vh-4rem)]">
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, search, and manage previously generated business security recommendations.
          </p>
        </div>

        {/* Search bar block */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search organization, asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Loading state display */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          <span className="text-slate-500 font-medium">Loading history...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        /* Empty State */
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-white">
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 inline-block mb-4">
            <FiSearch className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No Results Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
            {historyList.length === 0
              ? 'No vulnerabilities have been analyzed yet. Go back to the dashboard to scan one.'
              : 'No records match your current search query. Try typing another keyword.'}
          </p>
        </div>
      ) : (
        /* History list mapping */
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const isExpanded = expandedCard === item._id;
            return (
              <div
                key={item._id}
                onClick={() => toggleExpand(item._id)}
                className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                {/* Header row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-bold text-slate-800 text-base">{item.asset}</span>
                      <span className="text-slate-400 text-sm">at</span>
                      <span className="font-medium text-slate-600 text-sm">{item.organization}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiClock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.timeline}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 justify-end">
                    <div className="text-right">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                        Priority
                      </span>
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete record"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>

                    <div className="text-slate-400">
                      {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible content area */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 animate-fade-in duration-250" onClick={(e) => e.stopPropagation()}>
                    {/* Raw finding description */}
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Vulnerability Finding
                      </span>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white border border-slate-100 p-3 rounded-lg">
                        {item.finding}
                      </p>
                    </div>

                    {/* AI business impact */}
                    <div>
                      <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
                        <FiAlertTriangle className="w-3.5 h-3.5" />
                        <span>Business Impact</span>
                      </span>
                      <p className="text-slate-700 text-sm leading-relaxed bg-white border border-slate-100 p-3 rounded-lg">
                        {item.importance}
                      </p>
                    </div>

                    {/* AI recommended action */}
                    <div>
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
                        <FiFileText className="w-3.5 h-3.5" />
                        <span>Recommended Actions</span>
                      </span>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white border border-slate-100 p-3 rounded-lg">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
