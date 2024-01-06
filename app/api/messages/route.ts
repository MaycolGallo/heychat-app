import { db } from "@/lib/db";
import { Party } from "@/lib/party";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const socket = Party(body.chatId);

    // pusher server trigger
    const key = `chat:${body.chatId}:messages`;
    socket.send(JSON.stringify({ type: "delete_message", message: body.message }));
    db.zrem(key, body.message)
    
    return new Response(`Deleted 1`, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(`Error ${error}`, { status: 500 });
  }
}
