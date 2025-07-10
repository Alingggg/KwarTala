import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Week 1", pv: 2400 },
  { name: "Week 2", pv: 1398 },
  { name: "Week 3", pv: 9800 },
  { name: "Week 4", pv: 3908 },
  { name: "Week 5", pv: 4800 },
  { name: "Week 6", pv: 3800 },
];

function ExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -35, bottom: -10 }}>
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={false} />
        <YAxis tickLine={false} axisLine={false} tick={false} />
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
