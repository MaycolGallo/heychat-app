import { authOptions } from "@/lib/auth";
import { Await } from "@/components/buildui/await";
import { ChatInput } from "@/components/chats/chat-input";
import { HeaderChat } from "@/components/chats/header-chat";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getInitialMessages } from "@/lib/getInitialMessages";
import { unstable_noStore } from "next/cache";

type PageProps = {
  params: {
    chatId: string;
  };
};

const Messages = dynamic(() => import("@/components/chats/message-list"), {
  loading: () => <p>Loading...</p>,
});

// export const dynamic = "force-dynamic";

// async function getInitialMessages(chatId: string) {
//   try {
//     const messages: string[] = await db.zrange(
//       `chat:${chatId}:messages`,
//       0,
//       -1
//     );

//     const groupedByDay = messages.reduce((previous, message, index) => {
//       const { timestamp } = message as unknown as Message;
//       const date = new Date(timestamp).toLocaleDateString();

//       if (!previous[date]) {
//         previous[date] = [];
//       }

//       previous[date].push(message);
//       return previous;
//     }, {} as { [date: string]: string[] });
//     console.log(groupedByDay);

//     return groupedByDay;
//   } catch (error) {
//     console.log(error);
//   }
// }

async function isContactBlocked(userId: string, friendId: string) {
  const userFriends: Friend[] = await db.json.get(
    `user:${userId}:friends_info`,
    "$.friends.[*]"
  );
  const contFriens: Friend[] = await db.json.get(
    `user:${friendId}:friends_info`,
    "$.friends.[*]"
  );
  const contact = userFriends.find((friend) => friend.id === friendId);
  const contact2 = contFriens.find((friend) => friend.id === userId);

  if (contact?.id === friendId && contact?.blocked === true) {
    // if () {
    //   return 'has bloqueado';
    // }
    return "has bloqueado";
  } else if (contact2?.id === userId) {
    if (contact2?.blocked === true) {
      return "te han bloqueado";
    }
  }
  return false;
}

export default async function Chat({ params }: PageProps) {
  unstable_noStore()
  const { chatId } = params;
  const session = await getServerSession(authOptions);

  const user = session?.user;

  const [userId1, userId2] = chatId.split("--");

  if (!userId1 || !userId2) {
    notFound();
  }

  const chatPartnerId = user?.id === userId1 ? userId2 : userId1;

  const [chatPartner, initialMessages, blocked] = await Promise.all([
    db.get(`user:${chatPartnerId}`) as Promise<User>,
    getInitialMessages(chatId) as unknown as Promise<Record<string, Message[]>>,
    isContactBlocked(user?.id!, chatPartnerId),
  ]).catch(() => {
    notFound();
  });

  return (
    <div className="w-full flex flex-col h-[calc(100dvh-72px)] flex-grow lg:w-[calc(100%-384px)]">
      <HeaderChat
        name={chatPartner?.name!}
        image={chatPartner?.image!}
        email={chatPartner?.email}
        id={user?.id!}
      />
      {/* <Suspense fallback={<div>Loading...</div>}>
        <MessageList
          initialMessages={initialMessages}
          chatId={chatId}
          sessionId={session?.user.id!}
        />
      </Suspense> */}
      <Messages
        initialMessages={initialMessages}
        chatId={chatId}
        sessionId={session?.user?.id!}
      />
      <ChatInput chatId={chatId} userId={user?.id!} isBlocked={blocked} />
    </div>
  );
}
