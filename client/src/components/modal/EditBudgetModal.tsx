import { useState } from "react";
import { Button, Input } from "@/components";
import { FiX } from "@/assets/icons";

interface EditBudgetModalProps {
  onClose: () => void;
  month: string;
  year: number;
  currentBudget: number;
}

function EditBudgetModal({
  onClose,
  month,
  year,
  currentBudget,
}: EditBudgetModalProps) {
  const [budgetAmount, setBudgetAmount] = useState(currentBudget.toString());
  const [selectedMonth, setSelectedMonth] = useState(
    `${year}-${String(
      new Date(Date.parse(month + " 1, " + year)).getMonth() + 1
    ).padStart(2, "0")}`
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1

  // Calculate min date (1 year back from current month)
  // If current month is July 2025, min date should be August 2024
  let minYear = currentYear - 1;
  let minMonth = currentMonth + 1;

  // Handle month overflow (if current month is December, next month is January of next year)
  if (minMonth > 12) {
    minMonth = 1;
    minYear = currentYear;
  }

  const minDate = `${minYear}-${String(minMonth).padStart(2, "0")}`;

  // Calculate max date (current month of current year)
  const maxDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating budget:", {
      month: selectedMonth,
      budget: parseFloat(budgetAmount),
    });
    onClose();
  };

  const getImpactMessage = () => {
    const newBudget = parseFloat(budgetAmount);
    const difference = newBudget - currentBudget;

    if (difference > 0) {
      return `This will increase your budget by P${difference.toLocaleString()}`;
    } else if (difference < 0) {
      return `This will decrease your budget by P${Math.abs(
        difference
      ).toLocaleString()}`;
    }
    return "No change to current budget";
  };

  // Check if selected month is in the past (before current month)
  const selectedDate = new Date(selectedMonth + "-01");
  const currentMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const isEditingPastMonth = selectedDate < currentMonthDate;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ash-gray-900 p-8 rounded-lg w-full max-w-md text-night-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={24} />
        </button>

        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Budget</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Month/Year Selection */}
          <div>
            <label
              htmlFor="budgetPeriod"
              className="block text-sm font-semibold text-night-600 mb-1"
            >
              Budget Period
            </label>
            <Input
              id="budgetPeriod"
              type="month"
              value={selectedMonth}
              min={minDate}
              max={maxDate}
            />
            <p className="text-xs text-night-700 mt-1">
              You can edit budgets up to 1 year in the past
            </p>
          </div>

          {/* Budget Amount */}
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-semibold text-night-600 mb-1"
            >
              Budget Amount
            </label>
            <Input
              id="budget"
              type="number"
              placeholder="0.00"
              value={budgetAmount}
            />
          </div>

          {/* Current vs New Comparison */}
          <div className="bg-timberwolf-800 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-night-700">Current Budget:</span>
              <span className="font-semibold">
                P{currentBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-night-700">New Budget:</span>
              <span className="font-semibold">
                P{parseFloat(budgetAmount || "0").toLocaleString()}
              </span>
            </div>
            <div className="border-t border-ash-gray-700 pt-2">
              <p className="text-sm text-night-600">{getImpactMessage()}</p>
            </div>
          </div>

          {/* Warning for Past Dates */}
          {isEditingPastMonth && (
            <div className="bg-auburn-900 border border-auburn-500 p-3 rounded-lg">
              <p className="text-auburn-600 text-sm">
                ⚠️ You're editing a budget for a past period. This will
                recalculate your remaining budget for that month.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Update Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBudgetModal;
