"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function blockUser(contactId: string, userId: string) {
  try {
    if (!contactId || !userId) {
      throw new Error("Missing contactId or userId");
    }

    const [userFriends, contactFriends] = await Promise.all([
      db.json.get(`user:${userId}:friends_info`, "$.friends.[*]") as Promise<
        Friend[]
      >,
      db.json.get(`user:${contactId}:friends_info`, "$.friends.[*]") as Promise<
        Friend[]
      >,
    ]);

    const userIndex = userFriends.findIndex((friend) => {
      return friend.id === contactId;
    });

    const [isFriendBlocked] = await db.json.get(
      `user:${userId}:friends_info`,
      `$.friends.[${userIndex}].blocked`
    );

    const contactIndex = contactFriends.findIndex((friend) => {
      return friend.id === userId;
    });

    const pipeline = db.pipeline();

    pipeline.json.toggle(
      `user:${userId}:friends_info`,
      `$.friends.[${userIndex}].blocked`
    );

    if (!isFriendBlocked) {
      pipeline.srem(`user:${contactId}:friends`, userId);
      pipeline.json.del(
        `user:${contactId}:friends_info`,
        `$.friends.[${contactIndex}]`
      );
    }

    // if (userIndex !== -1) {
    //   await pipeline.exec();
    // }

    await pipeline.exec();

    revalidatePath("/chats/contactos");

    return {
      success: true,
      message: "Usuario bloqueado",
    };
  } catch (e) {
    return {
      error: e as Error,
    };
  }
}
