'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2,
  FiCalendar
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import Modal from '../../../components/UI/Modal';
import { 
  useMotivationalQuotes, 
  useCreateQuote, 
  useUpdateQuote, 
  useDeleteQuote 
} from '../../../hooks/useApiQueries';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { MotivationalQuote } from '../../../types';

const MotivationalQuotes: React.FC = () => {
  const [activeNav, setActiveNav] = useState('motivational-quotes');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<MotivationalQuote | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    month: 1,
    day: 1,
    theme: ''
  });

  // Fetch quotes
  const { data: quotesData, isLoading, error, refetch } = useMotivationalQuotes({
    page: currentPage,
    limit: 10
  });

  const createQuoteMutation = useCreateQuote();
  const updateQuoteMutation = useUpdateQuote();
  const deleteQuoteMutation = useDeleteQuote();

  // Handle form changes
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle create quote
  const handleCreateQuote = async () => {
    try {
      await createQuoteMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
      setFormData({ quote: '', author: '', month: 1, day: 1, theme: '' });
      refetch();
    } catch (error) {
      console.error('Failed to create quote:', error);
    }
  };

  // Handle edit quote
  const handleEditQuote = (quote: MotivationalQuote) => {
    setSelectedQuote(quote);
    setFormData({
      quote: quote.quote,
      author: quote.author || '',
      month: quote.month,
      day: quote.day,
      theme: quote.theme || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle update quote
  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;

    try {
      await updateQuoteMutation.mutateAsync({
        quoteId: selectedQuote.id,
        data: formData
      });
      setIsEditModalOpen(false);
      setSelectedQuote(null);
      refetch();
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  // Handle delete quote
  const handleDeleteQuote = async () => {
    if (!selectedQuote) return;

    try {
      await deleteQuoteMutation.mutateAsync(selectedQuote.id);
      setIsDeleteModalOpen(false);
      setSelectedQuote(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };


  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Quotes</h2>
          <p className="text-gray-400">Failed to load quotes data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const quotes = quotesData?.data || [];
  const pagination = quotesData?.pagination;

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      
      <div className="flex-1">
        <Header title="Motivational Quotes" />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Motivational Quotes</h1>
              <p className="text-gray-400">Manage motivational quotes for users</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Quote
            </button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search quotes..."
            />
          </div>

          {/* Quotes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {quotes.map((quote: MotivationalQuote) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="mb-4">
                  <p className="text-white text-lg leading-relaxed mb-3">
                    &ldquo;{quote.quote}&rdquo;
                  </p>
                  {quote.author && (
                    <p className="text-gray-400 text-sm">— {quote.author}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{getMonthName(quote.month)} {quote.day}</span>
                  </div>
                  {quote.theme && (
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {quote.theme}
                    </span>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditQuote(quote)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuote(quote);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-300">
                  Page {currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Quote Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Quote"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Quote *</label>
            <textarea
              value={formData.quote}
              onChange={(e) => handleFormChange('quote', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the motivational quote..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleFormChange('author', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name (optional)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Month *</label>
              <select
                value={formData.month}
                onChange={(e) => handleFormChange('month', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Day *</label>
              <select
                value={formData.day}
                onChange={(e) => handleFormChange('day', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Theme</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleFormChange('theme', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter theme (optional)"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateQuote}
              disabled={!formData.quote || createQuoteMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createQuoteMutation.isPending ? 'Creating...' : 'Create Quote'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Quote Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Quote"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Quote *</label>
            <textarea
              value={formData.quote}
              onChange={(e) => handleFormChange('quote', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleFormChange('author', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Month *</label>
              <select
                value={formData.month}
                onChange={(e) => handleFormChange('month', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Day *</label>
              <select
                value={formData.day}
                onChange={(e) => handleFormChange('day', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Theme</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleFormChange('theme', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateQuote}
              disabled={!formData.quote || updateQuoteMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateQuoteMutation.isPending ? 'Updating...' : 'Update Quote'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quote"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this quote? This action cannot be undone.
          </p>
          {selectedQuote && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-white italic">&ldquo;{selectedQuote.quote}&rdquo;</p>
              {selectedQuote.author && (
                <p className="text-gray-400 text-sm mt-2">— {selectedQuote.author}</p>
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
              onClick={handleDeleteQuote}
              disabled={deleteQuoteMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleteQuoteMutation.isPending ? 'Deleting...' : 'Delete Quote'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MotivationalQuotes;
