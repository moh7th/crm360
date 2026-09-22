import React, { useState, useEffect } from 'react';
import { FiX, FiCheckSquare, FiCalendar, FiFlag, FiUser, FiLink, FiFileText } from 'react-icons/fi';
import { authAPI, customerAPI, leadAPI } from '../services/api';

const priorityOptions = ['Low', 'Medium', 'High'];
const statusOptions = ['Pending', 'In Progress', 'Completed'];

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  preselectedRelatedTo = null,
  preselectedRelatedToId = null,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'Pending',
    dueDate: '',
    priority: 'Medium',
    relatedTo: '',
    relatedToId: '',
  });

  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      authAPI.getUsers().then((res) => setUsers(res.data.data || [])).catch(() => {});
      customerAPI.getAll({ limit: 100 }).then((res) => setCustomers(res.data.data || [])).catch(() => {});
      leadAPI.getAll({ limit: 100 }).then((res) => setLeads(res.data.data || [])).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        status: initialData.status || 'Pending',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        priority: initialData.priority || 'Medium',
        relatedTo: initialData.relatedTo || preselectedRelatedTo || '',
        relatedToId: initialData.relatedToId || preselectedRelatedToId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        status: 'Pending',
        dueDate: '',
        priority: 'Medium',
        relatedTo: preselectedRelatedTo || '',
        relatedToId: preselectedRelatedToId || '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, preselectedRelatedTo, preselectedRelatedToId]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      assignedTo: formData.assignedTo || null,
      dueDate: formData.dueDate || null,
      relatedTo: formData.relatedTo || null,
      relatedToId: formData.relatedTo && formData.relatedToId ? formData.relatedToId : null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'relatedTo' && value === '') {
        updated.relatedToId = '';
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialData ? 'Edit Task' : 'Schedule Action Task'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set deadlines, deliverables, and team responsibilities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <div className="relative">
              <FiCheckSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Conduct security walkthrough demo"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-indigo-500 bg-white'
                }`}
              />
            </div>
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <div className="relative">
                <FiFlag className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p} Priority
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Related Entity Type
              </label>
              <div className="relative">
                <FiLink className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  name="relatedTo"
                  value={formData.relatedTo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  <option value="">None / Standalone Task</option>
                  <option value="Customer">Customer</option>
                  <option value="Lead">Sales Lead</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Connect To Item
              </label>
              <select
                name="relatedToId"
                disabled={!formData.relatedTo}
                value={formData.relatedToId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">Select linked item...</option>
                {formData.relatedTo === 'Customer' &&
                  customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                {formData.relatedTo === 'Lead' &&
                  leads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.title} (${l.value.toLocaleString()})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {initialData && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Task Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Action Steps
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail expectations, background links, contact details..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving Task...'
                : initialData
                ? 'Update Task'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
