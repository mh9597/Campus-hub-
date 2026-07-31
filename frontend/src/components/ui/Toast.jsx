import { useEffect, useState } from 'react';

const ICONS = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

const COLORS = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-amber-500 text-white',
};

/**
 * Toast — temporary notification that auto-dismisses after a duration.
 *
 * @param {Object} props
 * @param {string} props.message - Notification text
 * @param {'success'|'error'|'info'|'warning'} props.type - Visual variant
 * @param {number} [props.duration=4000] - Auto-dismiss after ms
 * @param {Function} props.onDismiss - Called when toast should be removed
 */
export function Toast({ message, type = 'success', duration = 4000, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold transition-all duration-300 pointer-events-auto
        ${COLORS[type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      role="status"
      aria-live="polite"
    >
      <span className="material-symbols-outlined text-[20px] shrink-0">{ICONS[type]}</span>
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        className="ml-2 opacity-80 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

/**
 * ToastContainer — fixed portal at bottom-center of viewport.
 * Renders an array of toast notifications.
 *
 * Usage:
 *   const { toasts, addToast } = useToast();
 *   addToast({ message: 'Saved!', type: 'success' });
 *   <ToastContainer toasts={toasts} onDismiss={removeToast} />
 *
 * @param {Object} props
 * @param {Array} props.toasts - Array of { id, message, type }
 * @param {Function} props.onDismiss - Called with toast id to remove it
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts?.length) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * useToast — hook to manage a list of toasts.
 *
 * @returns {{ toasts: Array, addToast: Function, removeToast: Function }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ message, type = 'success', duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
