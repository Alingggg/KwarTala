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
  daysInWeek: number;
}

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
  spentToday: number;
  weeks: WeekData[];
  categoryData: CategoryAnalytics[];
  topExpenses: Transaction[];
  avgDailySpending: number;
  dailyLimit: number;
  budgetUsedPercentage: number;
  daysRemaining: number;
  recentTransactions: Transaction[];
}

export const mockData: MonthData[] = [
  {
    month: "March",
    year: 2025,
    monthlyTotal: 10210,
    monthlyBudget: 15000,
    remaining: 4790,
    spentToday: 450,
    weeks: [
      {
        weekNumber: 1,
        weeklyTotal: 728,
        weeklyBudget: 3500,
        weeklyRemaining: 2772,
        daysInWeek: 7,
        transactions: [
          {
            id: "1",
            date: "Mar. 1",
            category: "Food",
            amount: 75,
            description: "Coffee Shop",
            iconColor: "bg-orange-500",
          },
          {
            id: "2",
            date: "Mar. 2",
            category: "Food",
            amount: 120,
            description: "Restaurant Lunch",
            iconColor: "bg-green-500",
          },
          {
            id: "3",
            date: "Mar. 3",
            category: "Food",
            amount: 230,
            description: "Dinner Date",
            iconColor: "bg-blue-500",
          },
          {
            id: "4",
            date: "Mar. 4",
            category: "Shopping",
            amount: 210,
            description: "Clothing",
            iconColor: "bg-purple-500",
          },
          {
            id: "5",
            date: "Mar. 5",
            category: "Transportation",
            amount: 93,
            description: "Gas",
            iconColor: "bg-red-500",
          },
        ],
      },
      {
        weekNumber: 2,
        weeklyTotal: 1707,
        weeklyBudget: 3500,
        weeklyRemaining: 1793,
        daysInWeek: 7,
        transactions: [
          {
            id: "6",
            date: "Mar. 11",
            category: "Food",
            amount: 211,
            description: "Fast Food",
            iconColor: "bg-green-500",
          },
          {
            id: "7",
            date: "Mar. 14",
            category: "Food",
            amount: 1269,
            description: "Special Dinner",
            iconColor: "bg-blue-500",
          },
          {
            id: "8",
            date: "Mar. 15",
            category: "Food",
            amount: 227,
            description: "Weekend Brunch",
            iconColor: "bg-orange-500",
          },
        ],
      },
      {
        weekNumber: 3,
        weeklyTotal: 2400,
        weeklyBudget: 3500,
        weeklyRemaining: 1100,
        daysInWeek: 7,
        transactions: [
          {
            id: "9",
            date: "Mar. 18",
            category: "Shopping",
            amount: 1200,
            description: "Weekly Groceries",
            iconColor: "bg-yellow-500",
          },
          {
            id: "10",
            date: "Mar. 20",
            category: "Entertainment",
            amount: 800,
            description: "Concert Tickets",
            iconColor: "bg-pink-500",
          },
          {
            id: "11",
            date: "Mar. 22",
            category: "Transportation",
            amount: 400,
            description: "Uber Rides",
            iconColor: "bg-indigo-500",
          },
        ],
      },
      {
        weekNumber: 4,
        weeklyTotal: 1500,
        weeklyBudget: 3500,
        weeklyRemaining: 2000,
        daysInWeek: 7,
        transactions: [
          {
            id: "12",
            date: "Mar. 25",
            category: "Food",
            amount: 1500,
            description: "Anniversary Dinner",
            iconColor: "bg-blue-500",
          },
        ],
      },
      {
        weekNumber: 5,
        weeklyTotal: 1875,
        weeklyBudget: 1000,
        weeklyRemaining: -875,
        daysInWeek: 3,
        transactions: [
          {
            id: "13",
            date: "Mar. 29",
            category: "Shopping",
            amount: 860,
            description: "New Clothes",
            iconColor: "bg-purple-500",
          },
          {
            id: "19",
            date: "Mar. 30",
            category: "Bills",
            amount: 1015,
            description: "Internet Bill",
            iconColor: "bg-teal-500",
          },
        ],
      },
    ],
    categoryData: [
      { name: "Food", amount: 4432, percentage: 43, color: "#10b981" },
      { name: "Shopping", amount: 2270, percentage: 22, color: "#f59e0b" },
      { name: "Bills", amount: 1015, percentage: 10, color: "#06b6d4" },
      { name: "Entertainment", amount: 800, percentage: 8, color: "#ec4899" },
      { name: "Transportation", amount: 493, percentage: 5, color: "#ef4444" },
    ],
    topExpenses: [
      {
        id: "12",
        date: "Mar. 25",
        category: "Food",
        amount: 1500,
        description: "Anniversary Dinner",
        iconColor: "bg-blue-500",
      },
      {
        id: "7",
        date: "Mar. 14",
        category: "Food",
        amount: 1269,
        description: "Special Dinner",
        iconColor: "bg-blue-500",
      },
      {
        id: "9",
        date: "Mar. 18",
        category: "Shopping",
        amount: 1200,
        description: "Weekly Groceries",
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
        description: "New Clothes",
        iconColor: "bg-purple-500",
      },
    ],
    avgDailySpending: 329,
    dailyLimit: 319,
    budgetUsedPercentage: 68,
    daysRemaining: 15,
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
        description: "New Clothes",
        iconColor: "bg-purple-500",
      },
      {
        id: "12",
        date: "Mar. 25",
        category: "Food",
        amount: 1500,
        description: "Anniversary Dinner",
        iconColor: "bg-blue-500",
      },
      {
        id: "11",
        date: "Mar. 22",
        category: "Transportation",
        amount: 400,
        description: "Uber Rides",
        iconColor: "bg-indigo-500",
      },
      {
        id: "10",
        date: "Mar. 20",
        category: "Entertainment",
        amount: 800,
        description: "Concert Tickets",
        iconColor: "bg-pink-500",
      },
    ],
  },
  {
    month: "January",
    year: 2025,
    monthlyTotal: 4430,
    monthlyBudget: 14000,
    remaining: 9570,
    spentToday: 0,
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
            date: "Jan. 2",
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
        weeklyBudget: 2000,
        weeklyRemaining: 2000,
        daysInWeek: 3,
        transactions: [],
      },
    ],
    categoryData: [
      { name: "Bills", amount: 1850, percentage: 42, color: "#06b6d4" },
      { name: "Food", amount: 1730, percentage: 39, color: "#10b981" },
      { name: "Shopping", amount: 850, percentage: 19, color: "#f59e0b" },
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
        date: "Jan. 2",
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
    avgDailySpending: 143,
    dailyLimit: 0,
    budgetUsedPercentage: 32,
    daysRemaining: 0,
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
        date: "Jan. 2",
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
