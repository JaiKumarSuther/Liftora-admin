'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiDollarSign, 
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiHeart,
  FiTarget
} from 'react-icons/fi';
import Sidebar from '../../components/UI/Sidebar';
import Header from '../../components/UI/Header';
import AnimatedChart from '../../components/UI/AnimatedChart';
import FilterDropdown from '../../components/UI/FilterDropdown';

// Static dummy data
const dummyData = {
  overview: {
    totalUsers: 1247,
    activeUsers: 892,
    totalSubscriptions: 456,
    totalRevenue: 12580,
    totalAIInteractions: 3421,
    totalStreaks: 234,
    totalRoutines: 189,
    engagementRate: 78.5
  },
  recentActivity: {
    newUsers: 23,
    newSubscriptions: 12,
    newAIInteractions: 156,
    newStreaks: 8
  },
  timeSeriesData: [
    { date: '2024-01-01', users: 1200, subscriptions: 450, aiInteractions: 320, revenue: 1200 },
    { date: '2024-01-02', users: 1210, subscriptions: 455, aiInteractions: 340, revenue: 1250 },
    { date: '2024-01-03', users: 1220, subscriptions: 460, aiInteractions: 360, revenue: 1300 },
    { date: '2024-01-04', users: 1230, subscriptions: 465, aiInteractions: 380, revenue: 1350 },
    { date: '2024-01-05', users: 1240, subscriptions: 470, aiInteractions: 400, revenue: 1400 },
    { date: '2024-01-06', users: 1245, subscriptions: 472, aiInteractions: 420, revenue: 1420 },
    { date: '2024-01-07', users: 1247, subscriptions: 456, aiInteractions: 342, revenue: 1258 }
  ]
};

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Filter options
  const periodOptions = [
    { value: '7d', label: 'Last 7 Days', type: 'period' as const },
    { value: '30d', label: 'Last 30 Days', type: 'period' as const },
    { value: '90d', label: 'Last 90 Days', type: 'period' as const },
  ];

  // Prepare KPI data
  const kpiData = useMemo(() => {
    const { overview } = dummyData;
    
    return [
      {
        title: 'Total Users',
        value: String(overview.totalUsers),
        icon: FiUsers,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Active Users',
        value: String(overview.activeUsers),
        icon: FiActivity,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      {
        title: 'Total Subscriptions',
        value: String(overview.totalSubscriptions),
        icon: FiTarget,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Total Revenue',
        value: `$${overview.totalRevenue.toLocaleString()}`,
        icon: FiDollarSign,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
      },
      {
        title: 'AI Interactions',
        value: String(overview.totalAIInteractions),
        icon: FiMessageSquare,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-600'
      },
      {
        title: 'Active Streaks',
        value: String(overview.totalStreaks),
        icon: FiTrendingUp,
        iconBg: 'bg-pink-50',
        iconColor: 'text-pink-600'
      },
      {
        title: 'Active Routines',
        value: String(overview.totalRoutines),
        icon: FiCalendar,
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
      },
      {
        title: 'Engagement Rate',
        value: `${overview.engagementRate}%`,
        icon: FiHeart,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-600'
      }
    ];
  }, []);

  // Prepare chart data
  const chartData = useMemo(() => {
    return dummyData.timeSeriesData.map((item) => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: item.users,
      subscriptions: item.subscriptions,
      aiInteractions: item.aiInteractions,
      revenue: item.revenue
    }));
  }, []);

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
        <Header title="Liftora Dashboard Overview" />

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-visible bg-gray-900">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-visible"
          >
            {/* Filters */}
            <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3">
                <FilterDropdown
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  placeholder="Select Period"
                  className="w-full sm:w-48"
                />
              </div>
              <div className="text-sm text-gray-500">
                Showing data for {periodOptions.find(p => p.value === selectedPeriod)?.label.toLowerCase()}
              </div>
            </motion.div>

            {/* KPI Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiData.map((kpi, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-coral-500/20">
                      <kpi.icon className="w-6 h-6 text-coral-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Charts Grid */}
            <div className="space-y-8 overflow-visible">
              {/* Overview Chart */}
              <motion.div variants={itemVariants} className="overflow-visible">
                <AnimatedChart
                  data={chartData}
                  type="composed"
                  height={450}
                  title="Platform Overview"
                  subtitle="User growth, subscriptions, and AI interactions over time"
                  colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
                />
              </motion.div>

              {/* Revenue Chart */}
              <div className="grid grid-cols-1 gap-6 overflow-visible">
                <motion.div variants={itemVariants} className="overflow-visible">
                  <AnimatedChart
                    data={chartData}
                    type="bar"
                    height={350}
                    title="Revenue & Subscriptions"
                    subtitle="Daily revenue and subscription trends"
                    colors={['#10B981', '#3B82F6']}
                  />
                </motion.div>
              </div>

              {/* Recent Activity Summary */}
              <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
                    <FiUsers className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">
                      {dummyData.recentActivity.newUsers}
                    </div>
                    <div className="text-sm text-gray-400">New Users</div>
                  </div>
                  <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800/30">
                    <FiTarget className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400">
                      {dummyData.recentActivity.newSubscriptions}
                    </div>
                    <div className="text-sm text-gray-400">New Subscriptions</div>
                  </div>
                  <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-800/30">
                    <FiMessageSquare className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-400">
                      {dummyData.recentActivity.newAIInteractions}
                    </div>
                    <div className="text-sm text-gray-400">AI Interactions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
                    <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-400">
                      {dummyData.recentActivity.newStreaks}
                    </div>
                    <div className="text-sm text-gray-400">New Streaks</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;