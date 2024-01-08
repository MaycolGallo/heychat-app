import { db } from "@/lib/db";

export async function GET() {
  try {
    const data = (await db.zrange(
      "chat:1367e619-83be-4185-8bba-d669cc846f1e--65495627-318e-49bc-8454-7b5f839073fc:messages",
      0,
      -1
    )) as Message[];

    const plablos = data.reduce((previous, message, index) => {
      const { timestamp } = message as unknown as Message;
      const date = new Date(timestamp).toLocaleDateString();

      if (!previous[date]) {
        previous[date] = [];
      }

      previous[date].push(message);
      return previous;
    }, {} as Record<string, Message[]>);

    return Response.json({ plablos,yo:new Date().toLocaleDateString() }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error as Error }, { status: 500 });
  }
}
