// components/custom-skeletons.tsx

import { Skeleton } from '@/components/ui/skeleton'

export function ProviderSelectorSkeleton() {
  return (
    <div className="p-4 border border-accent rounded-md shadow-sm w-[16vw]">
      <Skeleton className="h-10 w-full rounded-md mb-4" />
      <Skeleton className="h-10 w-full rounded-md mb-4" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}
