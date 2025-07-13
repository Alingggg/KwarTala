import { useState } from "react";
import { Button, Input } from "@/components";
import { FiX, FiDollarSign } from "@/assets/icons";

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

  const currentYear = new Date().getFullYear();

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
          <FiDollarSign className="mr-2 text-night-600" size={24} />
          <h2 className="text-2xl font-bold">Edit Budget</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Month/Year Selection */}
          <div>
            <Input
              label="Budget Period"
              id="budgetPeriod"
              type="month"
              value={selectedMonth}
              // min={`${currentYear - 1}-01`}
              // max={`${currentYear}-12`}
            />
            <p className="text-xs text-night-700 mt-1">
              You can edit budgets up to 1 year in the past
            </p>
          </div>

          {/* Budget Amount */}
          <Input
            label="Budget Amount"
            id="budget"
            type="number"
            placeholder="0.00"
            value={budgetAmount}
          />

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
          {new Date(selectedMonth) <
            new Date(new Date().getFullYear(), new Date().getMonth()) && (
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
