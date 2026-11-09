import { useState } from "react";
import {
  Button,
  ExpenseCard,
  ExpenseCardSkeleton,
  SkeletonText,
} from "@/components";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import {
  useModalContext,
  useCurrencyContext,
  useGetMonthlyTransactionsSummary,
  useGetExpenses,
  useFetchOnScroll,
} from "@/hooks";
import { assignCategoryColors } from "@/utils";
import { format, subMonths } from "date-fns";

const MAX_MONTHS = 12;
const SKELETON_WEEK_COUNT = 5;
const SKELETON_TRANSACTION_COUNT = 5;

function formatWeekRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "MMM. d")}-${format(end, "d")}`;
  }
  return `${format(start, "MMM. d")} - ${format(end, "MMM. d")}`;
}

function Transactions() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();

  function getMonthYear(index: number) {
    const date = subMonths(new Date(), index);
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  }

  const { month, year } = getMonthYear(currentMonthIndex);
  const monthDate = new Date(year, month - 1);

  const { data: monthSummary, isLoading: isSummaryLoading } =
    useGetMonthlyTransactionsSummary({
      month,
      year,
    });

  const allWeeks = monthSummary?.weeks || [];

  const selectedWeekData = selectedWeek
    ? allWeeks.find((w: any) => w.weekNumber === selectedWeek)
    : null;

  const startDate = selectedWeekData
    ? selectedWeekData.weekStartDate
    : format(new Date(year, month - 1), "yyyy-MM-dd");
  const endDate = selectedWeekData
    ? selectedWeekData.weekEndDate
    : format(new Date(year, month, 0), "yyyy-MM-dd");

  const getTransactionsOptions = {
    startDate,
    endDate,
    limit: 10,
    orderBy: sortOrder,
  };

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetExpenses(getTransactionsOptions);

  const allTransactions =
    transactionsData?.pages.flatMap((page) => page.transactions) ?? [];
  const transactionsWithColors = assignCategoryColors(allTransactions);

  function navigateMonth(direction: "prev" | "next") {
    if (direction === "prev" && currentMonthIndex < MAX_MONTHS - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else if (direction === "next" && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
    setSortOrder("desc");
    setSelectedWeek(null);
  }

  function isPreviousMonthYear(month: number, year: number) {
    const now = new Date();
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const prevYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return month === prevMonth + 1 && year === prevYear;
  }

  const sentinelRef = useFetchOnScroll(
    fetchNextPage,
    hasNextPage ?? false,
    isFetchingNextPage
  );

  return (
    <div className="p-3 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-night-600 text-center sm:text-left w-full sm:w-auto">
          Transactions
        </h1>
        <div className="flex flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-end w-full sm:w-auto">
          <Button
            variant="success"
            disabled={isSummaryLoading}
            onClick={() =>
              openModal("EDIT_BUDGET", {
                monthNumber: monthSummary?.monthNumber,
                year: monthSummary?.year,
                currentBudget: monthSummary?.monthlyBudget,
              })
            }
            className="shadow-sm text-sm md:text-base w-full sm:w-auto"
          >
            Edit Budget
          </Button>
          <Button
            onClick={() => openModal("UPSERT_EXPENSE")}
            className="shadow-sm text-sm md:text-base w-full sm:w-auto"
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="relative mb-6 md:mb-8">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMonth("prev")}
          disabled={currentMonthIndex >= MAX_MONTHS - 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 shadow-lg cursor-pointer"
        >
          <FiChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          disabled={currentMonthIndex === 0}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 shadow-lg cursor-pointer"
        >
          <FiChevronRight size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Month Header */}
        <div className="text-center py-4 md:py-6">
          <div className="flex items-center justify-center">
            <FiCalendar className="mr-2 md:mr-3 text-night-600" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-night-600">
              {format(monthDate, "MMMM yyyy")}
            </h2>
          </div>
        </div>
      </div>

      {/* Monthly Summary Section */}
      <div className="bg-night-500 p-4 md:p-8 rounded-xl mb-6 md:mb-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {isSummaryLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="text-center">
                <p className="text-xs md:text-sm mb-2">
                  <SkeletonText tone="dark" className="w-20 md:w-24" />
                </p>
                <p className="text-xl md:text-3xl font-bold">
                  <SkeletonText tone="dark" className="w-24 md:w-36" />
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-xs md:text-sm text-night-800 mb-2">
                Monthly Budget
              </p>
              <p className="text-xl md:text-3xl font-bold text-timberwolf-900">
                {currency}
                {monthSummary?.monthlyBudget}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm text-night-800 mb-2">
                Total Spent
              </p>
              <p
                className={`text-xl md:text-3xl font-bold ${
                  monthSummary?.monthlyTotalSpent > monthSummary?.monthlyBudget
                    ? "text-auburn-700"
                    : "text-timberwolf-900"
                }`}
              >
                {currency}
                {monthSummary?.monthlyTotalSpent}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm text-night-800 mb-2">
                {isPreviousMonthYear(
                  monthSummary?.monthNumber - 1,
                  monthSummary?.year
                )
                  ? "Remaining"
                  : monthSummary?.monthlyRemainingBudget >= 0
                  ? "Savings"
                  : "Deficit"}
              </p>
              <p
                className={`text-xl md:text-3xl font-bold ${
                  monthSummary?.monthlyRemainingBudget >= 0
                    ? "text-emerald-500"
                    : "text-auburn-700"
                }`}
              >
                {currency}
                {monthSummary?.monthlyRemainingBudget}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Week Filter */}
      <div className="mb-6 md:mb-8 bg-timberwolf-900 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-center mb-3 md:mb-4">
          <FiFilter className="mr-2 text-night-600" size={16} />
          <span className="text-base md:text-lg font-bold text-night-600">
            Filter by Week
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 max-w-5xl mx-auto">
          <button
            onClick={() => {
              if (selectedWeek !== null) setSortOrder("desc");
              setSelectedWeek(null);
            }}
            className={`px-2 md:px-3 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 text-center shadow-sm hover:shadow-md ${
              selectedWeek === null
                ? "bg-night-600 text-timberwolf-900 shadow-md"
                : "bg-timberwolf-700 text-night-600 hover:bg-timberwolf-600"
            } cursor-pointer`}
          >
            <div className="text-xs md:text-sm font-semibold">All Weeks</div>
          </button>
          {isSummaryLoading &&
            Array.from({ length: SKELETON_WEEK_COUNT }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="px-2 md:px-3 py-3 md:py-4 rounded-lg bg-timberwolf-700 shadow-sm"
              >
                <div className="text-center space-y-1.5">
                  <div>
                    <div className="text-sm md:text-base font-bold">
                      <SkeletonText className="w-14" />
                    </div>
                    <div className="text-xs -mt-0.5">
                      <SkeletonText className="w-16" />
                    </div>
                  </div>
                  <div className="pt-1 border-t border-transparent">
                    <div className="text-xs">
                      <SkeletonText className="w-12" />
                    </div>
                    <div className="text-xs mt-0.5">
                      <SkeletonText className="w-14" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {allWeeks.map((week: any) => (
            <button
              key={week.weekNumber}
              onClick={() => {
                if (selectedWeek !== week.weekNumber) setSortOrder("desc");
                setSelectedWeek(week.weekNumber);
              }}
              className={`px-2 md:px-3 py-3 md:py-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                selectedWeek === week.weekNumber
                  ? "bg-night-600 text-timberwolf-900 shadow-md"
                  : "bg-timberwolf-700 text-night-600 hover:bg-timberwolf-600"
              } cursor-pointer`}
            >
              <div className="text-center space-y-1.5">
                {/* Week Header */}
                <div>
                  <div className="text-sm md:text-base font-bold">
                    Week {week.weekNumber}
                  </div>
                  <div className="text-xs opacity-50 font-normal -mt-0.5">
                    {formatWeekRange(week.weekStartDate, week.weekEndDate)}
                  </div>
                </div>

                {/* Financial Info */}
                <div className="pt-1 border-t border-opacity-20 border-current">
                  <div className="text-xs opacity-80 font-medium">
                    {currency}
                    {week.weeklyTotalSpent}
                  </div>
                  <div className="text-xs font-semibold mt-0.5">
                    {week.weeklyRemainingBudget >= 0 ? (
                      <span
                        className={
                          selectedWeek === week.weekNumber
                            ? "text-timberwolf-900"
                            : "text-emerald-400"
                        }
                      >
                        +{currency}
                        {week.weeklyRemainingBudget}
                      </span>
                    ) : (
                      <span
                        className={
                          selectedWeek === week.weekNumber
                            ? "text-timberwolf-900"
                            : "text-auburn-500"
                        }
                      >
                        -{currency}
                        {Math.abs(week.weeklyRemainingBudget)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Budget Info */}
      {selectedWeekData && (
        <div className="bg-night-500 p-4 md:p-6 rounded-xl mb-6 md:mb-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-xs md:text-sm text-night-800 mb-2">
                Weekly Budget
              </p>
              <p className="text-lg md:text-2xl font-bold text-timberwolf-900">
                {currency}
                {selectedWeekData.weeklyBudget}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm text-night-800 mb-2">
                Week {selectedWeek} Spent
              </p>
              <p
                className={`text-lg md:text-2xl font-bold ${
                  selectedWeekData.weeklyTotalSpent >
                  selectedWeekData.weeklyBudget
                    ? "text-auburn-700"
                    : "text-timberwolf-900"
                }`}
              >
                {currency}
                {selectedWeekData.weeklyTotalSpent}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm text-night-800 mb-2">
                {isPreviousMonthYear(
                  monthSummary.monthNumber - 1,
                  monthSummary.year
                )
                  ? "Remaining"
                  : monthSummary?.monthlyRemainingBudget >= 0
                  ? "Savings"
                  : "Deficit"}
              </p>
              <p
                className={`text-lg md:text-2xl font-bold ${
                  selectedWeekData.weeklyRemainingBudget >= 0
                    ? "text-emerald-500"
                    : "text-auburn-700"
                }`}
              >
                {currency}
                {selectedWeekData.weeklyRemainingBudget}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-night-600">
          {selectedWeek ? (
            <>
              Week {selectedWeek} Transactions{" "}
              <span className="text-sm md:text-base font-normal text-night-700">
                (
                {formatWeekRange(
                  selectedWeekData.weekStartDate,
                  selectedWeekData.weekEndDate
                )}
                )
              </span>
            </>
          ) : (
            `All ${format(monthDate, "MMMM")} Transactions`
          )}
        </h3>

        {/* Sort Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-xs md:text-sm text-night-700">Sort:</span>
          <button
            onClick={() => setSortOrder("desc")}
            className={`flex items-center space-x-1 px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              sortOrder === "desc"
                ? "bg-night-600 text-timberwolf-900"
                : "bg-timberwolf-600 text-night-500 hover:bg-timberwolf-500"
            } cursor-pointer`}
          >
            <span>Newest</span>
            <FiChevronDown size={12} className="md:w-3.5 md:h-3.5" />
          </button>
          <button
            onClick={() => setSortOrder("asc")}
            className={`flex items-center space-x-1 px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              sortOrder === "asc"
                ? "bg-night-600 text-timberwolf-900"
                : "bg-timberwolf-600 text-night-500 hover:bg-timberwolf-500"
            } cursor-pointer`}
          >
            <span>Oldest</span>
            <FiChevronUp size={12} className="md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 md:space-y-4">
        {isTransactionsLoading ? (
          Array.from({ length: SKELETON_TRANSACTION_COUNT }, (_, i) => (
            <ExpenseCardSkeleton key={i} />
          ))
        ) : (
          <ul
            role="list"
            aria-label="Transactions"
            className="space-y-3 md:space-y-4"
          >
            {transactionsWithColors.map((transaction: any) => (
              <li key={transaction.id}>
                <ExpenseCard
                  id={transaction.id}
                  category={transaction.category}
                  amount={transaction.amount}
                  description={transaction.description}
                  color={transaction.color}
                  date={transaction.date}
                />
              </li>
            ))}
          </ul>
        )}
        <div ref={sentinelRef}>
          {isFetchingNextPage && (
            <div className="space-y-3 md:space-y-4">
              <ExpenseCardSkeleton />
              <ExpenseCardSkeleton />
            </div>
          )}
        </div>
      </div>

      {/* No Transactions Message */}
      {!isTransactionsLoading && transactionsWithColors.length === 0 && (
        <div className="text-center py-12 md:py-16 text-night-700">
          <FiCalendar
            size={48}
            className="mx-auto mb-4 opacity-50 md:w-16 md:h-16"
          />
          <p className="text-lg md:text-xl font-semibold mb-2">
            No transactions found
          </p>
          <p className="text-sm">
            {selectedWeek
              ? `No expenses recorded for Week ${selectedWeek} (${formatWeekRange(
                  selectedWeekData.weekStartDate,
                  selectedWeekData.weekEndDate
                )})`
              : `No expenses recorded for ${format(monthDate, "MMMM yyyy")}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default Transactions;
