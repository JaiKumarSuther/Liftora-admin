'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiEye,
  FiCheckCircle,
  FiPause,
  FiEdit,
  FiCreditCard
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import Modal from '../../../components/UI/Modal';
import { useUsers } from '../../../hooks/useApiQueries';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { AdminUser, AdminSubscription } from '../../../types';

const SubscriptionManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('subscription-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    subscriptionStatus: '',
    accountType: ''
  });

  // Fetch users with subscription data
  const { data: usersData, isLoading, error, refetch } = useUsers({
    page: 1,
    limit: 100
  });

  // Filter options
  const statusOptions = [
    { value: '', label: 'All Status', type: 'status' as const },
    { value: 'active', label: 'Active', type: 'status' as const },
    { value: 'inactive', label: 'Inactive', type: 'status' as const },
    { value: 'cancelled', label: 'Cancelled', type: 'status' as const },
  ];

  const planOptions = [
    { value: '', label: 'All Plans', type: 'plan' as const },
    { value: 'free', label: 'Free', type: 'plan' as const },
    { value: 'premium', label: 'Premium', type: 'plan' as const },
    { value: 'pro', label: 'Pro', type: 'plan' as const },
  ];

  // Transform users to subscription format
  const subscriptions = useMemo(() => {
    if (!usersData?.data) return [];
    
    return usersData.data.map((user: AdminUser) => ({
      id: user.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId: user.subscriptionStatus === 'active' ? 2 : 1,
      planName: user.subscriptionStatus === 'active' ? 'Premium' : 'Free',
      status: user.subscriptionStatus,
      startDate: user.createdAt,
      nextBillingDate: user.subscriptionStatus === 'active' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      amount: user.subscriptionStatus === 'active' ? 29.99 : 0,
      billingCycle: user.subscriptionStatus === 'active' ? 'monthly' : 'none',
      paymentMethod: user.subscriptionStatus === 'active' ? 'card_****1234' : null,
      autoRenew: user.subscriptionStatus === 'active',
      trialEndsAt: null,
      cancelledAt: null,
      cancellationReason: null,
      totalPaid: user.subscriptionStatus === 'active' ? 29.99 : 0,
      lastPaymentDate: user.subscriptionStatus === 'active' ? user.createdAt : null,
      nextPaymentAmount: user.subscriptionStatus === 'active' ? 29.99 : 0
    }));
  }, [usersData]);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub: AdminSubscription) => {
      const matchesSearch = 
        sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || sub.status === statusFilter;
      const matchesPlan = !planFilter || sub.plan.toLowerCase() === planFilter;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [subscriptions, searchTerm, statusFilter, planFilter]);

  // Handle user actions
  const handleViewSubscription = (subscription: AdminSubscription) => {
    const user = usersData?.data?.find((u: AdminUser) => u.id === subscription.userId);
    if (user) {
      setSelectedUser(user);
      setIsViewModalOpen(true);
    }
  };

  const handleEditSubscription = (subscription: AdminSubscription) => {
    const user = usersData?.data?.find((u: AdminUser) => u.id === subscription.userId);
    if (user) {
      setSelectedUser(user);
      setEditForm({
        subscriptionStatus: user.subscriptionStatus,
        accountType: user.subscriptionStatus === 'active' ? 'premium' : 'free'
      });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return;

    try {
      // Here you would call the update user API
      console.log('Update subscription for user:', selectedUser.id, editForm);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Subscriptions</h2>
          <p className="text-gray-400">Failed to load subscription data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="ml-64">
        <Header title="Subscription Management" />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
            <p className="text-gray-400">Manage user subscriptions and billing</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Subscriptions</p>
                  <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FiCreditCard className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-white">
                    {subscriptions.filter((s: AdminSubscription) => s.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FiCheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold text-white">
                    {subscriptions.filter((s: AdminSubscription) => s.status === 'cancelled').length}
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <FiPause className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${subscriptions.reduce((sum: number, s: AdminSubscription) => sum + s.totalPaid, 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <FiCreditCard className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search subscriptions by user name or email..."
              />
            </div>
            <div className="flex gap-4">
              <FilterDropdown
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by Status"
              />
              <FilterDropdown
                options={planOptions}
                value={planFilter}
                onChange={setPlanFilter}
                placeholder="Filter by Plan"
              />
            </div>
          </div>

          {/* Subscriptions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Next Billing
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSubscriptions.map((subscription: AdminSubscription) => (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {subscription.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{subscription.userName}</div>
                            <div className="text-sm text-gray-400">{subscription.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{subscription.plan}</div>
                        <div className="text-sm text-gray-400">{subscription.billingCycle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">${subscription.amount}</div>
                        <div className="text-sm text-gray-400">Total: ${subscription.totalPaid}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewSubscription(subscription)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditSubscription(subscription)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      {/* View Subscription Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Subscription Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">User Name</label>
                <p className="text-white">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedUser.subscriptionStatus)}`}>
                  {selectedUser.subscriptionStatus}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Join Date</label>
                <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscription"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={editForm.subscriptionStatus}
              onChange={(e) => setEditForm(prev => ({ ...prev, subscriptionStatus: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Plan Type</label>
            <select
              value={editForm.accountType}
              onChange={(e) => setEditForm(prev => ({ ...prev, accountType: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubscription}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Subscription
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;