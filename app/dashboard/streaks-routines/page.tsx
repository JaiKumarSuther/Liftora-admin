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
  const filteredRoutines = routinesData?.data?.filter((routine: UserRoutine) => {
    if (!searchTerm.trim()) return true; // Show all if no search term
    const searchLower = searchTerm.toLowerCase();
    return (
      routine.routine_preference?.toLowerCase().includes(searchLower) ||
      routine.focus_area?.toLowerCase().includes(searchLower) ||
      routine.custom_input?.toLowerCase().includes(searchLower) ||
      routine.user?.name?.toLowerCase().includes(searchLower) ||
      routine.user?.email?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Filter streaks based on search
  const filteredStreaks = Array.isArray(streaksData?.data) 
    ? streaksData.data.filter((streak: UserStreak) => {
        if (!searchTerm.trim()) return true; // Show all if no search term
        const searchLower = searchTerm.toLowerCase();
        return (
          streak.user?.name?.toLowerCase().includes(searchLower) ||
          streak.user?.email?.toLowerCase().includes(searchLower)
        );
      })
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

  // Debug logging
  console.log('Routines Data:', routinesData);
  console.log('Streaks Data:', streaksData);
  console.log('Streaks Loading:', streaksLoading);
  console.log('Streaks Error:', streaksError);
  console.log('Filtered Routines:', filteredRoutines);
  console.log('Filtered Streaks:', filteredStreaks);
  console.log('Search Term:', searchTerm);

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

          {/* Debug Info - Remove this after fixing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h4 className="text-white font-medium mb-2">Debug Info:</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Streaks Loading: {streaksLoading ? 'Yes' : 'No'}</p>
                <p>Streaks Error: {streaksError ? 'Yes' : 'No'}</p>
                <p>Streaks Data Length: {streaksData?.data?.length || 0}</p>
                <p>Filtered Streaks Length: {filteredStreaks.length}</p>
                <p>Search Term: "{searchTerm}"</p>
                {streaksError && (
                  <p className="text-red-400">Error: {JSON.stringify(streaksError)}</p>
                )}
              </div>
            </div>
          )}

          {/* Routines Tab */}
          {activeTab === 'routines' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRoutines.length > 0 ? (
                filteredRoutines.map((routine: UserRoutine) => (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {routine.routine_preference || 'Routine'}
                    </h3>
                    {routine.focus_area && (
                      <p className="text-gray-400 text-sm mb-2">Focus: {routine.focus_area}</p>
                    )}
                    {routine.time_and_duration && (
                      <p className="text-gray-400 text-sm">Time: {routine.time_and_duration}</p>
                    )}
                    {routine.day && (
                      <p className="text-blue-400 text-sm">Day: {routine.day}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <FiUsers className="w-4 h-4" />
                      <span>{routine.user?.name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>Created {formatDate(routine.createdAt)}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {routine.daily_goal_duration || 0} min goal
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
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Routines Found</h3>
                    <p>No routines match your search criteria.</p>
                  </div>
                </div>
              )}
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
                    {filteredStreaks.map((streak: UserStreak) => (
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
                  {filteredStreaks.length === 0 && !streaksLoading && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <FiTarget className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">
                          {streaksError ? 'Error Loading Streaks' : 
                           searchTerm.trim() ? 'No Streaks Found' : 'No Streaks Available'}
                        </h3>
                        <p>
                          {streaksError ? 'Failed to load streaks data. Please try again later.' :
                           searchTerm.trim() ? 'No streaks match your search criteria.' :
                           'There are no streaks recorded yet.'}
                        </p>
                      </div>
                    </div>
                  )}
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
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedRoutine.routine_preference || 'Routine'}
              </h3>
              {selectedRoutine.focus_area && (
                <p className="text-gray-300 mb-2">Focus Area: {selectedRoutine.focus_area}</p>
              )}
              {selectedRoutine.time_and_duration && (
                <p className="text-gray-300 mb-2">Time: {selectedRoutine.time_and_duration}</p>
              )}
              {selectedRoutine.day && (
                <p className="text-blue-400 mb-2">Day: {selectedRoutine.day}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">User</label>
                <p className="text-white">{selectedRoutine.user?.name || 'Unknown User'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{selectedRoutine.user?.email || 'No email'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                <p className="text-white">{formatDate(selectedRoutine.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Goal Duration</label>
                <p className="text-white">{selectedRoutine.daily_goal_duration || 0} minutes</p>
              </div>
            </div>

            {selectedRoutine.custom_input && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Custom Input</label>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-white text-sm">{selectedRoutine.custom_input}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">AI Generated Routine</label>
              <div className="bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
                {selectedRoutine.ai_generated && Object.keys(selectedRoutine.ai_generated).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(selectedRoutine.ai_generated).map(([category, tasks]) => (
                      <div key={category}>
                        <h4 className="text-white font-medium mb-2">{category}</h4>
                        {Array.isArray(tasks) && tasks.length > 0 ? (
                          <ul className="space-y-2">
                            {tasks.map((task, index) => (
                              <li key={index} className="text-gray-300 text-sm">
                                <div className="flex justify-between items-start">
                                  <span>• {task.task}</span>
                                  <span className="text-blue-400 text-xs ml-2">{task.time}</span>
                                </div>
                                {task.details && (
                                  <p className="text-gray-400 text-xs mt-1 ml-4">{task.details}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm">No tasks in this category</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No AI generated content available</p>
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
                <p className="text-white">{selectedStreak.user?.name || 'Unknown User'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{selectedStreak.user?.email || 'No email'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Streak Count</label>
                <div className="flex items-center gap-2">
                  <FiTarget className="w-5 h-5 text-green-500" />
                  <p className="text-white text-2xl font-bold">{selectedStreak.count}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                <p className="text-white">{selectedStreak.user_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                <p className="text-white">{formatDate(selectedStreak.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated</label>
                <p className="text-white">{formatDate(selectedStreak.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}
        </Modal>
    </div>
  );
};

export default StreaksRoutines;