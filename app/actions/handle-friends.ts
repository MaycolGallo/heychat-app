"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function handleFriendRequest(idToUserToAdd: string, key: string) {
  function addFriendInfo(idFriend: string) {
    const body = {
      blocked: false,
      added: Date.now(),
      id: idFriend,
    };
    return body;
  }
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Unauthorized");
    }

    const currentUser = (await db.get(`user:${session?.user?.id}`)) as User;
    const friend = (await db.get(`user:${idToUserToAdd}`)) as User;

    //current login user
    const { id: user } = (await db.get(`user:${session?.user?.id}`)) as User;

    // verifica si el usuario a agregar ya existe en la lista d amigos del usuario
    const [isAlreadyFriend, hasFriendRequest] = await Promise.all([
      db.sismember(`user:${user}:friends`, idToUserToAdd),
      db.sismember(`user:${user}:incoming_friend_requests`, idToUserToAdd),
    ]);

    // if (isAlreadyFriend) {
    //   throw new Error("Already friends so no way lil bro");
    // }

    // verifica si existe a friend request from this user
    if (!hasFriendRequest) {
      throw new Error("No friend request found");
    }

    const [length, length2] = await Promise.all([
      db.json.get(`user:${user}:friends_info`, "$.friends"),
      db.json.get(`user:${idToUserToAdd}:friends_info`, "$.friends"),
    ]);

    if (key === "add") {
      const addFriendInfoToUser = addFriendInfo(idToUserToAdd);
      const addFriendInfoToTargetUser = addFriendInfo(user);

      const friendInfoToUser = { friends: [addFriendInfoToUser] };
      const friendInfoToTargetUser = { friends: [addFriendInfoToTargetUser] };

      const dbOperations: Promise<any>[] = [
        pusherServer.trigger(
          toPusherKey(`user:${idToUserToAdd}:friends`),
          "new_friend",
          currentUser
        ),
        pusherServer.trigger(
          toPusherKey(`user:${user}:friends`),
          "new_friend",
          friend
        ),
        db.sadd(`user:${user}:friends`, idToUserToAdd),
        db.sadd(`user:${idToUserToAdd}:friends`, user),
        db.srem(`user:${user}:incoming_friend_requests`, idToUserToAdd),
      ];

      if (length && length.length > 0 && length2 && length2.length > 0) {
        dbOperations.push(
          db.json.arrappend(
            `user:${user}:friends_info`,
            "$.friends",
            addFriendInfoToUser
          )
        ),
          dbOperations.push(
            db.json.arrappend(
              `user:${idToUserToAdd}:friends_info`,
              "$.friends",
              addFriendInfoToTargetUser
            )
          );
      } else if (length && length.length > 0) {
        dbOperations.push(
          db.json.arrappend(
            `user:${user}:friends_info`,
            "$.friends",
            addFriendInfoToUser
          )
        );
        dbOperations.push(
          db.json.set(
            `user:${idToUserToAdd}:friends_info`,
            "$",
            JSON.stringify({ friends: [addFriendInfoToTargetUser] })
          )
        );
      } else if (length2 && length2.length > 0) {
        dbOperations.push(
          db.json.set(
            `user:${user}:friends_info`,
            "$",
            JSON.stringify({ friends: [addFriendInfoToUser] })
          )
        );
        dbOperations.push(
          db.json.arrappend(
            `user:${idToUserToAdd}:friends_info`,
            "$.friends",
            addFriendInfoToTargetUser
          )
        );
      } else {
        dbOperations.push(
          db.json.set(
            `user:${user}:friends_info`,
            "$",
            JSON.stringify({ friends: [addFriendInfoToUser] })
          )
        );
        dbOperations.push(
          db.json.set(
            `user:${idToUserToAdd}:friends_info`,
            "$",
            JSON.stringify({ friends: [addFriendInfoToTargetUser] })
          )
        );
      }

      await Promise.all([dbOperations]);

      return {
        success: true,
        message: "Friend request accepted",
      };
    }

    if (key === "remove") {
      const pipeline = db.pipeline();
      pipeline.srem(`user:${user}:incoming_friend_requests`, idToUserToAdd);
      await pipeline.exec();
      return {
        success: true,
        message: "Friend request removed",
      };
    }
  } catch (error) {
    console.log(error);
    return { error: error as Error };
  }
}
