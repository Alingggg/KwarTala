import { useState } from "react";
import { ExpenseChart, LoadingSpinner } from "@/components";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "@/assets/icons";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  useAnalyticsData,
  useCurrencyContext,
  useDailyChartsData,
  useWeeklyChartsData,
} from "@/hooks";
import { assignCategoryColors } from "@/utils";
import type { Expense } from "@/types";

const MAX_MONTHS = 12;

// Custom pie chart tooltip
function CustomPieTooltip({ active, payload }: any) {
  const { currency } = useCurrencyContext();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-ash-gray-900 border border-night-700 p-3 rounded-lg shadow-lg">
        <p className="text-night-600 font-semibold mb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-night-500 text-sm">
            <span className="font-medium">Amount:</span> {currency}
            {data.total.toLocaleString()}
          </p>
          <p className="text-night-500 text-sm">
            <span className="font-medium">Percentage:</span>{" "}
            {data.percentageOfTotal}%
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function Analytics() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const { currency } = useCurrencyContext();

  const today = new Date();

  function getMonthYear(index: number) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  }

  const { month, year } = getMonthYear(currentMonthIndex);

  const { data: monthData, isLoading: isAnalyticsLoading } = useAnalyticsData({
    month,
    year,
  });
  const { data: dailyChartsData, isLoading: isDailyLoading } =
    useDailyChartsData({
      month,
      year,
    });
  const { data: weeklyChartsData, isLoading: isWeeklyLoading } =
    useWeeklyChartsData({
      month,
      year,
    });

  const highestExpensesWithColors =
    monthData && assignCategoryColors(monthData.highestExpenses);
  const expenseByCategoryWithColors =
    monthData && assignCategoryColors(monthData.expenseByCategory);

  function navigateMonth(direction: "prev" | "next") {
    if (direction === "prev" && currentMonthIndex < MAX_MONTHS - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else if (direction === "next" && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  }

  if (isAnalyticsLoading || isDailyLoading || isWeeklyLoading) {
    return <LoadingSpinner message="Loading analytics data..." />;
  }

  return (
    <div className="p-3 md:p-8">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-night-600 text-center md:text-left">
          Analytics
        </h1>
      </div>

      {/* Month Navigation */}
      <div className="relative mb-6 md:mb-8">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMonth("prev")}
          disabled={currentMonthIndex >= MAX_MONTHS - 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 shadow-lg"
        >
          <FiChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          disabled={currentMonthIndex === 0}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 shadow-lg"
        >
          <FiChevronRight size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Month Header */}
        <div className="text-center py-4 md:py-6">
          <div className="flex items-center justify-center">
            <FiCalendar className="mr-2 md:mr-3 text-night-600" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-night-600">
              {new Date(
                monthData.year,
                monthData.monthNumber - 1
              ).toLocaleString("default", { month: "long" })}{" "}
              {monthData.year}
            </h2>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-night-500 p-4 md:p-8 rounded-xl shadow-lg mb-6 md:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Progress and Remaining Budget */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-baseline space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div>
                <p className="text-xs md:text-sm text-ash-gray-400">
                  Budget Remaining
                </p>
                <p
                  className={`text-xl md:text-3xl font-bold ${
                    monthData.monthlyRemainingBudget >= 0
                      ? "text-timberwolf-900"
                      : "text-auburn-500"
                  }`}
                >
                  {currency}
                  {monthData.monthlyRemainingBudget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-ash-gray-400">
                  Monthly Budget
                </p>
                <p className="text-xl md:text-3xl font-bold text-timberwolf-900">
                  {currency}
                  {monthData.monthlyBudget.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-6">
              <div className="w-full bg-night-600 rounded-full h-2 md:h-3 shadow-inner">
                <div
                  className={`${
                    monthData.monthlyRemainingBudget >= 0
                      ? "bg-night-700"
                      : "bg-auburn-500"
                  } h-2 md:h-3 rounded-full shadow-sm`}
                  style={{
                    width: `${Math.min(
                      monthData.monthlyBudgetUsedPercentage,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-ash-gray-400 font-medium mt-2">
                <span>{monthData.monthlyBudgetUsedPercentage}% Used</span>
                {today.getMonth() === monthData.monthNumber - 1 &&
                  today.getFullYear() === monthData.year && (
                    <span>{monthData.remainingDays} Days Remaining</span>
                  )}
              </div>
            </div>
          </div>

          {/* Key Metrics & Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 justify-items-center text-center">
            <div className="bg-night-600 p-3 md:p-4 rounded-lg flex flex-col justify-center items-center w-full">
              <p className="text-xs md:text-sm text-ash-gray-400 mb-2">
                Total Spent
              </p>
              <p className="text-lg md:text-2xl font-bold text-timberwolf-900">
                {currency}
                {monthData.monthlyTotalSpent.toLocaleString()}
              </p>
            </div>
            <div className="bg-night-600 p-3 md:p-4 rounded-lg flex flex-col justify-center items-center w-full">
              <p className="text-xs md:text-sm text-ash-gray-400 mb-2">
                Daily Average
              </p>
              <p className="text-lg md:text-2xl font-bold text-timberwolf-900">
                {currency}
                {monthData.averageDailySpending.toLocaleString()}
              </p>
              <p className="text-xs text-ash-gray-500 mt-1">
                Avg. spend per day
              </p>
            </div>
            <div className="bg-night-600 p-3 md:p-4 rounded-lg flex flex-col justify-center items-center w-full">
              <p className="text-xs md:text-sm text-ash-gray-400 mb-2">
                Daily Limit
              </p>
              <p className="text-lg md:text-2xl font-bold text-timberwolf-900">
                {currency}
                {monthData.recommendedDailyLimit > 0
                  ? monthData.recommendedDailyLimit.toLocaleString()
                  : "0"}
              </p>
              <p className="text-xs text-ash-gray-500 mt-1">
                To stay on budget
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Expense Chart */}
        <div className="bg-timberwolf-900 p-4 md:p-6 rounded-xl shadow-lg">
          <ExpenseChart
            dailyChartsData={dailyChartsData}
            weeklyChartsData={weeklyChartsData}
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-timberwolf-900 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-night-600 mb-4">
            Expenses by Category
          </h3>
          {expenseByCategoryWithColors &&
          expenseByCategoryWithColors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Pie Chart */}
              <div className="h-48 md:h-52 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategoryWithColors}
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 768 ? 60 : 80}
                      dataKey="total"
                      label={false}
                    >
                      {expenseByCategoryWithColors.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="var(--color-ash-gray-900)"
                            strokeWidth={2}
                            style={{ cursor: "pointer" }}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Category List */}
              <div className="space-y-1">
                {expenseByCategoryWithColors.map(
                  (category: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs md:text-sm hover:bg-timberwolf-900 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center overflow-hidden min-w-0">
                        <div
                          className="w-3 h-3 rounded-full mr-2 md:mr-3 flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium text-night-600 truncate">
                          {category.category}
                        </span>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="font-semibold text-night-600">
                          {currency}
                          {category.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-ash-gray-400 font-medium">
                          {category.percentageOfTotal}%
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 text-ash-gray-500">
              <FiCalendar
                size={48}
                className="mx-auto mb-4 opacity-50 md:w-16 md:h-16"
              />
              <p className="text-lg md:text-xl font-semibold mb-2">
                No category data found
              </p>
              <p className="text-sm">No expenses recorded for this month.</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Expenses */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="bg-timberwolf-900 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-night-600 mb-4">
            Top Expenses
          </h3>
          {highestExpensesWithColors && highestExpensesWithColors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4">
              {highestExpensesWithColors.map(
                (expense: Expense & { color: string }, index: number) => (
                  <div
                    key={expense.id || index}
                    className="flex items-center justify-between py-2 md:py-3 border-b border-ash-gray-700"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-night-600 text-sm md:text-base truncate">
                        {expense.description || (
                          <span className="italic">[No Description]</span>
                        )}
                      </p>
                      <p className="text-xs md:text-sm text-ash-gray-400">
                        {expense.category} •{" "}
                        {new Date(expense.date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="font-semibold text-auburn-500 text-sm md:text-base ml-2 flex-shrink-0">
                      {currency}
                      {expense.amount.toLocaleString()}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-ash-gray-500">
              <FiCalendar
                size={48}
                className="mx-auto mb-4 opacity-50 md:w-16 md:h-16"
              />
              <p className="text-lg md:text-xl font-semibold mb-2">
                No top expenses found
              </p>
              <p className="text-sm">No expenses recorded for this month.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
