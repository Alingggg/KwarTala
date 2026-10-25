import { z } from "zod";
import { defineTool } from "./defineTool";
import { expenseService } from "@/services/index";
import { createExpenseSchema, updateExpenseSchema } from "@/zod-schemas/index";
import type { Expense } from "@/types/index";

export const EXPENSE_CATEGORIES = [
  "School",
  "Bills",
  "Entertainment",
  "Food",
  "Healthcare",
  "Shopping",
  "Transportation",
  "Others",
] as const;

const round = (n: number) => Math.round(n * 100) / 100;

const toToolExpense = ({ id, date, category, description, amount }: Expense) => ({
  id,
  date,
  category,
  description,
  amount,
});

const dateArg = z.iso.date();
const categoryArg = z.enum(EXPENSE_CATEGORIES);
const amountArg = z.number().positive();
const descriptionArg = z.string().max(50);

export const getExpenseSummary = defineTool({
  name: "get_expense_summary",
  description:
    "Get the user's total spending and the total per category for a date range. " +
    "Use this for questions about how much was spent. To compare periods, call this once per period.",
  args: z.object({
    startDate: z.iso.date().describe("Start date, YYYY-MM-DD, inclusive"),
    endDate: z.iso.date().describe("End date, YYYY-MM-DD, inclusive"),
  }),
  async run({ startDate, endDate }, userId) {
    const rows = await expenseService.getTotalSpentPerCategory({
      userId,
      startDate,
      endDate,
    });

    const byCategory: Record<string, number> = {};
    for (const row of rows) byCategory[row.category] = round(row.total);
    const total = round(rows.reduce((sum, row) => sum + row.total, 0));

    return { startDate, endDate, total, byCategory };
  },
});

export const listExpenses = defineTool({
  name: "list_expenses",
  description:
    "List the user's individual expenses in a date range, newest first, optionally filtered by category. " +
    "Use this to see what the user bought, or to find an expense's id before changing or deleting it.",
  args: z.object({
    startDate: z.iso.date().describe("Start date, YYYY-MM-DD, inclusive"),
    endDate: z.iso.date().describe("End date, YYYY-MM-DD, inclusive"),
    category: categoryArg.optional().describe("Only include this category"),
    limit: z.number().int().min(1).max(50).optional().describe("Max expenses to return, default 20"),
  }),
  async run({ startDate, endDate, category, limit = 20 }, userId) {
    const rows = await expenseService.getExpensesByUserIdAndDateRangeWithPageAndLimit({
      userId,
      startDate,
      endDate,
      category,
      page: 1,
      limit: limit + 1,
      orderBy: "desc",
    });

    return {
      expenses: rows.slice(0, limit).map(toToolExpense),
      hasMore: rows.length > limit,
    };
  },
});

export const createExpense = defineTool({
  name: "create_expense",
  description: "Add a new expense for the user. Use today's date if the user doesn't mention one.",
  args: z.object({
    category: categoryArg.describe("Expense category"),
    amount: amountArg.describe("Amount spent"),
    date: dateArg.describe("Date of the expense, YYYY-MM-DD, cannot be in the future"),
    description: descriptionArg
      .optional()
      .describe("Short description from what the user said, e.g. what it was for or where (\"Lunch\", \"Church offering\")"),
  }),
  async run(args, userId) {
    const { category, amount, date, description } = createExpenseSchema.parse({
      ...args,
      description: args.description ?? "",
    });
    const expense = await expenseService.createExpense({
      userId,
      category,
      amount,
      date,
      description,
    });

    return { created: toToolExpense(expense) };
  },
});

export const updateExpense = defineTool({
  name: "update_expense",
  description:
    "Change an existing expense. Only pass the fields that should change. " +
    "Get the id from list_expenses first, and only call this after the user confirms the change.",
  args: z.object({
    id: z.number().int().positive().describe("Id of the expense, from list_expenses"),
    category: categoryArg.optional().describe("New category"),
    amount: amountArg.optional().describe("New amount"),
    date: dateArg.optional().describe("New date, YYYY-MM-DD, cannot be in the future"),
    description: descriptionArg.optional().describe("New description, or an empty string to remove it"),
  }),
  async run({ id, ...changes }, userId) {
    const existing = await expenseService.getExpenseById({ id, userId });
    if (!existing) return { error: "Expense not found" };

    const { category, amount, date, description } = updateExpenseSchema.parse({
      id,
      category: changes.category ?? existing.category,
      amount: changes.amount ?? existing.amount,
      date: changes.date ?? existing.date,
      description: changes.description ?? existing.description ?? "",
    });
    const updated = await expenseService.updateExpense({
      id,
      userId,
      category,
      amount,
      date,
      description,
    });

    return { before: toToolExpense(existing), after: toToolExpense(updated) };
  },
});

export const deleteExpense = defineTool({
  name: "delete_expense",
  description:
    "Permanently delete an expense. Get the id from list_expenses first, " +
    "and only call this after the user confirms which expense to delete.",
  args: z.object({
    id: z.number().int().positive().describe("Id of the expense, from list_expenses"),
  }),
  async run({ id }, userId) {
    const deleted = await expenseService.deleteExpense({ id, userId });
    if (!deleted) return { error: "Expense not found" };

    return { deleted: toToolExpense(deleted) };
  },
});
