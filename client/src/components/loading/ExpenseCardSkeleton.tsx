import { Skeleton, SkeletonText } from "./Skeleton";

function ExpenseCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-20 md:h-24 bg-timberwolf-900 p-3 md:p-4 rounded-2xl flex items-center shadow-md"
    >
      <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full! mr-3 md:mr-4 flex-shrink-0" />
      <div className="flex-grow min-w-0">
        <div className="font-semibold text-sm md:text-base">
          <SkeletonText className="w-28 md:w-36" />
        </div>
        <div className="text-xs md:text-sm mt-1">
          <SkeletonText className="w-20 md:w-48" />
        </div>
        <div className="text-xs mt-1 hidden md:block">
          <SkeletonText className="w-16" />
        </div>
      </div>
      <div className="font-semibold text-sm md:text-lg mx-3 md:mx-4 flex-shrink-0">
        <SkeletonText className="w-14 md:w-20" />
      </div>
      <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
        <Skeleton className="w-[34px] h-[34px] rounded-full!" />
        <Skeleton className="w-[34px] h-[34px] rounded-full!" />
      </div>
      <div className="md:hidden flex items-center flex-shrink-0">
        <Skeleton className="w-[34px] h-[34px] rounded-full!" />
      </div>
    </div>
  );
}

export default ExpenseCardSkeleton;
