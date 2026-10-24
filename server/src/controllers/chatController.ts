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

      let result;
      try {
        result = await runChat({ userId, userName, currency, history, message });
      } catch (cause) {
        console.error("Chat failed:", cause);
        const error: CustomError = new Error(
          "The assistant is unavailable right now. Please try again later."
        );
        error.statusCode = 503;
        throw error;
      }

      await saveHistory(userId, result.history);

      res.status(200).json({
        data: { reply: result.reply, dataChanged: result.dataChanged },
        message: "Message sent successfully",
      });
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
