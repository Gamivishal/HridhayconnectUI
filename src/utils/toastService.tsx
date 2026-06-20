import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { CheckCircle, XCircle } from 'lucide-react';

export interface ApiResponse {
  statusCode: number;
  message?: string;
  isSuccess: boolean;
  isConfirm: boolean;
  [key: string]: any;
}

// Default options for Success Toast
// - Green left border
// - Success icon
// - Light green background
// - Auto close after 3 seconds
const successOptions: ToastOptions = {
  autoClose: 3000,
  icon: <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />,
  className: '!bg-green-50 !border-l-4 !border-green-500 !text-green-800 !rounded-md shadow-md',
  progressClassName: '!bg-green-500',
  closeButton: true,
};

// Default options for Error Toast
// - Red left border
// - Error icon
// - Light red background
// - Auto close after 5 seconds
const errorOptions: ToastOptions = {
  autoClose: 5000,
  icon: <XCircle className="text-red-500 w-5 h-5 shrink-0" />,
  className: '!bg-red-50 !border-l-4 !border-red-500 !text-red-800 !rounded-md shadow-md',
  progressClassName: '!bg-red-500',
  closeButton: true,
};

/**
 * Show a static toast message
 * @param type 'success' | 'error'
 * @param message Message to display
 */
export const showToast = (type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    toast.success(message, successOptions);
  } else if (type === 'error') {
    toast.error(message, errorOptions);
  }
};

/**
 * Show a toast based on the API response rules
 * @param response The API response object
 */
export const showApiResponseToast = (response: ApiResponse) => {
  if (!response) {
    showToast('error', 'Something went wrong.');
    return;
  }

  const { statusCode, isSuccess, isConfirm, message } = response;

  // 1. Success Toast Rules:
  // Show SUCCESS toast only when statusCode === 1, isSuccess === true, and isConfirm === true
  if (statusCode === 1 && isSuccess === true && isConfirm === true) {
    if (message) {
      showToast('success', message);
    }
    return;
  }

  // 2. Error Toast Rules:
  // If statusCode !== 1 OR isSuccess === false, show ERROR toast.
  if (statusCode !== 1 || isSuccess === false) {
    const errorMsg = message || 'Something went wrong.';
    showToast('error', errorMsg);
  }
};
