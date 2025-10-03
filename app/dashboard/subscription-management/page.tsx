'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiSettings,
  FiEye,
  FiUser,
  FiCheckCircle,
  FiPause,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCreditCard
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import Modal from '../../../components/UI/Modal';

// Static dummy data for subscription management
const dummySubscriptionData = {
  plans: [
    {
      id: 1,
      name: 'Free',
      price: 0,
      billingCycle: 'none',
      features: ['Basic AI interactions', 'Limited analytics', 'Basic support'],
      maxUsers: 1000,
      isActive: true,
      description: 'Basic plan for new users'
    },
    {
      id: 2,
      name: 'Pro Monthly',
      price: 29.99,
      billingCycle: 'monthly',
      features: ['Unlimited AI interactions', 'Advanced analytics', 'Priority support', 'Custom routines'],
      maxUsers: 500,
      isActive: true,
      description: 'Monthly subscription for power users'
    },
    {
      id: 3,
      name: 'Pro Yearly',
      price: 299.99,
      billingCycle: 'yearly',
      features: ['Unlimited AI interactions', 'Advanced analytics', 'Priority support', 'Custom routines', 'Premium features'],
      maxUsers: 500,
      isActive: true,
      description: 'Annual subscription with premium features'
    }
  ],
  subscriptions: [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      planId: 2,
      planName: 'Pro Monthly',
      status: 'active',
      startDate: '2024-01-15',
      nextBillingDate: '2024-02-15',
      amount: 29.99,
      billingCycle: 'monthly',
      paymentMethod: 'card_****1234',
      autoRenew: true,
      trialEndsAt: null,
      cancelledAt: null,
      cancellationReason: null,
      totalPaid: 29.99,
      lastPaymentDate: '2024-01-15',
      nextPaymentAmount: 29.99
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      planId: 1,
      planName: 'Free',
      status: 'active',
      startDate: '2024-01-10',
      nextBillingDate: null,
      amount: 0,
      billingCycle: 'none',
      paymentMethod: null,
      autoRenew: false,
      trialEndsAt: null,
      cancelledAt: null,
      cancellationReason: null,
      totalPaid: 0,
      lastPaymentDate: null,
      nextPaymentAmount: 0
    },
    {
      id: 3,
      userId: 3,
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      planId: 3,
      planName: 'Pro Yearly',
      status: 'active',
      startDate: '2024-01-05',
      nextBillingDate: '2025-01-05',
      amount: 299.99,
      billingCycle: 'yearly',
      paymentMethod: 'card_****5678',
      autoRenew: true,
      trialEndsAt: null,
      cancelledAt: null,
      cancellationReason: null,
      totalPaid: 299.99,
      lastPaymentDate: '2024-01-05',
      nextPaymentAmount: 299.99
    },
    {
      id: 4,
      userId: 4,
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      planId: 2,
      planName: 'Pro Monthly',
      status: 'trial',
      startDate: '2024-01-18',
      nextBillingDate: '2024-01-25',
      amount: 29.99,
      billingCycle: 'monthly',
      paymentMethod: 'card_****9012',
      autoRenew: true,
      trialEndsAt: '2024-01-25',
      cancelledAt: null,
      cancellationReason: null,
      totalPaid: 0,
      lastPaymentDate: null,
      nextPaymentAmount: 29.99
    },
    {
      id: 5,
      userId: 5,
      userName: 'David Brown',
      userEmail: 'david.brown@example.com',
      planId: 2,
      planName: 'Pro Monthly',
      status: 'cancelled',
      startDate: '2023-12-01',
      nextBillingDate: null,
      amount: 29.99,
      billingCycle: 'monthly',
      paymentMethod: 'card_****3456',
      autoRenew: false,
      trialEndsAt: null,
      cancelledAt: '2024-01-10',
      cancellationReason: 'Too expensive',
      totalPaid: 59.98,
      lastPaymentDate: '2023-12-01',
      nextPaymentAmount: 0
    }
  ]
};

const SubscriptionManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('subscription-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<typeof dummySubscriptionData.subscriptions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('subscriptions');

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status', type: 'status' as const },
    { value: 'active', label: 'Active', type: 'status' as const },
    { value: 'trial', label: 'Trial', type: 'status' as const },
    { value: 'cancelled', label: 'Cancelled', type: 'status' as const },
    { value: 'paused', label: 'Paused', type: 'status' as const }
  ];

  const planOptions = [
    { value: 'all', label: 'All Plans', type: 'plan' as const },
    { value: 'Free', label: 'Free', type: 'plan' as const },
    { value: 'Pro Monthly', label: 'Pro Monthly', type: 'plan' as const },
    { value: 'Pro Yearly', label: 'Pro Yearly', type: 'plan' as const }
  ];

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return dummySubscriptionData.subscriptions.filter(subscription => {
      const matchesSearch = subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.planName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus;
      const matchesPlan = filterPlan === 'all' || subscription.planName === filterPlan;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [searchTerm, filterStatus, filterPlan]);

  const handleViewSubscription = (subscription: typeof dummySubscriptionData.subscriptions[0]) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const toggleRowExpansion = (subscriptionId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(subscriptionId)) {
      newExpanded.delete(subscriptionId);
    } else {
      newExpanded.add(subscriptionId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
      trial: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Trial' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelled' },
      paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Paused' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="Subscription Management" />

        {/* Content */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
          >
            {/* Tab Navigation */}
            <motion.div variants={itemVariants} className="border-b border-gray-700">
              <nav className="-mb-px flex flex-wrap sm:flex-nowrap gap-2 sm:gap-8">
                {[
                  { id: 'subscriptions', label: 'Subscriptions', icon: FiCreditCard },
                  { id: 'plans', label: 'Plans', icon: FiSettings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                      ? 'border-coral-500 text-coral-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                      }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <>
                {/* Filters */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
                      <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search subscriptions..."
                        className="w-full sm:w-64 lg:w-72"
                      />
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <FilterDropdown
                          options={statusOptions}
                          value={filterStatus}
                          onChange={setFilterStatus}
                          placeholder="Filter by status"
                          className="w-full sm:w-48 lg:w-56"
                        />
                        <FilterDropdown
                          options={planOptions}
                          value={filterPlan}
                          onChange={setFilterPlan}
                          placeholder="Filter by plan"
                          className="w-full sm:w-48 lg:w-56"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {filteredSubscriptions.length} subscriptions found
                    </div>
                  </div>
                </motion.div>

                {/* Subscriptions Table */}
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            User & Plan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status & Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Billing Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Payment History
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {filteredSubscriptions.map((subscription) => (
                          <React.Fragment key={subscription.id}>
                            <tr className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <FiUser className="h-5 w-5 text-blue-600" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{subscription.userName}</div>
                                    <div className="text-sm text-gray-400">{subscription.userEmail}</div>
                                    <div className="text-xs text-gray-400">{subscription.planName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">${subscription.amount.toFixed(2)}</div>
                                <div className="text-sm text-gray-400">
                                  {getStatusBadge(subscription.status)}
                                </div>
                                <div className="text-xs text-gray-400 capitalize">
                                  {subscription.billingCycle}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">
                                  {subscription.nextBillingDate ?
                                    new Date(subscription.nextBillingDate).toLocaleDateString() :
                                    'N/A'
                                  }
                                </div>
                                <div className="text-sm text-gray-400">
                                  {subscription.paymentMethod || 'No payment method'}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">
                                  ${subscription.totalPaid.toFixed(2)} total
                                </div>
                                <div className="text-sm text-gray-400">
                                  Last: {subscription.lastPaymentDate ?
                                    new Date(subscription.lastPaymentDate).toLocaleDateString() :
                                    'Never'
                                  }
                                </div>
                                <div className="text-xs text-gray-400">
                                  Next: ${subscription.nextPaymentAmount.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewSubscription(subscription)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <FiEdit className="w-4 h-4" />
                                  </button>
                                  <button className="text-yellow-600 hover:text-yellow-900">
                                    <FiPause className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleRowExpansion(subscription.id)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  {expandedRows.has(subscription.id) ? (
                                    <FiChevronUp className="w-4 h-4" />
                                  ) : (
                                    <FiChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                            {expandedRows.has(subscription.id) && (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 bg-gray-700">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <h4 className="font-medium text-white mb-2">Subscription Details</h4>
                                        <div className="space-y-1 text-sm text-gray-300">
                                          <div>Plan: {subscription.planName}</div>
                                          <div>Status: {subscription.status}</div>
                                          <div>Amount: ${subscription.amount.toFixed(2)}</div>
                                          <div>Cycle: {subscription.billingCycle}</div>
                                          <div>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white mb-2">Payment Information</h4>
                                        <div className="space-y-1 text-sm text-gray-300">
                                          <div>Method: {subscription.paymentMethod || 'N/A'}</div>
                                          <div>Total Paid: ${subscription.totalPaid.toFixed(2)}</div>
                                          <div>Last Payment: {subscription.lastPaymentDate ?
                                            new Date(subscription.lastPaymentDate).toLocaleDateString() : 'Never'
                                          }</div>
                                          <div>Next Payment: ${subscription.nextPaymentAmount.toFixed(2)}</div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white mb-2">Billing Schedule</h4>
                                        <div className="space-y-1 text-sm text-gray-300">
                                          <div>Next Billing: {subscription.nextBillingDate ?
                                            new Date(subscription.nextBillingDate).toLocaleDateString() : 'N/A'
                                          }</div>
                                          <div>Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}</div>
                                          {subscription.trialEndsAt && (
                                            <div>Trial Ends: {new Date(subscription.trialEndsAt).toLocaleDateString()}</div>
                                          )}
                                          {subscription.cancelledAt && (
                                            <div>Cancelled: {new Date(subscription.cancelledAt).toLocaleDateString()}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {subscription.cancellationReason && (
                                      <div>
                                        <h4 className="font-medium text-white mb-2">Cancellation Reason</h4>
                                        <p className="text-sm text-gray-600">{subscription.cancellationReason}</p>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4 p-4">
                    {filteredSubscriptions.map((subscription) => (
                      <div key={subscription.id} className="bg-gray-700 rounded-lg border border-gray-600 p-4 space-y-3">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-blue-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{subscription.userName}</div>
                            <div className="text-xs text-gray-400 truncate">{subscription.userEmail}</div>
                          </div>
                        </div>

                        {/* Subscription Details */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Plan</span>
                            <span className="text-sm text-white">{subscription.planName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Status</span>
                            {getStatusBadge(subscription.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Amount</span>
                            <span className="text-sm text-white">${subscription.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Billing</span>
                            <span className="text-sm text-white">{subscription.billingCycle}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 pt-2 border-t border-gray-600">
                          <button
                            onClick={() => handleViewSubscription(subscription)}
                            className="flex-1 bg-coral-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-coral-600 transition-colors duration-200"
                          >
                            View Details
                          </button>
                          <button className="flex-1 bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-500 transition-colors duration-200">
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {dummySubscriptionData.plans.map((plan) => (
                  <div key={plan.id} className="flex flex-col justify-between bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${plan.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="text-3xl font-bold text-white">
                          ${plan.price.toFixed(2)}
                          {plan.billingCycle !== 'none' && (
                            <span className="text-sm font-normal text-gray-400">/{plan.billingCycle}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{plan.description}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-white mb-2">Features</h4>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center">
                              <FiCheckCircle className="w-4 h-4 text-green-400 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-300">
                          <span className="font-medium">Max Users:</span> {plan.maxUsers.toLocaleString()}
                        </div>
                      </div>

                    </div>

                    <div className="flex flex-col space-y-2">
                      <button className="w-full bg-coral-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ease-in-out hover:bg-coral-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                        Edit Plan
                      </button>
                      <button className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ease-in-out hover:bg-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Subscription Details Modal */}
      {isModalOpen && selectedSubscription && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Subscription Details - ${selectedSubscription.userName}`}
        >
          <div className="space-y-6">
            {/* Subscription Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiCreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedSubscription.userName}</h3>
                  <p className="text-gray-500">{selectedSubscription.planName}</p>
                  <p className="text-sm text-gray-400">
                    {getStatusBadge(selectedSubscription.status)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${selectedSubscription.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {selectedSubscription.billingCycle}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Subscription Information</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="font-medium text-gray-200">Plan:</span> <span className="text-white">{selectedSubscription.planName}</span></div>
                  <div><span className="font-medium text-gray-200">Status:</span> <span className="text-white">{selectedSubscription.status}</span></div>
                  <div><span className="font-medium text-gray-200">Amount:</span> <span className="text-white">${selectedSubscription.amount.toFixed(2)}</span></div>
                  <div><span className="font-medium text-gray-200">Billing Cycle:</span> <span className="text-white">{selectedSubscription.billingCycle}</span></div>
                  <div><span className="font-medium text-gray-200">Auto-renew:</span> <span className="text-white">{selectedSubscription.autoRenew ? 'Yes' : 'No'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Billing Details</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="font-medium text-gray-200">Start Date:</span> <span className="text-white">{new Date(selectedSubscription.startDate).toLocaleDateString()}</span></div>
                  <div><span className="font-medium text-gray-200">Next Billing:</span> <span className="text-white">{selectedSubscription.nextBillingDate ?
                    new Date(selectedSubscription.nextBillingDate).toLocaleDateString() : 'N/A'
                  }</span></div>
                  <div><span className="font-medium text-gray-200">Total Paid:</span> <span className="text-white">${selectedSubscription.totalPaid.toFixed(2)}</span></div>
                  <div><span className="font-medium text-gray-200">Payment Method:</span> <span className="text-white">{selectedSubscription.paymentMethod || 'N/A'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">User Information</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="font-medium text-gray-200">Name:</span> <span className="text-white">{selectedSubscription.userName}</span></div>
                  <div><span className="font-medium text-gray-200">Email:</span> <span className="text-white">{selectedSubscription.userEmail}</span></div>
                  <div><span className="font-medium text-gray-200">User ID:</span> <span className="text-white">{selectedSubscription.userId}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Payment History</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="font-medium text-gray-200">Last Payment:</span> <span className="text-white">{selectedSubscription.lastPaymentDate ?
                    new Date(selectedSubscription.lastPaymentDate).toLocaleDateString() : 'Never'
                  }</span></div>
                  <div><span className="font-medium text-gray-200">Next Payment:</span> <span className="text-white">${selectedSubscription.nextPaymentAmount.toFixed(2)}</span></div>
                  {selectedSubscription.trialEndsAt && (
                    <div><span className="font-medium">Trial Ends:</span> {new Date(selectedSubscription.trialEndsAt).toLocaleDateString()}</div>
                  )}
                  {selectedSubscription.cancelledAt && (
                    <div><span className="font-medium">Cancelled:</span> {new Date(selectedSubscription.cancelledAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </div>

            {selectedSubscription.cancellationReason && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cancellation Reason</h4>
                <p className="text-sm text-gray-600">{selectedSubscription.cancellationReason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionManagement;
