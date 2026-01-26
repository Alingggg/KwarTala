import {
  Button,
  ExpenseCard,
  ExpenseChart,
  LoadingSpinner,
} from "@/components";
import {
  useModalContext,
  useCurrencyContext,
  useGetHomeData,
  useGetWeeklyChartsData,
  useGetDailyChartsData,
  useGetExpenses,
  useFetchOnScroll,
  useUserContext,
} from "@/hooks";
import type { Expense } from "@/types";
import { assignCategoryColors } from "@/utils";
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";

function Home() {
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();

  const today = new Date();
  const currentMonthNumber = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const getTransactionsOptions = {
    startDate: format(today, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
    limit: 10,
    orderBy: "desc" as "desc" | "asc",
  };

  const { user } = useUserContext();
  const { data: homeData, isLoading: isHomeLoading } = useGetHomeData();
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

  const { data: dailyChartsData, isLoading: isDailyLoading } =
    useGetDailyChartsData({
      month: currentMonthNumber,
      year: currentYear,
    });

  const { data: weeklyChartsData, isLoading: isWeeklyLoading } =
    useGetWeeklyChartsData({
      month: currentMonthNumber,
      year: currentYear,
    });

  const sentinelRef = useFetchOnScroll(
    fetchNextPage,
    hasNextPage ?? false,
    isFetchingNextPage,
  );

  return (
    <div className="p-3 md:p-8">
      {/* Page Header */}
      <div className="mb-5 md:mb-8 mt-1 mb:mt-0">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-xl md:text-3xl font-bold text-night-600">
            Hello, {`${user.userName ?? "User"}`}!
          </h1>
          {isHomeLoading ? (
            <LoadingSpinner message="Loading summary..." />
          ) : (
            <p className="md:text-2xl font-semibold text-night-600">
              {homeData &&
                format(
                  new Date(homeData.year, homeData.monthNumber - 1),
                  "MMMM yyyy",
                )}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-8 mb-5 md:mb-8">
        {/* Budget Section */}
        <div className="bg-timberwolf-900 text-timberwolf-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center">
          {isHomeLoading ? (
            <LoadingSpinner message="Loading budget..." />
          ) : (
            <>
              <div className="bg-night-500 p-3 md:p-6 rounded-lg shadow-sm">
                <p className="text-sm text-ash-gray-400">Budget</p>
                {homeData && (
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                    <p className="text-2xl md:text-4xl font-bold text-timberwolf-900">
                      {currency}
                      {homeData.remainingBudget.toFixed(2)}
                    </p>
                    <span className="text-sm md:text-base font-normal text-ash-gray-400">
                      remaining of {currency}
                      {homeData.budget}
                    </span>
                  </div>
                )}
              </div>

              {/* Budget Progress and Today's Spending */}
              <div className="bg-ash-gray-800 p-3 md:p-4 rounded-lg mt-3 md:mt-4 shadow-inner">
                {homeData && (
                  <>
                    <Button
                      onClick={() =>
                        openModal("EDIT_BUDGET", {
                          monthNumber: homeData.monthNumber,
                          year: homeData.year,
                          currentBudget: homeData.budget,
                        })
                      }
                      variant="secondary"
                      className="w-full mb-3 md:mb-6 text-sm md:text-base"
                    >
                      Edit Budget
                    </Button>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-night-600">
                          Budget Progress
                        </span>
                        <span className="text-sm font-semibold text-night-600">
                          {homeData.budgetUsedPercentage}% used
                        </span>
                      </div>
                      <div className="w-full bg-ash-gray-700 rounded-full h-2 md:h-3 shadow-inner">
                        <div
                          className={`h-2 md:h-3 rounded-full shadow-sm ${
                            homeData.remainingBudget >= 0
                              ? "bg-night-700"
                              : "bg-auburn-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              homeData.budgetUsedPercentage,
                              100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm text-night-600 font-medium">
                        <span>{currency}0</span>
                        <span>
                          {currency}
                          {homeData.budget}
                        </span>
                      </div>
                    </div>

                    {/* Today's Spending */}
                    <div className="bg-night-500 p-3 md:p-4 rounded-lg mt-3 md:mt-4 border border-night-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-auburn-500 rounded-full"></div>
                          <span className="text-xs md:text-sm font-medium text-timberwolf-700">
                            Today's Spending
                          </span>
                        </div>
                        <span className="text-lg md:text-xl font-bold text-timberwolf-900">
                          {currency}
                          {homeData.spentToday}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button
                onClick={() => openModal("UPSERT_EXPENSE")}
                className="mt-3 md:mt-4 shadow-sm text-sm md:text-base"
              >
                Add Expense
              </Button>
            </>
          )}
        </div>

        {/* Expense Chart */}
        <div className="col-span-1 bg-timberwolf-900 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {isDailyLoading || isWeeklyLoading ? (
            <LoadingSpinner message="Loading charts..." />
          ) : (
            <ExpenseChart
              dailyChartsData={dailyChartsData}
              weeklyChartsData={weeklyChartsData}
            />
          )}
        </div>
      </div>

      {/* Today's Transactions */}
      <div>
        <div className="flex items-center mb-4 md:mb-6">
          <span className="text-lg md:text-xl font-bold text-night-600">
            Today's Transactions
          </span>
          <div className="flex-grow border-t border-ash-gray-700 ml-4"></div>
        </div>
        <div className="space-y-3 md:space-y-4">
          {isTransactionsLoading ? (
            <LoadingSpinner message="Loading transactions..." />
          ) : (
            transactionsWithColors &&
            transactionsWithColors.map((transaction: Expense) => (
              <ExpenseCard key={transaction.id} {...transaction} />
            ))
          )}
          <div ref={sentinelRef}>
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <LoadingSpinner message="Loading more..." />
              </div>
            )}
          </div>
        </div>

        {/* No Transactions Message */}
        {!isTransactionsLoading &&
          (!transactionsWithColors || transactionsWithColors.length === 0) && (
            <div className="text-center py-12 md:py-16 text-ash-gray-500">
              <FiCalendar
                size={48}
                className="mx-auto mb-4 opacity-50 md:w-16 md:h-16"
              />
              <p className="text-lg md:text-xl font-semibold mb-2">
                No transactions found
              </p>
              <p className="text-sm">No expenses recorded for today.</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default Home;
