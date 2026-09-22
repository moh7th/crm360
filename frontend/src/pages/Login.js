import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSeedSuccess('');

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    let result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
      return;
    }

    if (email.endsWith('@crm360.com')) {
      try {
        setSeeding(true);
        await authAPI.seed();
        setSeeding(false);
        result = await login(email, password);
        if (result.success) {
          navigate('/dashboard');
          return;
        }
      } catch (err) {
        setSeeding(false);
      }
    }
  };

  const handleFillDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLocalError('');
    setSeedSuccess('');
  };

  const handleManualSeed = async () => {
    setSeeding(true);
    setLocalError('');
    setSeedSuccess('');
    try {
      await authAPI.seed();
      setSeedSuccess('Demo database initialized. You can now sign in with any demo role.');
    } catch (err) {
      setLocalError('Failed to initialize demo accounts. Ensure the backend is running.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-2xl shadow-xl shadow-indigo-500/30 mb-4">
          360
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Sign In to CRM360
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Intelligent customer relationships, sales pipelines, and team collaboration.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
          {(error || localError) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
              <FiAlertCircle className="w-5 h-5 shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          {seedSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
              <FiCheckCircle className="w-5 h-5 shrink-0" />
              <span>{seedSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || seeding}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-60 active:scale-[0.99]"
            >
              {isLoading || seeding ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quick One-Click Demo Access
              </p>
              <button
                type="button"
                onClick={handleManualSeed}
                disabled={seeding}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Populate or reset demo database"
              >
                <FiRefreshCw className={`w-3 h-3 ${seeding ? 'animate-spin' : ''}`} />
                <span>Initialize Demo Data</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@crm360.com', 'Admin@123')}
                className="px-2 py-2 text-xs font-semibold rounded-xl bg-slate-700/60 hover:bg-slate-700 text-indigo-300 border border-indigo-500/20 transition-colors text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('manager@crm360.com', 'Manager@123')}
                className="px-2 py-2 text-xs font-semibold rounded-xl bg-slate-700/60 hover:bg-slate-700 text-blue-300 border border-blue-500/20 transition-colors text-center"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('executive@crm360.com', 'Executive@123')}
                className="px-2 py-2 text-xs font-semibold rounded-xl bg-slate-700/60 hover:bg-slate-700 text-emerald-300 border border-emerald-500/20 transition-colors text-center"
              >
                Executive
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
