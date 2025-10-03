'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser,
  FiCalendar,
  FiEye
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import Modal from '../../../components/UI/Modal';
import { useUsers } from '../../../hooks/useApiQueries';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { AdminUser } from '../../../types';

const AIInteractions: React.FC = () => {
  const [activeNav, setActiveNav] = useState('ai-interactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users (we'll use this to show users with AI interactions)
  const { data: usersData, isLoading, error } = useUsers({
    page: 1,
    limit: 50
  });

  // Handle view user AI conversations
  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter users based on search
  const filteredUsers = usersData?.data?.filter((user: AdminUser) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading AI Interactions</h2>
          <p className="text-gray-400">Failed to load AI interactions data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const users = usersData?.data || [];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="flex-1">
        <Header title="AI Interactions" />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Interactions</h1>
            <p className="text-gray-400">Monitor user AI conversations and interactions</p>
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
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FiUser className="w-6 h-6 text-blue-500" />
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
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {users.filter((u: AdminUser) => u.subscriptionStatus === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FiUser className="w-6 h-6 text-green-500" />
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
                  <p className="text-gray-400 text-sm">Verified Users</p>
                  <p className="text-2xl font-bold text-white">
                    {users.filter((u: AdminUser) => u.isVerified).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FiUser className="w-6 h-6 text-purple-500" />
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
                  <p className="text-gray-400 text-sm">New This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {users.filter((u: AdminUser) => {
                      const userDate = new Date(u.createdAt);
                      const now = new Date();
                      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search users..."
            />
          </div>

          {/* Users Table */}
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
                      Email
                      </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                      </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Join Date
                      </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Verified
                      </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user: AdminUser) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-750 transition-colors"
                    >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                                </div>
                              </div>
                              <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscriptionStatus === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                          onClick={() => handleViewUser(user)}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              <FiEye className="w-4 h-4" />
                          View AI Conversations
                            </button>
                          </td>
                    </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </motion.div>
        </main>
      </div>

      {/* User AI Conversations Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        title="AI Conversations"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedUser.name}</h3>
              <p className="text-gray-300">{selectedUser.email}</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-center">
                AI conversation details would be loaded here using the getUserAIConversations API.
                This requires the user ID to fetch specific conversation data.
              </p>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    // Here you would call the getUserAIConversations API
                    console.log('Fetch AI conversations for user:', selectedUser.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Load Conversations
                </button>
              </div>
            </div>
          </div>
        )}
        </Modal>
    </div>
  );
};

export default AIInteractions;