import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json();
  pusherServer.trigger(
    toPusherKey(`chat:${body.chatId}`),
    "user_typping",
    {
      userId: body.userId,
    }
  );

  return new Response("OK", { status: 200 });
}
