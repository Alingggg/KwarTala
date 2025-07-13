import { useState } from "react";
import { ExpenseChart } from "@/components";
import {
  FiDollarSign,
  FiCalendar,
  FiPieChart,
  FiChevronLeft,
  FiChevronRight,
} from "@/assets/icons";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Sample data for different months
const analyticsData = [
  {
    month: "February",
    year: 2025,
    categoryData: [
      { name: "Food", amount: 3500, percentage: 35, color: "#54876e" },
      {
        name: "Transportation",
        amount: 1800,
        percentage: 18,
        color: "#a22c29",
      },
      { name: "Entertainment", amount: 1200, percentage: 12, color: "#999b7a" },
      { name: "Shopping", amount: 2000, percentage: 20, color: "#902923" },
      { name: "Bills", amount: 800, percentage: 8, color: "#757759" },
      { name: "Others", amount: 700, percentage: 7, color: "#832221" },
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
      { name: "Food", amount: 2800, percentage: 32, color: "#54876e" },
      {
        name: "Transportation",
        amount: 1600,
        percentage: 18,
        color: "#a22c29",
      },
      { name: "Entertainment", amount: 900, percentage: 10, color: "#999b7a" },
      { name: "Shopping", amount: 1800, percentage: 21, color: "#902923" },
      { name: "Bills", amount: 1200, percentage: 14, color: "#757759" },
      { name: "Others", amount: 400, percentage: 5, color: "#832221" },
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
      <div className="relative mb-6">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMonth("prev")}
          disabled={currentMonthIndex === analyticsData.length - 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          disabled={currentMonthIndex === 0}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Month Header */}
        <div className="text-center py-4">
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
        <div className="bg-ash-gray-900 p-6 rounded-lg">
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

        <div className="bg-ash-gray-900 p-6 rounded-lg">
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

        <div className="bg-ash-gray-900 p-6 rounded-lg">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expense Chart from Home */}
        <div className="bg-ash-gray-900 p-6 rounded-lg">
          <ExpenseChart />
        </div>

        {/* Category Breakdown - Combined Pie Chart and List */}
        <div className="bg-ash-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-night-600 mb-4">
            Expenses by Category
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="amount"
                    label={false}
                  >
                    {currentData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      `P${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {currentData.categoryData.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-night-600 truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-semibold text-night-600">
                      P{category.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-ash-gray-400">
                      {category.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trends with Average Line */}
        <div className="bg-ash-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-night-600 mb-4">
            Weekly Spending Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2f4b3d" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#999b7a" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#999b7a" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `P${value.toLocaleString()}`,
                    "Weekly Spending",
                  ]}
                />
                <ReferenceLine
                  y={weeklyAverage}
                  stroke="#54876e"
                  strokeDasharray="5 5"
                  label={{
                    value: `Avg: P${weeklyAverage.toFixed(0)}`,
                    position: "top",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="#a22c29"
                  strokeWidth={3}
                  dot={{ fill: "#a22c29", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#a22c29" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Expenses */}
        <div className="bg-ash-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-night-600 mb-4">
            Top Expenses
          </h3>
          <div className="space-y-4">
            {currentData.topExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-ash-gray-700 last:border-b-0"
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
                  P{expense.amount.toLocaleString()}
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
