import { db } from "./db";
import { linkChatSorted } from "./utils";

export async function friendLastMessage(userId: string, friendId: string) {
  const [messages] = (await db.zrange(
    `chat:${linkChatSorted(userId, friendId)}:messages`,
    -1,
    -1
  )) as Message[];
  return messages;
}
