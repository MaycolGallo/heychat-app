import { db } from "./db";

export async function getInitialMessages(chatId: string) {
  try {
    const messages: Message[] = await db.zrange(
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const groupedByDay = messages.reduce((previous, message, index) => {
      const { timestamp } = message;
      const date = new Date(timestamp).toLocaleDateString('es-ES');

      if (!previous[date]) {
        previous[date] = [];
      }

      previous[date].push(message);
      return previous;
    }, {} as Record<string, Message[]>);

    return groupedByDay;
  } catch (error) {
    console.log(error);
  }
}
