import { create } from 'zustand';
import { taskAPI } from '../services/api';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  userTasks: [],
  loading: false,
  error: null,
  filters: {
    status: 'All',
    priority: 'All',
    assignedTo: 'All',
    search: '',
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchTasks();
  },

  fetchTasks: async (customFilters = null) => {
    set({ loading: true, error: null });
    try {
      const activeFilters = customFilters || get().filters;
      const params = {};
      if (activeFilters.status && activeFilters.status !== 'All') {
        params.status = activeFilters.status;
      }
      if (activeFilters.priority && activeFilters.priority !== 'All') {
        params.priority = activeFilters.priority;
      }
      if (activeFilters.assignedTo && activeFilters.assignedTo !== 'All') {
        params.assignedTo = activeFilters.assignedTo;
      }
      if (activeFilters.search) {
        params.search = activeFilters.search;
      }

      const response = await taskAPI.getAll(params);
      set({ tasks: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchUserTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await taskAPI.getUserAssigned();
      set({ userTasks: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch assigned tasks';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await taskAPI.create(data);
      const newTask = response.data.data;
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        loading: false,
      }));
      return { success: true, data: newTask };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateTask: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await taskAPI.update(id, data);
      const updated = response.data.data;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
        loading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const response = await taskAPI.updateStatus(id, status);
      const updated = response.data.data;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task status';
      return { success: false, error: message };
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await taskAPI.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));
