import { create } from 'zustand';
import { customerAPI } from '../services/api';

export const useCustomerStore = create((set, get) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,

  fetchCustomers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await customerAPI.getAll(params);
      const { data, total, page, pages } = response.data;
      set({
        customers: data,
        total: total || data.length,
        page: page || 1,
        pages: pages || 1,
        loading: false,
      });
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch customers';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await customerAPI.getById(id);
      set({ selectedCustomer: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch customer details';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  createCustomer: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await customerAPI.create(data);
      const newCustomer = response.data.data;
      set((state) => ({
        customers: [newCustomer, ...state.customers],
        total: state.total + 1,
        loading: false,
      }));
      return { success: true, data: newCustomer };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create customer';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateCustomer: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await customerAPI.update(id, data);
      const updated = response.data.data;
      set((state) => ({
        customers: state.customers.map((c) => (c._id === id ? updated : c)),
        selectedCustomer:
          state.selectedCustomer?._id === id
            ? { ...state.selectedCustomer, ...updated }
            : state.selectedCustomer,
        loading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update customer';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await customerAPI.delete(id);
      set((state) => ({
        customers: state.customers.filter((c) => c._id !== id),
        total: Math.max(0, state.total - 1),
        selectedCustomer: state.selectedCustomer?._id === id ? null : state.selectedCustomer,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete customer';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  searchCustomers: async (query) => {
    return get().fetchCustomers({ search: query, page: 1 });
  },

  clearSelectedCustomer: () => set({ selectedCustomer: null }),
}));
