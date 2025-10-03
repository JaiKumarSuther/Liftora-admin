'use client';

import React, { useState } from 'react';
import { FiFlag, FiUser, FiCalendar, FiAlertTriangle, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import { ContentFlag } from '@/types';

interface ContentFlagTableProps {
  flags: ContentFlag[];
  onReview: (flagId: string, action: string, notes: string) => void;
}

const ContentFlagTable: React.FC<ContentFlagTableProps> = ({ flags, onReview }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<ContentFlag | null>(null);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'resolved':
        return <FiCheckCircle className="w-4 h-4 text-blue-500" />;
      case 'dismissed':
        return <FiXCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <FiAlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'spam':
        return 'bg-red-100 text-red-800';
      case 'inappropriate':
        return 'bg-orange-100 text-orange-800';
      case 'harassment':
        return 'bg-purple-100 text-purple-800';
      case 'fake':
        return 'bg-yellow-100 text-yellow-800';
      case 'violence':
        return 'bg-red-100 text-red-800';
      case 'hate_speech':
        return 'bg-red-100 text-red-800';
      case 'adult_content':
        return 'bg-pink-100 text-pink-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'comment':
        return 'bg-purple-100 text-purple-800';
      case 'message':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReviewClick = (flag: ContentFlag) => {
    setSelectedFlag(flag);
    setReviewAction('');
    setReviewNotes('');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = () => {
    if (selectedFlag && reviewAction && reviewNotes) {
      onReview(selectedFlag.id, reviewAction, reviewNotes);
      setShowReviewModal(false);
      setSelectedFlag(null);
      setReviewAction('');
      setReviewNotes('');
    }
  };

  const formatReason = (reason: string) => {
    return reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (flags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FiFlag className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">No content flags found</p>
        <p className="text-sm">No flags match your current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flag Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flags.map((flag) => (
              <tr key={flag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <FiFlag className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Flag #{flag.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {flag.description || 'No description provided'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiUser className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {flag.reporter?.fullName || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {flag.reporter?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(flag.contentType)}`}>
                    {flag.contentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonColor(flag.reason)}`}>
                    {formatReason(flag.reason)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(flag.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(flag.status)}`}>
                      {flag.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {format(new Date(flag.createdAt), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {flag.status === 'pending' && (
                    <button
                      onClick={() => handleReviewClick(flag)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Review
                    </button>
                  )}
                  <button className="text-gray-600 hover:text-gray-900">
                    <FiEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedFlag && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Review Content Flag</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Reason:</strong> {formatReason(selectedFlag.reason)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Description:</strong> {selectedFlag.description || 'No description'}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Action
                </label>
                <select
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Action</option>
                  <option value="approved">Approve Content</option>
                  <option value="removed">Remove Content</option>
                  <option value="warned">Warn User</option>
                  <option value="no_action">No Action</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter review notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!reviewAction || !reviewNotes}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentFlagTable;

