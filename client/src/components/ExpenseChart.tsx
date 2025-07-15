import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { mockData as allMonthsData } from "@/assets/mockData";

// --- Helper Functions ---

// Generate monthly data for the chart from all available data
const getMonthlyChartData = () => {
  const monthIndexMap: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  return allMonthsData
    .map((month) => {
      const monthIndex = monthIndexMap[month.month];
      const daysInMonth = new Date(month.year, monthIndex + 1, 0).getDate();
      return {
        name: `${month.month.slice(0, 3)} '${String(month.year).slice(2)}`,
        total: month.monthlyTotal,
        days: daysInMonth,
      };
    })
    .reverse(); // Show most recent month last
};

// Generate weekly data for a specific month index
const getWeeklyChartData = (monthIndex: number) => {
  const month = allMonthsData[monthIndex];
  if (!month) return [];

  return month.weeks.map((week) => ({
    name: `Week ${week.weekNumber}`,
    total: week.weeklyTotal,
    days: week.daysInWeek, // Use the new daysInWeek field
  }));
};

function tickFormatter(value: any): string {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  if (numValue >= 1000) {
    return `${numValue / 1000}k`;
  }
  return String(numValue);
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.total;
    const days = data.days;
    const dailyAverage = days > 0 ? total / days : 0; // Avoid division by zero

    return (
      <div className="bg-ash-gray-900 border border-night-700 p-3 rounded-lg shadow-lg">
        <p className="text-night-600 font-semibold mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-night-500 text-sm">
            <span className="font-medium">Total:</span> P
            {total.toLocaleString()}
          </p>
          <p className="text-night-500 text-sm">
            <span className="font-medium">Daily Average:</span> P
            {dailyAverage.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

type ChartView = "weekly" | "monthly";

interface ExpenseChartProps {
  // Optional prop to specify which month's weekly data to show.
  // Defaults to the first month if not provided.
  monthIndex?: number;
}

function ExpenseChart({ monthIndex = 0 }: ExpenseChartProps) {
  const [chartView, setChartView] = useState<ChartView>("weekly");

  // The component now fetches and processes its own data
  const weeklyData = getWeeklyChartData(monthIndex);
  const monthlyData = getMonthlyChartData();

  const currentData = chartView === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="h-full flex flex-col">
      {/* Chart Header with Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-night-600">
          {chartView === "weekly" ? "Weekly" : "Monthly"} Expenses
        </h3>

        {/* View Toggle */}
        <div className="flex bg-timberwolf-700 rounded-lg p-1">
          <button
            onClick={() => setChartView("weekly")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chartView === "weekly"
                ? "bg-night-600 text-timberwolf-900"
                : "text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setChartView("monthly")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chartView === "monthly"
                ? "bg-night-600 text-timberwolf-900"
                : "text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#2f4b3d"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#999b7a" }}
              angle={chartView === "monthly" ? -45 : 0}
              textAnchor={chartView === "monthly" ? "end" : "middle"}
              height={chartView === "monthly" ? 50 : 30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
              tickCount={6}
              domain={[0, "dataMax + 1000"]}
              tick={{ fontSize: 10, fill: "#999b7a" }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {currentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#a22c29" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;
