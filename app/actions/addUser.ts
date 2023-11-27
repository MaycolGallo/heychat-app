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

    const session = await getServerSession(authOptions);

    // verifica si ya se envio una solicitud de amistad
    const isAlreadySent = await db.sismember(
      `user:${user}:incoming_friend_requests`,
      session?.user.id
    );

    // verifica si ya se encuentra en la lista de amigos
    const isAlreadyFriend = await db.sismember(
      `user:${user}:friends`,
      session?.user.id
    );

    if (isAlreadySent || isAlreadyFriend) {
      throw new Error("Ya has enviado una solicitud de amistad a este usuario");
    }

    if (!user) {
      throw new Error("Este usuario no existe");
    }

    if (session?.user.id === user) {
      throw new Error("No puedes enviar una solicitud de amistad a ti mismo");
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

    await db.sadd(`user:${user}:incoming_friend_requests`, session?.user.id);
    return { message: `Solicitud enviada a ${emailToAdd}`, type: "success" };
  } catch (error) {
    console.log(error);
    return { message: `${error}`, type: "error" };
  }
}
