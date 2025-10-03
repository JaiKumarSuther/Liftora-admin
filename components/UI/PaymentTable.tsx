'use client';

import React, { useState } from 'react';
import { FiDollarSign, FiUser, FiCalendar, FiCreditCard, FiAlertCircle, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';

interface Payment {
  id: string;
  userId: string;
  eventId?: string;
  amount: number;
  currency: string;
  paymentType: 'deposit' | 'refund' | 'payout' | 'fee' | 'commission';
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  description?: string;
  processedAt?: string;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
  event?: {
    eventName: string;
    eventType: string;
  };
}

interface PaymentTableProps {
  payments: Payment[];
  onRefund: (paymentId: string, amount: number, reason: string) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onRefund }) => {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <FiAlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <FiRefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <FiAlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'refund':
        return 'bg-red-100 text-red-800';
      case 'payout':
        return 'bg-blue-100 text-blue-800';
      case 'fee':
        return 'bg-orange-100 text-orange-800';
      case 'commission':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefundClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundAmount(payment.amount.toString());
    setShowRefundModal(true);
  };

  const handleRefundSubmit = () => {
    if (selectedPayment && refundAmount && refundReason) {
      onRefund(selectedPayment.id, parseFloat(refundAmount), refundReason);
      setShowRefundModal(false);
      setSelectedPayment(null);
      setRefundAmount('');
      setRefundReason('');
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FiCreditCard className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">No payments found</p>
        <p className="text-sm">No payments match your current filters.</p>
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
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiDollarSign className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.transactionId || `TXN-${payment.id}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.paymentMethod || 'N/A'}
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
                        {payment.user?.fullName || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.user?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                  {payment.event && (
                    <div className="text-sm text-gray-500">
                      {payment.event.eventName}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(payment.paymentType)}`}>
                    {payment.paymentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(payment.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {payment.status === 'completed' && payment.paymentType !== 'refund' && (
                    <button
                      onClick={() => handleRefundClick(payment)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Refund
                    </button>
                  )}
                  <button className="text-blue-600 hover:text-blue-900">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Process Refund</h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                  max={selectedPayment.amount}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Refund
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter reason for refund..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefundSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentTable;



