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
import { format, parseISO } from "date-fns";
import { formatAxisTick, formatWeekRange } from "@/utils";

type ChartView = "weekly" | "daily";

interface DailyChartDatum {
  date: string;
  total: number;
}

interface WeeklyChartDatum {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  total: number;
  days: number;
  dailyAverage: number;
}

interface ExpenseChartProps {
  dailyChartsData: DailyChartDatum[];
  weeklyChartsData: WeeklyChartDatum[];
}

// Custom tick for weekly X axis (shows week number and date range)
function WeeklyXAxisTick({ x, y, payload, weeklyData }: any) {
  const weekData = weeklyData.find((w: any) => w.weekNumber === payload.value);
  const dateRange = formatWeekRange(
    weekData.weekStartDate,
    weekData.weekEndDate
  );

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="var(--color-night-700)"
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
          fill="var(--color-night-700)"
          fontSize="8"
        >
          {dateRange}
        </text>
      )}
    </g>
  );
}

// Tooltip for chart points (shows week/day details)
function CustomTooltip({ active, payload, label }: any) {
  const { currency } = useCurrencyContext();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.total;
    const days = data.days;
    const dailyAverage = data.dailyAverage;
    const title =
      (data.weekNumber && `Week ${data.weekNumber}`) ||
      (data.date && format(parseISO(data.date), "MMMM d")) ||
      label;
    const dateRange =
      data.weekStartDate && data.weekEndDate
        ? formatWeekRange(data.weekStartDate, data.weekEndDate)
        : "";

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
            {total}
          </p>
          {days && days > 1 && (
            <p className="text-night-500 text-xs md:text-sm">
              <span className="font-medium">Daily Average:</span> {currency}
              {dailyAverage.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
}

function ExpenseChart({
  dailyChartsData = [],
  weeklyChartsData = [],
}: ExpenseChartProps) {
  const [chartView, setChartView] = useState<ChartView>("daily");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find the max value for Y-axis scaling
  const maxDailyValue = Math.max(...dailyChartsData.map((d) => d.total), 0);
  const maxWeeklyValue = Math.max(...weeklyChartsData.map((d) => d.total), 0);

  // Fixed spacing for daily chart - ensures consistent spacing regardless of data length
  const DAILY_POINT_SPACING = 50; // pixels between each day
  const MIN_CHART_WIDTH = 400;

  // Chart width: use consistent spacing for daily view
  const chartWidth =
    chartView === "daily"
      ? Math.max(MIN_CHART_WIDTH, dailyChartsData.length * DAILY_POINT_SPACING)
      : "100%";

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
            className={`cursor-pointer px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              chartView === "daily"
                ? "bg-night-600 text-timberwolf-900"
                : "text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setChartView("weekly")}
            className={`cursor-pointer px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
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
              <BarChart data={weeklyChartsData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--color-timberwolf-500)"
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
                  tickFormatter={formatAxisTick}
                  tickCount={5}
                  domain={[0, Math.max(maxWeeklyValue + 100, 500)]}
                  tick={{ fontSize: 9, fill: "var(--color-night-700)" }}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {weeklyChartsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="var(--color-auburn-500)" />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={dailyChartsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-timberwolf-500)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 8, fill: "var(--color-night-700)" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  tickFormatter={(dateStr) =>
                    format(parseISO(dateStr), "MMM. d")
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatAxisTick}
                  tickCount={5}
                  domain={[0, Math.max(maxDailyValue + 100, 500)]}
                  tick={{ fontSize: 9, fill: "var(--color-night-700)" }}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-auburn-500)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-auburn-500)", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "var(--color-auburn-500)", strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scroll Indicator for Daily View */}
      {chartView === "daily" &&
        dailyChartsData.length * DAILY_POINT_SPACING > MIN_CHART_WIDTH && (
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
