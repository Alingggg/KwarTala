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

// Sample data structure for different views
const weeklyData = [
  { name: "Week 1", total: 2400, days: 7 },
  { name: "Week 2", total: 1398, days: 7 },
  { name: "Week 3", total: 9800, days: 7 },
  { name: "Week 4", total: 3908, days: 7 },
  { name: "Week 5", total: 4800, days: 5 }, // Current week might have fewer days
];

const monthlyData = [
  { name: "Feb '24", total: 13570, days: 29 },
  { name: "Mar '24", total: 8940, days: 31 },
  { name: "Apr '24", total: 12350, days: 30 },
  { name: "May '24", total: 9780, days: 31 },
  { name: "Jun '24", total: 11200, days: 30 },
  { name: "Jul '24", total: 10500, days: 31 },
  { name: "Aug '24", total: 9800, days: 31 },
  { name: "Sep '24", total: 12400, days: 30 },
  { name: "Oct '24", total: 8900, days: 31 },
  { name: "Nov '24", total: 10200, days: 30 },
  { name: "Dec '24", total: 11800, days: 31 },
  { name: "Jan '25", total: 9500, days: 31 },
];

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
    const dailyAverage = total / days;

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

function ExpenseChart() {
  const [chartView, setChartView] = useState<ChartView>("weekly");
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
