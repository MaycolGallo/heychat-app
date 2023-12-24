import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    // pusher server trigger
    const key = `chat:${body.chatId}:messages`;
    
    await Promise.all([
      pusherServer.trigger(toPusherKey(key), "message_removed", body.message),
      db.zrem(key, body.message)
    ]);
    
    return new Response(`Deleted 1`, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(`Error ${error}`, { status: 500 });
  }
}
