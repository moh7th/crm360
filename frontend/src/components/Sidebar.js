import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  FiGrid,
  FiUsers,
  FiTrendingUp,
  FiCheckSquare,
  FiLogOut,
  FiPieChart,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Customers', path: '/customers', icon: FiUsers },
    { name: 'Sales Leads', path: '/leads', icon: FiTrendingUp },
    { name: 'Tasks', path: '/tasks', icon: FiCheckSquare },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/30">
            360
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">CRM360</h1>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Suite</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Platform Menu
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="px-4 mt-auto mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-800/40 border border-slate-700/60">
          <div className="flex items-center gap-2 mb-2">
            <FiPieChart className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">Pipeline Velocity</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Track real-time stages, conversions, and deals across all accounts.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
