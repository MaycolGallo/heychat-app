import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const deleteds = await db.zrem(
      `chat:${body.chatId}:messages`,
      body.message
    );

    // pusher server trigger
    pusherServer.trigger(
      toPusherKey(`chat:${body.chatId}:messages`),
      "message_removed",
      body.message
    );

    return new Response("OK deteds" + deleteds, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error" + error, { status: 500 });
  }
}
