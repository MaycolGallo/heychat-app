import { db } from "./db";

export async function getFriendList(userID: string) {
  const friends = await db.smembers(`user:${userID}:friends`);

  const listFriends = await Promise.all(
    friends.map(async (id) => {
      const friend = (await db.get(`user:${id}`)) as User;
      return friend;
    })
  );
  return listFriends;
}
