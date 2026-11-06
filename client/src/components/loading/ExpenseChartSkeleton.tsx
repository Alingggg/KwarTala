import { Skeleton, SkeletonText } from "./Skeleton";

function ExpenseChartSkeleton() {
  const toggleItem =
    "px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium";

  return (
    <div aria-hidden="true" className="h-full flex flex-col bg-timberwolf-900">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold text-night-600">
          Daily Expenses
        </h3>
        <div className="flex bg-timberwolf-700 rounded-lg p-1">
          <span className={`${toggleItem} bg-night-600 text-timberwolf-900`}>
            Daily
          </span>
          <span className={`${toggleItem} text-night-500`}>Weekly</span>
        </div>
      </div>
      <Skeleton className="flex-1 min-h-[250px] rounded-lg!" />
      <div className="mt-2 text-center text-xs">
        <SkeletonText className="w-56" />
      </div>
    </div>
  );
}

export default ExpenseChartSkeleton;
