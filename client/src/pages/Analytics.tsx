import { useState } from "react";
import { ExpenseChart } from "@/components";
import {
  FiDollarSign,
  FiCalendar,
  FiPieChart,
  FiChevronLeft,
  FiChevronRight,
} from "@/assets/icons";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for different months with distinct colors
const analyticsData = [
  {
    month: "February",
    year: 2025,
    categoryData: [
      { name: "Food", amount: 3500, percentage: 35, color: "#2da62f" }, // emerald
      {
        name: "Transportation",
        amount: 1800,
        percentage: 18,
        color: "#a22c29",
      }, // auburn
      { name: "Entertainment", amount: 1200, percentage: 12, color: "#4f46e5" }, // indigo
      { name: "Shopping", amount: 2000, percentage: 20, color: "#f59e0b" }, // amber
      { name: "Bills", amount: 800, percentage: 8, color: "#2d9596" }, // teal
      { name: "Others", amount: 700, percentage: 7, color: "#7c3aed" }, // violet
    ],
    weeklyTrends: [
      { week: "Week 1", spending: 920, days: 7 },
      { week: "Week 2", spending: 650, days: 7 },
      { week: "Week 3", spending: 1100, days: 7 },
      { week: "Week 4", spending: 750, days: 7 },
    ],
    topExpenses: [
      {
        description: "Anniversary Dinner",
        amount: 1500,
        category: "Food",
        date: "Feb 25",
      },
      {
        description: "Valentine's Day",
        amount: 1269,
        category: "Food",
        date: "Feb 14",
      },
      {
        description: "Weekly Shopping",
        amount: 1200,
        category: "Shopping",
        date: "Feb 18",
      },
      {
        description: "Clothes Shopping",
        amount: 860,
        category: "Shopping",
        date: "Feb 27",
      },
      {
        description: "Concert Tickets",
        amount: 800,
        category: "Entertainment",
        date: "Feb 20",
      },
    ],
    monthlyBudget: 15000,
  },
  {
    month: "January",
    year: 2025,
    categoryData: [
      { name: "Food", amount: 2800, percentage: 32, color: "#2da62f" }, // emerald
      {
        name: "Transportation",
        amount: 1600,
        percentage: 18,
        color: "#a22c29",
      }, // auburn
      { name: "Entertainment", amount: 900, percentage: 10, color: "#4f46e5" }, // indigo
      { name: "Shopping", amount: 1800, percentage: 21, color: "#f59e0b" }, // amber
      { name: "Bills", amount: 1200, percentage: 14, color: "#2d9596" }, // teal
      { name: "Others", amount: 400, percentage: 5, color: "#7c3aed" }, // violet
    ],
    weeklyTrends: [
      { week: "Week 1", spending: 1200, days: 7 },
      { week: "Week 2", spending: 800, days: 7 },
      { week: "Week 3", spending: 950, days: 7 },
      { week: "Week 4", spending: 1100, days: 7 },
      { week: "Week 5", spending: 650, days: 3 },
    ],
    topExpenses: [
      {
        description: "Rent Payment",
        amount: 1200,
        category: "Bills",
        date: "Jan 1",
      },
      {
        description: "New Year Dinner",
        amount: 980,
        category: "Food",
        date: "Jan 1",
      },
      {
        description: "Winter Clothes",
        amount: 850,
        category: "Shopping",
        date: "Jan 15",
      },
      {
        description: "Grocery Shopping",
        amount: 750,
        category: "Food",
        date: "Jan 10",
      },
      {
        description: "Gas Bill",
        amount: 650,
        category: "Bills",
        date: "Jan 5",
      },
    ],
    monthlyBudget: 14000,
  },
];

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

  const currentData = analyticsData[currentMonthIndex];
  const totalSpent = currentData.categoryData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Calculate days in current month (simplified - using 28 for Feb, 31 for Jan)
  const daysInMonth = currentData.month === "February" ? 28 : 31;
  const avgDailySpending = totalSpent / daysInMonth;
  const budgetRemaining = currentData.monthlyBudget - totalSpent;

  // Calculate universal weekly average (excluding incomplete weeks)
  const completeWeeks = currentData.weeklyTrends.filter(
    (week) => week.days === 7
  );
  const weeklyAverage =
    completeWeeks.reduce((sum, week) => sum + week.spending, 0) /
    completeWeeks.length;

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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ash-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-night-600">
                P{totalSpent.toLocaleString()}
              </p>
            </div>
            <FiDollarSign className="text-night-600" size={24} />
          </div>
        </div>

        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ash-gray-400 text-sm">Daily Average</p>
              <p className="text-2xl font-bold text-night-600">
                P{avgDailySpending.toFixed(0)}
              </p>
            </div>
            <FiCalendar className="text-night-600" size={24} />
          </div>
        </div>

        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ash-gray-400 text-sm">Budget Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  budgetRemaining >= 0 ? "text-night-700" : "text-auburn-500"
                }`}
              >
                P{budgetRemaining.toLocaleString()}
              </p>
            </div>
            <FiPieChart className="text-night-600" size={24} />
          </div>
        </div>
      </div>

      {/* Budget Spending Guide */}
      <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-night-600">
            Spending Guide
          </h3>
          <div className="text-right">
            <p className="text-xs text-ash-gray-400">
              Days remaining in {currentData.month}
            </p>
            <p className="text-lg font-bold text-night-600">
              {Math.max(0, daysInMonth - 14)}
            </p>
          </div>
        </div>

        {budgetRemaining >= 0 ? (
          // Within Budget - Show spending allowances
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily Allowance */}
              <div className="text-center bg-timberwolf-900 p-4 rounded-lg">
                <p className="text-sm text-ash-gray-400 mb-2">DAILY LIMIT</p>
                <p className="text-3xl font-bold text-night-600 mb-2">
                  ₱
                  {Math.round(
                    budgetRemaining / Math.max(1, daysInMonth - 14)
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-ash-gray-500">To stay on budget</p>
              </div>

              {/* Weekly Allowance */}
              <div className="text-center bg-timberwolf-900 p-4 rounded-lg">
                <p className="text-sm text-ash-gray-400 mb-2">WEEKLY LIMIT</p>
                <p className="text-3xl font-bold text-night-600 mb-2">
                  ₱
                  {Math.round(
                    (budgetRemaining / Math.max(1, daysInMonth - 14)) * 7
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-ash-gray-500">For the next 7 days</p>
              </div>

              {/* Budget Progress */}
              <div className="text-center bg-timberwolf-900 p-4 rounded-lg">
                <p className="text-sm text-ash-gray-400 mb-2">BUDGET USED</p>
                <p className="text-3xl font-bold text-night-600 mb-2">
                  {Math.round((totalSpent / currentData.monthlyBudget) * 100)}%
                </p>
                <p className="text-xs text-ash-gray-500">
                  ₱{totalSpent.toLocaleString()} of ₱
                  {currentData.monthlyBudget.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Quick Tips */}
            <div className="mt-8 pt-6 border-t border-ash-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-night-700 rounded-full"></div>
                  <p className="text-sm text-ash-gray-400">
                    <span className="font-semibold text-night-600">
                      Target:
                    </span>{" "}
                    Under ₱
                    {Math.round(
                      budgetRemaining / Math.max(1, daysInMonth - 14)
                    ).toLocaleString()}
                    /day
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-night-700 rounded-full"></div>
                  <p className="text-sm text-ash-gray-400">
                    <span className="font-semibold text-night-600">
                      Current Avg:
                    </span>{" "}
                    ₱{avgDailySpending.toFixed(0)}/day
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Over Budget - Show recovery information
          <div className="bg-auburn-900 p-6 rounded-lg border border-auburn-800">
            <div className="flex items-center space-x-3 mb-4">
              <FiDollarSign className="text-auburn-500" size={20} />
              <div>
                <h4 className="font-semibold text-auburn-500">
                  Budget Exceeded
                </h4>
                <p className="text-sm text-timberwolf-700">
                  You've overspent by ₱
                  {Math.abs(budgetRemaining).toLocaleString()} this month
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-timberwolf-700 mb-1">
                  Total overspend
                </p>
                <p className="text-lg font-bold text-auburn-500">
                  ₱{Math.abs(budgetRemaining).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-timberwolf-700 mb-1">
                  Daily average over
                </p>
                <p className="text-lg font-bold text-auburn-500">
                  ₱{Math.round(Math.abs(budgetRemaining) / 14).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-timberwolf-700 mb-1">Budget usage</p>
                <p className="text-lg font-bold text-auburn-500">
                  {Math.round((totalSpent / currentData.monthlyBudget) * 100)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expense Chart from Home */}
        <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg">
          <ExpenseChart />
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
            {currentData.topExpenses.slice(0, 6).map((expense, index) => (
              <div
                key={index}
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
