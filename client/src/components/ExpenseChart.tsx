import { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { mockData as allMonthsData } from "@/assets/mockData";
import { useCurrencyContext } from "@/hooks";

// Returns daily chart data for the given month index
const getDailyChartData = (monthIndex: number) => {
  const month = allMonthsData[monthIndex];
  if (!month) return [];

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

  const monthIndex2 = monthIndexMap[month.month];
  const year = month.year;
  const daysInMonth = new Date(year, monthIndex2 + 1, 0).getDate();

  // Build an array with an entry for each day of the month
  const dailyData = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    let dayTotal = 0;

    // Sum all transactions for this day
    month.weeks.forEach((week) => {
      week.transactions.forEach((transaction) => {
        // Extract day from transaction date (e.g., "Mar. 15" -> 15)
        const transactionDay = parseInt(transaction.date.split(". ")[1]);
        if (transactionDay === day) {
          dayTotal += transaction.amount;
        }
      });
    });

    // Format display name with month abbreviation
    const monthAbbr = month.month.slice(0, 3);

    return {
      name: `${monthAbbr} ${day}`,
      day: day,
      total: dayTotal,
      days: 1,
    };
  });

  return dailyData;
};

// Returns weekly chart data for the given month index
const getWeeklyChartData = (monthIndex: number) => {
  const month = allMonthsData[monthIndex];
  if (!month) return [];

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

  const monthIndex2 = monthIndexMap[month.month];
  const year = month.year;

  return month.weeks.map((week) => {
    // Calculate the date range for each week
    const startDay = (week.weekNumber - 1) * 7 + 1;
    const endDay = Math.min(
      startDay + week.daysInWeek - 1,
      new Date(year, monthIndex2 + 1, 0).getDate()
    );

    // Format the date range with month abbreviation
    const monthAbbr = month.month.slice(0, 3);
    const dateRange =
      startDay === endDay
        ? `${monthAbbr}. ${startDay}`
        : `${monthAbbr}. ${startDay}-${endDay}`;

    return {
      name: `Week ${week.weekNumber}`,
      dateRange: dateRange,
      total: week.weeklyTotal,
      days: week.daysInWeek,
      dailyAverage: week.dailyAverage,
    };
  });
};

// Formats Y-axis ticks (e.g., 1000 -> 1k)
function tickFormatter(value: any): string {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  if (numValue >= 1000) {
    return `${numValue / 1000}k`;
  }
  return String(numValue);
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  const { currency } = useCurrencyContext();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.total;
    const days = data.days;
    const dailyAverage = data.dailyAverage;

    return (
      <div className="bg-timberwolf-900 border border-night-700 p-2 md:p-3 rounded-lg shadow-lg max-w-xs">
        <p className="text-night-600 font-semibold mb-1 md:mb-2 text-sm md:text-base">
          {data.name || label}
        </p>
        {data.dateRange && (
          <p className="text-night-500 text-xs mb-1 md:mb-2">
            {data.dateRange}
          </p>
        )}
        <div className="space-y-1">
          <p className="text-night-500 text-xs md:text-sm">
            <span className="font-medium">Total:</span> {currency}
            {total.toLocaleString()}
          </p>
          {days > 1 && (
            <p className="text-night-500 text-xs md:text-sm">
              <span className="font-medium">Daily Average:</span> {currency}
              {dailyAverage.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

type ChartView = "weekly" | "daily";

interface ExpenseChartProps {
  // Optionally specify which month's data to show (defaults to first month)
  monthIndex?: number;
}

function ExpenseChart({ monthIndex = 0 }: ExpenseChartProps) {
  const [chartView, setChartView] = useState<ChartView>("daily");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const weeklyData = getWeeklyChartData(monthIndex);
  const allDailyData = getDailyChartData(monthIndex);

  const currentData = chartView === "weekly" ? weeklyData : allDailyData;

  // Find the max value for Y-axis scaling in daily view
  const maxDailyValue = Math.max(...allDailyData.map((d) => d.total));

  // Chart width: wider for daily view to allow horizontal scrolling
  const chartWidth =
    chartView === "daily" ? Math.max(600, allDailyData.length * 35) : "100%";

  // Custom tick for weekly X axis (shows week and date range)
  const WeeklyXAxisTick = ({ x, y, payload }: any) => {
    const weekData = weeklyData.find((w) => w.name === payload.value);

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#999b7a"
          fontSize="10"
          fontWeight="500"
        >
          {payload.value}
        </text>
        {weekData && (
          <text
            x={0}
            y={0}
            dy={28}
            textAnchor="middle"
            fill="#999b7a"
            fontSize="8"
          >
            {weekData.dateRange}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="h-full flex flex-col bg-timberwolf-900">
      {/* Chart Header with Toggle */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold text-night-600">
          {chartView === "weekly" ? "Weekly" : "Daily"} Expenses
        </h3>

        {/* View Toggle */}
        <div className="flex bg-timberwolf-700 rounded-lg p-1">
          <button
            onClick={() => setChartView("daily")}
            className={`px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              chartView === "daily"
                ? "bg-night-600 text-timberwolf-900"
                : "text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setChartView("weekly")}
            className={`px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              chartView === "weekly"
                ? "bg-night-600 text-timberwolf-900"
                : "text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Scrollable Chart Container */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar-arrows"
        ref={scrollContainerRef}
      >
        <div style={{ width: chartWidth, height: "100%", minHeight: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "weekly" ? (
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
                  tick={WeeklyXAxisTick}
                  textAnchor="middle"
                  height={45}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatter}
                  tickCount={5}
                  domain={[0, "dataMax + 1000"]}
                  tick={{ fontSize: 9, fill: "#999b7a" }}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {currentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#a22c29" />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2f4b3d" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 8, fill: "#999b7a" }}
                  interval={0} // Show all labels
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatter}
                  tickCount={5}
                  domain={[0, Math.max(maxDailyValue + 500, 1000)]}
                  tick={{ fontSize: 9, fill: "#999b7a" }}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#a22c29"
                  strokeWidth={2}
                  dot={{ fill: "#a22c29", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#a22c29", strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scroll Indicator for Daily View */}
      {chartView === "daily" && (
        <div className="mt-2 text-center">
          <span className="text-xs text-night-600">
            ← Scroll horizontally to view all {allDailyData.length} days →
          </span>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;
