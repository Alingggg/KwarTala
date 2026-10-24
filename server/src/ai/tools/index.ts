import { z } from "zod";
import {
  getExpenseSummary,
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expenses";
import { getBudgetStatus, setBudget } from "./budgets";

const tools = [
  getExpenseSummary,
  listExpenses,
  getBudgetStatus,
  createExpense,
  updateExpense,
  deleteExpense,
  setBudget,
];

export const geminiTools = [
  {
    functionDeclarations: tools.map((tool) => {
      const { $schema, ...parameters } = z.toJSONSchema(tool.args);
      return {
        name: tool.name,
        description: tool.description,
        parametersJsonSchema: parameters,
      };
    }),
  },
];

export async function runTool(name: string, rawArgs: unknown, userId: number) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return { error: `Unknown tool: ${name}` };

  try {
    return await tool.run(rawArgs, userId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: `Invalid arguments: ${z.prettifyError(error)}` };
    }
    return { error: "The tool failed to run." };
  }
}
