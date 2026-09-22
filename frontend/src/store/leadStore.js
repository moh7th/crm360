import { create } from 'zustand';
import { leadAPI } from '../services/api';

export const useLeadStore = create((set, get) => ({
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
  filters: {
    status: 'All',
    assignedTo: 'All',
    search: '',
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchLeads();
  },

  fetchLeads: async (customFilters = null) => {
    set({ loading: true, error: null });
    try {
      const activeFilters = customFilters || get().filters;
      const params = {};
      if (activeFilters.status && activeFilters.status !== 'All') {
        params.status = activeFilters.status;
      }
      if (activeFilters.assignedTo && activeFilters.assignedTo !== 'All') {
        params.assignedTo = activeFilters.assignedTo;
      }
      if (activeFilters.search) {
        params.search = activeFilters.search;
      }

      const response = await leadAPI.getAll(params);
      set({ leads: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch leads';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchLead: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await leadAPI.getById(id);
      set({ selectedLead: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch lead';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  createLead: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await leadAPI.create(data);
      const newLead = response.data.data;
      set((state) => ({
        leads: [newLead, ...state.leads],
        loading: false,
      }));
      return { success: true, data: newLead };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create lead';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateLead: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await leadAPI.update(id, data);
      const updated = response.data.data;
      set((state) => ({
        leads: state.leads.map((l) => (l._id === id ? updated : l)),
        selectedLead:
          state.selectedLead?._id === id ? { ...state.selectedLead, ...updated } : state.selectedLead,
        loading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update lead';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateLeadStatus: async (id, status) => {
    try {
      const response = await leadAPI.updateStatus(id, status);
      const updated = response.data.data;
      set((state) => ({
        leads: state.leads.map((l) => (l._id === id ? updated : l)),
        selectedLead:
          state.selectedLead?._id === id ? { ...state.selectedLead, ...updated } : state.selectedLead,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      return { success: false, error: message };
    }
  },

  deleteLead: async (id) => {
    set({ loading: true, error: null });
    try {
      await leadAPI.delete(id);
      set((state) => ({
        leads: state.leads.filter((l) => l._id !== id),
        selectedLead: state.selectedLead?._id === id ? null : state.selectedLead,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete lead';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  clearSelectedLead: () => set({ selectedLead: null }),
}));
