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
}

export interface MonthData {
  month: string;
  year: number;
  weeks: WeekData[];
  monthlyTotal: number;
  monthlyBudget: number;
  remaining: number;
}

export const mockData: MonthData[] = [
  {
    month: "February",
    year: 2025,
    monthlyTotal: 13570,
    monthlyBudget: 15000,
    remaining: 1430,
    weeks: [
      {
        weekNumber: 1,
        weeklyTotal: 4799,
        weeklyBudget: 3000,
        weeklyRemaining: -1799,
        transactions: [
          {
            id: "1",
            date: "Feb. 1",
            category: "Breakfast",
            amount: 75,
            description: "Coffee Shop",
            iconColor: "bg-orange-500",
          },
          {
            id: "2",
            date: "Feb. 2",
            category: "Lunch",
            amount: 120,
            description: "Restaurant",
            iconColor: "bg-green-500",
          },
          {
            id: "3",
            date: "Feb. 3",
            category: "Dinner",
            amount: 230,
            description: "Dinner Date",
            iconColor: "bg-blue-500",
          },
          {
            id: "4",
            date: "Feb. 4",
            category: "Miscellaneous",
            amount: 210,
            description: "Shopping",
            iconColor: "bg-purple-500",
          },
          {
            id: "5",
            date: "Feb. 5",
            category: "Others",
            amount: 93,
            description: "Gas",
            iconColor: "bg-red-500",
          },
        ],
      },
      {
        weekNumber: 2,
        weeklyTotal: 2211,
        weeklyBudget: 3000,
        weeklyRemaining: 789,
        transactions: [
          {
            id: "6",
            date: "Feb. 11",
            category: "Lunch",
            amount: 211,
            description: "Fast Food",
            iconColor: "bg-green-500",
          },
          {
            id: "7",
            date: "Feb. 14",
            category: "Dinner",
            amount: 1269,
            description: "Valentine's Day",
            iconColor: "bg-blue-500",
          },
          {
            id: "8",
            date: "Feb. 15",
            category: "Breakfast",
            amount: 227,
            description: "Brunch",
            iconColor: "bg-orange-500",
          },
        ],
      },
      {
        weekNumber: 3,
        weeklyTotal: 3200,
        weeklyBudget: 3000,
        weeklyRemaining: -200,
        transactions: [
          {
            id: "9",
            date: "Feb. 18",
            category: "Grocery",
            amount: 1200,
            description: "Weekly Shopping",
            iconColor: "bg-yellow-500",
          },
          {
            id: "10",
            date: "Feb. 20",
            category: "Entertainment",
            amount: 800,
            description: "Concert",
            iconColor: "bg-pink-500",
          },
          {
            id: "11",
            date: "Feb. 22",
            category: "Transport",
            amount: 400,
            description: "Uber",
            iconColor: "bg-indigo-500",
          },
        ],
      },
      {
        weekNumber: 4,
        weeklyTotal: 3360,
        weeklyBudget: 3000,
        weeklyRemaining: -360,
        transactions: [
          {
            id: "12",
            date: "Feb. 25",
            category: "Dinner",
            amount: 1500,
            description: "Anniversary",
            iconColor: "bg-blue-500",
          },
          {
            id: "13",
            date: "Feb. 27",
            category: "Shopping",
            amount: 860,
            description: "Clothes",
            iconColor: "bg-purple-500",
          },
        ],
      },
      {
        weekNumber: 5,
        weeklyTotal: 0,
        weeklyBudget: 3000,
        weeklyRemaining: 3000,
        transactions: [],
      },
    ],
  },
];
