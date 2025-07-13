import { useState } from "react";
import { Button, ExpenseCard } from "@/components";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiFilter,
} from "@/assets/icons";
import { useModalContext } from "@/hooks";

interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  iconColor: string;
}

interface WeekData {
  weekNumber: number;
  transactions: Transaction[];
  weeklyTotal: number;
  weeklyBudget: number;
  weeklyRemaining: number;
}

interface MonthData {
  month: string;
  year: number;
  weeks: WeekData[];
  monthlyTotal: number;
  monthlyBudget: number;
  remaining: number;
}

// Sample data structure matching your spreadsheet
const mockData: MonthData[] = [
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

function Transactions() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const { openModal } = useModalContext();

  const currentMonth = mockData[currentMonthIndex];

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev" && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    } else if (
      direction === "next" &&
      currentMonthIndex < mockData.length - 1
    ) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
    setSelectedWeek(null);
  };

  const getStatusColor = (remaining: number) => {
    if (remaining > 0) return "text-night-700";
    return "text-auburn-500";
  };

  // Generate all 5 weeks, filling in missing ones with empty data
  const getAllWeeks = () => {
    const allWeeks = [];
    for (let i = 1; i <= 5; i++) {
      const existingWeek = currentMonth.weeks.find((w) => w.weekNumber === i);
      if (existingWeek) {
        allWeeks.push(existingWeek);
      } else {
        allWeeks.push({
          weekNumber: i,
          weeklyTotal: 0,
          weeklyBudget: 3000, // Default weekly budget
          weeklyRemaining: 3000,
          transactions: [],
        });
      }
    }
    return allWeeks;
  };

  const allWeeks = getAllWeeks();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-night-600">Transactions</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() =>
              openModal("EDIT_BUDGET", {
                month: currentMonth.month,
                year: currentMonth.year,
                currentBudget: currentMonth.monthlyBudget,
              })
            }
          >
            Edit Budget
          </Button>
          <Button onClick={() => openModal("ADD_EXPENSE")}>Add Expense</Button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="relative mb-6">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMonth("prev")}
          disabled={currentMonthIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          disabled={currentMonthIndex === mockData.length - 1}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Month Header */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center">
            <FiCalendar className="mr-3 text-night-600" size={28} />
            <h2 className="text-3xl font-bold text-night-600">
              {currentMonth.month} {currentMonth.year}
            </h2>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-ash-gray-900 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-ash-gray-400 mb-2">Monthly Budget</p>
            <p className="text-3xl font-bold text-night-600">
              P{currentMonth.monthlyBudget.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-ash-gray-400 mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-night-600">
              P{currentMonth.monthlyTotal.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-ash-gray-400 mb-2">Remaining</p>
            <p
              className={`text-3xl font-bold ${getStatusColor(
                currentMonth.remaining
              )}`}
            >
              P{currentMonth.remaining.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Week Filter */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <FiFilter className="mr-2 text-night-600" size={16} />
          <span className="font-semibold text-night-600">Filter by Week</span>
        </div>
        <div className="grid grid-cols-6 gap-2 max-w-4xl">
          <button
            onClick={() => setSelectedWeek(null)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors text-center ${
              selectedWeek === null
                ? "bg-night-600 text-timberwolf-900"
                : "bg-timberwolf-700 text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            All Weeks
          </button>
          {allWeeks.map((week) => (
            <button
              key={week.weekNumber}
              onClick={() =>
                setSelectedWeek(
                  selectedWeek === week.weekNumber ? null : week.weekNumber
                )
              }
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedWeek === week.weekNumber
                  ? "bg-night-600 text-timberwolf-900"
                  : "bg-timberwolf-700 text-night-500 hover:bg-timberwolf-600"
              }`}
            >
              <div className="text-center">
                <div className="text-sm">Week {week.weekNumber}</div>
                <div className="text-xs opacity-75">
                  P{week.weeklyTotal.toLocaleString()}
                </div>
                <div
                  className={`text-xs font-medium ${
                    selectedWeek === week.weekNumber
                      ? week.weeklyRemaining >= 0
                        ? "text-night-800" // Better contrast for positive when selected
                        : "text-auburn-700" // Better contrast for negative when selected
                      : getStatusColor(week.weeklyRemaining)
                  }`}
                >
                  {week.weeklyRemaining >= 0
                    ? `+P${week.weeklyRemaining}`
                    : `P${week.weeklyRemaining}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-ash-gray-900 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night-600">
            {selectedWeek
              ? `Week ${selectedWeek} Transactions`
              : `All ${currentMonth.month} Transactions`}
          </h3>
          {selectedWeek && (
            <div className="text-right">
              <p className="text-sm text-ash-gray-400">
                Week {selectedWeek} Budget
              </p>
              <p className="font-semibold text-night-600">
                P
                {allWeeks
                  .find((w) => w.weekNumber === selectedWeek)
                  ?.weeklyBudget.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {(selectedWeek
            ? allWeeks.find((w) => w.weekNumber === selectedWeek)
                ?.transactions || []
            : allWeeks.flatMap((week) => week.transactions)
          ).map((transaction) => (
            <ExpenseCard
              key={transaction.id}
              id={transaction.id}
              category={transaction.category}
              amount={transaction.amount}
              description={transaction.description}
              iconColor={transaction.iconColor}
              date={transaction.date}
            />
          ))}
        </div>

        {/* No transactions message */}
        {(selectedWeek
          ? allWeeks.find((w) => w.weekNumber === selectedWeek)?.transactions ||
            []
          : allWeeks.flatMap((week) => week.transactions)
        ).length === 0 && (
          <div className="text-center py-12 text-ash-gray-500">
            <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-2">
              {selectedWeek
                ? `No expenses recorded for Week ${selectedWeek}`
                : `No expenses recorded for ${currentMonth.month} ${currentMonth.year}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
