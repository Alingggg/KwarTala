import { useEffect } from "react";
import { Button, Input } from "@/components";
import { FiX } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { useEditBudget } from "@/hooks";

interface EditBudgetModalProps {
  onClose: () => void;
  month: string;
  year: number;
  currentBudget: number;
}

interface EditBudgetFormValues {
  budgetPeriod: string;
  budget: number;
}

function EditBudgetModal({
  onClose,
  month,
  year,
  currentBudget,
}: EditBudgetModalProps) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditBudgetFormValues>();
  const { mutate: editBudget } = useEditBudget();

  const initialBudgetPeriod = `${year}-${String(
    new Date(`${month} 1, ${year}`).getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    reset({
      budgetPeriod: initialBudgetPeriod,
      budget: currentBudget,
    });
  }, [initialBudgetPeriod, currentBudget, reset]);

  const budget = watch("budget");
  const budgetPeriod = watch("budgetPeriod");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let minYear = currentYear - 1;
  let minMonth = currentMonth + 1;
  if (minMonth > 12) {
    minMonth = 1;
    minYear = currentYear;
  }
  const minDate = `${minYear}-${String(minMonth).padStart(2, "0")}`;
  const maxDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  function onSubmit({ budgetPeriod, budget }: EditBudgetFormValues) {
    const [selectedYear, selectedMonth] = budgetPeriod.split("-").map(Number);

    editBudget({
      year: selectedYear,
      month: selectedMonth,
      budget: Number(budget),
    });

    onClose();
  }

  function getImpactMessage() {
    if (
      budget === undefined ||
      budget === null ||
      isNaN(Number(budget)) ||
      budget < 0
    ) {
      return "Please enter a valid budget amount";
    }
    const newBudget = Number(budget);
    const difference = newBudget - currentBudget;

    if (difference > 0) {
      return `This will increase your budget by P${difference.toLocaleString()}`;
    } else if (difference < 0) {
      return `This will decrease your budget by P${Math.abs(
        difference
      ).toLocaleString()}`;
    }

    return "No change to current budget";
  }

  const selectedDate = new Date((budgetPeriod || initialBudgetPeriod) + "-01");
  const currentMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const isEditingPastMonth = selectedDate < currentMonthDate;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10"
        >
          <FiX size={18} className="md:w-5 md:h-5" />
        </button>

        <div className="flex items-center mb-5 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold">Edit Budget</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
          noValidate
        >
          {/* Budget Period Selection */}
          <div>
            <label
              htmlFor="budgetPeriod"
              className="block text-xs md:text-sm font-semibold text-night-600 mb-1"
            >
              Budget Period <span className="text-auburn-600">*</span>
            </label>
            <Input
              id="budgetPeriod"
              type="month"
              min={minDate}
              max={maxDate}
              {...register("budgetPeriod", {
                required: "Budget period is required",
              })}
            />
            {errors.budgetPeriod && (
              <p className="text-xs text-auburn-600 mt-1 font-semibold">
                {errors.budgetPeriod.message}
              </p>
            )}
            <p className="text-xs text-night-700 mt-1">
              You can edit budgets up to 1 year in the past
            </p>
          </div>

          {/* Budget Amount Input */}
          <div>
            <label
              htmlFor="budget"
              className="block text-xs md:text-sm font-semibold text-night-600 mb-1"
            >
              Budget Amount <span className="text-auburn-600">*</span>
            </label>
            <Input
              id="budget"
              type="number"
              min={0}
              placeholder="0.00"
              {...register("budget", {
                required: "Budget is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Budget must be 0 or greater",
                },
              })}
            />
            {errors.budget && (
              <p className="text-xs text-auburn-600 mt-1 font-semibold">
                {errors.budget.message}
              </p>
            )}
          </div>

          {/* Current vs New Budget Comparison */}
          <div className="bg-timberwolf-800 p-3 md:p-4 rounded-lg">
            <div className="flex justify-between mb-2 text-xs md:text-sm">
              <span className="text-night-700">Current Budget:</span>
              <span className="font-semibold">
                P{currentBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-xs md:text-sm">
              <span className="text-night-700">New Budget:</span>
              <span className="font-semibold">
                P
                {budget !== undefined &&
                budget !== null &&
                !isNaN(Number(budget)) &&
                Number(budget) >= 0
                  ? Number(budget).toLocaleString()
                  : "-"}
              </span>
            </div>
            <div className="border-t border-ash-gray-700 pt-2">
              <p className="text-xs text-night-600">{getImpactMessage()}</p>
            </div>
          </div>

          {/* Warning for Editing Past Dates */}
          {isEditingPastMonth && (
            <div className="bg-auburn-900 border border-auburn-500 p-3 rounded-lg">
              <p className="text-auburn-600 text-xs">
                ⚠️ You're editing a budget for a past period. This will
                recalculate your remaining budget for that month.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
            >
              Update Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBudgetModal;
