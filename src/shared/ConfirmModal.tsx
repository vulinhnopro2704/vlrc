'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'success' | 'danger';
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning',
  isLoading = false
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Memoize handlers to prevent re-renders
  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  const handleConfirm = useCallback(() => {
    if (!isLoading) {
      onConfirm();
    }
  }, [onConfirm, isLoading]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isLoading]);

  // Prevent scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    dialog.addEventListener('keydown', handleTabKey);

    const timeoutId = setTimeout(() => {
      firstElement?.focus();
    }, 100);

    return () => {
      dialog.removeEventListener('keydown', handleTabKey);
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const getIconByType = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon className='h-6 w-6 text-yellow-500' />;
      case 'info':
        return <InfoIcon className='h-6 w-6 text-blue-500' />;
      case 'success':
        return <CheckCircleIcon className='h-6 w-6 text-green-500' />;
      case 'danger':
        return <XCircleIcon className='h-6 w-6 text-red-500' />;
      default:
        return <AlertTriangleIcon className='h-6 w-6 text-yellow-500' />;
    }
  };

  const getButtonColorByType = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-500';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500';
    }
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <AnimatePresence mode='wait'>
      <div className='fixed inset-0 z-10000 flex items-center justify-center'>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-black/50'
          onClick={handleBackdropClick}
        />

        {/* Dialog */}
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300,
            duration: 0.2
          }}
          className='relative z-10000 w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4'
          onClick={e => e.stopPropagation()}>
          {/* Close button */}
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            className='absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Đóng'>
            <XIcon className='h-5 w-5' />
          </button>

          {/* Content */}
          <div className='flex items-start space-x-4 pr-8'>
            <div className='flex-shrink-0 mt-1'>{getIconByType()}</div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>{title}</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isLoading}
              className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'>
              {cancelText}
            </button>
            <button
              type='button'
              onClick={handleConfirm}
              disabled={isLoading}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColorByType()}`}>
              {isLoading ? (
                <span className='flex items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    aria-label='Loading'>
                    <title>Loading</title>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
