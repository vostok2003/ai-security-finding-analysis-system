import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiShield, FiAlertOctagon, FiTerminal, FiLoader } from 'react-icons/fi';
import { analyzeFinding } from '../services/api';
import AnalysisResultCard from '../components/cards/AnalysisResultCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      organization: '',
      asset: '',
      finding: '',
      severity: '',
    },
  });

  const loadingSteps = [
    'Scanning inputs...',
    'Establishing secure link to AI engine...',
    'Evaluating threat vectors against OWASP Top 10...',
    'Calculating business impact metrics...',
    'Formulating prioritized action plan...',
    'Storing analysis record in database...',
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const onSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await analyzeFinding(data);
      if (response.success) {
        setResult(response.data);
        toast.success('Security analysis completed successfully.');
        reset();
      } else {
        toast.error(response.message || 'Analysis generation failed.');
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message;
      const validationErrs = err.response?.data?.errors;
      
      if (validationErrs && validationErrs.length > 0) {
        toast.error(`${serverMsg}: ${validationErrs[0].message}`);
      } else {
        toast.error(serverMsg || 'An error occurred during threat analysis.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto cyber-grid min-h-[calc(100vh-4rem)]">
      {/* Hero section */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 mb-3 glow-blue">
          <FiShield className="w-8 h-8 animate-pulse-ring" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Cyber Risk Analysis Engine
        </h1>
        <p className="mt-2 text-md text-slate-500 max-w-2xl mx-auto">
          Submit technical vulnerabilities to generate business-oriented risk reports, priorities, and implementation actions instantly using AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submission Form block */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-md rounded-2xl p-6">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-lg mb-6 pb-2 border-b border-slate-100">
            <FiAlertOctagon className="text-blue-600" />
            <span>Finding Details</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Organization Name
              </label>
              <input
                id="organization"
                type="text"
                placeholder="e.g. Acme Corp, Healthcare"
                {...register('organization', {
                  required: 'Organization name is required.',
                  minLength: { value: 2, message: 'Must be at least 2 characters.' },
                  maxLength: { value: 100, message: 'Cannot exceed 100 characters.' },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 bg-slate-50/50"
              />
              {errors.organization && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.organization.message}</p>
              )}
            </div>

            {/* Asset */}
            <div>
              <label htmlFor="asset" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Asset
              </label>
              <input
                id="asset"
                type="text"
                placeholder="e.g. Patient Portal, Internal API"
                {...register('asset', {
                  required: 'Asset name is required.',
                  minLength: { value: 2, message: 'Must be at least 2 characters.' },
                  maxLength: { value: 100, message: 'Cannot exceed 100 characters.' },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 bg-slate-50/50"
              />
              {errors.asset && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.asset.message}</p>
              )}
            </div>

            {/* Severity Dropdown */}
            <div>
              <label htmlFor="severity" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Technical Severity
              </label>
              <select
                id="severity"
                {...register('severity', { required: 'Severity rating is required.' })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-700"
              >
                <option value="">Select Severity Rating</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.severity && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.severity.message}</p>
              )}
            </div>

            {/* Finding Textbox */}
            <div>
              <label htmlFor="finding" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Vulnerability Finding Description
              </label>
              <textarea
                id="finding"
                rows={5}
                placeholder="e.g. SQL Injection on login form parameter 'username' allows unauthenticated users to dump database tables..."
                {...register('finding', {
                  required: 'Vulnerability description is required.',
                  minLength: { value: 10, message: 'Must be at least 10 characters.' },
                  maxLength: { value: 1000, message: 'Cannot exceed 1000 characters.' },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 bg-slate-50/50 resize-y"
              />
              {errors.finding && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.finding.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Analyzing Vulnerability...</span>
                </>
              ) : (
                <span>Generate Risk Analysis</span>
              )}
            </button>
          </form>
        </div>

        {/* Results & Loader display */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-emerald-400 font-mono shadow-2xl min-h-[400px] flex flex-col justify-between">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-slate-400">
                <FiTerminal className="w-4 h-4 text-emerald-500" />
                <span className="text-xs uppercase tracking-wider">Securescan risk daemon v1.0.0</span>
              </div>
              <div className="flex-grow flex flex-col justify-center items-center py-12 space-y-6">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="text-center space-y-2 max-w-sm px-4">
                  <p className="text-emerald-300 font-semibold text-sm transition-all duration-300 animate-pulse">
                    &gt; {loadingSteps[loadingStep]}
                  </p>
                  <p className="text-slate-500 text-xs font-sans">
                    Please do not close this window. AI analysis can take up to 20 seconds.
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 flex justify-between uppercase">
                <span>Status: Processing</span>
                <span>Port: 5000</span>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center bg-white">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 mb-4">
                <FiTerminal className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No Active Report</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-1">
                Fill in the threat form on the left and submit it to trigger our cyber threat intelligence generator.
              </p>
            </div>
          )}

          {!loading && result && <AnalysisResultCard result={result} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
