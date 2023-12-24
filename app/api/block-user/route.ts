import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const [userFriends, contactFriends] = await Promise.all([
      db.json.get(
        `user:${body.userId}:friends_info`,
        "$.friends.[*]"
      ) as Promise<Friend[]>,
      db.json.get(
        `user:${body.contactId}:friends_info`,
        "$.friends.[*]"
      ) as Promise<Friend[]>,
    ]);

    const userIndex = userFriends.findIndex((friend) => {
      return friend.id === body.contactId;
    });

    const [isFriendBlocked] = await db.json.get(
      `user:${body.userId}:friends_info`,
      `$.friends.[${userIndex}].blocked`
    );

    const contactIndex = contactFriends.findIndex((friend) => {
      return friend.id === body.userId;
    });

    const pipeline = db.pipeline();

    pipeline.json.toggle(
      `user:${body.userId}:friends_info`,
      `$.friends.[${userIndex}].blocked`
    );

    if (!isFriendBlocked) {
      pipeline.srem(`user:${body.contactId}:friends`, body.userId);
      pipeline.json.del(
        `user:${body.contactId}:friends_info`,
        `$.friends.[${contactIndex}]`
      );
    }

    if (userIndex !== -1) {
      await pipeline.exec();
    }
    // revalidatePath("/chats/contactos");

    return new Response(
      JSON.stringify({ success: true, friend: isFriendBlocked }),
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e as Error },
      { status: 500 }
    );
  }
}
