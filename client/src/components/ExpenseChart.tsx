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

const data = [
  { name: "Week 1", pv: 2400 },
  { name: "Week 2", pv: 1398 },
  { name: "Week 3", pv: 9800 },
  { name: "Week 4", pv: 3908 },
  { name: "Week 5", pv: 4800 },
  { name: "Week 6", pv: 3800 },
];

function tickFormatter(value: any) {
  if (value >= 1000) {
    return `${value / 1000}k`;
  }
  return value;
}

function ExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#2f4b3d"
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#999b7a" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={tickFormatter}
          tickCount={6}
          domain={[0, "dataMax + 1000"]}
          tick={{ fontSize: 12, fill: "#999b7a" }}
        />
        <Tooltip
          cursor={{ fill: "rgba(185, 186, 163, 0.1)" }}
          contentStyle={{
            background: "rgba(10, 16, 13, 0.8)",
            borderColor: "#54876e",
            color: "#f7f6f4",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="pv" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="#a22c29" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ExpenseChart;
