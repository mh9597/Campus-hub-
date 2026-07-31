/**
 * LoadingSkeleton — animated pulse placeholder for cards while data loads.
 * Matches the visual footprint of the actual card it's replacing.
 */

/** Skeleton for a semester note-card (Semesters.jsx) */
export function SemesterCardSkeleton() {
  return (
    <div className="animate-pulse w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] min-h-[420px] rounded-[20px] bg-gray-100 flex flex-col items-center p-8 gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 mb-4" />
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
      <div className="mt-auto h-3 w-1/2 rounded-full bg-gray-200" />
      <div className="h-10 w-full rounded-[16px] bg-gray-200" />
    </div>
  );
}

/** Skeleton for a subject card (ResourceDetails.jsx) */
export function SubjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[20px] bg-gray-100 p-8 flex flex-col gap-4 min-h-[260px]">
      <div className="w-14 h-14 rounded-2xl bg-gray-200" />
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
    <div className="animate-pulse rounded-xl bg-gray-100 p-8 flex flex-col gap-4 min-h-[220px]">
      <div className="flex justify-between">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="h-6 w-20 rounded-lg bg-gray-200" />
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
