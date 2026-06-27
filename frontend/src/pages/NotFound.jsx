import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 text-center cyber-grid">
      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-3xl text-yellow-600 mb-6 glow-blue">
        <FiAlertTriangle className="w-16 h-16 animate-bounce" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-3">Page Not Found</h2>
      <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed">
        The route you are trying to access does not exist or has been relocated to another secure sector.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
      >
        <FiHome className="w-5 h-5" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
