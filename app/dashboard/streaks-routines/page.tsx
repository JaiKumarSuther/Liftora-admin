'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, 
  FiEye, 
  FiUser,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiPlay,
  FiPause,
  FiChevronDown,
  FiChevronUp,
  FiBarChart,
  FiAward
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import Modal from '../../../components/UI/Modal';
import AnimatedChart from '../../../components/UI/AnimatedChart';
import KPICard from '../../../components/UI/KPICard';

// Static dummy data for streaks and routines
const dummyStreaksData = {
  overview: {
    totalStreaks: 234,
    activeStreaks: 189,
    completedStreaks: 45,
    averageStreakLength: 12.5,
    longestStreak: 45,
    totalRoutines: 156,
    activeRoutines: 134,
    completedRoutines: 22
  },
  streaks: [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      streakType: 'Workout',
      currentStreak: 12,
      longestStreak: 25,
      startDate: '2024-01-08',
      lastActivity: '2024-01-20',
      status: 'active',
      goal: 'Daily workout for 30 days',
      progress: 40,
      nextMilestone: 15,
      rewards: ['Badge: Week Warrior', 'Points: 120'],
      motivation: 'Keep going! You\'re doing great!'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      streakType: 'Meditation',
      currentStreak: 5,
      longestStreak: 18,
      startDate: '2024-01-16',
      lastActivity: '2024-01-20',
      status: 'active',
      goal: 'Daily meditation for 21 days',
      progress: 24,
      nextMilestone: 7,
      rewards: ['Badge: Mindful Beginner', 'Points: 50'],
      motivation: 'Great start! Consistency is key.'
    },
    {
      id: 3,
      userId: 3,
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      streakType: 'Reading',
      currentStreak: 0,
      longestStreak: 30,
      startDate: '2024-01-01',
      lastActivity: '2024-01-15',
      status: 'broken',
      goal: 'Read 30 minutes daily',
      progress: 50,
      nextMilestone: 5,
      rewards: ['Badge: Bookworm', 'Points: 200'],
      motivation: 'Don\'t give up! Start again today.'
    }
  ],
  routines: [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      routineName: 'Morning Workout',
      description: '30-minute morning exercise routine',
      frequency: 'daily',
      duration: 30,
      difficulty: 'intermediate',
      status: 'active',
      completionRate: 85,
      totalSessions: 17,
      completedSessions: 14,
      lastCompleted: '2024-01-20',
      nextScheduled: '2024-01-21',
      exercises: ['Push-ups', 'Squats', 'Planks', 'Burpees'],
      timeOfDay: 'morning',
      reminders: true
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      routineName: 'Evening Yoga',
      description: 'Relaxing yoga session before bed',
      frequency: 'daily',
      duration: 20,
      difficulty: 'beginner',
      status: 'active',
      completionRate: 90,
      totalSessions: 10,
      completedSessions: 9,
      lastCompleted: '2024-01-19',
      nextScheduled: '2024-01-20',
      exercises: ['Sun Salutation', 'Warrior Poses', 'Child\'s Pose', 'Savasana'],
      timeOfDay: 'evening',
      reminders: true
    },
    {
      id: 3,
      userId: 3,
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      routineName: 'Strength Training',
      description: 'Full body strength workout',
      frequency: '3x per week',
      duration: 45,
      difficulty: 'advanced',
      status: 'paused',
      completionRate: 60,
      totalSessions: 12,
      completedSessions: 7,
      lastCompleted: '2024-01-15',
      nextScheduled: null,
      exercises: ['Deadlifts', 'Bench Press', 'Squats', 'Pull-ups'],
      timeOfDay: 'afternoon',
      reminders: false
    }
  ],
  analytics: {
    streakTrends: [
      { date: '2024-01-14', activeStreaks: 180, newStreaks: 12, brokenStreaks: 8 },
      { date: '2024-01-15', activeStreaks: 184, newStreaks: 15, brokenStreaks: 11 },
      { date: '2024-01-16', activeStreaks: 188, newStreaks: 18, brokenStreaks: 14 },
      { date: '2024-01-17', activeStreaks: 192, newStreaks: 20, brokenStreaks: 16 },
      { date: '2024-01-18', activeStreaks: 196, newStreaks: 22, brokenStreaks: 18 },
      { date: '2024-01-19', activeStreaks: 200, newStreaks: 25, brokenStreaks: 21 },
      { date: '2024-01-20', activeStreaks: 189, newStreaks: 15, brokenStreaks: 26 }
    ],
    routineCompletion: [
      { routine: 'Morning Workout', completion: 85, participants: 45 },
      { routine: 'Evening Yoga', completion: 90, participants: 32 },
      { routine: 'Strength Training', completion: 60, participants: 28 },
      { routine: 'Cardio Blast', completion: 75, participants: 38 }
    ]
  }
};

