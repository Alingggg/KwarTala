import { runChat, getHistory, saveHistory, clearHistory } from "@/ai/index";
import { chatMessageSchema } from "@/zod-schemas/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const chatController = {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId, userName } = req.user;

      const validationResult = chatMessageSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { message, currency } = validationResult.data;
      const history = await getHistory(userId);

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const send = (event: string, data: object) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      try {
        const result = await runChat({
          userId,
          userName,
          currency,
          history,
          message,
          onDelta: (text) => send("delta", { text }),
        });
        await saveHistory(userId, result.history);
        send("done", { dataChanged: result.dataChanged });
      } catch (cause) {
        console.error("Chat failed:", cause);
        send("error", {
          message: "The assistant is unavailable right now. Please try again later.",
        });
      }
      res.end();
    } catch (error) {
      next(error);
    }
  },

  async clearChat(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      await clearHistory(req.user.userId);

      res.status(200).json({ message: "Chat cleared successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default chatController;
