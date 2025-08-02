import { useEffect, useMemo } from "react";
import { Button, Input, LoadingOverlay } from "@/components";
import { FiX } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { useEditBudget, useCurrencyContext, useGetBudget } from "@/hooks";

const validation = {
  budgetPeriod: {
    required: "Budget Period is required",
  },
  budget: {
    valueAsNumber: true,
    required: "Budget is required",
    min: {
      value: 0,
      message: "Budget cannot be negative",
    },
    max: 100000000,
  },
};

interface EditBudgetModalProps {
  onClose: () => void;
  monthNumber: number;
  year: number;
  currentBudget: number;
}

interface EditBudgetFormValues {
  budgetPeriod: string;
  budget: number;
}

const formatDate = (year: number, month: number): string =>
  `${year}-${String(month).padStart(2, "0")}`;

function EditBudgetModal({
  onClose,
  monthNumber,
  year,
  currentBudget,
}: EditBudgetModalProps) {
  const initialPeriod = formatDate(year, monthNumber);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EditBudgetFormValues>({
    defaultValues: {
      budgetPeriod: initialPeriod,
      budget: currentBudget,
    },
  });
  const { mutate: editBudget, isPending } = useEditBudget();
  const { currency } = useCurrencyContext();

  const budget = watch("budget");
  const budgetPeriod = watch("budgetPeriod");
  if (!budgetPeriod) {
    setValue("budgetPeriod", initialPeriod);
  }

  const [selectedYear, selectedMonth] = budgetPeriod.split("-").map(Number);

  const { data: fetchedBudget, isLoading: isBudgetLoading } = useGetBudget({
    month: selectedMonth,
    year: selectedYear,
  });

  useEffect(() => {
    if (budgetPeriod === initialPeriod) {
      reset({ budgetPeriod, budget: currentBudget });
      return;
    }

    if (fetchedBudget && !isBudgetLoading) {
      reset({
        budgetPeriod: formatDate(fetchedBudget.year, fetchedBudget.month),
        budget: fetchedBudget.amount || 0,
      });
    }
  }, [initialPeriod, budgetPeriod, fetchedBudget, isBudgetLoading, reset]);

  const dateInfo = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let minYear = currentYear - 1;
    let minMonth = currentMonth + 1;
    if (minMonth > 12) {
      minMonth = 1;
      minYear = currentYear;
    }

    const selectedDate = new Date(budgetPeriod + "-01");
    const currentMonthDate = new Date(currentYear, currentMonth - 1, 1);

    return {
      minDate: formatDate(minYear, minMonth),
      maxDate: formatDate(currentYear, currentMonth),
      isEditingPastMonth: selectedDate < currentMonthDate,
    };
  }, [budgetPeriod]);

  function onSubmit({ budgetPeriod, budget }: EditBudgetFormValues) {
    const [selectedYear, selectedMonth] = budgetPeriod.split("-").map(Number);

    editBudget(
      {
        year: selectedYear,
        month: selectedMonth,
        budget: Number(budget),
      },
      {
        onSuccess: () => onClose(),
      }
    );
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

    const initialBudget = fetchedBudget?.amount || 0;
    const newBudget = Number(budget);
    const difference = newBudget - initialBudget;

    if (difference > 0) {
      return `This will increase your budget by ${currency}${difference}`;
    } else if (difference < 0) {
      return `This will decrease your budget by ${currency}${Math.abs(
        difference
      )}`;
    }

    return "No change to current budget";
  }

  const isLoading = isPending || isBudgetLoading;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10"
          disabled={isPending}
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
              min={dateInfo.minDate}
              max={dateInfo.maxDate}
              {...register("budgetPeriod", validation.budgetPeriod)}
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                {currency}
              </div>
              <Input
                id="budget"
                type="number"
                min={0}
                placeholder="0.00"
                max={100000000}
                className={`pl-8 ${
                  errors.budget
                    ? "border-auburn-600 focus:border-auburn-600"
                    : ""
                }`}
                {...register("budget", validation.budget)}
              />
            </div>
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
                {currency}
                {fetchedBudget?.amount}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-xs md:text-sm">
              <span className="text-night-700">New Budget:</span>
              <span className="font-semibold">
                {currency}
                {budget !== undefined &&
                budget !== null &&
                !isNaN(Number(budget)) &&
                Number(budget) >= 0
                  ? Number(budget)
                  : "-"}
              </span>
            </div>
            <div className="border-t border-ash-gray-700 pt-2">
              <p className="text-xs text-night-600">{getImpactMessage()}</p>
            </div>
          </div>

          {/* Warning for Editing Past Dates */}
          {dateInfo.isEditingPastMonth && (
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
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
              disabled={isPending}
            >
              Update Budget
            </Button>
          </div>
        </form>
        {isLoading && (
          <LoadingOverlay
            message={isPending ? "Updating budget..." : "Loading budget..."}
          />
        )}
      </div>
    </div>
  );
}

export default EditBudgetModal;
