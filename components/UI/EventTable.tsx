'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, MapPin, Calendar, Clock, Trash2, Eye, Tag, FileText, CheckCircle, Flag } from 'lucide-react';
import { EventEntry } from '@/types';
import Modal from './Modal';
import Button from './Button';

interface EventTableProps {
  events: EventEntry[];
  onDelete: (id: string) => void;
  onBulkDelete?: (eventIds: string[]) => Promise<void>;
  onExport?: (selectedEventIds?: string[]) => Promise<void>;
  onApprove?: (id: string) => void;
  onFlag?: (id: string, reason: string, description: string) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, onDelete, onBulkDelete, onExport, onApprove, onFlag }) => {
  console.log('EventTable props:', { 
    onApprove: !!onApprove, 
    onFlag: !!onFlag, 
    onDelete: !!onDelete,
    eventsCount: events.length 
  });
  const router = useRouter();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagEventId, setFlagEventId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagDescription, setFlagDescription] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveEventId, setApproveEventId] = useState<string | null>(null);

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === events.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(events.map(e => e.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedRows.size === 0) return;
    
    try {
      const selectedEventIds = Array.from(selectedRows);
      await onBulkDelete(selectedEventIds);
      setSelectedRows(new Set());
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const handleExport = async () => {
    if (!onExport) return;
    
    try {
      const selectedEventIds = selectedRows.size > 0 ? Array.from(selectedRows) : undefined;
      await onExport(selectedEventIds);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleApprove = (eventId: string) => {
    console.log('Approve button clicked for event:', eventId);
    setApproveEventId(eventId);
    setShowApproveModal(true);
    setOpenMenuIndex(null);
    console.log('Approve modal should be open now');
  };

  const handleApproveConfirm = () => {
    console.log('handleApproveConfirm called:', { approveEventId, onApprove: !!onApprove });
    console.log('Current state:', { 
      approveEventId, 
      onApprove: !!onApprove, 
      showApproveModal 
    });
    if (approveEventId && onApprove) {
      console.log('Calling onApprove with eventId:', approveEventId);
      onApprove(approveEventId);
      setShowApproveModal(false);
      setApproveEventId(null);
    } else {
      console.log('Missing approveEventId or onApprove function');
      console.log('approveEventId:', approveEventId);
      console.log('onApprove function exists:', !!onApprove);
    }
  };

  const handleFlagClick = (eventId: string) => {
    console.log('Flag button clicked for event:', eventId);
    setFlagEventId(eventId);
    setFlagReason('');
    setFlagDescription('');
    setShowFlagModal(true);
    setOpenMenuIndex(null);
    console.log('Flag modal should be open now');
  };

  const handleFlagSubmit = () => {
    console.log('Flag submit clicked:', { flagEventId, flagReason, onFlag: !!onFlag });
    console.log('Current flag state:', { 
      flagEventId, 
      flagReason, 
      flagDescription,
      onFlag: !!onFlag,
      showFlagModal 
    });
    if (flagEventId && flagReason && onFlag) {
      console.log('Calling onFlag with:', { flagEventId, flagReason, flagDescription });
      onFlag(flagEventId, flagReason, flagDescription);
      setShowFlagModal(false);
      setFlagEventId(null);
      setFlagReason('');
      setFlagDescription('');
    } else {
      console.log('Missing required fields for flag submit');
      console.log('flagEventId:', flagEventId);
      console.log('flagReason:', flagReason);
      console.log('onFlag function exists:', !!onFlag);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'flagged':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'flagged':
        return 'Flagged';
      default:
        return 'Pending';
    }
  };

  return (
    <>
      {/* Mobile cards */}
      <div className="lg:hidden space-y-3 sm:space-y-4 p-3 sm:p-4">
        {events.map((event, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.eventName}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {event.eventType}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status || 'pending')}`}>
                    {getStatusText(event.status || 'pending')}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{event.repeat}</span>
                </div>
                <p className="text-xs font-medium text-gray-500">Created by: {event.createdById}</p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => {
                    console.log('Mobile dropdown button clicked for index:', index);
                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group-hover:bg-gray-50"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {openMenuIndex === index && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => { 
                        router.push(`/dashboard/event-management/${event.id}`);
                        setOpenMenuIndex(null); 
                      }}
                    >
                      <Eye className="w-4 h-4 mr-3 text-gray-400" />
                      View Details
                    </button>
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors duration-150"
                      onClick={() => handleApprove(event.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-3" />
                      Approve
                    </button>
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors duration-150"
                      onClick={() => handleFlagClick(event.id)}
                    >
                      <Flag className="w-4 h-4 mr-3" />
                      Flag
                    </button>
                    <hr className="border-gray-100" />
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      onClick={() => setDeleteId(event.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-4">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{event.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="text-sm font-semibold text-gray-900">{event.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        {/* Table header with bulk actions */}
        {selectedRows.size > 0 && (
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleExport}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                >
                  Export
                </button>
                <button 
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors duration-150"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors duration-150"
                    checked={selectedRows.size === events.length && events.length > 0}
                    onChange={toggleAllSelection}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Event Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Repeat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event, index) => (
                <tr 
                  key={index} 
                  className={`group transition-all duration-200 ${
                    hoveredRow === index ? 'bg-gradient-to-r from-purple-50/50 to-pink-50/50' : 'hover:bg-gray-50/50'
                  } ${selectedRows.has(event.id) ? 'bg-blue-50/30' : ''}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors duration-150"
                      checked={selectedRows.has(event.id)}
                      onChange={() => toggleRowSelection(event.id)}
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.eventName}</p>
                      <p className="text-xs text-gray-500">ID: {event.createdById}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  text-black">
                      
                      {event.eventType}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 max-w-xs truncate" title={event.description}>
                      {event.description}
                    </p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
               
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">{event.location}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">{event.repeat}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">{event.time}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status || 'pending')}`}>
                      {getStatusText(event.status || 'pending')}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => {
                          console.log('Dropdown button clicked for index:', index);
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group-hover:bg-gray-50"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {openMenuIndex === index && (
                        <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => { 
                              router.push(`/dashboard/event-management/${event.id}`);
                              setOpenMenuIndex(null); 
                            }}
                          >
                            <Eye className="w-4 h-4 mr-3 text-gray-400" />
                            View Details
                          </button>
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors duration-150"
                            onClick={() => handleApprove(event.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-3" />
                            Approve
                          </button>
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors duration-150"
                            onClick={() => handleFlagClick(event.id)}
                          >
                            <Flag className="w-4 h-4 mr-3" />
                            Flag
                          </button>
                          <hr className="border-gray-100" />
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                            onClick={() => { setDeleteId(event.id); setOpenMenuIndex(null); }}
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Event"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
            Are you sure you want to delete this event? All associated data will be permanently removed from the system.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => { 
                if (deleteId) onDelete(deleteId); 
                setDeleteId(null); 
              }}
            >
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Delete Selected Events"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Bulk Deletion</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
            Are you sure you want to delete {selectedRows.size} selected event{selectedRows.size > 1 ? 's' : ''}? 
            All associated data will be permanently removed from the system.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleBulkDelete}
            >
              Delete {selectedRows.size} Event{selectedRows.size > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Flag Event Modal */}
      <Modal
        isOpen={showFlagModal}
        onClose={() => {
          console.log('Flag modal close clicked');
          setShowFlagModal(false);
        }}
        title="Flag Event"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Flag className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Flag Event for Review</h3>
              <p className="text-sm text-gray-600">Report this event for rule violations</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Violation Reason
              </label>
              <select
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a reason</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="harassment">Harassment</option>
                <option value="fake">Fake Content</option>
                <option value="violence">Violence</option>
                <option value="hate_speech">Hate Speech</option>
                <option value="adult_content">Adult Content</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={flagDescription}
                onChange={(e) => setFlagDescription(e.target.value)}
                placeholder="Provide additional details about the violation..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => {
                console.log('Cancel button clicked');
                setShowFlagModal(false);
              }}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                console.log('Flag Event button clicked directly');
                handleFlagSubmit();
              }}
              disabled={!flagReason}
            >
              Flag Event
            </button>
          </div>
        </div>
      </Modal>

      {/* Approve Event Confirmation Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          console.log('Approve modal close clicked');
          setShowApproveModal(false);
        }}
        title="Approve Event"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Approve Event</h3>
              <p className="text-sm text-gray-600">This will approve the event and make it visible to users</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
            Are you sure you want to approve this event? Once approved, it will be visible to all users and cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => {
                console.log('Approve Cancel button clicked');
                setShowApproveModal(false);
              }}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => {
                console.log('Approve Event button clicked directly');
                handleApproveConfirm();
              }}
            >
              Approve Event
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EventTable;
