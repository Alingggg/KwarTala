export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  iconColor: string;
}

export interface WeekData {
  weekNumber: number;
  transactions: Transaction[];
  weeklyTotal: number;
  weeklyBudget: number;
  weeklyRemaining: number;
  daysInWeek: number; // Add a field for the number of days in the week
}

// New interface for pre-calculated category data
export interface CategoryAnalytics {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthData {
  month: string;
  year: number;
  monthlyTotal: number;
  monthlyBudget: number;
  remaining: number;
  weeks: WeekData[];
  categoryData: CategoryAnalytics[];
  topExpenses: Transaction[];
  avgDailySpending: number;
  dailyLimit: number;
  budgetUsedPercentage: number;
  daysRemaining: number;
  recentTransactions: Transaction[]; // Add recent transactions
}

export const mockData: MonthData[] = [
  {
    month: "March",
    year: 2025,
    monthlyTotal: 10210,
    monthlyBudget: 15000,
    remaining: 4790,
    weeks: [
      {
        weekNumber: 1,
        weeklyTotal: 728, // Recalculated
        weeklyBudget: 3500,
        weeklyRemaining: 2772, // Recalculated
        daysInWeek: 7,
        transactions: [
          {
            id: "1",
            date: "Mar. 1",
            category: "Breakfast",
            amount: 75,
            description: "Coffee Shop",
            iconColor: "bg-orange-500",
          },
          {
            id: "2",
            date: "Mar. 2",
            category: "Lunch",
            amount: 120,
            description: "Restaurant",
            iconColor: "bg-green-500",
          },
          {
            id: "3",
            date: "Mar. 3",
            category: "Dinner",
            amount: 230,
            description: "Dinner Date",
            iconColor: "bg-blue-500",
          },
          {
            id: "4",
            date: "Mar. 4",
            category: "Miscellaneous",
            amount: 210,
            description: "Shopping",
            iconColor: "bg-purple-500",
          },
          {
            id: "5",
            date: "Mar. 5",
            category: "Others",
            amount: 93,
            description: "Gas",
            iconColor: "bg-red-500",
          },
        ],
      },
      {
        weekNumber: 2,
        weeklyTotal: 1707, // Recalculated
        weeklyBudget: 3500,
        weeklyRemaining: 1793, // Recalculated
        daysInWeek: 7,
        transactions: [
          {
            id: "6",
            date: "Mar. 11",
            category: "Lunch",
            amount: 211,
            description: "Fast Food",
            iconColor: "bg-green-500",
          },
          {
            id: "7",
            date: "Mar. 14",
            category: "Dinner",
            amount: 1269,
            description: "Special Occasion",
            iconColor: "bg-blue-500",
          },
          {
            id: "8",
            date: "Mar. 15",
            category: "Breakfast",
            amount: 227,
            description: "Brunch",
            iconColor: "bg-orange-500",
          },
        ],
      },
      {
        weekNumber: 3,
        weeklyTotal: 2400, // Recalculated
        weeklyBudget: 3500,
        weeklyRemaining: 1100, // Recalculated
        daysInWeek: 7,
        transactions: [
          {
            id: "9",
            date: "Mar. 18",
            category: "Grocery",
            amount: 1200,
            description: "Weekly Shopping",
            iconColor: "bg-yellow-500",
          },
          {
            id: "10",
            date: "Mar. 20",
            category: "Entertainment",
            amount: 800,
            description: "Concert",
            iconColor: "bg-pink-500",
          },
          {
            id: "11",
            date: "Mar. 22",
            category: "Transport",
            amount: 400,
            description: "Uber",
            iconColor: "bg-indigo-500",
          },
        ],
      },
      {
        weekNumber: 4,
        weeklyTotal: 1500, // Recalculated
        weeklyBudget: 3500,
        weeklyRemaining: 2000, // Recalculated
        daysInWeek: 7,
        transactions: [
          {
            id: "12",
            date: "Mar. 25",
            category: "Dinner",
            amount: 1500,
            description: "Anniversary",
            iconColor: "bg-blue-500",
          },
        ],
      },
      {
        weekNumber: 5,
        weeklyTotal: 1875, // Contains transactions for the rest of the month
        weeklyBudget: 1000, // Lower budget for fewer days
        weeklyRemaining: -875, // Recalculated
        daysInWeek: 3, // March has 31 days, so 31-28=3
        transactions: [
          {
            id: "13",
            date: "Mar. 29",
            category: "Shopping",
            amount: 860,
            description: "Clothes",
            iconColor: "bg-purple-500",
          },
          {
            id: "19", // New transaction
            date: "Mar. 30",
            category: "Bills",
            amount: 1015,
            description: "Internet Bill",
            iconColor: "bg-teal-500",
          },
        ],
      },
    ],
    // Pre-calculated analytics for March
    categoryData: [
      { name: "Food", amount: 4606, percentage: 45, color: "#2da62f" },
      { name: "Bills", amount: 1015, percentage: 10, color: "#2d9596" },
      { name: "Shopping", amount: 860, percentage: 8, color: "#f59e0b" },
      { name: "Entertainment", amount: 800, percentage: 8, color: "#4f46e5" },
      { name: "Transportation", amount: 400, percentage: 4, color: "#a22c29" },
      { name: "Others", amount: 303, percentage: 3, color: "#7c3aed" },
    ],
    topExpenses: [
      {
        id: "12",
        date: "Mar. 25",
        category: "Dinner",
        amount: 1500,
        description: "Anniversary",
        iconColor: "bg-blue-500",
      },
      {
        id: "7",
        date: "Mar. 14",
        category: "Dinner",
        amount: 1269,
        description: "Special Occasion",
        iconColor: "bg-blue-500",
      },
      {
        id: "9",
        date: "Mar. 18",
        category: "Grocery",
        amount: 1200,
        description: "Weekly Shopping",
        iconColor: "bg-yellow-500",
      },
      {
        id: "19",
        date: "Mar. 30",
        category: "Bills",
        amount: 1015,
        description: "Internet Bill",
        iconColor: "bg-teal-500",
      },
      {
        id: "13",
        date: "Mar. 29",
        category: "Shopping",
        amount: 860,
        description: "Clothes",
        iconColor: "bg-purple-500",
      },
    ],
    // Additional pre-calculated analytics for March
    avgDailySpending: 329, // 10210 / 31 days
    dailyLimit: 282, // 4790 / 17 days remaining (example)
    budgetUsedPercentage: 68, // (10210 / 15000) * 100
    daysRemaining: 17, // Example: 31 days - 14 days passed
    recentTransactions: [
      {
        id: "19",
        date: "Mar. 30",
        category: "Bills",
        amount: 1015,
        description: "Internet Bill",
        iconColor: "bg-teal-500",
      },
      {
        id: "13",
        date: "Mar. 29",
        category: "Shopping",
        amount: 860,
        description: "Clothes",
        iconColor: "bg-purple-500",
      },
      {
        id: "12",
        date: "Mar. 25",
        category: "Dinner",
        amount: 1500,
        description: "Anniversary",
        iconColor: "bg-blue-500",
      },
      {
        id: "11",
        date: "Mar. 22",
        category: "Transport",
        amount: 400,
        description: "Uber",
        iconColor: "bg-indigo-500",
      },
      {
        id: "10",
        date: "Mar. 20",
        category: "Entertainment",
        amount: 800,
        description: "Concert",
        iconColor: "bg-pink-500",
      },
      {
        id: "9",
        date: "Mar. 18",
        category: "Grocery",
        amount: 1200,
        description: "Weekly Shopping",
        iconColor: "bg-yellow-500",
      },
      {
        id: "8",
        date: "Mar. 15",
        category: "Breakfast",
        amount: 227,
        description: "Brunch",
        iconColor: "bg-orange-500",
      },
      {
        id: "7",
        date: "Mar. 14",
        category: "Dinner",
        amount: 1269,
        description: "Special Occasion",
        iconColor: "bg-blue-500",
      },
      {
        id: "6",
        date: "Mar. 11",
        category: "Lunch",
        amount: 211,
        description: "Fast Food",
        iconColor: "bg-green-500",
      },
      {
        id: "5",
        date: "Mar. 5",
        category: "Others",
        amount: 93,
        description: "Gas",
        iconColor: "bg-red-500",
      },
    ],
  },
  {
    month: "January",
    year: 2025,
    monthlyTotal: 8700,
    monthlyBudget: 14000,
    remaining: 5300,
    weeks: [
      {
        weekNumber: 1,
        weeklyTotal: 2830,
        weeklyBudget: 3000,
        weeklyRemaining: 170,
        daysInWeek: 7,
        transactions: [
          {
            id: "14",
            date: "Jan. 1",
            category: "Bills",
            amount: 1200,
            description: "Rent Payment",
            iconColor: "bg-teal-500",
          },
          {
            id: "15",
            date: "Jan. 1",
            category: "Food",
            amount: 980,
            description: "New Year Dinner",
            iconColor: "bg-green-500",
          },
          {
            id: "16",
            date: "Jan. 5",
            category: "Bills",
            amount: 650,
            description: "Gas Bill",
            iconColor: "bg-teal-500",
          },
        ],
      },
      {
        weekNumber: 2,
        weeklyTotal: 750,
        weeklyBudget: 3000,
        weeklyRemaining: 2250,
        daysInWeek: 7,
        transactions: [
          {
            id: "17",
            date: "Jan. 10",
            category: "Food",
            amount: 750,
            description: "Grocery Shopping",
            iconColor: "bg-green-500",
          },
        ],
      },
      {
        weekNumber: 3,
        weeklyTotal: 850,
        weeklyBudget: 3000,
        weeklyRemaining: 2150,
        daysInWeek: 7,
        transactions: [
          {
            id: "18",
            date: "Jan. 15",
            category: "Shopping",
            amount: 850,
            description: "Winter Clothes",
            iconColor: "bg-purple-500",
          },
        ],
      },
      {
        weekNumber: 4,
        weeklyTotal: 0,
        weeklyBudget: 3000,
        weeklyRemaining: 3000,
        daysInWeek: 7,
        transactions: [],
      },
      {
        weekNumber: 5,
        weeklyTotal: 0,
        weeklyBudget: 2000, // Adjusted budget for remaining days
        weeklyRemaining: 2000,
        daysInWeek: 3, // January has 31 days, so 31-28=3
        transactions: [],
      },
    ],
    // Pre-calculated analytics for January
    categoryData: [
      { name: "Bills", amount: 1850, percentage: 21, color: "#2d9596" },
      { name: "Food", amount: 1730, percentage: 20, color: "#2da62f" },
      { name: "Shopping", amount: 850, percentage: 10, color: "#f59e0b" },
    ],
    topExpenses: [
      {
        id: "14",
        date: "Jan. 1",
        category: "Bills",
        amount: 1200,
        description: "Rent Payment",
        iconColor: "bg-teal-500",
      },
      {
        id: "15",
        date: "Jan. 1",
        category: "Food",
        amount: 980,
        description: "New Year Dinner",
        iconColor: "bg-green-500",
      },
      {
        id: "18",
        date: "Jan. 15",
        category: "Shopping",
        amount: 850,
        description: "Winter Clothes",
        iconColor: "bg-purple-500",
      },
      {
        id: "17",
        date: "Jan. 10",
        category: "Food",
        amount: 750,
        description: "Grocery Shopping",
        iconColor: "bg-green-500",
      },
      {
        id: "16",
        date: "Jan. 5",
        category: "Bills",
        amount: 650,
        description: "Gas Bill",
        iconColor: "bg-teal-500",
      },
    ],
    // Additional pre-calculated analytics for January
    avgDailySpending: 281, // 8700 / 31 days
    dailyLimit: 312, // 5300 / 17 days remaining (example)
    budgetUsedPercentage: 62, // (8700 / 14000) * 100
    daysRemaining: 17, // Example: 31 days - 14 days passed
    recentTransactions: [
      {
        id: "18",
        date: "Jan. 15",
        category: "Shopping",
        amount: 850,
        description: "Winter Clothes",
        iconColor: "bg-purple-500",
      },
      {
        id: "17",
        date: "Jan. 10",
        category: "Food",
        amount: 750,
        description: "Grocery Shopping",
        iconColor: "bg-green-500",
      },
      {
        id: "16",
        date: "Jan. 5",
        category: "Bills",
        amount: 650,
        description: "Gas Bill",
        iconColor: "bg-teal-500",
      },
      {
        id: "15",
        date: "Jan. 1",
        category: "Food",
        amount: 980,
        description: "New Year Dinner",
        iconColor: "bg-green-500",
      },
      {
        id: "14",
        date: "Jan. 1",
        category: "Bills",
        amount: 1200,
        description: "Rent Payment",
        iconColor: "bg-teal-500",
      },
    ],
  },
];
