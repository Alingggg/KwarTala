import { format, parseISO } from "date-fns";

function formatWeekRange(start: string, end: string) {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${format(startDate, "MMM. d")}-${format(endDate, "d")}`;
  }
  return `${format(startDate, "MMM. d")} - ${format(endDate, "MMM. d")}`;
}

function formatAxisTick(value: unknown): string {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  if (numValue >= 1000) {
    const kValue = numValue / 1000;
    if (kValue % 1 === 0 || kValue >= 10) {
      return `${Math.round(kValue)}k`;
    }
    return `${kValue.toFixed(1)}k`;
  }
  return String(numValue);
}

export { formatWeekRange, formatAxisTick };
