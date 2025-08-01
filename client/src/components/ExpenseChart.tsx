import { useState, useRef, useEffect } from "react";
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
import { useCurrencyContext } from "@/hooks";

type ChartView = "weekly" | "daily";

interface DailyChartDatum {
  date: string | Date;
  total: number;
}

interface WeeklyChartDatum {
  weekNumber: number;
  weekStartDate: string | Date;
  weekEndDate: string | Date;
  total: number;
  days: number;
  dailyAverage: number;
}

interface ExpenseChartProps {
  dailyChartsData: DailyChartDatum[];
  weeklyChartsData: WeeklyChartDatum[];
}

function tickFormatter(value: any): string {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  if (numValue >= 1000) {
    const kValue = numValue / 1000;
    // Only show decimal if it's not a whole number and less than 10k
    if (kValue % 1 === 0 || kValue >= 10) {
      return `${Math.round(kValue)}k`;
    } else {
      return `${kValue.toFixed(1)}k`;
    }
  }
  return String(numValue);
}

// Custom tooltip for the chart
function CustomTooltip({ active, payload, label }: any) {
  const { currency } = useCurrencyContext();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.total;
    const days = data.days;
    const dailyAverage = data.dailyAverage;
    const title =
      (data.weekNumber && `Week ${data.weekNumber}`) ||
      (data.date &&
        new Date(data.date).toLocaleDateString("default", {
          month: "long",
          day: "numeric",
        })) ||
      label;
    const dateRange = `${new Date(data.weekStartDate).toLocaleString(
      "default",
      {
        month: "short",
      }
    )}. ${new Date(data.weekStartDate).getDate()}-${new Date(
      data.weekEndDate
    ).getDate()}`;

    return (
      <div className="bg-timberwolf-900 border border-night-700 p-2 md:p-3 rounded-lg shadow-lg max-w-xs">
        <p className="text-night-600 font-semibold mb-1 md:mb-2 text-sm md:text-base">
          {title}
        </p>
        {dateRange && (
          <p className="text-night-500 text-xs mb-1 md:mb-2">{dateRange}</p>
        )}
        <div className="space-y-1">
          <p className="text-night-500 text-xs md:text-sm">
            <span className="font-medium">Total:</span> {currency}
            {total.toLocaleString()}
          </p>
          {days && days > 1 && (
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
}

// Custom tick for weekly X axis (shows week and date range)
function WeeklyXAxisTick({ x, y, payload, weeklyData }: any) {
  const weekData = weeklyData.find((w: any) => w.weekNumber === payload.value);
  const dateRange = weekData
    ? `${new Date(weekData.weekStartDate).toLocaleString("default", {
        month: "short",
      })}. ${new Date(weekData.weekStartDate).getDate()}-${new Date(
        weekData.weekEndDate
      ).getDate()}`
    : "";

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
        {`Week ${payload.value}`}
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
          {dateRange}
        </text>
      )}
    </g>
  );
}

function monthAbbrevTick(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month}. ${day}`;
}

function ExpenseChart({
  dailyChartsData = [],
  weeklyChartsData = [],
}: ExpenseChartProps) {
  const [chartView, setChartView] = useState<ChartView>("daily");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentData =
    chartView === "weekly" ? weeklyChartsData : dailyChartsData;

  // Find the max value for Y-axis scaling
  const maxDailyValue = Math.max(...dailyChartsData.map((d) => d.total), 0);
  const maxWeeklyValue = Math.max(...weeklyChartsData.map((d) => d.total), 0);

  // Chart width: wider for daily view to allow horizontal scrolling
  const chartWidth =
    chartView === "daily" ? Math.max(600, dailyChartsData.length * 35) : "100%";

  // Auto-scroll to end when daily view is active
  useEffect(() => {
    if (chartView === "daily" && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [chartView, dailyChartsData.length]);

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
                  dataKey="weekNumber"
                  tickLine={false}
                  axisLine={false}
                  tick={(props) => (
                    <WeeklyXAxisTick {...props} weeklyData={weeklyChartsData} />
                  )}
                  textAnchor="middle"
                  height={45}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatter}
                  tickCount={5}
                  domain={[0, Math.max(maxWeeklyValue + 100, 500)]}
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
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 8, fill: "#999b7a" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  tickFormatter={monthAbbrevTick}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatter}
                  tickCount={5}
                  domain={[0, Math.max(maxDailyValue + 100, 500)]}
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
            ← Scroll horizontally to view all {dailyChartsData.length} days →
          </span>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;
