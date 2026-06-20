import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * GlobalToastProvider component.
 * Import and render this component ONCE at the root of your application (e.g., in App.tsx or main.tsx).
 * 
 * Example usage in App.tsx:
 * ```tsx
 * import { GlobalToastProvider } from './components/GlobalToastProvider';
 * 
 * function App() {
 *   return (
 *     <>
 *       <GlobalToastProvider />
 *       <YourOtherComponents />
 *     </>
 *   );
 * }
 * ```
 */
export const GlobalToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      // Ensure the toast is above the modal (which has z-index 10002)
      style={{ zIndex: 99999 }}
      // Basic container styling to ensure the toast classes sit well
      toastClassName="!p-0 !m-4 bg-transparent shadow-none"
      className="!p-4 !m-0"
      aria-label="Notifications"
    />
  );
};
