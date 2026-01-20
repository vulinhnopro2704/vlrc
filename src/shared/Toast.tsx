import { toast as sonnerToast } from 'sonner';

const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: '✅',
      style: {
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #16a34a'
      },
      duration: 3000
    });
  },
  error: (message: string) => {
    sonnerToast.error(message, {
      icon: '❌',
      style: {
        background: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #dc2626'
      },
      duration: 3000
    });
  },
  info: (message: string) => {
    sonnerToast.info(message, {
      icon: 'ℹ️',
      style: {
        background: '#e0f7fa',
        color: '#006064',
        border: '1px solid #004d40'
      },
      duration: 3000
    });
  },
  warning: (message: string) => {
    sonnerToast.warning(message, {
      icon: '⚠️',
      style: {
        background: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba'
      },
      duration: 3000
    });
  }
};

export default toast;
