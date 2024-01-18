"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function change(newValue: string, contactId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return;
    }
    const [userFriends, contactFriends] = await Promise.all([
      db.json.get(
        `user:${session?.user?.id}:friends_info`,
        "$.friends.[*]"
      ) as Promise<Friend[]>,
      db.json.get(`user:${contactId}:friends_info`, "$.friends.[*]") as Promise<
        Friend[]
      >,
    ]);

    const userIndex = userFriends.findIndex((friend) => {
      return friend.id === contactId;
    });

    const pipeline = db.pipeline();

    pipeline.json.set(
      `user:${session?.user?.id}:friends_info`,
      `$.friends.[${userIndex}].category`,
      JSON.stringify(newValue)
    );

    const result = await pipeline.exec();

    if (!result) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/chats/contactos");

    return {
      success: true,
      message: "Category changed successfully",
    };

  } catch (error) {
    return { error: `${error}` };
  }
}
