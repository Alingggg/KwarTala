const PREDEFINED_COLORS: { [key: string]: string } = {
  bills: "#FECA57",
  entertainment: "#45B7D1",
  food: "#FF6B6B",
  healthcare: "#FF9FF3",
  shopping: "#00B894",
  transportation: "#4ECDC4",
  others: "#A29BFE",
};

const FALLBACK_COLORS = [
  "#C0392B", // red
  "#27AE60", // green
  "#F39C12", // orange
  "#8E44AD", // purple
  "#2980B9", // blue
  "#D35400", // dark orange
  "#16A085", // teal
  "#2C3E50", // dark gray-blue
  "#F1C40F", // yellow
  "#7D3C98", // plum
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
