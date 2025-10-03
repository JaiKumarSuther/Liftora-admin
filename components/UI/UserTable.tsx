'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Calendar, User as UserIcon, Mail, Edit3, CheckCircle, XCircle, MinusCircle, Download, Eye, Ban, AlertTriangle } from 'lucide-react';
import { UserTableData, EditUserFormData, UserAction } from '@/types';
import Modal from './Modal';
import Button from './Button';
import { useRouter } from 'next/navigation';
 

interface UserTableProps {
  users: UserTableData[];
  onUpdate: (userId: string, data: EditUserFormData) => void;
  onUserAction?: (action: UserAction) => Promise<void>;
  onExport?: (selectedUserIds?: string[]) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({ users, onUpdate, onUserAction, onExport }) => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [actionUser, setActionUser] = useState<UserTableData | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const actionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInside = actionRefs.current.some(
        (ref) => ref && ref.contains(event.target as Node)
      );
      if (!clickedInside) {
        setOpenMenuIndex(null);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenuIndex(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const [editForm, setEditForm] = useState<EditUserFormData>({
    name: '',
    email: '',
    fullName: '',
    contact: '',
    gender: '',
    age: 0,
    country: '',
    bio: '',
    isVerified: false,
    isOnline: true,
    status: 'Active',
  });

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
    if (selectedRows.size === users.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map(u => u.id)));
    }
  };

  const openEditModal = (user: UserTableData) => {
    setOpenMenuIndex(null);
    setTimeout(() => {
      handleEditUser(user);
    }, 0);
  };


  const handleViewDetails = (userId: string) => {
    setOpenMenuIndex(null);
    router.push(`/dashboard/user-management/${userId}`);
  };

  const handleEditUser = (user: UserTableData) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      fullName: user.name, // Using name as fullName for now
      contact: '', // Will be populated from backend
      gender: '', // Will be populated from backend
      age: 0, // Will be populated from backend
      country: '', // Will be populated from backend
      bio: '', // Will be populated from backend
      isVerified: false, // Will be populated from backend
      isOnline: user.status === 'Active',
      status: user.status === 'Active' ? 'Active' : 'Inactive',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      onUpdate(selectedUser.id, editForm);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: 'Active' | 'Inactive' | 'Banned' | 'Warning' | 'Deleted') => {
    if (status === 'Active') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Inactive') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status === 'Warning') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (status === 'Banned') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: 'Active' | 'Inactive' | 'Banned' | 'Warning' | 'Deleted') => {
    if (status === 'Active') return <CheckCircle className="w-4 h-4 mr-1" />;
    if (status === 'Inactive') return <MinusCircle className="w-4 h-4 mr-1" />;
    if (status === 'Warning') return <AlertTriangle className="w-4 h-4 mr-1" />;
    if (status === 'Banned') return <Ban className="w-4 h-4 mr-1" />;
    return <XCircle className="w-4 h-4 mr-1" />;
  };


  const handleExport = async () => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      const selectedUserIds = selectedRows.size > 0 ? Array.from(selectedRows) : undefined;
      await onExport(selectedUserIds);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };


  const handleBanUser = (user: UserTableData) => {
    setActionUser(user);
    setActionReason('');
    setActionMessage(`Your account has been banned due to violation of our terms of service. Reason: ${actionReason || 'Policy violation'}. If you believe this is an error, please contact our support team.`);
    setShowBanModal(true);
    setOpenMenuIndex(null);
  };

  const handleWarningUser = (user: UserTableData) => {
    setActionUser(user);
    setActionReason('');
    setActionMessage(`You have received a warning for violating our community guidelines. Reason: ${actionReason || 'Policy violation'}. Please review our terms of service and ensure compliance to avoid further action.`);
    setShowWarningModal(true);
    setOpenMenuIndex(null);
  };

  const performUserAction = async (actionType: 'ban' | 'warning') => {
    if (!actionUser || !onUserAction) return;

    setIsPerformingAction(true);
    try {
      const action: UserAction = {
        type: actionType,
        userId: actionUser.id,
        reason: actionReason,
        emailSubject: actionType === 'ban' ? 'Account Banned - Action Required' : 'Account Warning - Please Review',
        emailMessage: actionMessage
      };

      await onUserAction(action);
      
      // Close modals and reset state
      setShowBanModal(false);
      setShowWarningModal(false);
      setActionUser(null);
      setActionReason('');
      setActionMessage('');
    } catch (error) {
      console.error(`${actionType} action failed:`, error);
    } finally {
      setIsPerformingAction(false);
    }
  };

  return (
    <>
      {/* Mobile cards */}
      <div className="lg:hidden space-y-4">
        {users.map((user, index) => (
          <div 
            key={user.id}
            className="group relative bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User</p>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-32">{user.name}</p>
                </div>
              </div>
              
              <div className="relative" ref={(el) => { actionRefs.current[index] = el; }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group-hover:bg-gray-50 touch-manipulation"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {openMenuIndex === index && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
                       style={{
                         maxHeight: 'calc(100vh - 200px)',
                         transform: 'translateY(0)',
                       }}
                  >
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewDetails(user.id);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewDetails(user.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-3 text-gray-400" />
                      View Details
                    </button>
                    <hr className="border-gray-100" />
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditModal(user);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditModal(user);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-3 text-gray-400" />
                      Edit
                    </button>
                    <hr className="border-gray-100" />
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors duration-150 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWarningUser(user);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWarningUser(user);
                      }}
                    >
                      <AlertTriangle className="w-4 h-4 mr-3 text-orange-500" />
                      Send Warning
                    </button>
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors duration-150 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBanUser(user);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBanUser(user);
                      }}
                    >
                      <Ban className="w-4 h-4 mr-3 text-red-500" />
                      Ban User
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User details */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Account ID</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-fuchsia-600 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Created</p>
                    <p className="text-sm font-semibold text-gray-900">{user.accountCreated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                {getStatusIcon(user.status)}
                {user.status}
              </span>
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
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
                  {selectedRows.size} user{selectedRows.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </>
                  )}
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
                    checked={selectedRows.size === users.length && users.length > 0}
                    onChange={toggleAllSelection}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Account Created
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
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`group transition-all duration-200 ${
                    hoveredRow === index ? 'bg-gradient-to-r from-blue-50/50 to-cyan-50/50' : 'hover:bg-gray-50/50'
                  } ${selectedRows.has(user.id) ? 'bg-blue-50/30' : ''}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors duration-150"
                      checked={selectedRows.has(user.id)}
                      onChange={() => toggleRowSelection(user.id)}
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-32">{user.name}</p>
                      <p className="text-xs text-gray-500">Account ID: {user.id}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-48">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-fuchsia-600" />
                      <span className="text-sm text-gray-900">{user.accountCreated}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      {user.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="relative" ref={(el) => { actionRefs.current[index] = el; }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group-hover:bg-gray-50 touch-manipulation"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {openMenuIndex === index && (
                        <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 touch-manipulation"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewDetails(user.id);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewDetails(user.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-3 text-gray-400" />
                            View Details
                          </button>
                          <hr className="border-gray-100" />
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 touch-manipulation"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openEditModal(user);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openEditModal(user);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-3 text-gray-400" />
                            Edit
                          </button>
                          <hr className="border-gray-100" />
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors duration-150 touch-manipulation"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleWarningUser(user);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleWarningUser(user);
                            }}
                          >
                            <AlertTriangle className="w-4 h-4 mr-3 text-orange-500" />
                            Send Warning
                          </button>
                          <button 
                            className="w-full flex items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors duration-150 touch-manipulation"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBanUser(user);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBanUser(user);
                            }}
                          >
                            <Ban className="w-4 h-4 mr-3 text-red-500" />
                            Ban User
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

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModal}
        title="Edit User Information"
        className="max-w-2xl lg:max-w-4xl xl:max-w-5xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter user name"
                  />
                </div>

                <div>
                  <label htmlFor="edit-fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="edit-fullName"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="edit-contact" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact
                  </label>
                  <input
                    type="text"
                    id="edit-contact"
                    value={editForm.contact}
                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter contact number"
                  />
                </div>

                <div>
                  <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="edit-gender"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="edit-age"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter age"
                    min="0"
                    max="120"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="edit-country"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Inactive' | 'Banned' | 'Warning' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Warning">Warning</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isVerified}
                    onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Verified</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isOnline}
                    onChange={(e) => setEditForm({ ...editForm, isOnline: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Online</span>
                </label>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={closeModal} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
                Update User
              </Button>
            </div>
          </div>
        )}
      </Modal>



      {/* Ban User Modal */}
      <Modal
        isOpen={showBanModal}
        onClose={() => {
          setShowBanModal(false);
          setActionUser(null);
          setActionReason('');
          setActionMessage('');
        }}
        title="Ban User Account"
        className="max-w-lg lg:max-w-2xl xl:max-w-3xl"
      >
        {actionUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ban User Account</h3>
                <p className="text-sm text-gray-600">Banning {actionUser.name} ({actionUser.email})</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Ban
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-none"
                    placeholder="Enter the reason for banning this user..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Message (will be sent to user)
                  </label>
                  <textarea
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-none"
                    placeholder="Enter the email message to be sent to the user..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action will immediately ban the user and send them an email notification. 
                The user will lose access to their account and all associated features.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowBanModal(false);
                  setActionUser(null);
                  setActionReason('');
                  setActionMessage('');
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => performUserAction('ban')}
                disabled={isPerformingAction}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                {isPerformingAction ? 'Banning...' : 'Ban User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Warning User Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          setActionUser(null);
          setActionReason('');
          setActionMessage('');
        }}
        title="Send Warning to User"
        className="max-w-lg lg:max-w-2xl xl:max-w-3xl"
      >
        {actionUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Warning</h3>
                <p className="text-sm text-gray-600">Sending warning to {actionUser.name} ({actionUser.email})</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Warning
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                    placeholder="Enter the reason for this warning..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Message (will be sent to user)
                  </label>
                  <textarea
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                    placeholder="Enter the warning message to be sent to the user..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> This will send a warning email to the user and may change their account status to &quot;Warning&quot;. 
                The user will be notified about the violation and expected behavior.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowWarningModal(false);
                  setActionUser(null);
                  setActionReason('');
                  setActionMessage('');
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => performUserAction('warning')}
                disabled={isPerformingAction}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
              >
                {isPerformingAction ? 'Sending...' : 'Send Warning'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserTable;
