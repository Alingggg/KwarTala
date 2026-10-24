import type { Content } from "@google/genai";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const TTL_SECONDS = 30 * 60;
const MAX_TURNS = 20;

const key = (userId: number) => `chat:${userId}`;

function trimHistory(history: Content[]) {
  const turnStarts = history.flatMap((content, i) =>
    content.role === "user" && content.parts?.some((part) => part.text)
      ? [i]
      : [],
  );
  if (turnStarts.length <= MAX_TURNS) return history;

  return history.slice(turnStarts[turnStarts.length - MAX_TURNS]);
}

export async function getHistory(userId: number) {
  return (await redis.get<Content[]>(key(userId))) ?? [];
}

export async function saveHistory(userId: number, history: Content[]) {
  await redis.set(key(userId), trimHistory(history), { ex: TTL_SECONDS });
}

export async function clearHistory(userId: number) {
  await redis.del(key(userId));
}
