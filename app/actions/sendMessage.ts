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

    const redisMulti = db.multi();
    redisMulti.smembers(`user:${user?.id}:friends`);
    redisMulti.json.get(`user:${user?.id}:friends_info`,'$.friends.[*]');
    redisMulti.get(`user:${friendId}`);
    const [friendList, friends, friendInfo] = await redisMulti.exec() as [string[],any[],User];

    const isFriend = new Set(friendList).has(friendId);

    const friendCheck = friends.find((friend) => {
      return friend.id === friendId
    })

    if (friendCheck?.blocked) {
      throw new Error("No puedes mandar mensajes a este usuario");
    }
    
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
    const pusherBatch = []

    pusherBatch.push({
      channel: toPusherKey(`chat:${chatId}`),
      name: "incoming_message",
      data: messageData,
    })

    pusherBatch.push({
      channel:toPusherKey(`user:${friendId}:chats`),
      name: "new_message",
      data: {
        ...messageData,
        senderEmail: friendInfo.email,
        senderImage: friendInfo.image,
        senderName: friendInfo.name,
      }
    })

    await pusherServer.triggerBatch(pusherBatch);
    // pusher server trigger 
    // await pusherServer.trigger(
    //   toPusherKey(`chat:${chatId}`),
    //   "incoming_message",
    //   messageData
    // );

    // pusherServer.trigger(
    //   toPusherKey(`user:${friendId}:chats`),
    //   "new_message",
    //   {
    //     ...messageData,
    //     senderEmail: friendInfo.email,
    //     senderImage: friendInfo.image,
    //     senderName: friendInfo.name,
    //   }
    // )
    const pipeline = db.pipeline();
    pipeline.zadd(`chat:${chatId}:messages`, {
      score: Date.now(),
      member: JSON.stringify(messageData),
    })
    await pipeline.exec();

    // revalidatePath(`/chats/${chatId}`);
    return {
      message: "Message sent",
      type: "success",
    }
  } catch (error) {
    return { message: `Ha ocurrido un error: ${error}`, type: "error" };
  }
}
