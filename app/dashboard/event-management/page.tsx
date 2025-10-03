'use client';

import React, { useMemo, useState, useCallback } from 'react';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import EventTable from '../../../components/UI/EventTable';
import { EventEntry, BackendHostEvent } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { exportEventsToExcel } from '@/utils/exportUtils';
import { useAuth } from '@/components/context/AuthContext';

const EventManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('event-management');
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();

  const { data: eventsRaw = [], isLoading } = useQuery({
    queryKey: ['host-events'],
    queryFn: async () => {
      console.log('Fetching events from API...');
      const { data } = await api.get('/api/v2/host-event', { params: { page: 1, limit: 50 } });
      console.log('Events fetched:', data?.events?.length || 0, 'events');
      return data?.events || [];
    }
  });

  const data: EventEntry[] = useMemo(() => (
    (eventsRaw || []).map((e: BackendHostEvent) => ({
      id: String(e.id),
      eventName: e.eventName || 'Untitled Event',
      createdById: String(e.userId),
      eventType: e.eventType || 'General',
      description: e.description || 'No description provided',
      location: e.location,
      repeat: e.repeat || 'One-time',
      date: new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: e.time,
      participants: typeof e.number_of_guest === 'number' ? e.number_of_guest : 0,
      status: e.status || 'pending',
    }))
  ), [eventsRaw]);

  const filtered = data.filter(d =>
    d.eventName.toLowerCase().includes(search.toLowerCase()) ||
    d.createdById.toLowerCase().includes(search.toLowerCase()) ||
    d.eventType.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase()) ||
    d.date.toLowerCase().includes(search.toLowerCase())
  );



  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/v2/host-event/${encodeURIComponent(id)}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Event deleted');
      queryClient.invalidateQueries({ queryKey: ['host-events'] });
    },
    onError: () => toast.error('Failed to delete event'),
  });

  const bulkDeleteEvents = useMutation({
    mutationFn: async (eventIds: string[]) => {
      const res = await api.post('/api/v2/host-event/bulk-delete', { eventIds });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Events deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['host-events'] });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete events'
        : 'Failed to delete events';
      toast.error(errorMessage);
    }
  });


  const handleDelete = (id: string) => {
    deleteEvent.mutate(id);
  };

  const handleBulkDelete = async (eventIds: string[]) => {
    bulkDeleteEvents.mutate(eventIds);
  };

  const handleExport = async (selectedEventIds?: string[]) => {
    try {
      await exportEventsToExcel(selectedEventIds);
      toast.success('Events exported successfully');
    } catch {
      toast.error('Failed to export events');
    }
  };

  const handleApprove = useCallback(async (id: string) => {
    console.log('handleApprove called with id:', id);
    try {
      console.log('Making API call to approve event:', id);
      const response = await api.put(`/api/v2/host-event/${encodeURIComponent(id)}/approve`);
      console.log('API call successful:', response.data);
      toast.success('Event approved successfully');
      console.log('Invalidating queries to refetch events...');
      await queryClient.invalidateQueries({ queryKey: ['host-events'] });
      console.log('Events refetched successfully');
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve event');
    }
  }, [queryClient]);

  const handleFlag = useCallback(async (id: string, reason: string, description: string) => {
    console.log('handleFlag called with:', { id, reason, description });
    try {
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      console.log('Making API call to flag event:', id);
      
      // First, create the flag report
      const flagResponse = await api.post('/api/v2/moderation/flags', {
        reporterId: parseInt(user.id), // Use authenticated user's ID
        contentType: 'event',
        contentId: parseInt(id),
        reason,
        description
      });
      console.log('Flag report created:', flagResponse.data);
      
      // Then, update the event status to "flagged"
      const eventResponse = await api.put(`/api/v2/host-event/${encodeURIComponent(id)}/flag`);
      console.log('Event status updated to flagged:', eventResponse.data);
      
      toast.success('Event flagged successfully');
      console.log('Invalidating queries to refetch events...');
      await queryClient.invalidateQueries({ queryKey: ['host-events'] });
      console.log('Events refetched successfully');
    } catch (error) {
      console.error('Flag error:', error);
      toast.error('Failed to flag event');
    }
  }, [queryClient, user]);



  const handleNavChange = (navId: string) => setActiveNav(navId);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      <div className="flex-1 lg:ml-0">
        <Header title="Event Management" />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Page Title - Mobile */}
          <div className="mb-4 sm:mb-6 lg:hidden">
            <h1 className="text-xl font-bold text-gray-900">Event Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and moderate event posts</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="relative w-full sm:max-w-sm md:max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events by name, location, type..."
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{filtered.length}</span>
                <span className="hidden sm:inline">events found</span>
                <span className="sm:hidden">events</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[300px] sm:min-h-[400px] overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
                <LoadingSpinner />
              </div>
            ) : (
              <EventTable 
                events={filtered} 
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
                onExport={handleExport}
                onApprove={handleApprove}
                onFlag={handleFlag}
              />
            )}
          </div>
        </main>
      </div>

    </div>
  );
};

export default EventManagement;


