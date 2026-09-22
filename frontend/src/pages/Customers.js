import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CustomerForm from '../components/CustomerForm';
import { useCustomerStore } from '../store/customerStore';
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiArrowRight,
} from 'react-icons/fi';

const Customers = () => {
  const navigate = useNavigate();
  const {
    customers,
    loading,
    total,
    page,
    pages,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchCustomers({ page: 1, limit: 10 });
  }, [fetchCustomers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers({ search: searchTerm, page: 1, limit: 10 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      fetchCustomers({ search: searchTerm, page: newPage, limit: 10 });
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingCustomer) {
      const res = await updateCustomer(editingCustomer._id, formData);
      if (res.success) {
        setModalOpen(false);
        setEditingCustomer(null);
      }
    } else {
      const res = await createCustomer(formData);
      if (res.success) {
        setModalOpen(false);
      }
    }
  };

  const handleOpenEdit = (e, customer) => {
    e.stopPropagation();
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer? Related tasks will also be removed.')) {
      await deleteCustomer(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customers Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage client organizations, points of contact, and business dossiers.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCustomer(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name, company, or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
            >
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  fetchCustomers({ page: 1, limit: 10 });
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-xl">Client Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
                      <p>Loading customers...</p>
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      No customers found. Click "Add Customer" to create your first client record.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer._id}
                      onClick={() => navigate(`/customers/${customer._id}`)}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {customer.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <span className="group-hover:text-indigo-600 transition-colors">
                              {customer.name}
                            </span>
                            <div className="text-[11px] text-slate-400 font-normal">
                              Added {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-xs">
                            <FiMail className="w-3.5 h-3.5 text-slate-400" />
                            {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="flex items-center gap-1.5 text-xs text-slate-400">
                              <FiPhone className="w-3.5 h-3.5" />
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {customer.company ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                            <FiBriefcase className="w-3.5 h-3.5 text-slate-400" />
                            {customer.company}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Personal Account</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {customer.city || customer.state ? (
                          `${customer.city || ''}${customer.city && customer.state ? ', ' : ''}${customer.state || ''}`
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => handleOpenEdit(e, customer)}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Customer"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, customer._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Customer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <span className="p-2 text-slate-300 group-hover:text-indigo-500 transition-colors">
                            <FiArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <span className="font-bold text-slate-700">{customers.length}</span> of{' '}
              <span className="font-bold text-slate-700">{total}</span> total clients
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-700">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomerForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
      />
    </Layout>
  );
};

export default Customers;
