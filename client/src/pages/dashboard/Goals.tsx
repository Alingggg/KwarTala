import { useState } from "react";
import { Button } from "@/components";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiPlus,
} from "@/assets/icons";
import { useModalContext } from "@/hooks";

interface Goal {
  id: string;
  category: string;
  targetAmount: number;
  currentSpent: number;
  color: string;
}

interface MonthGoals {
  month: string;
  year: number;
  goals: Goal[];
  totalBudget: number;
  totalSpent: number;
}

// Sample data for different months
const goalsData: MonthGoals[] = [
  {
    month: "February",
    year: 2025,
    totalBudget: 15000,
    totalSpent: 10000,
    goals: [
      {
        id: "1",
        category: "Food",
        targetAmount: 4000,
        currentSpent: 3500,
        color: "#54876e",
      },
      {
        id: "2",
        category: "Transportation",
        targetAmount: 2000,
        currentSpent: 1800,
        color: "#a22c29",
      },
      {
        id: "3",
        category: "Entertainment",
        targetAmount: 1500,
        currentSpent: 1200,
        color: "#832221",
      },
      {
        id: "4",
        category: "Shopping",
        targetAmount: 3000,
        currentSpent: 2000,
        color: "#902923",
      },
      {
        id: "5",
        category: "Bills",
        targetAmount: 1000,
        currentSpent: 800,
        color: "#757759",
      },
      {
        id: "6",
        category: "Others",
        targetAmount: 1500,
        currentSpent: 700,
        color: "#999b7a",
      },
    ],
  },
  {
    month: "January",
    year: 2025,
    totalBudget: 14000,
    totalSpent: 8700,
    goals: [
      {
        id: "1",
        category: "Food",
        targetAmount: 3500,
        currentSpent: 2800,
        color: "#54876e",
      },
      {
        id: "2",
        category: "Transportation",
        targetAmount: 2000,
        currentSpent: 1600,
        color: "#a22c29",
      },
      {
        id: "3",
        category: "Entertainment",
        targetAmount: 1200,
        currentSpent: 900,
        color: "#832221",
      },
      {
        id: "4",
        category: "Shopping",
        targetAmount: 2500,
        currentSpent: 1800,
        color: "#902923",
      },
      {
        id: "5",
        category: "Bills",
        targetAmount: 1500,
        currentSpent: 1200,
        color: "#757759",
      },
      {
        id: "6",
        category: "Others",
        targetAmount: 800,
        currentSpent: 400,
        color: "#999b7a",
      },
    ],
  },
];

function Goals() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const { openModal } = useModalContext();

  const currentData = goalsData[currentMonthIndex];
  const overallProgress =
    (currentData.totalSpent / currentData.totalBudget) * 100;
  const remainingBudget = currentData.totalBudget - currentData.totalSpent;

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev" && currentMonthIndex < goalsData.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else if (direction === "next" && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 70) return "#54876e"; // Green - safe
    if (percentage <= 90) return "#999b7a"; // Yellow - warning
    return "#a22c29"; // Red - over/close to limit
  };

  const getGoalStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    const remaining = target - current;

    if (percentage > 100) {
      return {
        status: "Over Budget",
        amount: Math.abs(remaining),
        color: "text-auburn-500",
        prefix: "over by",
      };
    } else {
      return {
        status: "Remaining",
        amount: remaining,
        color: "text-night-700",
        prefix: "left",
      };
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-night-600">Goals</h1>
        </div>
        <Button
          onClick={() => openModal("ADD_GOAL")}
          className="flex items-center bg-night-600 hover:bg-night-700 text-timberwolf-900"
        >
          <FiPlus className="mr-2" size={16} />
          Add Goal
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="relative mb-8">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMonth("prev")}
          disabled={currentMonthIndex === goalsData.length - 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          disabled={currentMonthIndex === 0}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Month Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center">
            <FiCalendar className="mr-3 text-night-600" size={28} />
            <h2 className="text-3xl font-bold text-night-600">
              {currentData.month} {currentData.year} Goals
            </h2>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-ash-gray-900 p-8 rounded-xl mb-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Budget Progress */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-night-600 mb-2">
                  Overall Budget Progress
                </h3>
                <p className="text-ash-gray-400">
                  P{currentData.totalSpent.toLocaleString()} of P
                  {currentData.totalBudget.toLocaleString()} used
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-night-600">
                  {overallProgress.toFixed(1)}%
                </p>
                <p className="text-sm text-ash-gray-400">completed</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-ash-gray-700 rounded-full h-6 mb-3 shadow-inner">
              <div
                className="h-6 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{
                  width: `${Math.min(overallProgress, 100)}%`,
                  backgroundColor: getProgressColor(overallProgress),
                }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-ash-gray-400">
              <span>P0</span>
              <span>P{currentData.totalBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="text-center bg-timberwolf-700 p-4 rounded-lg">
              <p className="text-sm text-ash-gray-400 mb-1">Remaining Budget</p>
              <p
                className={`text-2xl font-bold ${
                  remainingBudget >= 0 ? "text-night-700" : "text-auburn-500"
                }`}
              >
                P{remainingBudget.toLocaleString()}
              </p>
            </div>
            <div className="text-center bg-timberwolf-700 p-4 rounded-lg">
              <p className="text-sm text-ash-gray-400 mb-1">Active Goals</p>
              <p className="text-2xl font-bold text-night-600">
                {currentData.goals.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentData.goals.map((goal) => {
          const progress = (goal.currentSpent / goal.targetAmount) * 100;
          const goalStatus = getGoalStatus(
            goal.currentSpent,
            goal.targetAmount
          );

          return (
            <div
              key={goal.id}
              className="bg-ash-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div
                    className="w-5 h-5 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: goal.color }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-night-600 mb-1">
                      {goal.category}
                    </h3>
                    <p className="text-sm text-ash-gray-400">
                      P{goal.currentSpent.toLocaleString()} of P
                      {goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openModal("EDIT_GOAL", goal)}
                  className="p-2 text-night-700 hover:text-night-500 hover:bg-timberwolf-600 rounded-full transition-all duration-200 ml-2"
                >
                  <FiEdit size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-ash-gray-700 rounded-full h-4 mb-4 shadow-inner">
                <div
                  className="h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: getProgressColor(progress),
                  }}
                ></div>
              </div>

              {/* Progress Details */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-night-600">
                    {progress.toFixed(1)}% used
                  </p>
                  <p className={`text-xs ${goalStatus.color} font-medium`}>
                    P{goalStatus.amount.toLocaleString()} {goalStatus.prefix}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${goalStatus.color}`}>
                    {goalStatus.status}
                  </p>
                  {progress > 100 && (
                    <p className="text-xs text-auburn-500 font-medium">
                      {(progress - 100).toFixed(1)}% over
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Goals;
