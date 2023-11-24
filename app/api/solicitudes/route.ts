import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { db } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { id: idToUserToAdd } = await req.json();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    //current login user
    const { id: user } = (await db.get(`user:${session?.user?.id}`)) as User;

    // verifica si el usuario a agregar ya existe en la lista d amigos del usuario
    const isAlreadyFriend = await db.sismember(
      `user:${user}:friends`,
      idToUserToAdd
    );

    if (isAlreadyFriend) {
      return new Response("Already in friends list", { status: 400 });
    }

    // verifica si existe a friend request from this user
    const hasFriendRequest = await db.sismember(
      `user:${user}:incoming_friend_requests`,
      idToUserToAdd
    );

    const y = await db.smembers(`user:${user}:incoming_friend_requests`);

    console.log(user, y);

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    const add = await db.sadd(`user:${user}:friends`, idToUserToAdd);

    const inverseAdd = await db.sadd(`user:${idToUserToAdd}:friends`, user);

    const remove = await db.srem(
      `user:${user}:incoming_friend_requests`,
      idToUserToAdd
    );

    await Promise.all([add, inverseAdd, remove]);

    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}
