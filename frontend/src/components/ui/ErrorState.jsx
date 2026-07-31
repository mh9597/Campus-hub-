/**
 * ErrorState — displayed when a data-fetch fails.
 * Provides a retry button to re-trigger the failed request.
 */

/**
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Callback to retry the fetch
 * @param {string} [props.className] - Additional CSS classes
 */
export function ErrorState({ message, onRetry, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 px-8 text-center rounded-2xl bg-red-50 border border-red-100 ${className}`}
      role="alert"
    >
      <span className="material-symbols-outlined text-red-400 text-5xl">error_outline</span>
      <div>
        <h3 className="font-bold text-red-700 text-lg mb-1">Something went wrong</h3>
        <p className="text-red-600/80 text-sm max-w-sm">
          {message || 'Failed to load data. Please check your connection and try again.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * InlineError — compact error for form validation or inline errors.
 */
export function InlineError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1" role="alert">
      <span className="material-symbols-outlined text-[16px]">error</span>
      {message}
    </div>
  );
}
