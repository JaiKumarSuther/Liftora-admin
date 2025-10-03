'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { ModalProps } from '@/types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        ref={modalRef}
        className={`bg-gray-800 rounded-xl shadow-2xl w-full mx-auto transform transition-all max-h-[90vh] overflow-y-auto ${className || 'max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-xl">
          <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-white pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors p-2 cursor-pointer rounded-lg hover:bg-gray-700 flex-shrink-0"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
