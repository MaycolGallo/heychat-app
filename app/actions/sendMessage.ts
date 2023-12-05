"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function sendMessage(chatId: string, data: FormData) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const [userId1, userId2] = chatId.split("--");

    const friendId = user?.id === userId1 ? userId2 : userId1;

    const friendList = await db.smembers(`user:${user?.id}:friends`);
    const isFriend = friendList.includes(friendId);

    const friendInfo = (await db.get(`user:${friendId}`)) as User;

    if (!isFriend) {
      throw new Error("You are not friends");
    }

    const messageData = {
      id: crypto.randomUUID(),
      text: data.get("message")?.valueOf(),
      senderId: user?.id,
      timestamp: Date.now(),
    };

    console.log(messageData);

    // pusher server trigger 
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming_message",
      messageData
    );

    pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      "new_message",
      {
        ...messageData,
        senderEmail: friendInfo.email,
        senderImage: friendInfo.image,
        senderName: friendInfo.name,
      }
    )

    // el chat tiene id sender--reciever
    await db.zadd(`chat:${chatId}:messages`, {
      score: Date.now(),
      member: JSON.stringify(messageData),
    });

    // revalidatePath(`/chats/${chatId}`);

  } catch (error) {
    console.log(error);
    return { message: `Ha ocurrido un error: ${error}`, type: "error" };
  }
}
