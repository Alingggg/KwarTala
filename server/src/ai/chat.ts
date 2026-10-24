import type { Content, Part } from "@google/genai";
import { ai, MODEL } from "./llm";
import { buildSystemPrompt } from "./prompts";
import { geminiTools, runTool } from "./tools";

const MAX_STEPS = 8;
const FALLBACK_REPLY = "Sorry, I couldn't finish that. Please try again.";

export async function runChat({
  userId,
  userName,
  currency,
  history,
  message,
}: {
  userId: number;
  userName: string;
  currency: string;
  history: Content[];
  message: string;
}) {
  const contents: Content[] = [...history, { role: "user", parts: [{ text: message }] }];
  const config = {
    systemInstruction: buildSystemPrompt({ userName, currency }),
    tools: geminiTools,
  };

  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await ai.models.generateContent({ model: MODEL, contents, config });
    const content = response.candidates?.[0]?.content;
    if (!content?.parts?.length) break;

    contents.push(content);

    const calls = response.functionCalls;
    if (!calls?.length) {
      return { reply: response.text ?? FALLBACK_REPLY, history: contents };
    }

    const parts: Part[] = [];
    for (const call of calls) {
      const response = await runTool(call.name ?? "", call.args, userId);
      parts.push({ functionResponse: { name: call.name, response } });
    }
    contents.push({ role: "user", parts });
  }

  contents.push({ role: "model", parts: [{ text: FALLBACK_REPLY }] });
  return { reply: FALLBACK_REPLY, history: contents };
}
