// src/utils/toastHandler.js
import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message || 'Action completed successfully!', {
    position: 'top-center',
    autoClose: 2000,
    theme: 'light',
  });
  console.log("showSuccess is triggered");
};

export const showError = (message) => {
  toast.error(message || 'Something went wrong!', {
    position: 'top-center',
    autoClose: 3000,
    theme: 'colored',
  });
  console.log("showError is triggered");
};
