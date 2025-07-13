import { useState } from "react";
import { Button, ExpenseCard } from "@/components";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
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
    monthlyBudget: 10000,
    remaining: -3570,
    weeks: [
      {
        weekNumber: 1,
        weeklyTotal: 4799,
        weeklyBudget: 2500,
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
        weeklyBudget: 2500,
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
      // Add more weeks as needed
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

  const getWeekStatusColor = (weeklyTotal: number, weeklyBudget: number) => {
    if (weeklyTotal <= weeklyBudget) return "text-night-700";
    return "text-auburn-500";
  };

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
            <FiDollarSign className="mr-2" />
            Edit Budget
          </Button>
          <Button onClick={() => openModal("ADD_EXPENSE")}>Add Expense</Button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-ash-gray-900 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            disabled={currentMonthIndex === 0}
            className="p-2 rounded-lg bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft size={20} />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-night-600 flex items-center justify-center">
              <FiCalendar className="mr-2" />
              {currentMonth.month} {currentMonth.year}
            </h2>
          </div>

          <button
            onClick={() => navigateMonth("next")}
            disabled={currentMonthIndex === mockData.length - 1}
            className="p-2 rounded-lg bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-night-500 p-4 rounded-lg">
            <p className="text-sm text-ash-gray-400">Monthly Budget</p>
            <p className="text-2xl font-bold text-timberwolf-900">
              P{currentMonth.monthlyBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-night-500 p-4 rounded-lg">
            <p className="text-sm text-ash-gray-400">Total Spent</p>
            <p className="text-2xl font-bold text-timberwolf-900">
              P{currentMonth.monthlyTotal.toLocaleString()}
            </p>
          </div>
          <div className="bg-night-500 p-4 rounded-lg">
            <p className="text-sm text-ash-gray-400">Remaining</p>
            <p
              className={`text-2xl font-bold ${getStatusColor(
                currentMonth.remaining
              )}`}
            >
              P{currentMonth.remaining.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Weeks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentMonth.weeks.map((week) => (
          <div
            key={week.weekNumber}
            onClick={() =>
              setSelectedWeek(
                selectedWeek === week.weekNumber ? null : week.weekNumber
              )
            }
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedWeek === week.weekNumber
                ? "bg-night-600 text-timberwolf-900"
                : "bg-timberwolf-700 text-night-500 hover:bg-timberwolf-600"
            }`}
          >
            <h3 className="font-semibold mb-2">Week {week.weekNumber}</h3>
            <p className="text-sm opacity-75">
              Budget: P{week.weeklyBudget.toLocaleString()}
            </p>
            <p
              className={`font-bold ${getWeekStatusColor(
                week.weeklyTotal,
                week.weeklyBudget
              )}`}
            >
              Spent: P{week.weeklyTotal.toLocaleString()}
            </p>
            <p className="text-xs mt-1">
              {week.transactions.length} transaction
              {week.transactions.length !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Transactions List */}
      <div className="bg-ash-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-night-600 mb-4">
          {selectedWeek
            ? `Week ${selectedWeek} Transactions`
            : `All ${currentMonth.month} Transactions`}
        </h3>

        <div className="space-y-3">
          {(selectedWeek
            ? currentMonth.weeks.find((w) => w.weekNumber === selectedWeek)
                ?.transactions || []
            : currentMonth.weeks.flatMap((week) => week.transactions)
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
          ? currentMonth.weeks.find((w) => w.weekNumber === selectedWeek)
              ?.transactions || []
          : currentMonth.weeks.flatMap((week) => week.transactions)
        ).length === 0 && (
          <div className="text-center py-8 text-ash-gray-500">
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
