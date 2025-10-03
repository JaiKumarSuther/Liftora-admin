'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiCreditCard
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import AnimatedChart from '../../../components/UI/AnimatedChart';
import { useStats, useAdvancedAnalytics } from '../../../hooks/useApiQueries';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';

const BillingAnalytics: React.FC = () => {
  const [activeNav, setActiveNav] = useState('billing-analytics');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Calculate date range based on selected period
  const getDateRange = (period: string) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const dateRange = getDateRange(selectedPeriod);

  // Fetch data from APIs
  const { data: statsData, isLoading: statsLoading, error: statsError } = useStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const { isLoading: analyticsLoading } = useAdvancedAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    interval: 'day'
  });

  // Filter options
  const periodOptions = [
    { value: '7d', label: 'Last 7 Days', type: 'period' as const },
    { value: '30d', label: 'Last 30 Days', type: 'period' as const },
    { value: '90d', label: 'Last 90 Days', type: 'period' as const },
  ];

  const statusOptions = [
    { value: '', label: 'All Status', type: 'status' as const },
    { value: 'active', label: 'Active', type: 'status' as const },
    { value: 'cancelled', label: 'Cancelled', type: 'status' as const },
    { value: 'inactive', label: 'Inactive', type: 'status' as const },
  ];

  // Transform API data to billing format
  const billingData = useMemo(() => {
    if (!statsData?.data) return null;

    const stats = statsData.data;
    return {
      overview: {
        totalRevenue: stats.subscriptions.revenue.total,
        totalSubscriptions: stats.subscriptions.total,
        activeSubscriptions: stats.subscriptions.active,
        cancelledSubscriptions: stats.subscriptions.cancelled,
        averageRevenuePerUser: stats.subscriptions.total > 0 
          ? stats.subscriptions.revenue.total / stats.subscriptions.total 
          : 0,
        conversionRate: stats.users.total > 0 
          ? (stats.subscriptions.total / stats.users.total) * 100 
          : 0
      },
      revenueData: stats.subscriptions.revenue.monthlyTrend.map((item: { month: string; revenue: number }) => ({
        month: item.month,
        revenue: item.revenue
      }))
    };
  }, [statsData]);

  // KPI Cards Data
  const kpiCards = useMemo(() => {
    if (!billingData) return [];
    
    return [
      {
        title: 'Total Revenue',
        value: `$${billingData.overview.totalRevenue.toLocaleString()}`,
        icon: FiDollarSign,
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-500',
        change: '+12.5%', // Static for now
        changeType: 'positive' as const
      },
      {
        title: 'Total Subscriptions',
        value: billingData.overview.totalSubscriptions.toLocaleString(),
        icon: FiCreditCard,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
        change: '+8.2%', // Static for now
        changeType: 'positive' as const
      },
      {
        title: 'Active Subscriptions',
        value: billingData.overview.activeSubscriptions.toLocaleString(),
        icon: FiUsers,
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-500',
        change: '+15.3%', // Static for now
        changeType: 'positive' as const
      },
      {
        title: 'Avg Revenue/User',
        value: `$${billingData.overview.averageRevenuePerUser.toFixed(2)}`,
        icon: FiTrendingUp,
        iconBg: 'bg-yellow-500/10',
        iconColor: 'text-yellow-500',
        change: '+5.7%', // Static for now
        changeType: 'positive' as const
      }
    ];
  }, [billingData]);

  // Loading state
  if (statsLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Billing Data</h2>
          <p className="text-gray-400">Failed to load billing analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="flex-1">
        <Header title="Billing & Analytics" />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Billing & Analytics</h1>
            <p className="text-gray-400">Monitor revenue, subscriptions, and billing metrics</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search subscriptions..."
              />
            </div>
            <div className="flex gap-4">
              <FilterDropdown
                options={periodOptions}
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                placeholder="Select Period"
              />
              <FilterDropdown
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by Status"
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${kpi.iconBg}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
                <p className="text-gray-400 text-sm">{kpi.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
              <AnimatedChart 
                data={billingData?.revenueData || []}
                type="line"
                height={300}
              />
            </motion.div>

            {/* Subscription Status Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Subscription Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Active</span>
                  </div>
                  <span className="text-white font-semibold">
                    {billingData?.overview.activeSubscriptions || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Cancelled</span>
                  </div>
                  <span className="text-white font-semibold">
                    {billingData?.overview.cancelledSubscriptions || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Inactive</span>
                  </div>
                  <span className="text-white font-semibold">
                    {(billingData?.overview.totalSubscriptions || 0) - 
                     (billingData?.overview.activeSubscriptions || 0) - 
                     (billingData?.overview.cancelledSubscriptions || 0)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {billingData?.overview.conversionRate.toFixed(1)}%
                </div>
                <p className="text-gray-400">Conversion Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  ${billingData?.overview.averageRevenuePerUser.toFixed(2) || '0.00'}
                </div>
                <p className="text-gray-400">Average Revenue Per User</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {billingData?.overview.totalSubscriptions || 0}
                </div>
                <p className="text-gray-400">Total Subscriptions</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default BillingAnalytics;