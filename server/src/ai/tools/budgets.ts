import { z } from "zod";
import { defineTool } from "./defineTool";
import { budgetService } from "@/services/index";
import { budgetSchema } from "@/zod-schemas/index";

const monthArgs = {
  month: z.number().int().min(1).max(12).describe("Month number, 1-12"),
  year: z.number().int().min(2000).describe("Four-digit year"),
};

export const getBudgetStatus = defineTool({
  name: "get_budget_status",
  description:
    "Get the user's budget for a month along with how much they spent and how much is remaining. " +
    "A budget of 0 means no budget is set. A negative remaining amount means they went over budget.",
  args: z.object(monthArgs),
  async run({ month, year }, userId) {
    return budgetService.getBudgetStatus({ userId, month, year });
  },
});

export const setBudget = defineTool({
  name: "set_budget",
  description: "Set the user's budget for a month. Creates it if it doesn't exist, otherwise replaces the amount.",
  args: z.object({
    ...monthArgs,
    amount: z.number().min(0).describe("Budget amount for the month"),
  }),
  async run(args, userId) {
    const { month, year, amount } = budgetSchema.parse(args);
    const budget = await budgetService.updateBudgetByUserIdAndDate({
      userId,
      month,
      year,
      amount,
    });

    return { month: budget.month, year: budget.year, amount: budget.amount };
  },
});
