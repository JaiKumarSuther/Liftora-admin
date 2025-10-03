'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiEye, 
  FiUser,
  FiTrendingDown,
  FiTrendingUp,
  FiCreditCard,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiBarChart,
  FiPieChart
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import Modal from '../../../components/UI/Modal';
import AnimatedChart from '../../../components/UI/AnimatedChart';
import KPICard from '../../../components/UI/KPICard';

// Static dummy data for billing and analytics
const dummyBillingData = {
  overview: {
    totalRevenue: 12580.50,
    monthlyRecurringRevenue: 3420.00,
    totalSubscriptions: 456,
    activeSubscriptions: 389,
    trialSubscriptions: 67,
    churnRate: 5.2,
    averageRevenuePerUser: 27.59,
    conversionRate: 12.8
  },
  subscriptions: [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      plan: 'Pro Monthly',
      status: 'active',
      amount: 29.99,
      billingCycle: 'monthly',
      startDate: '2024-01-15',
      nextBillingDate: '2024-02-15',
      totalPaid: 29.99,
      paymentMethod: 'card_****1234',
      autoRenew: true,
      features: ['Unlimited AI interactions', 'Advanced analytics', 'Priority support']
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      plan: 'Free',
      status: 'inactive',
      amount: 0,
      billingCycle: 'none',
      startDate: '2024-01-10',
      nextBillingDate: null,
      totalPaid: 0,
      paymentMethod: null,
      autoRenew: false,
      features: ['Basic AI interactions', 'Limited analytics']
    },
    {
      id: 3,
      userId: 3,
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      plan: 'Pro Yearly',
      status: 'active',
      amount: 299.99,
      billingCycle: 'yearly',
      startDate: '2024-01-05',
      nextBillingDate: '2025-01-05',
      totalPaid: 299.99,
      paymentMethod: 'card_****5678',
      autoRenew: true,
      features: ['Unlimited AI interactions', 'Advanced analytics', 'Priority support', 'Custom routines']
    },
    {
      id: 4,
      userId: 4,
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      plan: 'Pro Monthly',
      status: 'trial',
      amount: 29.99,
      billingCycle: 'monthly',
      startDate: '2024-01-18',
      nextBillingDate: '2024-01-25',
      totalPaid: 0,
      paymentMethod: 'card_****9012',
      autoRenew: true,
      features: ['Unlimited AI interactions', 'Advanced analytics', 'Priority support']
    }
  ],
  revenueData: [
    { date: '2024-01-01', revenue: 1200, subscriptions: 45, churn: 2 },
    { date: '2024-01-02', revenue: 1250, subscriptions: 47, churn: 1 },
    { date: '2024-01-03', revenue: 1300, subscriptions: 49, churn: 3 },
    { date: '2024-01-04', revenue: 1350, subscriptions: 51, churn: 1 },
    { date: '2024-01-05', revenue: 1400, subscriptions: 53, churn: 2 },
    { date: '2024-01-06', revenue: 1420, subscriptions: 54, churn: 1 },
    { date: '2024-01-07', revenue: 1258, subscriptions: 48, churn: 4 }
  ],
  planAnalytics: {
    'Pro Monthly': { count: 234, revenue: 7016.66, churnRate: 4.8 },
    'Pro Yearly': { count: 122, revenue: 36599.78, churnRate: 2.1 },
    'Free': { count: 100, revenue: 0, churnRate: 8.5 }
  }
};

