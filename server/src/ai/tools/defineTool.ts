import { z } from "zod";

export function defineTool<T extends z.ZodObject>(tool: {
  name: string;
  description: string;
  args: T;
  run: (args: z.infer<T>, userId: number) => Promise<Record<string, unknown>>;
}) {
  return {
    name: tool.name,
    description: tool.description,
    args: tool.args,
    run: (rawArgs: unknown, userId: number) => {
      const validArgs = tool.args.parse(rawArgs);
      return tool.run(validArgs, userId);
    },
  };
}
