'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, MapPin, Calendar, Clock, Users, Trash2, Eye } from 'lucide-react';
import { EventEntry } from '@/types';
import Modal from './Modal';
import Button from './Button';

interface DateTableProps {
  dates: EventEntry[];
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
}

const DateTable: React.FC<DateTableProps> = ({ dates, onDelete, onBulkDelete }) => {
  const router = useRouter();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

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
    if (selectedRows.size === dates.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(dates.map(d => d.id)));
    }
  };

  const getStatusColor = (participants: number) => {
    if (participants >= 10) return 'bg-green-100 text-green-800 border-green-200';
    if (participants >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getParticipantAvatars = (count: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const avatarsToShow = Math.min(count, 3);
    
    return (
      <div className="flex -space-x-2">
        {[...Array(avatarsToShow)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-semibold text-white ${colors[i % colors.length]} transform transition-transform duration-200 hover:scale-110 hover:z-10`}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
        {count > 3 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shadow-sm">
            +{count - 3}
          </div>
        )}
      </div>
    );
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedRows.size === 0) return;
    
    setIsDeleting(true);
    try {
      const selectedIds = Array.from(selectedRows);
      await onBulkDelete(selectedIds);
      setSelectedRows(new Set());
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Mobile cards */}
      <div className="lg:hidden space-y-4">
        {dates.map((d, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Id</p>
                  <p className="text-sm font-bold text-gray-900">{d.createdById}</p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
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
                        router.push(`/dashboard/date-management/${d.id}`);
                        setOpenMenuIndex(null); 
                      }}
                    >
                      <Eye className="w-4 h-4 mr-3 text-gray-400" />
                      View Details
                    </button>
                    <hr className="border-gray-100" />
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      onClick={() => setDeleteId(d.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Participants section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Participants</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(d.participants)}`}>
                  {d.participants} people
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {getParticipantAvatars(d.participants)}
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{d.participants}</span>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{d.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{d.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="text-sm font-semibold text-gray-900">{d.time}</p>
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
                <button className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors duration-150">
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
          <table className="w-full">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors duration-150"
                    checked={selectedRows.size === dates.length && dates.length > 0}
                    onChange={toggleAllSelection}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created by ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
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
              {dates.map((d, index) => (
                <tr 
                  key={index} 
                  className={`group transition-all duration-200 ${
                    hoveredRow === index ? 'bg-gradient-to-r from-purple-50/50 to-pink-50/50' : 'hover:bg-gray-50/50'
                  } ${selectedRows.has(d.id) ? 'bg-blue-50/30' : ''}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors duration-150"
                      checked={selectedRows.has(d.id)}
                      onChange={() => toggleRowSelection(d.id)}
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{d.createdById}</p>
                      <p className="text-xs text-gray-500">Creator</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {getParticipantAvatars(d.participants)}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{d.participants} people</p>
                        <p className="text-xs text-gray-500">Attending</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">{d.location}</p>
                        <p className="text-xs text-gray-500">Venue</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{d.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{d.time}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(d.participants)}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        d.participants >= 10 ? 'bg-green-500' : 
                        d.participants >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {d.participants >= 10 ? 'High' : d.participants >= 5 ? 'Medium' : 'Low'} Attendance
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
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
                              router.push(`/dashboard/date-management/${d.id}`);
                              setOpenMenuIndex(null); 
                            }}
                          >
                            <Eye className="w-4 h-4 mr-3 text-gray-400" />
                            View Details
                          </button>
                          <hr className="border-gray-100" />
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                            onClick={() => { setDeleteId(d.id); setOpenMenuIndex(null); }}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Date Entry"
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
            Are you sure you want to delete this date entry? All associated data will be permanently removed from the system.
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
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Delete Selected Date Entries"
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
            Are you sure you want to delete {selectedRows.size} selected date entr{selectedRows.size > 1 ? 'ies' : 'y'}? 
            All associated data will be permanently removed from the system.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedRows.size} Entr${selectedRows.size > 1 ? 'ies' : 'y'}`}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DateTable;