import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-200 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          The requested resource does not exist or has been relocated to another workspace path.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/20"
        >
          <FiHome className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
