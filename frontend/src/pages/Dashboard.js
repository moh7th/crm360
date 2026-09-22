import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import MetricCard from '../components/MetricCard';
import CustomerForm from '../components/CustomerForm';
import LeadForm from '../components/LeadForm';
import TaskForm from '../components/TaskForm';
import { dashboardAPI } from '../services/api';
import { useCustomerStore } from '../store/customerStore';
import { useLeadStore } from '../store/leadStore';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import {
  FiUsers,
  FiTrendingUp,
  FiCheckSquare,
  FiAward,
  FiPlus,
  FiArrowUpRight,
  FiClock,
  FiBriefcase,
  FiDollarSign,
  FiRefreshCw,
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [activities, setActivities] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const { createCustomer } = useCustomerStore();
  const { createLead } = useLeadStore();
  const { createTask } = useTaskStore();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, activitiesRes, pipelineRes] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getRecentActivities(),
        dashboardAPI.getSalesPipeline(),
      ]);

      setMetrics(metricsRes.data.data);
      setActivities(activitiesRes.data.data);
      setPipeline(pipelineRes.data.pipeline || []);
      setConversionRate(pipelineRes.data.conversionRate || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateCustomer = async (data) => {
    const res = await createCustomer(data);
    if (res.success) {
      setCustomerModalOpen(false);
      loadDashboardData();
    }
  };

  const handleCreateLead = async (data) => {
    const res = await createLead(data);
    if (res.success) {
      setLeadModalOpen(false);
      loadDashboardData();
    }
  };

  const handleCreateTask = async (data) => {
    const res = await createTask(data);
    if (res.success) {
      setTaskModalOpen(false);
      loadDashboardData();
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500 text-blue-500';
      case 'Contacted':
        return 'bg-amber-500 text-amber-500';
      case 'Qualified':
        return 'bg-indigo-500 text-indigo-500';
      case 'Proposal Sent':
        return 'bg-purple-500 text-purple-500';
      case 'Won':
        return 'bg-emerald-500 text-emerald-500';
      case 'Lost':
        return 'bg-rose-500 text-rose-500';
      default:
        return 'bg-slate-500 text-slate-500';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>. Here is your enterprise pipeline pulse.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              title="Refresh Analytics"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              onClick={() => setCustomerModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm"
            >
              <FiPlus className="w-4 h-4 text-indigo-600" />
              <span>Add Customer</span>
            </button>

            <button
              onClick={() => setLeadModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all shadow-sm"
            >
              <FiPlus className="w-4 h-4 text-indigo-700" />
              <span>Add Lead</span>
            </button>

            <button
              onClick={() => setTaskModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            label="Total Customers"
            value={metrics ? metrics.totalCustomers : '...'}
            subtitle="Verified accounts in database"
            color="indigo"
            icon={FiUsers}
          />
          <MetricCard
            label="Active Sales Leads"
            value={metrics ? metrics.activeLeads : '...'}
            subtitle="In negotiation & proposal stages"
            color="blue"
            icon={FiTrendingUp}
          />
          <MetricCard
            label="Pending Action Tasks"
            value={metrics ? metrics.pendingTasks : '...'}
            subtitle="Team action items in progress"
            color="amber"
            icon={FiCheckSquare}
          />
          <MetricCard
            label="Closed Deals"
            value={
              metrics
                ? `$${metrics.totalDealValue.toLocaleString()}`
                : '...'
            }
            subtitle={metrics ? `${metrics.closedDeals} won contracts` : 'Won contracts'}
            trend={`${conversionRate}%`}
            color="emerald"
            icon={FiAward}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sales Pipeline Progression</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deal distribution, volumetric count, and projected revenue per stage.
                </p>
              </div>
              <Link
                to="/leads"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Full Pipeline</span>
                <FiArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {pipeline.map((stage) => {
                const colors = getStageColor(stage.status);
                const bgClass = colors.split(' ')[0];
                return (
                  <div key={stage.status} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${bgClass}`} />
                        <span className="font-bold text-slate-800">{stage.status}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600 font-semibold">
                          {stage.count} {stage.count === 1 ? 'deal' : 'deals'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900">
                          ${stage.value.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          ({stage.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${bgClass}`}
                        style={{ width: `${Math.max(stage.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 10 team operations</p>
              </div>
              <FiClock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-5 space-y-3.5 flex-1 overflow-y-auto max-h-[380px] custom-scrollbar pr-1">
              {activities.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No activity recorded yet. Create a customer or lead to start!
                </div>
              ) : (
                activities.map((item) => (
                  <div
                    key={item.id + item.type}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all text-xs"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 ${
                        item.type === 'customer'
                          ? 'bg-indigo-600'
                          : item.type === 'lead'
                          ? 'bg-emerald-600'
                          : 'bg-amber-500'
                      }`}
                    >
                      {item.type === 'customer' && <FiUsers className="w-4 h-4" />}
                      {item.type === 'lead' && <FiDollarSign className="w-4 h-4" />}
                      {item.type === 'task' && <FiCheckSquare className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>by {item.user}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomerForm
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />

      <LeadForm
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <TaskForm
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </Layout>
  );
};

export default Dashboard;
