import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <header className="py-6 bg-card shadow-md">
        <div className="container mx-auto flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-64 rounded-md" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Form Skeleton */}
          <Skeleton className="h-[500px] w-full rounded-lg" />
          
          {/* Result Card Skeleton (optional, might not show initially) */}
          <Skeleton className="h-[150px] w-full rounded-lg" />

          {/* History Table Skeleton */}
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="py-6 text-center">
        <Skeleton className="h-6 w-1/3 mx-auto rounded-md" />
      </footer>
    </div>
  );
}
