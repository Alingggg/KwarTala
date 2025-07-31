const PREDEFINED_COLORS: { [key: string]: string } = {
  food: "#FF6B6B",
  transportation: "#4ECDC4",
  entertainment: "#45B7D1",
  shopping: "#96CEB4",
  bills: "#FECA57",
  healthcare: "#FF9FF3",
  utilities: "#A29BFE",
  groceries: "#00B894",
  dining: "#E17055",
  gas: "#F39C12",
};

const FALLBACK_COLORS = [
  "#54A0FF",
  "#FD79A8",
  "#6C5CE7",
  "#74B9FF",
  "#00CEC9",
  "#FDCB6E",
  "#E74C3C",
  "#9B59B6",
  "#3498DB",
  "#1ABC9C",
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function assignCategoryColors(expenses: any[]) {
  if (!expenses || !Array.isArray(expenses)) {
    return [];
  }

  return expenses.map((expense: any) => {
    const normalizedName = expense.category.toLowerCase().trim();

    if (PREDEFINED_COLORS[normalizedName]) {
      return {
        ...expense,
        color: PREDEFINED_COLORS[normalizedName],
      };
    }

    const hash = hashString(expense.category);
    const colorIndex = hash % FALLBACK_COLORS.length;

    return {
      ...expense,
      color: FALLBACK_COLORS[colorIndex],
    };
  });
}

export default assignCategoryColors;
