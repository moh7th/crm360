import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CustomerForm from '../components/CustomerForm';
import LeadForm from '../components/LeadForm';
import TaskForm from '../components/TaskForm';
import { useCustomerStore } from '../store/customerStore';
import { useLeadStore } from '../store/leadStore';
import { useTaskStore } from '../store/taskStore';
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiTrendingUp,
  FiCheckSquare,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedCustomer,
    loading,
    fetchCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  const { createLead, updateLeadStatus } = useLeadStore();
  const { createTask, updateTaskStatus } = useTaskStore();

  const [editCustomerOpen, setEditCustomerOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  useEffect(() => {
    fetchCustomer(id);
  }, [id, fetchCustomer]);

  const handleUpdateCustomer = async (formData) => {
    const res = await updateCustomer(id, formData);
    if (res.success) {
      setEditCustomerOpen(false);
      fetchCustomer(id);
    }
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm('Delete this customer profile and all related items?')) {
      const res = await deleteCustomer(id);
      if (res.success) {
        navigate('/customers');
      }
    }
  };

  const handleCreateLead = async (formData) => {
    const res = await createLead({ ...formData, customer: id });
    if (res.success) {
      setAddLeadOpen(false);
      fetchCustomer(id);
    }
  };

  const handleCreateTask = async (formData) => {
    const res = await createTask({
      ...formData,
      relatedTo: 'Customer',
      relatedToId: id,
    });
    if (res.success) {
      setAddTaskOpen(false);
      fetchCustomer(id);
    }
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    await updateLeadStatus(leadId, newStatus);
    fetchCustomer(id);
  };

  const handleQuickTaskToggle = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    await updateTaskStatus(taskId, nextStatus);
    fetchCustomer(id);
  };

  if (loading || !selectedCustomer) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-500">Loading client profile...</p>
        </div>
      </Layout>
    );
  }

  const leads = selectedCustomer.leads || [];
  const tasks = selectedCustomer.tasks || [];
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/customers"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
              title="Back to Customers"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedCustomer.name}
                </h1>
                {selectedCustomer.company && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                    {selectedCustomer.company}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Account created on {new Date(selectedCustomer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditCustomerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={handleDeleteCustomer}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/20">
                {selectedCustomer.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedCustomer.company || 'Direct Contact'}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <FiMail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Email</p>
                  <p className="text-slate-800 font-medium truncate">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <FiPhone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Phone</p>
                  <p className="text-slate-800 font-medium">
                    {selectedCustomer.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Address</p>
                  <p className="text-slate-800 font-medium">
                    {selectedCustomer.address
                      ? `${selectedCustomer.address}, ${selectedCustomer.city || ''} ${selectedCustomer.state || ''} ${selectedCustomer.zip || ''}`
                      : 'No address logged'}
                  </p>
                </div>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Account Notes
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                  {selectedCustomer.notes}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Managed by {selectedCustomer.createdBy?.name || 'Team'}</span>
              <span>Updated {new Date(selectedCustomer.updatedAt || selectedCustomer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FiTrendingUp className="text-indigo-600" />
                    <span>Associated Sales Deals</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Total pipeline volume: <span className="font-bold text-slate-800">${totalPipelineValue.toLocaleString()}</span>
                  </p>
                </div>

                <button
                  onClick={() => setAddLeadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Deal</span>
                </button>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {leads.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">
                    No active deals logged for this customer. Click "Add Deal" to initiate one.
                  </p>
                ) : (
                  leads.map((lead) => (
                    <div
                      key={lead._id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{lead.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="font-extrabold text-indigo-600">
                            ${Number(lead.value).toLocaleString()}
                          </span>
                          <span>•</span>
                          <span>Assigned to: {lead.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FiCheckSquare className="text-indigo-600" />
                    <span>Action Tasks & Milestones</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Account deliverables and follow-ups
                  </p>
                </div>

                <button
                  onClick={() => setAddTaskOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {tasks.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">
                    No tasks assigned to this customer. Click "Add Task" to record an action item.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className="py-3.5 flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleQuickTaskToggle(task._id, task.status)}
                          className={`mt-0.5 p-1 rounded-md transition-colors ${
                            task.status === 'Completed'
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-300 hover:text-slate-500 bg-slate-100'
                          }`}
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              task.status === 'Completed'
                                ? 'line-through text-slate-400'
                                : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {task.priority}
                            </span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {task.assignedTo && (
                              <span>Assignee: {task.assignedTo.name}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          task.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : task.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerForm
        isOpen={editCustomerOpen}
        onClose={() => setEditCustomerOpen(false)}
        onSubmit={handleUpdateCustomer}
        initialData={selectedCustomer}
      />

      <LeadForm
        isOpen={addLeadOpen}
        onClose={() => setAddLeadOpen(false)}
        onSubmit={handleCreateLead}
        preselectedCustomerId={id}
      />

      <TaskForm
        isOpen={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onSubmit={handleCreateTask}
        preselectedRelatedTo="Customer"
        preselectedRelatedToId={id}
      />
    </Layout>
  );
};

export default CustomerDetail;
