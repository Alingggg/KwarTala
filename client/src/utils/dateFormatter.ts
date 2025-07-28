function formatDate(
  date: string,
  options: {
    includeYear?: boolean;
    includeMonth?: boolean;
    includeDay?: boolean;
  }
): string {
  const { includeYear, includeMonth, includeDay } = options;

  const dateObj = new Date(date);

  const formatOptions: Intl.DateTimeFormatOptions = {
    ...(includeYear && { year: "numeric" }),
    ...(includeMonth && { month: "long" }),
    ...(includeDay && { day: "numeric" }),
  };

  return dateObj.toLocaleDateString("en-US", formatOptions);
}

export { formatDate };
