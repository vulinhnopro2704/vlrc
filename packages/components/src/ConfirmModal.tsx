import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  closeLabel?: string;
  processingText?: string;
  type?: 'warning' | 'info' | 'success' | 'danger';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  closeLabel = 'Đóng',
  processingText = 'Đang xử lý...',
  type = 'warning',
  isLoading = false
}: ConfirmationDialogProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered || isOpen) return;

    const timeoutId = window.setTimeout(() => setIsRendered(false), 200);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, isRendered]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
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

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    dialog.addEventListener('keydown', handleTabKey);
    const timeoutId = window.setTimeout(() => firstElement?.focus(), 100);

    return () => {
      dialog.removeEventListener('keydown', handleTabKey);
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isRendered) return null;

  const Icon = {
    warning: AlertTriangleIcon,
    info: InfoIcon,
    success: CheckCircleIcon,
    danger: XCircleIcon
  }[type];

  const iconColor = {
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    success: 'text-green-500',
    danger: 'text-red-500'
  }[type];

  const buttonColor = {
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    success: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
  }[type];

  return (
    <div ref={containerRef} className='fixed inset-0 z-10000 flex items-center justify-center'>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleBackdropClick}
      />

      <div
        ref={dialogRef}
        className={`relative z-10000 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all duration-200 ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-95 opacity-0'}`}
        onClick={event => event.stopPropagation()}>
        <button
          type='button'
          onClick={handleClose}
          disabled={isLoading}
          className='absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
          aria-label={closeLabel}>
          <XIcon className='h-5 w-5' />
        </button>

        <div className='flex items-start space-x-4 pr-8'>
          <div className='mt-1 flex-shrink-0'>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className='mb-2 text-lg font-medium text-gray-900'>{title}</h3>
            <p className='text-sm leading-relaxed text-gray-500'>{message}</p>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
            {cancelText}
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={isLoading}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${buttonColor}`}>
            {isLoading ? (
              <span className='flex items-center'>
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                {processingText}
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
