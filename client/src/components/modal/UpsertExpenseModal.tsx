import { Button, Dropdown, Input, LoadingOverlay } from "@/components";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useAddExpense, useCurrencyContext, useEditExpense } from "@/hooks";
import type { Expense } from "@/types";
import { useEffect, useState } from "react";
import * as z from "zod";
import { expenseSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = z.infer<typeof expenseSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: category || "",
      amount: amount,
      description: description || "",
      date: date || "",
    },
  });
  const { mutate: addExpense, isPending: isAdding } = useAddExpense();
  const { mutate: editExpense, isPending: isEditing } = useEditExpense();
  const { currency } = useCurrencyContext();
  const [categoryOption, setCategoryOption] = useState<"default" | "custom">(
    "default"
  );

  useEffect(() => {
    if (
      category &&
      !DEFAULT_CATEGORIES.some((categories) => categories.value === category)
    ) {
      setCategoryOption("custom");
    }
  }, [category]);

  function onSubmit(data: FormValues) {
    if (id) {
      editExpense({ id, ...data }, { onSuccess: () => onClose() });
    } else {
      addExpense(data, { onSuccess: () => onClose() });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10 cursor-pointer"
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
                {...register("category")}
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
                {...register("category")}
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
              {...register("description")}
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
                {...register("amount", { valueAsNumber: true })}
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
              {...register("date")}
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
