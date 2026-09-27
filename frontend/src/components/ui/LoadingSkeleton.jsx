/**
 * LoadingSkeleton — animated pulse placeholder for cards while data loads.
 * Matches the visual footprint of the actual card it's replacing.
 */

/** Skeleton for a semester note-card (Semesters.jsx) */
export function SemesterCardSkeleton() {
  return (
    <div className="animate-pulse w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] min-h-[220px] sm:min-h-[300px] rounded-[24px] sm:rounded-[32px] bg-gray-100 flex flex-col items-center p-4 sm:p-6 gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-200 mb-2" />
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
      <div className="mt-auto h-3 w-1/2 rounded-full bg-gray-200" />
      <div className="h-9 sm:h-10 w-full rounded-[16px] bg-gray-200 animate-pulse" />
    </div>
  );
}

/** Skeleton for a subject card (ResourceDetails.jsx or SubjectDetails.jsx) */
export function SubjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[20px] sm:rounded-[24px] bg-gray-100 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 min-h-[140px] sm:min-h-[180px]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-200" />
      <div className="h-3 w-1/3 rounded bg-gray-200" />
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
      <div className="mt-auto h-px w-full bg-gray-200" />
      <div className="flex justify-between">
        <div className="h-3 w-1/4 rounded bg-gray-200" />
        <div className="h-3 w-1/4 rounded bg-gray-200" />
      </div>
    </div>
  );
}

/** Skeleton for an opportunity paper-card (Opportunities.jsx) */
export function OpportunityCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-gray-100 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 min-h-[140px] sm:min-h-[160px]">
      <div className="flex justify-between">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-200" />
        <div className="h-6 w-16 sm:w-20 rounded-lg bg-gray-200" />
      </div>
      <div className="h-5 w-3/4 rounded bg-gray-200 mt-2" />
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
      <div className="mt-auto h-4 w-1/4 rounded bg-gray-200" />
    </div>
  );
}

/** Skeleton for an announcement row */
export function AnnouncementSkeleton() {
  return (
    <div className="animate-pulse flex items-start gap-3">
      <div className="w-3 h-3 rounded-full bg-gray-200 mt-1.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-2 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

/** Full page lazy transition fallback with subtle pulse loader */
export function PageLoadingFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400 animate-ping absolute" />
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg relative z-10 font-black text-sm">
          CH
        </div>
      </div>
      <p className="text-xs font-bold text-slate-500 tracking-wider uppercase animate-pulse">
        Loading CampusHub...
      </p>
    </div>
  );
}
