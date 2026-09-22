import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import { useTaskStore } from '../store/taskStore';
import { authAPI } from '../services/api';
import {
  FiCheckSquare,
  FiPlus,
  FiFilter,
  FiUser,
  FiClock,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiCheck,
  FiFlag,
} from 'react-icons/fi';

const priorityBadges = {
  High: 'bg-rose-100 text-rose-700 border-rose-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const Tasks = () => {
  const {
    tasks,
    loading,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  } = useTaskStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    authAPI.getUsers().then((res) => setUsers(res.data.data || [])).catch(() => {});
  }, [fetchTasks]);

  const handleFormSubmit = async (formData) => {
    if (editingTask) {
      const res = await updateTask(editingTask._id, formData);
      if (res.success) {
        setModalOpen(false);
        setEditingTask(null);
      }
    } else {
      const res = await createTask(formData);
      if (res.success) {
        setModalOpen(false);
      }
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusToggle = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await updateTaskStatus(task._id, nextStatus);
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Completed') return false;
    return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Action Tasks & Operations
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track deadlines, team deliverables, and operational execution.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search task title..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiFilter className="w-3.5 h-3.5" />
              <span className="font-semibold">Status:</span>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <FiFlag className="w-3.5 h-3.5" />
              <span className="font-semibold">Priority:</span>
            </div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ priority: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <FiUser className="w-3.5 h-3.5" />
              <span className="font-semibold">Assignee:</span>
            </div>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ assignedTo: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Assignees</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No tasks match your selected criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <div
                    key={task._id}
                    className={`py-4 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl transition-colors ${
                      overdue ? 'bg-rose-50/40' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all mt-0.5 shrink-0 ${
                          task.status === 'Completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-indigo-600 text-transparent'
                        }`}
                      >
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm font-bold ${
                              task.status === 'Completed'
                                ? 'line-through text-slate-400'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>

                          {overdue && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200">
                              <FiAlertTriangle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              priorityBadges[task.priority] || priorityBadges.Medium
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                          {task.dueDate && (
                            <span
                              className={`flex items-center gap-1 font-medium ${
                                overdue ? 'text-rose-600 font-bold' : 'text-slate-500'
                              }`}
                            >
                              <FiCalendar className="w-3 h-3" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            {task.assignedTo?.name || 'Unassigned'}
                          </span>

                          {task.relatedTo && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium">
                              Linked: {task.relatedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                          task.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : task.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit Task"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Task"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TaskForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />
    </Layout>
  );
};

export default Tasks;
