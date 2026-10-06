import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

/**
 * RouteErrorBoundary
 * CampusHub neo-brutalist fallback UI for route-level crashes and unhandled exceptions.
 */
export default function RouteErrorBoundary() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred while loading this page.';
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    title = error.status === 404 ? 'Page Not Found' : `Error ${error.status}`;
    message = error.statusText || error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bulletin-board-bg flex items-center justify-center p-4 selection:bg-amber-300 selection:text-black">
      <div className="max-w-lg w-full bg-white border-3 border-black rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0px_#000] text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="w-16 h-16 rounded-2xl bg-amber-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto mb-5 text-black">
          <span className="material-symbols-outlined text-3xl">
            {statusCode === 404 ? 'travel_explore' : 'warning'}
          </span>
        </div>

        <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-black px-3 py-1 rounded-xl text-xs font-black font-mono inline-block mb-3 shadow-2xs">
          CODE: {statusCode}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
          {title}
        </h1>

        <p className="text-sm text-gray-700 font-medium mb-6 leading-relaxed bg-amber-50/70 border border-black/15 rounded-xl p-3 text-left font-mono break-words">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-white hover:bg-amber-50 text-black border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Reload Page</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-[#0F172A] text-[#FBBF24] hover:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_#FBBF24] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
