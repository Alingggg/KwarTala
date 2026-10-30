import type { Content, FunctionCall, Part } from "@google/genai";
import { ai, MODEL } from "./llm";
import { buildSystemPrompt } from "./prompts";
import { geminiTools, runTool } from "./tools";

const MAX_STEPS = 8;
const FALLBACK_REPLY = "Sorry, I couldn't finish that. Please try again.";
const PARTIAL_REPLY =
  "Sorry, something went wrong before I could finish. Some of your request may already be done, so please check your dashboard before trying again.";
const MUTATING_TOOLS = ["create_expense", "update_expense", "delete_expense", "set_budget"];

export async function runChat({
  userId,
  userName,
  currency,
  history,
  message,
  onDelta,
}: {
  userId: number;
  userName: string;
  currency: string;
  history: Content[];
  message: string;
  onDelta: (text: string) => void;
}) {
  const contents: Content[] = [...history, { role: "user", parts: [{ text: message }] }];
  const config = {
    systemInstruction: buildSystemPrompt({ userName, currency }),
    tools: geminiTools,
  };
  let dataChanged = false;

  for (let step = 0; step < MAX_STEPS; step++) {
    const parts: Part[] = [];
    const calls: FunctionCall[] = [];
    let text = "";
    try {
      const stream = await ai.models.generateContentStream({ model: MODEL, contents, config });
      for await (const chunk of stream) {
        parts.push(...(chunk.candidates?.[0]?.content?.parts ?? []));
        calls.push(...(chunk.functionCalls ?? []));
        if (chunk.text) {
          text += chunk.text;
          onDelta(chunk.text);
        }
      }
    } catch (error) {
      if (!dataChanged) throw error;
      console.error("Chat failed after data changed:", error);
      onDelta(text ? `\n\n${PARTIAL_REPLY}` : PARTIAL_REPLY);
      contents.push({ role: "model", parts: [{ text: PARTIAL_REPLY }] });
      return { history: contents, dataChanged };
    }
    if (!parts.length) break;

    contents.push({ role: "model", parts });

    if (!calls.length) {
      if (!text) onDelta(FALLBACK_REPLY);
      return { history: contents, dataChanged };
    }

    const responseParts: Part[] = [];
    for (const call of calls) {
      const response = await runTool(call.name ?? "", call.args, userId);
      if (MUTATING_TOOLS.includes(call.name ?? "") && !("error" in response)) {
        dataChanged = true;
      }
      responseParts.push({ functionResponse: { name: call.name, response } });
    }
    contents.push({ role: "user", parts: responseParts });
  }

  onDelta(FALLBACK_REPLY);
  contents.push({ role: "model", parts: [{ text: FALLBACK_REPLY }] });
  return { history: contents, dataChanged };
}
