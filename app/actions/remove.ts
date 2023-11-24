"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function remove(chatId: string, data: FormData, message: Message) {
  try {
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}:messages`),
      "message-removed",
      message
    );
    await db.zrem(`chat:${chatId}:messages`, message);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}
