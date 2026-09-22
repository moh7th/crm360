import React, { useState, useEffect } from 'react';
import { FiX, FiTrendingUp, FiDollarSign, FiCalendar, FiUser, FiBriefcase, FiFileText } from 'react-icons/fi';
import { authAPI, customerAPI } from '../services/api';

const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  preselectedCustomerId = null,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    status: 'New',
    value: '',
    assignedTo: '',
    notes: '',
    followUpDate: '',
  });

  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      customerAPI.getAll({ limit: 100 })
        .then((res) => setCustomers(res.data.data || []))
        .catch(() => {});

      authAPI.getUsers()
        .then((res) => setUsers(res.data.data || []))
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        customer: initialData.customer?._id || initialData.customer || preselectedCustomerId || '',
        status: initialData.status || 'New',
        value: initialData.value !== undefined ? initialData.value : '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        notes: initialData.notes || '',
        followUpDate: initialData.followUpDate ? initialData.followUpDate.slice(0, 10) : '',
      });
    } else {
      setFormData({
        title: '',
        customer: preselectedCustomerId || '',
        status: 'New',
        value: '',
        assignedTo: '',
        notes: '',
        followUpDate: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, preselectedCustomerId]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Lead title is required';
    if (formData.value && (isNaN(formData.value) || Number(formData.value) < 0)) {
      newErrors.value = 'Deal value must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      value: formData.value ? Number(formData.value) : 0,
      customer: formData.customer || null,
      assignedTo: formData.assignedTo || null,
      followUpDate: formData.followUpDate || null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              {initialData ? 'Edit Sales Lead' : 'Create Sales Opportunity'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track deal pipelines, projected revenues, and sales assignments.
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
              Deal Title *
            </label>
            <div className="relative">
              <FiTrendingUp className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Enterprise License Expansion 2026"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-indigo-500 bg-white'
                }`}
              />
            </div>
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Associated Customer
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  <option value="">No Customer Selected</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Deal Value ($)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  name="value"
                  min="0"
                  step="100"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.value
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.value && <p className="text-xs text-rose-600 mt-1">{errors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pipeline Stage
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Next Follow-Up Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deal Notes & Qualification
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Log key pain points, buyer persona, competitors, or discount considerations..."
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
                ? 'Saving Opportunity...'
                : initialData
                ? 'Update Opportunity'
                : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
