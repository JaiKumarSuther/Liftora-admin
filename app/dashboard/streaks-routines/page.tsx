'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTarget,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiEye,
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import Modal from '../../../components/UI/Modal';
import { useAllRoutines, useAllUserStreaks } from '../../../hooks/useApiQueries';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { UserRoutine, UserStreak } from '../../../types';

const StreaksRoutines: React.FC = () => {
  const [activeNav, setActiveNav] = useState('streaks-routines');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'routines' | 'streaks'>('routines');
  const [selectedRoutine, setSelectedRoutine] = useState<UserRoutine | null>(null);
  const [selectedStreak, setSelectedStreak] = useState<UserStreak | null>(null);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  // Fetch data
  const { data: routinesData, isLoading: routinesLoading, error: routinesError } = useAllRoutines();
  const { data: streaksData, isLoading: streaksLoading, error: streaksError } = useAllUserStreaks();

  // Handle view routine
  const handleViewRoutine = (routine: UserRoutine) => {
    setSelectedRoutine(routine);
    setIsRoutineModalOpen(true);
  };

  // Handle view streak
  const handleViewStreak = (streak: UserStreak) => {
    setSelectedStreak(streak);
    setIsStreakModalOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter routines based on search
  const filteredRoutines = routinesData?.data?.filter((routine: UserRoutine) =>
    routine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    routine.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter streaks based on search
  const filteredStreaks = Array.isArray(streaksData?.data) 
    ? streaksData.data.filter((streak: { user?: { name?: string; email?: string } }) =>
        streak.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        streak.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Loading state
  if (routinesLoading || streaksLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (routinesError || streaksError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Data</h2>
          <p className="text-gray-400">Failed to load routines and streaks data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const routines = routinesData?.data || [];
  const streaks = Array.isArray(streaksData?.data) ? streaksData.data : [];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="flex-1">
        <Header title="Streaks & Routines" />

        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Streaks & Routines</h1>
            <p className="text-gray-400">Monitor user streaks and routines</p>
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
                  <p className="text-gray-400 text-sm">Total Routines</p>
                  <p className="text-2xl font-bold text-white">{routines.length}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-blue-500" />
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
                  <p className="text-gray-400 text-sm">Total Streaks</p>
                  <p className="text-2xl font-bold text-white">{streaks.length}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FiTarget className="w-6 h-6 text-green-500" />
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
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(streaks.map((s: { user_id: number }) => s.user_id)).size}
                  </p>
                                    </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FiUsers className="w-6 h-6 text-purple-500" />
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
                  <p className="text-gray-400 text-sm">Avg Streak</p>
                  <p className="text-2xl font-bold text-white">
                    {streaks.length > 0 
                      ? Math.round(streaks.reduce((sum: number, s: { count: number }) => sum + s.count, 0) / streaks.length)
                      : 0
                    }
                  </p>
                                    </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <FiTrendingUp className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    </div>
            </motion.div>
                                    </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
                                  <button
                onClick={() => setActiveTab('routines')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'routines'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Routines ({routines.length})
                                  </button>
                                <button
                onClick={() => setActiveTab('streaks')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'streaks'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Streaks ({streaks.length})
                                </button>
                                          </div>
                                        </div>

          {/* Search */}
          <div className="mb-8">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
              placeholder={`Search ${activeTab}...`}
            />
          </div>

          {/* Routines Tab */}
          {activeTab === 'routines' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRoutines.map((routine: UserRoutine) => (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{routine.name || 'Unnamed Routine'}</h3>
                    {routine.description && (
                      <p className="text-gray-400 text-sm">{routine.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>Created {formatDate(routine.createdAt)}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {routine.tasks?.length || 0} tasks
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewRoutine(routine)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Streaks Tab */}
          {activeTab === 'streaks' && (
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
                        Streak Count
                          </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Created
                          </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Last Updated
                          </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredStreaks.map((streak: { id: number; user_id: number; count: number; createdAt: string; updatedAt: string; user?: { name?: string; email?: string } }) => (
                      <motion.tr
                        key={streak.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-750 transition-colors"
                      >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {streak.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {streak.user?.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-400">
                                {streak.user?.email || 'No email'}
                              </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FiTarget className="w-4 h-4 text-green-500" />
                            <span className="text-lg font-semibold text-white">{streak.count}</span>
                                    </div>
                              </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(streak.createdAt)}
                              </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(streak.updatedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                            onClick={() => handleViewStreak(streak)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                              </td>
                      </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
            )}
        </main>
      </div>

      {/* Routine Details Modal */}
        <Modal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        title="Routine Details"
      >
        {selectedRoutine && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{selectedRoutine.name || 'Unnamed Routine'}</h3>
              {selectedRoutine.description && (
                <p className="text-gray-300 mb-4">{selectedRoutine.description}</p>
                  )}
                </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                <p className="text-white">{formatDate(selectedRoutine.createdAt)}</p>
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated</label>
                <p className="text-white">{formatDate(selectedRoutine.updatedAt)}</p>
              </div>
                  </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tasks</label>
              <div className="bg-gray-700 p-4 rounded-lg">
                {selectedRoutine.tasks && selectedRoutine.tasks.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedRoutine.tasks.map((task: { id: number; title: string; description?: string; completed: boolean }, index: number) => (
                      <li key={index} className="text-white text-sm">
                        • {task.title || `Task ${index + 1}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No tasks defined</p>
                )}
              </div>
            </div>
                    </div>
        )}
      </Modal>

      {/* Streak Details Modal */}
      <Modal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        title="Streak Details"
      >
        {selectedStreak && (
          <div className="space-y-4">
                  <div>
              <h3 className="text-xl font-semibold text-white mb-2">User Streak</h3>
                  </div>

            <div className="grid grid-cols-2 gap-4">
                  <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">User</label>
                <p className="text-white">{(selectedStreak as { user?: { name?: string } }).user?.name || 'Unknown User'}</p>
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{(selectedStreak as { user?: { email?: string } }).user?.email || 'No email'}</p>
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Streak Count</label>
                <p className="text-white text-2xl font-bold">{selectedStreak.count}</p>
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                <p className="text-white">{formatDate(selectedStreak.createdAt)}</p>
                  </div>
            </div>
          </div>
        )}
        </Modal>
    </div>
  );
};

export default StreaksRoutines;