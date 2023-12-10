import { authOptions } from "@/lib/auth";
import { getFriendList } from "@/lib/getFriendList";
import { getServerSession } from "next-auth";
import Fuse from "fuse.js";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  try {
    const friends = await getFriendList(session?.user?.id!);

    const fuse = new Fuse(friends, {
      keys: ["name", "email"],
    });

    const results = fuse.search(body.query);

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