const StreaksRoutines: React.FC = () => {
  const [activeNav, setActiveNav] = useState('streaks-routines');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<typeof dummyStreaksData.streaks[0] | typeof dummyStreaksData.routines[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');


  const statusOptions = [
    { value: 'all', label: 'All Status', type: 'status' as const },
    { value: 'active', label: 'Active', type: 'status' as const },
    { value: 'paused', label: 'Paused', type: 'status' as const },
    { value: 'broken', label: 'Broken', type: 'status' as const },
    { value: 'completed', label: 'Completed', type: 'status' as const }
  ];

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    if (activeTab === 'streaks') {
      return dummyStreaksData.streaks.filter(item => {
        const matchesSearch = item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.streakType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'routines') {
      return dummyStreaksData.routines.filter(item => {
        const matchesSearch = item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.routineName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    }
    return [];
  }, [activeTab, searchTerm, filterStatus]);

  // Type guards
  const isStreak = (item: typeof dummyStreaksData.streaks[0] | typeof dummyStreaksData.routines[0]): item is typeof dummyStreaksData.streaks[0] => {
    return 'streakType' in item;
  };

  const handleViewItem = (item: typeof dummyStreaksData.streaks[0] | typeof dummyStreaksData.routines[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const toggleRowExpansion = (itemId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
      paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Paused' },
      broken: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Broken' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Completed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      beginner: { bg: 'bg-green-500/20', text: 'text-green-400' },
      intermediate: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
      advanced: { bg: 'bg-red-500/20', text: 'text-red-400' }
    };
    
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {difficulty}
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
    const { overview } = dummyStreaksData;
    
    return [
      {
        title: 'Total Streaks',
        value: String(overview.totalStreaks),
        icon: FiActivity,
        iconBg: 'bg-coral-500/20',
        iconColor: 'text-coral-400'
      },
      {
        title: 'Active Streaks',
        value: String(overview.activeStreaks),
        icon: FiTrendingUp,
        iconBg: 'bg-coral-500/20',
        iconColor: 'text-coral-400'
      },
      {
        title: 'Total Routines',
        value: String(overview.totalRoutines),
        icon: FiTarget,
        iconBg: 'bg-coral-500/20',
        iconColor: 'text-coral-400'
      },
      {
        title: 'Active Routines',
        value: String(overview.activeRoutines),
        icon: FiPlay,
        iconBg: 'bg-coral-500/20',
        iconColor: 'text-coral-400'
      },
      {
        title: 'Avg Streak Length',
        value: `${overview.averageStreakLength} days`,
        icon: FiClock,
        iconBg: 'bg-coral-500/20',
        iconColor: 'text-coral-400'
      },
      {
        title: 'Longest Streak',
        value: `${overview.longestStreak} days`,
        icon: FiAward,
        iconBg: 'bg-coral-500/20',
        iconColor: 'text-coral-400'
      }
    ];
  }, []);

  // Prepare chart data
  const chartData = useMemo(() => {
    return dummyStreaksData.analytics.streakTrends.map((item) => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      activeStreaks: item.activeStreaks,
      newStreaks: item.newStreaks,
      brokenStreaks: item.brokenStreaks
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="Streaks & Routines" />

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
                  { id: 'streaks', label: 'Streaks', icon: FiActivity },
                  { id: 'routines', label: 'Routines', icon: FiTarget }
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
                      title="Streak Trends"
                      subtitle="Daily streak activity over time"
                      colors={['#3B82F6', '#10B981', '#EF4444']}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <AnimatedChart
                      data={dummyStreaksData.analytics.routineCompletion.map(item => ({
                        name: item.routine,
                        completion: item.completion,
                        participants: item.participants
                      }))}
                      type="bar"
                      height={350}
                      title="Routine Completion Rates"
                      subtitle="Completion rates by routine type"
                      colors={['#8B5CF6']}
                    />
                  </motion.div>
                </div>
              </>
            )}

            {/* Streaks Tab */}
            {selectedItem && isStreak(selectedItem) && (
              <>
                {/* Filters */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder="Search streaks..."
                      className="w-full sm:w-64"
                    />
                    <FilterDropdown
                      options={statusOptions}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      placeholder="Filter by status"
                      className="w-full sm:w-56"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredData.length} streaks found
                  </div>
                </motion.div>

                {/* Streaks Table */}
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            User & Streak
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status & Goal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Rewards
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
                        {filteredData.map((item) => (
                          <React.Fragment key={item.id}>
                            <tr className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                      <FiUser className="h-5 w-5 text-blue-400" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{item.userName}</div>
                                    <div className="text-sm text-gray-400">{item.userEmail}</div>
                                    <div className="text-xs text-gray-400">{isStreak(item) ? item.streakType : item.routineName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isStreak(item) ? (
                                  <>
                                    <div className="text-sm text-white">
                                      {item.currentStreak} days
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Best: {item.longestStreak} days
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                                      <div 
                                        className="bg-blue-400 h-2 rounded-full" 
                                        style={{ width: `${item.progress}%` }}
                                      ></div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm text-white">
                                      {item.completedSessions}/{item.totalSessions} sessions
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {item.completionRate}% completion
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                                      <div 
                                        className="bg-purple-400 h-2 rounded-full" 
                                        style={{ width: `${item.completionRate}%` }}
                                      ></div>
                                    </div>
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isStreak(item) ? (
                                  <>
                                    <div className="text-sm text-white">{item.goal}</div>
                                    <div className="text-sm text-gray-400">
                                      {getStatusBadge(item.status)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Next: {item.nextMilestone} days
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm text-white">{item.description}</div>
                                    <div className="text-sm text-gray-400">
                                      {getDifficultyBadge(item.difficulty)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {item.duration} min • {item.frequency}
                                    </div>
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isStreak(item) ? (
                                  <div className="space-y-1">
                                    {item.rewards.map((reward: string, index: number) => (
                                      <div key={index} className="text-xs text-gray-400">
                                        {reward}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-white">
                                    {item.nextScheduled ? 
                                      new Date(item.nextScheduled).toLocaleDateString() : 
                                      'Not scheduled'
                                    }
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewItem(item)}
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-400 hover:text-green-300">
                                    <FiPlay className="w-4 h-4" />
                                  </button>
                                  <button className="text-yellow-400 hover:text-yellow-300">
                                    <FiPause className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleRowExpansion(item.id)}
                                  className="text-gray-400 hover:text-gray-300"
                                >
                                  {expandedRows.has(item.id) ? (
                                    <FiChevronUp className="w-4 h-4" />
                                  ) : (
                                    <FiChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                            {expandedRows.has(item.id) && (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 bg-gray-700">
                                  <div className="space-y-4">
                                    {isStreak(item) ? (
                                      <>
                                        <div>
                                          <h4 className="font-medium text-white mb-2">Streak Details</h4>
                                          <p className="text-sm text-gray-300">{item.motivation}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Timeline</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Start Date: {new Date(item.startDate).toLocaleDateString()}</div>
                                              <div>Last Activity: {new Date(item.lastActivity).toLocaleDateString()}</div>
                                              <div>Current Streak: {item.currentStreak} days</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Progress</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Progress: {item.progress}%</div>
                                              <div>Next Milestone: {item.nextMilestone} days</div>
                                              <div>Longest Streak: {item.longestStreak} days</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Rewards</h4>
                                            <div className="space-y-1">
                                              {item.rewards.map((reward: string, index: number) => (
                                                <div key={index} className="text-sm text-gray-300 flex items-center">
                                                  <FiAward className="w-4 h-4 text-yellow-400 mr-2" />
                                                  {reward}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          <h4 className="font-medium text-white mb-2">Exercises Included</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {item.exercises.map((exercise: string, index: number) => (
                                              <span
                                                key={index}
                                                className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                                              >
                                                {exercise}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Routine Details</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Duration: {item.duration} minutes</div>
                                              <div>Frequency: {item.frequency}</div>
                                              <div>Difficulty: {item.difficulty}</div>
                                              <div>Time: {item.timeOfDay}</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Progress Stats</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Completed: {item.completedSessions}</div>
                                              <div>Total: {item.totalSessions}</div>
                                              <div>Rate: {item.completionRate}%</div>
                                              <div>Last: {item.lastCompleted ? 
                                                new Date(item.lastCompleted).toLocaleDateString() : 'Never'
                                              }</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Settings</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Status: {item.status}</div>
                                              <div>Reminders: {item.reminders ? 'Enabled' : 'Disabled'}</div>
                                              <div>Next: {item.nextScheduled ? 
                                                new Date(item.nextScheduled).toLocaleDateString() : 'Not scheduled'
                                              }</div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
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
                </motion.div>
              </>
            )}

            {/* Routines Tab */}
            {activeTab === 'routines' && (
              <>
                {/* Filters */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder="Search routines..."
                      className="w-full sm:w-64"
                    />
                    <FilterDropdown
                      options={statusOptions}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      placeholder="Filter by status"
                      className="w-full sm:w-56"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredData.length} routines found
                  </div>
                </motion.div>

                {/* Routines Table - Same table structure as streaks */}
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            User & Routine
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status & Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Schedule
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
                        {filteredData.map((item) => (
                          <React.Fragment key={item.id}>
                            <tr className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className={`h-10 w-10 rounded-full ${isStreak(item) ? 'bg-blue-500/20' : 'bg-purple-500/20'} flex items-center justify-center`}>
                                      {isStreak(item) ? (
                                        <FiUser className="h-5 w-5 text-blue-400" />
                                      ) : (
                                        <FiTarget className="h-5 w-5 text-purple-400" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{item.userName}</div>
                                    <div className="text-sm text-gray-400">{item.userEmail}</div>
                                    <div className="text-xs text-gray-400">{isStreak(item) ? item.streakType : item.routineName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isStreak(item) ? (
                                  <>
                                    <div className="text-sm text-white">
                                      {item.currentStreak} days
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Best: {item.longestStreak} days
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                                      <div 
                                        className="bg-blue-400 h-2 rounded-full" 
                                        style={{ width: `${item.progress}%` }}
                                      ></div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm text-white">
                                      {item.completedSessions}/{item.totalSessions} sessions
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {item.completionRate}% completion
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                                      <div 
                                        className="bg-purple-400 h-2 rounded-full" 
                                        style={{ width: `${item.completionRate}%` }}
                                      ></div>
                                    </div>
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isStreak(item) ? (
                                  <>
                                    <div className="text-sm text-white">{item.goal}</div>
                                    <div className="text-sm text-gray-400">
                                      {getStatusBadge(item.status)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Next: {item.nextMilestone} days
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm text-white">{item.description}</div>
                                    <div className="text-sm text-gray-400">
                                      {getDifficultyBadge(item.difficulty)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {item.duration} min • {item.frequency}
                                    </div>
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isStreak(item) ? (
                                  <div className="space-y-1">
                                    {item.rewards.map((reward: string, index: number) => (
                                      <div key={index} className="text-xs text-gray-400">
                                        {reward}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-sm text-white">
                                      {item.nextScheduled ? 
                                        new Date(item.nextScheduled).toLocaleDateString() : 
                                        'Not scheduled'
                                      }
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {item.timeOfDay}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Reminders: {'reminders' in item ? (item.reminders ? 'On' : 'Off') : 'N/A'}
                                    </div>
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewItem(item)}
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-400 hover:text-green-300">
                                    <FiPlay className="w-4 h-4" />
                                  </button>
                                  <button className="text-yellow-400 hover:text-yellow-300">
                                    <FiPause className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleRowExpansion(item.id)}
                                  className="text-gray-400 hover:text-gray-300"
                                >
                                  {expandedRows.has(item.id) ? (
                                    <FiChevronUp className="w-4 h-4" />
                                  ) : (
                                    <FiChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                            {expandedRows.has(item.id) && (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 bg-gray-700">
                                  <div className="space-y-4">
                                    {isStreak(item) ? (
                                      <>
                                        <div>
                                          <h4 className="font-medium text-white mb-2">Streak Details</h4>
                                          <p className="text-sm text-gray-300">{item.motivation}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Timeline</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Start Date: {new Date(item.startDate).toLocaleDateString()}</div>
                                              <div>Last Activity: {new Date(item.lastActivity).toLocaleDateString()}</div>
                                              <div>Current Streak: {item.currentStreak} days</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Progress</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Progress: {item.progress}%</div>
                                              <div>Next Milestone: {item.nextMilestone} days</div>
                                              <div>Longest Streak: {item.longestStreak} days</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Rewards</h4>
                                            <div className="space-y-1">
                                              {item.rewards.map((reward: string, index: number) => (
                                                <div key={index} className="text-sm text-gray-300 flex items-center">
                                                  <FiAward className="w-4 h-4 text-yellow-400 mr-2" />
                                                  {reward}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          <h4 className="font-medium text-white mb-2">Exercises Included</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {item.exercises.map((exercise: string, index: number) => (
                                              <span
                                                key={index}
                                                className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                                              >
                                                {exercise}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Routine Details</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Duration: {item.duration} minutes</div>
                                              <div>Frequency: {item.frequency}</div>
                                              <div>Difficulty: {item.difficulty}</div>
                                              <div>Time: {item.timeOfDay}</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Progress Stats</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Completed: {item.completedSessions}</div>
                                              <div>Total: {item.totalSessions}</div>
                                              <div>Rate: {item.completionRate}%</div>
                                              <div>Last: {item.lastCompleted ? 
                                                new Date(item.lastCompleted).toLocaleDateString() : 'Never'
                                              }</div>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-white mb-2">Settings</h4>
                                            <div className="space-y-1 text-sm text-gray-300">
                                              <div>Status: {item.status}</div>
                                              <div>Reminders: {item.reminders ? 'Enabled' : 'Disabled'}</div>
                                              <div>Next: {item.nextScheduled ? 
                                                new Date(item.nextScheduled).toLocaleDateString() : 'Not scheduled'
                                              }</div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
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
                </motion.div>
              </>
            )}
          </motion.div>
        </main>
      </div>

      {/* Item Details Modal */}
      {isModalOpen && selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${isStreak(selectedItem) ? 'Streak' : 'Routine'} Details - ${selectedItem.userName}`}
        >
          <div className="space-y-6">
            {/* Item Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  isStreak(selectedItem) ? 'bg-blue-500/20' : 'bg-purple-500/20'
                }`}>
                  {isStreak(selectedItem) ? (
                    <FiActivity className="h-6 w-6 text-blue-400" />
                  ) : (
                    <FiTarget className="h-6 w-6 text-purple-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {isStreak(selectedItem) ? selectedItem.streakType : selectedItem.routineName}
                  </h3>
                  <p className="text-gray-400">{selectedItem.userName}</p>
                  <p className="text-sm text-gray-400">
                    {getStatusBadge(selectedItem.status)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {isStreak(selectedItem) ? (
                  <div className="text-2xl font-bold text-white">
                    {selectedItem.currentStreak} days
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-white">
                    {selectedItem.completionRate}%
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isStreak(selectedItem) ? (
                <>
                  <div>
                    <h4 className="font-medium text-white mb-3">Streak Information</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="font-medium text-gray-200">Type:</span> <span className="text-white">{selectedItem.streakType}</span></div>
                      <div><span className="font-medium text-gray-200">Current Streak:</span> <span className="text-white">{selectedItem.currentStreak} days</span></div>
                      <div><span className="font-medium text-gray-200">Longest Streak:</span> <span className="text-white">{selectedItem.longestStreak} days</span></div>
                      <div><span className="font-medium text-gray-200">Goal:</span> <span className="text-white">{selectedItem.goal}</span></div>
                      <div><span className="font-medium text-gray-200">Progress:</span> <span className="text-white">{selectedItem.progress}%</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="font-medium text-gray-200">Start Date:</span> <span className="text-white">{new Date(selectedItem.startDate).toLocaleDateString()}</span></div>
                      <div><span className="font-medium text-gray-200">Last Activity:</span> <span className="text-white">{new Date(selectedItem.lastActivity).toLocaleDateString()}</span></div>
                      <div><span className="font-medium text-gray-200">Next Milestone:</span> <span className="text-white">{selectedItem.nextMilestone} days</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Rewards</h4>
                    <div className="space-y-1">
                      {selectedItem.rewards.map((reward: string, index: number) => (
                        <div key={index} className="text-sm text-gray-300 flex items-center">
                          <FiAward className="w-4 h-4 text-yellow-400 mr-2" />
                          {reward}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Motivation</h4>
                    <p className="text-sm text-gray-300">{selectedItem.motivation}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-medium text-white mb-3">Routine Information</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="font-medium text-gray-200">Name:</span> <span className="text-white">{selectedItem.routineName}</span></div>
                      <div><span className="font-medium text-gray-200">Description:</span> <span className="text-white">{selectedItem.description}</span></div>
                      <div><span className="font-medium text-gray-200">Duration:</span> <span className="text-white">{selectedItem.duration} minutes</span></div>
                      <div><span className="font-medium text-gray-200">Frequency:</span> <span className="text-white">{selectedItem.frequency}</span></div>
                      <div><span className="font-medium text-gray-200">Difficulty:</span> {getDifficultyBadge(selectedItem.difficulty)}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Progress</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="font-medium text-gray-200">Completed Sessions:</span> <span className="text-white">{selectedItem.completedSessions}</span></div>
                      <div><span className="font-medium text-gray-200">Total Sessions:</span> <span className="text-white">{selectedItem.totalSessions}</span></div>
                      <div><span className="font-medium text-gray-200">Completion Rate:</span> <span className="text-white">{selectedItem.completionRate}%</span></div>
                      <div><span className="font-medium text-gray-200">Last Completed:</span> <span className="text-white">{selectedItem.lastCompleted ? 
                        new Date(selectedItem.lastCompleted).toLocaleDateString() : 'Never'
                      }</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Schedule</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div><span className="font-medium text-gray-200">Time of Day:</span> <span className="text-white">{selectedItem.timeOfDay}</span></div>
                      <div><span className="font-medium text-gray-200">Next Scheduled:</span> <span className="text-white">{selectedItem.nextScheduled ? 
                        new Date(selectedItem.nextScheduled).toLocaleDateString() : 'Not scheduled'
                      }</span></div>
                      <div><span className="font-medium text-gray-200">Reminders:</span> <span className="text-white">{selectedItem.reminders ? 'Enabled' : 'Disabled'}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Exercises</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.exercises.map((exercise: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                        >
                          {exercise}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StreaksRoutines;
