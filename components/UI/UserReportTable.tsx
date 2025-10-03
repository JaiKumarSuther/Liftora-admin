'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiUser, FiCalendar, FiCheckCircle, FiXCircle, FiEye, FiClock, FiUserX } from 'react-icons/fi';
import { format } from 'date-fns';

interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportType: 'inappropriate_behavior' | 'harassment' | 'fake_profile' | 'spam' | 'scam' | 'underage' | 'violence' | 'hate_speech' | 'other';
  description?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  adminAction?: 'no_action' | 'warning' | 'suspension' | 'ban' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  reporter?: {
    fullName: string;
    email: string;
  };
  reportedUser?: {
    fullName: string;
    email: string;
  };
  reviewer?: {
    fullName: string;
    email: string;
  };
}

interface UserReportTableProps {
  reports: UserReport[];
  onReview: (reportId: string, action: string, notes: string, suspensionDays?: number) => void;
  onResolve: (reportId: string, notes: string) => void;
}

const UserReportTable: React.FC<UserReportTableProps> = ({ reports, onReview, onResolve }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(7);
  const [resolveNotes, setResolveNotes] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'under_review':
        return <FiClock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
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
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspension':
        return 'bg-orange-100 text-orange-800';
      case 'ban':
        return 'bg-red-100 text-red-800';
      case 'no_action':
        return 'bg-gray-100 text-gray-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inappropriate_behavior':
        return 'bg-red-100 text-red-800';
      case 'harassment':
        return 'bg-purple-100 text-purple-800';
      case 'fake_profile':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-orange-100 text-orange-800';
      case 'scam':
        return 'bg-red-100 text-red-800';
      case 'underage':
        return 'bg-pink-100 text-pink-800';
      case 'violence':
        return 'bg-red-100 text-red-800';
      case 'hate_speech':
        return 'bg-red-100 text-red-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReviewClick = (report: UserReport) => {
    setSelectedReport(report);
    setReviewAction('');
    setReviewNotes('');
    setSuspensionDays(7);
    setShowReviewModal(true);
  };

  const handleResolveClick = (report: UserReport) => {
    setSelectedReport(report);
    setResolveNotes('');
    setShowResolveModal(true);
  };

  const handleReviewSubmit = () => {
    if (selectedReport && reviewAction && reviewNotes) {
      onReview(selectedReport.id, reviewAction, reviewNotes, suspensionDays);
      setShowReviewModal(false);
      setSelectedReport(null);
      setReviewAction('');
      setReviewNotes('');
    }
  };

  const handleResolveSubmit = () => {
    if (selectedReport && resolveNotes) {
      onResolve(selectedReport.id, resolveNotes);
      setShowResolveModal(false);
      setSelectedReport(null);
      setResolveNotes('');
    }
  };

  const formatReportType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FiAlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">No user reports found</p>
        <p className="text-sm">No reports match your current filters.</p>
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
                Report Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <FiAlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Report #{report.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.description || 'No description provided'}
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
                        {report.reporter?.fullName || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.reporter?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <FiUserX className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {report.reportedUser?.fullName || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.reportedUser?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.reportType)}`}>
                    {formatReportType(report.reportType)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(report.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  {report.adminAction && (
                    <div className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(report.adminAction)}`}>
                        {report.adminAction}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.status === 'pending' && (
                    <button
                      onClick={() => handleReviewClick(report)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Review
                    </button>
                  )}
                  {report.status === 'under_review' && (
                    <button
                      onClick={() => handleResolveClick(report)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Resolve
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
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Review User Report</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Report Type:</strong> {formatReportType(selectedReport.reportType)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Description:</strong> {selectedReport.description || 'No description'}
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
                  <option value="warning">Warning</option>
                  <option value="suspension">Suspension</option>
                  <option value="ban">Ban User</option>
                  <option value="no_action">No Action</option>
                  <option value="dismissed">Dismiss Report</option>
                </select>
              </div>

              {reviewAction === 'suspension' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suspension Days
                  </label>
                  <input
                    type="number"
                    value={suspensionDays}
                    onChange={(e) => setSuspensionDays(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="365"
                  />
                </div>
              )}

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

      {/* Resolve Modal */}
      {showResolveModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Resolve User Report</h3>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes
                </label>
                <textarea
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter resolution notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveSubmit}
                  disabled={!resolveNotes}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Resolve Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserReportTable;
