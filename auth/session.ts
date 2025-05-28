import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

export async function createUserSession(sessionData: any) {
  try {
    const sessionId = nanoid();
    await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), {
      ex: SESSION_EXPIRATION_SECONDS,
    });
    return sessionId;
  } catch (error) {
    console.error("Failed to create user session:", error);
    throw new Error("Failed to create user session");
  }
}

export async function getUserSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      console.debug("No session cookie found");
      return null;
    }

    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
      console.debug("No session data found in Redis");
      return null;
    }

    if (typeof sessionData === "string") {
      try {
        return JSON.parse(sessionData);
      } catch (error) {
        console.error("Failed to parse session data:", error);
        return null;
      }
    }

    return sessionData;
  } catch (error) {
    console.error("Failed to get user session:", error);
    return null;
  }
}
