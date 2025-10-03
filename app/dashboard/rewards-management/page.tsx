'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2,
  FiGift,
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import Modal from '../../../components/UI/Modal';
import { 
  useRewardEvents, 
  useCreateRewardEvent, 
  useUpdateRewardEvent, 
  useDeleteRewardEvent 
} from '../../../hooks/useApiQueries';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { RewardEvent } from '../../../types';

const RewardsManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('rewards-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<RewardEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    event_code: '',
    event_name: '',
    event_description: '',
    event_category: '',
    points: 0,
    max_occurrences: null as number | null,
    cooldown_hours: null as number | null,
    is_active: true,
    metadata: ''
  });

  // Fetch reward events
  const { data: eventsData, isLoading, error, refetch } = useRewardEvents();

  const createEventMutation = useCreateRewardEvent();
  const updateEventMutation = useUpdateRewardEvent();
  const deleteEventMutation = useDeleteRewardEvent();

  // Handle form changes
  const handleFormChange = (field: string, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle create event
  const handleCreateEvent = async () => {
    try {
      const data = {
        ...formData,
        max_occurrences: formData.max_occurrences && formData.max_occurrences > 0 ? formData.max_occurrences : undefined,
        cooldown_hours: formData.cooldown_hours && formData.cooldown_hours > 0 ? formData.cooldown_hours : undefined,
        metadata: formData.metadata ? JSON.parse(formData.metadata) : undefined
      };
      await createEventMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      setFormData({
        event_code: '',
        event_name: '',
        event_description: '',
        event_category: '',
        points: 0,
        max_occurrences: null,
        cooldown_hours: null,
        is_active: true,
        metadata: ''
      });
      refetch();
    } catch (error) {
      console.error('Failed to create reward event:', error);
    }
  };

  // Handle edit event
  const handleEditEvent = (event: RewardEvent) => {
    setSelectedEvent(event);
    setFormData({
      event_code: event.event_code,
      event_name: event.event_name,
      event_description: event.event_description || '',
      event_category: event.event_category,
      points: event.points,
      max_occurrences: event.max_occurrences || 0,
      cooldown_hours: event.cooldown_hours || 0,
      is_active: event.is_active,
      metadata: event.metadata ? JSON.stringify(event.metadata, null, 2) : ''
    });
    setIsEditModalOpen(true);
  };

  // Handle update event
  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      const data = {
        ...formData,
        max_occurrences: formData.max_occurrences && formData.max_occurrences > 0 ? formData.max_occurrences : undefined,
        cooldown_hours: formData.cooldown_hours && formData.cooldown_hours > 0 ? formData.cooldown_hours : undefined,
        metadata: formData.metadata ? JSON.parse(formData.metadata) : undefined
      };
      await updateEventMutation.mutateAsync({
        eventId: selectedEvent.id,
        data
      });
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error('Failed to update reward event:', error);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEventMutation.mutateAsync(selectedEvent.id);
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete reward event:', error);
    }
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

  // Get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'streak':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Reward Events</h2>
          <p className="text-gray-400">Failed to load reward events data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const events = eventsData?.data || [];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="flex-1">
        <Header title="Rewards Management" />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Rewards Management</h1>
              <p className="text-gray-400">Manage reward events and point systems</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search reward events..."
            />
          </div>

          {/* Events Table */}
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
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {events.map((event: RewardEvent) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{event.event_name}</div>
                          <div className="text-sm text-gray-400">{event.event_code}</div>
                          {event.event_description && (
                            <div className="text-xs text-gray-500 mt-1">{event.event_description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(event.event_category)}`}>
                          {event.event_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FiGift className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-white">{event.points}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Reward Event"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Code *</label>
              <input
                type="text"
                value={formData.event_code}
                onChange={(e) => handleFormChange('event_code', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., TASK_STREAK_5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Name *</label>
              <input
                type="text"
                value={formData.event_name}
                onChange={(e) => handleFormChange('event_name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Task Master"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.event_description}
              onChange={(e) => handleFormChange('event_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the reward event..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <select
                value={formData.event_category}
                onChange={(e) => handleFormChange('event_category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="task">Task</option>
                <option value="streak">Streak</option>
                <option value="social">Social</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Points *</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => handleFormChange('points', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Occurrences</label>
              <input
                type="number"
                value={formData.max_occurrences || ''}
                onChange={(e) => handleFormChange('max_occurrences', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cooldown (hours)</label>
              <input
                type="number"
                value={formData.cooldown_hours || ''}
                onChange={(e) => handleFormChange('cooldown_hours', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="No cooldown"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Metadata (JSON)</label>
            <textarea
              value={formData.metadata}
              onChange={(e) => handleFormChange('metadata', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='{"period": "daily", "tasks_required": 5}'
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleFormChange('is_active', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateEvent}
              disabled={!formData.event_code || !formData.event_name || !formData.event_category || createEventMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Reward Event"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Code *</label>
              <input
                type="text"
                value={formData.event_code}
                onChange={(e) => handleFormChange('event_code', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Name *</label>
              <input
                type="text"
                value={formData.event_name}
                onChange={(e) => handleFormChange('event_name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.event_description}
              onChange={(e) => handleFormChange('event_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <select
                value={formData.event_category}
                onChange={(e) => handleFormChange('event_category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="task">Task</option>
                <option value="streak">Streak</option>
                <option value="social">Social</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Points *</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => handleFormChange('points', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Occurrences</label>
              <input
                type="number"
                value={formData.max_occurrences || ''}
                onChange={(e) => handleFormChange('max_occurrences', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cooldown (hours)</label>
              <input
                type="number"
                value={formData.cooldown_hours || ''}
                onChange={(e) => handleFormChange('cooldown_hours', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="No cooldown"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Metadata (JSON)</label>
            <textarea
              value={formData.metadata}
              onChange={(e) => handleFormChange('metadata', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active_edit"
              checked={formData.is_active}
              onChange={(e) => handleFormChange('is_active', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="is_active_edit" className="text-sm text-gray-300">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateEvent}
              disabled={!formData.event_code || !formData.event_name || !formData.event_category || updateEventMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateEventMutation.isPending ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Reward Event"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this reward event? This action cannot be undone.
          </p>
          {selectedEvent && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-white font-medium">{selectedEvent.event_name}</div>
              <div className="text-gray-400 text-sm">{selectedEvent.event_code}</div>
              {selectedEvent.event_description && (
                <div className="text-gray-300 text-sm mt-2">{selectedEvent.event_description}</div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deleteEventMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleteEventMutation.isPending ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RewardsManagement;
