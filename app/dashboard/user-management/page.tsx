'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import Modal from '../../../components/UI/Modal';

// Static dummy data for users
const dummyUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15',
    lastActive: '2024-01-20',
    subscription: 'Pro Monthly',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2024-02-15',
    totalSpent: 29.99,
    aiInteractions: 45,
    currentStreak: 12,
    totalRoutines: 3,
    profile: {
      age: 28,
      goals: ['Weight Loss', 'Muscle Building'],
      preferences: ['Morning Workouts', 'Cardio'],
      onboardingCompleted: true,
      profileImage: '/assets/default-avatar.png'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2024-01-10',
    lastActive: '2024-01-19',
    subscription: 'Free',
    subscriptionStatus: 'inactive',
    subscriptionExpiry: null,
    totalSpent: 0,
    aiInteractions: 12,
    currentStreak: 3,
    totalRoutines: 1,
    profile: {
      age: 32,
      goals: ['General Fitness'],
      preferences: ['Evening Workouts'],
      onboardingCompleted: true,
      profileImage: '/assets/default-avatar.png'
    }
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 345-6789',
    joinDate: '2024-01-05',
    lastActive: '2024-01-21',
    subscription: 'Pro Yearly',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2025-01-05',
    totalSpent: 299.99,
    aiInteractions: 89,
    currentStreak: 25,
    totalRoutines: 5,
    profile: {
      age: 35,
      goals: ['Strength Training', 'Endurance'],
      preferences: ['Morning Workouts', 'HIIT'],
      onboardingCompleted: true,
      profileImage: '/assets/default-avatar.png'
    }
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2024-01-18',
    lastActive: '2024-01-20',
    subscription: 'Pro Monthly',
    subscriptionStatus: 'trial',
    subscriptionExpiry: '2024-01-25',
    totalSpent: 0,
    aiInteractions: 23,
    currentStreak: 5,
    totalRoutines: 2,
    profile: {
      age: 29,
      goals: ['Weight Loss'],
      preferences: ['Yoga', 'Pilates'],
      onboardingCompleted: false,
      profileImage: '/assets/default-avatar.png'
    }
  }
];

const UserManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('user-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof dummyUsers[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Users', type: 'status' as const },
    { value: 'active', label: 'Active Subscriptions', type: 'status' as const },
    { value: 'trial', label: 'Trial Users', type: 'status' as const },
    { value: 'inactive', label: 'Free Users', type: 'status' as const }
  ];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return dummyUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || user.subscriptionStatus === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleViewUser = (user: typeof dummyUsers[0]) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const toggleRowExpansion = (userId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
      trial: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Trial' },
      inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Free' }
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

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="User Management" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search users..."
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
                {filteredUsers.length} users found
              </div>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Activity
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
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={user.profile.profileImage}
                                  alt={user.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{user.subscription}</div>
                            <div className="text-sm text-gray-400">
                              {getStatusBadge(user.subscriptionStatus)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {user.aiInteractions} AI interactions
                            </div>
                            <div className="text-sm text-gray-400">
                              {user.currentStreak} day streak
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              ${user.totalSpent.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user.subscriptionExpiry ? `Expires ${user.subscriptionExpiry}` : 'No expiry'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button className="text-green-400 hover:text-green-300">
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleRowExpansion(user.id)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              {expandedRows.has(user.id) ? (
                                <FiChevronUp className="w-4 h-4" />
                              ) : (
                                <FiChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(user.id) && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-700">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                  <h4 className="font-medium text-white mb-2">Profile Details</h4>
                                  <div className="space-y-1 text-sm text-gray-300">
                                    <div>Age: {user.profile.age}</div>
                                    <div>Goals: {user.profile.goals.join(', ')}</div>
                                    <div>Preferences: {user.profile.preferences.join(', ')}</div>
                                    <div>Onboarding: {user.profile.onboardingCompleted ? 'Completed' : 'Pending'}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white mb-2">Activity Stats</h4>
                                  <div className="space-y-1 text-sm text-gray-300">
                                    <div>AI Interactions: {user.aiInteractions}</div>
                                    <div>Current Streak: {user.currentStreak} days</div>
                                    <div>Total Routines: {user.totalRoutines}</div>
                                    <div>Last Active: {user.lastActive}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white mb-2">Subscription Info</h4>
                                  <div className="space-y-1 text-sm text-gray-300">
                                    <div>Plan: {user.subscription}</div>
                                    <div>Status: {user.subscriptionStatus}</div>
                                    <div>Total Spent: ${user.totalSpent.toFixed(2)}</div>
                                    <div>Join Date: {user.joinDate}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white mb-2">Contact Info</h4>
                                  <div className="space-y-1 text-sm text-gray-300">
                                    <div className="flex items-center">
                                      <FiMail className="w-4 h-4 mr-2" />
                                      {user.email}
                                    </div>
                                    <div className="flex items-center">
                                      <FiPhone className="w-4 h-4 mr-2" />
                                      {user.phone}
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
          </motion.div>
        </main>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`User Profile - ${selectedUser.name}`}
        >
          <div className="space-y-6">
            {/* User Basic Info */}
            <div className="flex items-center space-x-4">
              <img
                className="h-16 w-16 rounded-full"
                src={selectedUser.profile.profileImage}
                alt={selectedUser.name}
              />
              <div>
                <h3 className="text-lg font-medium text-white">{selectedUser.name}</h3>
                <p className="text-gray-400">{selectedUser.email}</p>
                <p className="text-gray-400">{selectedUser.phone}</p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Profile Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">Age:</span> <span className="text-gray-400">{selectedUser.profile.age}</span></div>
                  <div><span className="font-medium text-gray-300">Goals:</span> <span className="text-gray-400">{selectedUser.profile.goals.join(', ')}</span></div>
                  <div><span className="font-medium text-gray-300">Preferences:</span> <span className="text-gray-400">{selectedUser.profile.preferences.join(', ')}</span></div>
                  <div><span className="font-medium text-gray-300">Onboarding:</span> <span className="text-gray-400">{selectedUser.profile.onboardingCompleted ? 'Completed' : 'Pending'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Subscription Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">Plan:</span> <span className="text-gray-400">{selectedUser.subscription}</span></div>
                  <div><span className="font-medium text-gray-300">Status:</span> {getStatusBadge(selectedUser.subscriptionStatus)}</div>
                  <div><span className="font-medium text-gray-300">Total Spent:</span> <span className="text-gray-400">${selectedUser.totalSpent.toFixed(2)}</span></div>
                  <div><span className="font-medium text-gray-300">Expiry:</span> <span className="text-gray-400">{selectedUser.subscriptionExpiry || 'N/A'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Activity Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">AI Interactions:</span> <span className="text-gray-400">{selectedUser.aiInteractions}</span></div>
                  <div><span className="font-medium text-gray-300">Current Streak:</span> <span className="text-gray-400">{selectedUser.currentStreak} days</span></div>
                  <div><span className="font-medium text-gray-300">Total Routines:</span> <span className="text-gray-400">{selectedUser.totalRoutines}</span></div>
                  <div><span className="font-medium text-gray-300">Last Active:</span> <span className="text-gray-400">{selectedUser.lastActive}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Account Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-300">Join Date:</span> <span className="text-gray-400">{selectedUser.joinDate}</span></div>
                  <div><span className="font-medium text-gray-300">Last Active:</span> <span className="text-gray-400">{selectedUser.lastActive}</span></div>
                  <div><span className="font-medium text-gray-300">Email:</span> <span className="text-gray-400">{selectedUser.email}</span></div>
                  <div><span className="font-medium text-gray-300">Phone:</span> <span className="text-gray-400">{selectedUser.phone}</span></div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;