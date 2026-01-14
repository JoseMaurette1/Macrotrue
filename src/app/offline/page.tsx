"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-2.122-5.659M12 12l-2.829 2.829m0 0l-1.414 1.414M9.172 14.828L6.343 17.657M3 3l18 18"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
        <p className="text-muted-foreground mb-6">
          It looks like you&apos;ve lost your internet connection. Some features
          may not be available until you&apos;re back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
