'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiDollarSign, 
  FiActivity,
  FiCalendar,
  FiTarget
} from 'react-icons/fi';
import Sidebar from '../../components/UI/Sidebar';
import Header from '../../components/UI/Header';
import AnimatedChart from '../../components/UI/AnimatedChart';
import FilterDropdown from '../../components/UI/FilterDropdown';
import { useStats, useAdvancedAnalytics } from '../../hooks/useApiQueries';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

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

  // Transform API data to dashboard format
  const dashboardData = useMemo(() => {
    if (!statsData?.data) {
      // Return fallback data if API data is not available
      return {
        overview: {
          totalUsers: 0,
          activeUsers: 0,
          totalSubscriptions: 0,
          totalRevenue: 0,
          totalAIInteractions: 0,
          totalStreaks: 0,
          totalRoutines: 0,
          engagementRate: 0
        },
        recentActivity: {
          newUsers: 0,
          newSubscriptions: 0,
          newAIInteractions: 0,
          newStreaks: 0
        },
        timeSeriesData: []
      };
    }

    const stats = statsData.data;
    return {
      overview: {
        totalUsers: stats.users?.total || 0,
        activeUsers: stats.users?.active || 0,
        totalSubscriptions: stats.subscriptions?.total || 0,
        totalRevenue: stats.subscriptions?.revenue?.total || 0,
        totalAIInteractions: stats.content?.totalAIQuotes || 0,
        totalStreaks: 0, // Not available in current API
        totalRoutines: 0, // Not available in current API
        engagementRate: stats.users?.active > 0 ? (stats.users.active / stats.users.total) * 100 : 0
      },
      recentActivity: {
        newUsers: stats.users?.newToday || 0,
        newSubscriptions: stats.subscriptions?.active || 0,
        newAIInteractions: stats.content?.totalAIQuotes || 0,
        newStreaks: 0 // Not available in current API
      },
      timeSeriesData: stats.growth?.dailySignups?.map((item: { date: string; count: number }) => ({
        date: item.date,
        users: item.count,
        subscriptions: 0, // Not available in current API
        aiInteractions: 0, // Not available in current API
        revenue: 0 // Not available in current API
      })) || []
    };
  }, [statsData]);

  // KPI Cards Data
  const kpiCards = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Total Users',
        value: dashboardData.overview.totalUsers.toLocaleString(),
        icon: FiUsers,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500'
      },
      {
        title: 'Active Users',
        value: dashboardData.overview.activeUsers.toLocaleString(),
        icon: FiActivity,
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-500'
      },
      {
        title: 'Total Revenue',
        value: `$${dashboardData.overview.totalRevenue.toLocaleString()}`,
        icon: FiDollarSign,
        iconBg: 'bg-yellow-500/10',
        iconColor: 'text-yellow-500'
      },
      {
        title: 'AI Interactions',
        value: dashboardData.overview.totalAIInteractions.toLocaleString(),
        icon: FiMessageSquare,
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-500'
      },
      {
        title: 'Active Streaks',
        value: dashboardData.overview.totalStreaks.toLocaleString(),
        icon: FiTarget,
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-500'
      },
      {
        title: 'Total Routines',
        value: dashboardData.overview.totalRoutines.toLocaleString(),
        icon: FiCalendar,
        iconBg: 'bg-indigo-500/10',
        iconColor: 'text-indigo-500'
      }
    ];
  }, [dashboardData]);

  // Recent Activity Data
  const recentActivity = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'New Users Today',
        value: dashboardData.recentActivity.newUsers,
        icon: FiUsers,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500'
      },
      {
        title: 'New Subscriptions',
        value: dashboardData.recentActivity.newSubscriptions,
        icon: FiDollarSign,
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-500'
      },
      {
        title: 'AI Interactions',
        value: dashboardData.recentActivity.newAIInteractions,
        icon: FiMessageSquare,
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-500'
      },
      {
        title: 'New Streaks',
        value: dashboardData.recentActivity.newStreaks,
        icon: FiTarget,
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-500'
      }
    ];
  }, [dashboardData]);


  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="flex-1">
        <Header title="Dashboard" />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome to your Liftora admin dashboard</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex gap-4">
              <FilterDropdown
                options={periodOptions}
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                placeholder="Select Period"
              />
            </div>
          </div>

          {/* Loading indicator */}
          {(statsLoading || analyticsLoading) && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" />
                <span className="text-blue-400">Loading dashboard data...</span>
              </div>
            </div>
          )}

          {/* Error indicator */}
          {statsError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400">⚠️ Failed to load some dashboard data. Showing cached or default values.</span>
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {kpiCards.map((kpi) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${kpi.iconBg}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
                <p className="text-gray-400 text-sm">{kpi.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">User Growth</h3>
              <AnimatedChart 
                data={dashboardData?.timeSeriesData || []}
                type="line"
                height={300}
              />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                        <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                      </div>
                      <span className="text-gray-300">{activity.title}</span>
                    </div>
                    <span className="text-white font-semibold">{activity.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Engagement Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Engagement Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {dashboardData?.overview.engagementRate.toFixed(1)}%
                </div>
                <p className="text-gray-400">User Engagement Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {dashboardData?.overview.totalSubscriptions.toLocaleString()}
                </div>
                <p className="text-gray-400">Total Subscriptions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {dashboardData?.overview.totalRevenue.toLocaleString()}
                </div>
                <p className="text-gray-400">Total Revenue ($)</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;