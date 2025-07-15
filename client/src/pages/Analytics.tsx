import { useState } from "react";
import { ExpenseChart } from "@/components";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "@/assets/icons";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { mockData as allMonthsData } from "@/data/mockData";

// --- Helper Functions to process mockData for Analytics ---

const CATEGORY_COLORS: { [key: string]: string } = {
  Food: "#2da62f", // emerald
  Breakfast: "#2da62f",
  Lunch: "#2da62f",
  Dinner: "#2da62f",
  Grocery: "#2da62f",
  Transportation: "#a22c29", // auburn
  Transport: "#a22c29",
  Entertainment: "#4f46e5", // indigo
  Shopping: "#f59e0b", // amber
  Bills: "#2d9596", // teal
  Others: "#7c3aed", // violet
  Miscellaneous: "#7c3aed",
};

const getAnalyticsData = (monthData: (typeof allMonthsData)[0]) => {
  const allTransactions = monthData.weeks.flatMap((week) => week.transactions);

  // 1. Calculate Category Data
  const categoryMap = new Map<string, number>();
  allTransactions.forEach((t) => {
    const mainCategory =
      Object.keys(CATEGORY_COLORS).find((c) =>
        t.category.toLowerCase().includes(c.toLowerCase())
      ) || "Others";
    categoryMap.set(
      mainCategory,
      (categoryMap.get(mainCategory) || 0) + t.amount
    );
  });

  const categoryData = Array.from(categoryMap.entries()).map(
    ([name, amount]) => ({
      name,
      amount,
      percentage: Math.round((amount / monthData.monthlyTotal) * 100) || 0,
      color: CATEGORY_COLORS[name] || "#7c3aed",
    })
  );

  // 2. Get Top 5 Expenses
  const topExpenses = [...allTransactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // 3. Get Weekly Trends for ExpenseChart
  const weeklyTrends = monthData.weeks.map((week) => ({
    week: `Week ${week.weekNumber}`,
    spending: week.weeklyTotal,
  }));

  return {
    ...monthData,
    categoryData,
    topExpenses,
    weeklyTrends,
  };
};

// Custom pie chart tooltip
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-ash-gray-900 border border-night-700 p-3 rounded-lg shadow-lg">
        <p className="text-night-600 font-semibold mb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-night-500 text-sm">
            <span className="font-medium">Amount:</span> P{" "}
            {data.amount.toLocaleString()}
          </p>
          <p className="text-night-500 text-sm">
            <span className="font-medium">Percentage:</span> {data.percentage}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function Analytics() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  // Process the data for all available months
  const analyticsData = allMonthsData.map(getAnalyticsData);

  const currentData = analyticsData[currentMonthIndex];
  const totalSpent = currentData.monthlyTotal;

  // Calculate days in current month (simplified)
  const daysInMonth = new Date(
    currentData.year,
    currentMonthIndex + 1,
    0
  ).getDate();
  const avgDailySpending = totalSpent / daysInMonth;
  const budgetRemaining = currentData.remaining;

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev" && currentMonthIndex < analyticsData.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else if (direction === "next" && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-night-600">Analytics</h1>
      </div>

      {/* Month Navigation */}
      <div className="relative mb-8">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMonth("prev")}
          disabled={currentMonthIndex === analyticsData.length - 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 shadow-lg"
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          disabled={currentMonthIndex === 0}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 shadow-lg"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Month Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center">
            <FiCalendar className="mr-3 text-night-600" size={28} />
            <h2 className="text-3xl font-bold text-night-600">
              {currentData.month} {currentData.year}
            </h2>
          </div>
        </div>
      </div>

      {/* Finalized Budget Overview */}
      <div className="bg-night-500 p-8 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Progress and Remaining Budget */}
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline space-x-6">
              <div>
                <p className="text-sm text-ash-gray-400">Budget Remaining</p>
                <p
                  className={`text-3xl font-bold ${
                    budgetRemaining >= 0
                      ? "text-timberwolf-900"
                      : "text-auburn-500"
                  }`}
                >
                  ₱{budgetRemaining.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-ash-gray-400">Monthly Budget</p>
                <p className="text-3xl font-bold text-timberwolf-900">
                  ₱{currentData.monthlyBudget.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-night-600 rounded-full h-3 shadow-inner">
                <div
                  className={`${
                    budgetRemaining >= 0 ? "bg-emerald-500" : "bg-auburn-500"
                  } h-3 rounded-full shadow-sm`}
                  style={{
                    width: `${Math.min(
                      (totalSpent / currentData.monthlyBudget) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-ash-gray-400 font-medium mt-2">
                <span>
                  {Math.round((totalSpent / currentData.monthlyBudget) * 100)}%
                  Used
                </span>
                <span>{Math.max(0, daysInMonth - 14)} Days Remaining</span>
              </div>
            </div>
          </div>

          {/* Right Side: Key Metrics & Limits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-night-600 p-4 rounded-lg text-center">
              <p className="text-sm text-ash-gray-400 mb-2">Total Spent</p>
              <p className="text-2xl font-bold text-timberwolf-900">
                ₱{totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-ash-gray-500 mt-1">&nbsp;</p>
            </div>
            <div className="bg-night-600 p-4 rounded-lg text-center">
              <p className="text-sm text-ash-gray-400 mb-2">Daily Average</p>
              <p className="text-2xl font-bold text-timberwolf-900">
                ₱{avgDailySpending.toFixed(0)}
              </p>
              <p className="text-xs text-ash-gray-500 mt-1">
                Avg. spend per day
              </p>
            </div>
            <div className="bg-night-600 p-4 rounded-lg text-center">
              <p className="text-sm text-ash-gray-400 mb-2">Daily Limit</p>
              <p className="text-2xl font-bold text-timberwolf-900">
                ₱
                {budgetRemaining >= 0
                  ? Math.round(
                      budgetRemaining / Math.max(1, daysInMonth - 14)
                    ).toLocaleString()
                  : "0"}
              </p>
              <p className="text-xs text-ash-gray-500 mt-1">
                To stay on budget
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expense Chart from Home */}
        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <ExpenseChart monthIndex={currentMonthIndex} />
        </div>

        {/* Category Breakdown - Combined Pie Chart and List */}
        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-night-600 mb-4">
            Expenses by Category
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={false}
                  >
                    {currentData.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="var(--color-ash-gray-900)"
                        strokeWidth={2}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category List */}
            <div>
              {currentData.categoryData.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm hover:bg-timberwolf-900 p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center overflow-hidden">
                    <div
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-night-600 truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="font-semibold text-night-600">
                      ₱{category.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-ash-gray-400 font-medium">
                      {category.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        {/* Top Expenses - Full Width */}
        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-night-600 mb-4">
            Top Expenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {currentData.topExpenses.map((expense, index) => (
              <div
                key={expense.id || index}
                className="flex items-center justify-between py-3 border-b border-ash-gray-700"
              >
                <div>
                  <p className="font-medium text-night-600">
                    {expense.description}
                  </p>
                  <p className="text-sm text-ash-gray-400">
                    {expense.category} • {expense.date}
                  </p>
                </div>
                <p className="font-semibold text-auburn-500">
                  ₱{expense.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
