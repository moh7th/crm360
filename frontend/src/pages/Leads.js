import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LeadForm from '../components/LeadForm';
import { useLeadStore } from '../store/leadStore';
import { authAPI } from '../services/api';
import {
  FiTrendingUp,
  FiPlus,
  FiFilter,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiGrid,
  FiList,
  FiArrowRight,
  FiBriefcase,
  FiClock,
} from 'react-icons/fi';

const statusColumns = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
];

const Leads = () => {
  const {
    leads,
    loading,
    filters,
    setFilters,
    fetchLeads,
    createLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
  } = useLeadStore();

  const [viewMode, setViewMode] = useState('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeads();
    authAPI.getUsers().then((res) => setUsers(res.data.data || [])).catch(() => {});
  }, [fetchLeads]);

  const handleStatusFilterChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleUserFilterChange = (e) => {
    setFilters({ assignedTo: e.target.value });
  };

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleFormSubmit = async (formData) => {
    if (editingLead) {
      const res = await updateLead(editingLead._id, formData);
      if (res.success) {
        setModalOpen(false);
        setEditingLead(null);
      }
    } else {
      const res = await createLead(formData);
      if (res.success) {
        setModalOpen(false);
      }
    }
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead opportunity and any linked tasks?')) {
      await deleteLead(id);
    }
  };

  const handleQuickStatusChange = async (id, status) => {
    await updateLeadStatus(id, status);
  };

  const getStageHeaderColor = (status) => {
    switch (status) {
      case 'New':
        return 'border-t-blue-500 text-blue-700 bg-blue-50/60';
      case 'Contacted':
        return 'border-t-amber-500 text-amber-700 bg-amber-50/60';
      case 'Qualified':
        return 'border-t-indigo-500 text-indigo-700 bg-indigo-50/60';
      case 'Proposal Sent':
        return 'border-t-purple-500 text-purple-700 bg-purple-50/60';
      case 'Won':
        return 'border-t-emerald-500 text-emerald-700 bg-emerald-50/60';
      case 'Lost':
        return 'border-t-rose-500 text-rose-700 bg-rose-50/60';
      default:
        return 'border-t-slate-500 text-slate-700 bg-slate-50/60';
    }
  };

  const totalPipeline = leads.reduce((acc, l) => acc + (l.value || 0), 0);
  const wonPipeline = leads
    .filter((l) => l.status === 'Won')
    .reduce((acc, l) => acc + (l.value || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sales Pipeline & Leads
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Active volume:{' '}
              <span className="font-extrabold text-indigo-600">
                ${totalPipeline.toLocaleString()}
              </span>{' '}
              | Won revenue:{' '}
              <span className="font-extrabold text-emerald-600">
                ${wonPipeline.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FiGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FiList className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <button
              onClick={() => {
                setEditingLead(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Opportunity</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search opportunity title..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiFilter className="w-3.5 h-3.5" />
              <span className="font-semibold">Stage:</span>
            </div>
            <select
              value={filters.status}
              onChange={handleStatusFilterChange}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Stages</option>
              {statusColumns.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <FiUser className="w-3.5 h-3.5" />
              <span className="font-semibold">Assignee:</span>
            </div>
            <select
              value={filters.assignedTo}
              onChange={handleUserFilterChange}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Team Members</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
            {statusColumns.map((status) => {
              const stageLeads = leads.filter((l) => l.status === status);
              const stageTotal = stageLeads.reduce((acc, l) => acc + (l.value || 0), 0);
              const headerClasses = getStageHeaderColor(status);

              return (
                <div
                  key={status}
                  className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 flex flex-col max-h-[80vh]"
                >
                  <div className={`p-3 rounded-xl border-t-4 border shadow-sm mb-3 ${headerClasses}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs tracking-tight">{status}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs">
                        {stageLeads.length}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 mt-1">
                      ${stageTotal.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
                    {stageLeads.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No deals in {status}
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead._id}
                          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-800 text-xs leading-snug line-clamp-2">
                              {lead.title}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEdit(lead)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                                title="Edit"
                              >
                                <FiEdit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(lead._id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                                title="Delete"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-700">
                            <FiDollarSign className="w-3.5 h-3.5" />
                            <span>{Number(lead.value).toLocaleString()}</span>
                          </div>

                          {lead.customer && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                              <FiBriefcase className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate font-medium">{lead.customer.name}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                            <span className="truncate">
                              {lead.assignedTo?.name || 'Unassigned'}
                            </span>
                            {lead.followUpDate && (
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {new Date(lead.followUpDate).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                          </div>

                          <select
                            value={lead.status}
                            onChange={(e) => handleQuickStatusChange(lead._id, e.target.value)}
                            className="w-full mt-1 px-2 py-1 text-[10px] font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            {statusColumns.map((st) => (
                              <option key={st} value={st}>
                                Move to {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-xl">Deal Title</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Follow-Up</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 text-xs">{lead.title}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {lead.customer?.name || <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleQuickStatusChange(lead._id, e.target.value)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {statusColumns.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-indigo-700 text-xs">
                      ${Number(lead.value).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {lead.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeadForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingLead}
      />
    </Layout>
  );
};

export default Leads;
