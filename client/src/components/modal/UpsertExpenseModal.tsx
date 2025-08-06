import { Button, Dropdown, Input, LoadingOverlay } from "@/components";
import { FiX } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { useAddExpense, useCurrencyContext, useEditExpense } from "@/hooks";
import type { Expense } from "@/types";
import { format } from "date-fns";
import { useState } from "react";

const validation = {
  category: {
    required: "Category is required",
    maxLength: {
      value: 25,
      message: "Category must be at most 25 characters",
    },
  },
  description: {
    maxLength: {
      value: 50,
      message: "Description must be at most 50 characters",
    },
  },
  amount: {
    valueAsNumber: true,
    required: "Amount is required",
    min: {
      value: 0,
      message: "Amount cannot be negative",
    },
    max: 10000000,
  },
  date: {
    required: "Date is required",
  },
};

const DEFAULT_CATEGORIES = [
  { value: "Bills", label: "Bills" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Food", label: "Food" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Shopping", label: "Shopping" },
  { value: "Transportation", label: "Transportation" },
  { value: "Others", label: "Others" },
];

interface UpsertExpenseModalProps extends Partial<Omit<Expense, "userId">> {
  onClose: () => void;
}

function UpsertExpenseModal({
  onClose,
  id,
  category,
  amount,
  description,
  date,
}: UpsertExpenseModalProps) {
  const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : "";
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Omit<Expense, "id" | "userId">>({
    defaultValues: {
      category: category || "",
      amount: amount,
      description: description || "",
      date: formattedDate || "",
    },
  });
  const { mutate: addExpense, isPending: isAdding } = useAddExpense();
  const { mutate: editExpense, isPending: isEditing } = useEditExpense();
  const { currency } = useCurrencyContext();
  const [categoryOption, setCategoryOption] = useState<"default" | "custom">(
    "default"
  );

  function onSubmit(data: Omit<Expense, "id" | "userId">) {
    const { date, ...restData } = data;

    // Convert date to UTC with timestamp format from just YYYY-MM-DD
    const dateStr =
      typeof date === "string" ? date : format(new Date(date), "yyyy-MM-dd");
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateWithTime = new Date(year, month - 1, day);

    const finalData = {
      ...restData,
      date: dateWithTime,
    };

    if (id) {
      editExpense({ id, ...finalData }, { onSuccess: () => onClose() });
    } else {
      addExpense(finalData, { onSuccess: () => onClose() });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10"
          disabled={isAdding || isEditing}
        >
          <FiX size={18} className="md:w-5 md:h-5" />
        </button>
        <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-6 pr-8">
          {id ? "Edit" : "Add"} Expense
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
          noValidate
          autoComplete="off"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="category"
                className="text-xs md:text-sm font-semibold text-night-600"
              >
                Category <span className="text-auburn-600">*</span>
              </label>
              <div className="flex bg-timberwolf-700 rounded-lg p-0.5">
                <button
                  type="button"
                  aria-label="Use default categories"
                  className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    categoryOption === "default"
                      ? "bg-night-600 text-timberwolf-900"
                      : "text-night-500 hover:bg-timberwolf-600"
                  }`}
                  onClick={() => setCategoryOption("default")}
                >
                  Default
                </button>
                <button
                  type="button"
                  aria-label="Use custom category"
                  className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    categoryOption === "custom"
                      ? "bg-night-600 text-timberwolf-900"
                      : "text-night-500 hover:bg-timberwolf-600"
                  }`}
                  onClick={() => setCategoryOption("custom")}
                >
                  Custom
                </button>
              </div>
            </div>
            {categoryOption === "default" ? (
              <Dropdown
                options={DEFAULT_CATEGORIES}
                id="category"
                placeholder="e.g. Food"
                {...register("category", validation.category)}
                classname={`${
                  watch("category") ? "text-night-500" : "text-night-500/50"
                }`}
              />
            ) : (
              <Input
                id="category"
                type="text"
                maxLength={25}
                placeholder="e.g. Food"
                {...register("category", validation.category)}
                className={
                  errors.category
                    ? "border-auburn-600 focus:border-auburn-600"
                    : ""
                }
              />
            )}
            {errors.category && (
              <p className="text-xs text-auburn-600 font-semibold">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-xs md:text-sm font-semibold text-night-600"
            >
              Description
            </label>
            <Input
              id="description"
              type="text"
              maxLength={50}
              placeholder="e.g. Lunch at restaurant"
              {...register("description", validation.description)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="amount"
              className="text-xs md:text-sm font-semibold text-night-600"
            >
              Amount <span className="text-auburn-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                {currency}
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                max={10000000}
                {...register("amount", validation.amount)}
                className={`pl-8 ${
                  errors.amount
                    ? "border-auburn-600 focus:border-auburn-600"
                    : ""
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-auburn-600 font-semibold">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="date"
              className="text-xs md:text-sm font-semibold text-night-600"
            >
              Date <span className="text-auburn-600">*</span>
            </label>
            <Input
              id="date"
              type="date"
              {...register("date", validation.date)}
              className={
                errors.date ? "border-auburn-600 focus:border-auburn-600" : ""
              }
            />
            {errors.date && (
              <p className="text-xs text-auburn-600 font-semibold">
                {errors.date.message}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
              disabled={isAdding || isEditing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
              disabled={isAdding || isEditing}
            >
              {id ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
        {isAdding ||
          (isEditing && <LoadingOverlay message="Saving expense..." />)}
      </div>
    </div>
  );
}

export default UpsertExpenseModal;
