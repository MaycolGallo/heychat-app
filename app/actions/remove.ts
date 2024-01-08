"use server";

import { db } from "@/lib/db";
import { Party } from "@/lib/party";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function removeMessage(chatId: string, message: Message) {
  const socket = Party(chatId);
  try {
    socket.send(JSON.stringify({ type: "delete_message", message }));
    await db.zrem(`chat:${chatId}:messages`, message);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}
