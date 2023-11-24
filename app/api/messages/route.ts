import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    // pusher server trigger
    await pusherServer.trigger(
      toPusherKey(`chat:${body.chatId}:messages`),
      "message_removed",
      body.message
    );

    const deleteds = await db.zrem(
      `chat:${body.chatId}:messages`,
      body.message
    );


    return new Response(`Deleted ${deleteds}`, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(`Error ${error}`, { status: 500 });
  }
}
