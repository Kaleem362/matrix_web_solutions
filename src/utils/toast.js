/* ========================================================================
   TOAST NOTIFICATIONS - Beautiful alert replacements
   ========================================================================
   Usage:
   import { toast } from 'react-hot-toast';

   toast.success('Quote sent successfully!')
   toast.error('Failed to send quote')
   toast.custom('Custom message')
   ======================================================================== */

import toast from "react-hot-toast";

// Success toast - for successful actions
export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      borderRadius: '12px',
      background: '#10b981',
      color: '#fff',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
    duration: 3000,
  });
};

// Error toast - for error messages
export const showError = (message) => {
  toast.error(message, {
    style: {
      borderRadius: '12px',
      background: '#ef4444',
      color: '#fff',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
    duration: 4000,
  });
};

// Warning toast - for warnings
export const showWarning = (message) => {
  toast(message, {
    style: {
      borderRadius: '12px',
      background: '#f59e0b',
      color: '#fff',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#f59e0b',
    },
    duration: 4000,
  });
};

// Loading toast - for pending operations
export const showLoading = (message = "Loading...") => {
  return toast.loading(message, {
    style: {
      borderRadius: '12px',
      background: '#6366f1',
      color: '#fff',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
};

// Custom toast - for any message
export const showToast = (message, type = "default") => {
  switch (type) {
    case "success":
      showSuccess(message);
      break;
    case "error":
      showError(message);
      break;
    case "warning":
      showWarning(message);
      break;
    default:
      toast(message, {
        style: {
          borderRadius: '12px',
          background: '#374151',
          color: '#fff',
          padding: '12px 20px',
          fontSize: '14px',
        },
        duration: 3000,
      });
  }
};

// Promise toast - for async operations
export const showPromise = (promise, messages = {}) => {
  const { loading = "Processing...", success = "Done!", error = "Failed!" } = messages;

  toast.promise(promise, {
    loading: loading,
    success: success,
    error: error,
    style: {
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '14px',
    },
  });
};

export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  loading: showLoading,
  custom: showToast,
  promise: showPromise,
};