const BillingAnalytics: React.FC = () => {
  const [activeNav, setActiveNav] = useState('billing-analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<typeof dummyBillingData.subscriptions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status', type: 'status' as const },
    { value: 'active', label: 'Active', type: 'status' as const },
    { value: 'trial', label: 'Trial', type: 'status' as const },
    { value: 'inactive', label: 'Inactive', type: 'status' as const },
    { value: 'cancelled', label: 'Cancelled', type: 'status' as const }
  ];

  const planOptions = [
    { value: 'all', label: 'All Plans', type: 'plan' as const },
    { value: 'Pro Monthly', label: 'Pro Monthly', type: 'plan' as const },
    { value: 'Pro Yearly', label: 'Pro Yearly', type: 'plan' as const },
    { value: 'Free', label: 'Free', type: 'plan' as const }
  ];

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return dummyBillingData.subscriptions.filter(subscription => {
      const matchesSearch = subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subscription.plan.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus;
      const matchesPlan = filterPlan === 'all' || subscription.plan === filterPlan;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [searchTerm, filterStatus, filterPlan]);

  const handleViewSubscription = (subscription: typeof dummyBillingData.subscriptions[0]) => {
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
      inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Inactive' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
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

  // Prepare KPI data
  const kpiData = useMemo(() => {
    const { overview } = dummyBillingData;
    
    return [
      {
        title: 'Total Revenue',
        value: `$${overview.totalRevenue.toLocaleString()}`,
        icon: FiDollarSign,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      {
        title: 'Monthly Recurring Revenue',
        value: `$${overview.monthlyRecurringRevenue.toLocaleString()}`,
        icon: FiTrendingUp,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Active Subscriptions',
        value: String(overview.activeSubscriptions),
        icon: FiCheckCircle,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
      },
      {
        title: 'Churn Rate',
        value: `${overview.churnRate}%`,
        icon: FiTrendingDown,
        iconBg: 'bg-red-50',
        iconColor: 'text-red-600'
      },
      {
        title: 'Average Revenue Per User',
        value: `$${overview.averageRevenuePerUser}`,
        icon: FiUser,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Conversion Rate',
        value: `${overview.conversionRate}%`,
        icon: FiBarChart,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-600'
      }
    ];
  }, []);

  // Prepare chart data
  const chartData = useMemo(() => {
    return dummyBillingData.revenueData.map((item) => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: item.revenue,
      subscriptions: item.subscriptions,
      churn: item.churn
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="Billing & Analytics" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <motion.div variants={itemVariants} className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: FiBarChart },
                  { id: 'subscriptions', label: 'Subscriptions', icon: FiCreditCard },
                  { id: 'analytics', label: 'Analytics', icon: FiPieChart }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-coral-500 text-coral-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* KPI Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {kpiData.map((kpi, index) => (
                    <KPICard
                      key={index}
                      title={kpi.title}
                      value={kpi.value}
                      icon={kpi.icon}
                      iconBg={kpi.iconBg}
                      iconColor={kpi.iconColor}
                    />
                  ))}
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <motion.div variants={itemVariants}>
                    <AnimatedChart
                      data={chartData}
                      type="line"
                      height={350}
                      title="Revenue Trend"
                      subtitle="Daily revenue over time"
                      colors={['#10B981']}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <AnimatedChart
                      data={chartData}
                      type="bar"
                      height={350}
                      title="Subscriptions & Churn"
                      subtitle="Daily subscriptions and churn rate"
                      colors={['#3B82F6', '#EF4444']}
                    />
                  </motion.div>
                </div>

                {/* Plan Analytics */}
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Plan Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(dummyBillingData.planAnalytics).map(([plan, data]) => (
                      <div key={plan} className="text-center p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-medium text-white mb-2">{plan}</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>Subscribers: {data.count}</div>
                          <div>Revenue: ${data.revenue.toLocaleString()}</div>
                          <div>Churn Rate: {data.churnRate}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <>
                {/* Filters */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder="Search subscriptions..."
                      className="w-full sm:w-64"
                    />
                    <FilterDropdown
                      options={statusOptions}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      placeholder="Filter by status"
                      className="w-full sm:w-56"
                    />
                    <FilterDropdown
                      options={planOptions}
                      value={filterPlan}
                      onChange={setFilterPlan}
                      placeholder="Filter by plan"
                      className="w-full sm:w-56"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredSubscriptions.length} subscriptions found
                  </div>
                </motion.div>

                {/* Subscriptions Table */}
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
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
                            Revenue
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
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                      <FiUser className="h-5 w-5 text-blue-400" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{subscription.userName}</div>
                                    <div className="text-sm text-gray-400">{subscription.userEmail}</div>
                                    <div className="text-xs text-gray-500">{subscription.plan}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">${subscription.amount.toFixed(2)}</div>
                                <div className="text-sm text-gray-400">
                                  {getStatusBadge(subscription.status)}
                                </div>
                                <div className="text-xs text-gray-500 capitalize">
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
                                <div className="text-xs text-gray-500">
                                  Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">
                                  ${subscription.totalPaid.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Since {new Date(subscription.startDate).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleViewSubscription(subscription)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleRowExpansion(subscription.id)}
                                  className="text-gray-400 hover:text-gray-300"
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
                                    <div>
                                      <h4 className="font-medium text-white mb-2">Features Included</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {subscription.features.map((feature, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                                          >
                                            {feature}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <h4 className="font-medium text-white mb-2">Billing Details</h4>
                                        <div className="space-y-1 text-sm text-gray-300">
                                          <div>Amount: ${subscription.amount.toFixed(2)}</div>
                                          <div>Cycle: {subscription.billingCycle}</div>
                                          <div>Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}</div>
                                          <div>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white mb-2">Payment Info</h4>
                                        <div className="space-y-1 text-sm text-gray-300">
                                          <div>Method: {subscription.paymentMethod || 'N/A'}</div>
                                          <div>Total Paid: ${subscription.totalPaid.toFixed(2)}</div>
                                          <div>Next Billing: {subscription.nextBillingDate ? 
                                            new Date(subscription.nextBillingDate).toLocaleDateString() : 'N/A'
                                          }</div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white mb-2">User Info</h4>
                                        <div className="space-y-1 text-sm text-gray-300">
                                          <div>Name: {subscription.userName}</div>
                                          <div>Email: {subscription.userEmail}</div>
                                          <div>User ID: {subscription.userId}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <AnimatedChart
                    data={chartData}
                    type="composed"
                    height={450}
                    title="Revenue & Subscription Analytics"
                    subtitle="Comprehensive view of revenue, subscriptions, and churn"
                    colors={['#10B981', '#3B82F6', '#EF4444']}
                  />
                </motion.div>
              </div>
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
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FiCreditCard className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedSubscription.userName}</h3>
                  <p className="text-gray-400">{selectedSubscription.plan}</p>
                  <p className="text-sm text-gray-500">
                    {getStatusBadge(selectedSubscription.status)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${selectedSubscription.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 capitalize">
                  {selectedSubscription.billingCycle}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Subscription Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">Plan:</span> <span className="text-gray-400">{selectedSubscription.plan}</span></div>
                  <div><span className="font-medium text-gray-300">Status:</span> <span className="text-gray-400">{selectedSubscription.status}</span></div>
                  <div><span className="font-medium text-gray-300">Amount:</span> <span className="text-gray-400">${selectedSubscription.amount.toFixed(2)}</span></div>
                  <div><span className="font-medium text-gray-300">Billing Cycle:</span> <span className="text-gray-400">{selectedSubscription.billingCycle}</span></div>
                  <div><span className="font-medium text-gray-300">Auto-renew:</span> <span className="text-gray-400">{selectedSubscription.autoRenew ? 'Yes' : 'No'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Billing Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">Start Date:</span> <span className="text-gray-400">{new Date(selectedSubscription.startDate).toLocaleDateString()}</span></div>
                  <div><span className="font-medium text-gray-300">Next Billing:</span> <span className="text-gray-400">{selectedSubscription.nextBillingDate ? 
                    new Date(selectedSubscription.nextBillingDate).toLocaleDateString() : 'N/A'
                  }</span></div>
                  <div><span className="font-medium text-gray-300">Total Paid:</span> <span className="text-gray-400">${selectedSubscription.totalPaid.toFixed(2)}</span></div>
                  <div><span className="font-medium text-gray-300">Payment Method:</span> <span className="text-gray-400">{selectedSubscription.paymentMethod || 'N/A'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">User Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">Name:</span> <span className="text-gray-400">{selectedSubscription.userName}</span></div>
                  <div><span className="font-medium text-gray-300">Email:</span> <span className="text-gray-400">{selectedSubscription.userEmail}</span></div>
                  <div><span className="font-medium text-gray-300">User ID:</span> <span className="text-gray-400">{selectedSubscription.userId}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Features Included</h4>
                <div className="space-y-1">
                  {selectedSubscription.features.map((feature, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BillingAnalytics;
