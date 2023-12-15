"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function addUser(data: FormData) {
  try {
    const emailToAdd = data.get("email")?.valueOf() as string;
    //usuario a  enviar la solicitud
    const user = await db.get(`user:email:${emailToAdd}`);

    if (!user) {
      throw new Error("Este usuario no existe");
    }

    const session = await getServerSession(authOptions);

    if (session?.user.id === user) {
      throw new Error("No puedes enviar una solicitud de amistad a ti mismo");
    }

    const pipeline = db.pipeline();

    // verifica si ya se envio una solicitud de amistad
    pipeline.sismember(
      `user:${user}:incoming_friend_requests`,
      session?.user.id
    );
    pipeline.sismember(`user:${user}:friends`, session?.user.id);
    pipeline.json.get(`user:${user}:friends_info`, "$.friends.[*]");
   
    const [isAlreadySent, isAlreadyFriend, friends] = await pipeline.exec<any>();

    if (friends) {
      const isnotblocked = friends.find((friend:Friend) => {
        return friend.id === session?.user.id
      })
      if (isnotblocked?.blocked === true) {
        throw new Error("No puedes enviar una solicitud a este usuario");
      }
    }

    if (isAlreadySent || isAlreadyFriend) {
      throw new Error("Ya has enviado una solicitud de amistad a este usuario");
    }

    await pusherServer.trigger(
      toPusherKey(`user:${user}:incoming_friend_requests`),
      "new_incoming_friend",
      {
        senderName: session?.user.name,
        senderImage: session?.user.image,
        senderId: session?.user.id,
        senderEmail: session?.user.email,
      }
    );

    const multi = db.multi();
    multi.sadd(`user:${user}:incoming_friend_requests`, session?.user.id)

    const result = await multi.exec();

    if (!result) {
      throw new Error("Failed to add incoming friend request");
    }

    return { message: `Solicitud enviada a ${emailToAdd}`, type: "success" };
  } catch (error) {
    console.log(error);
    return { message: `${error}`, type: "error" };
  }
}
