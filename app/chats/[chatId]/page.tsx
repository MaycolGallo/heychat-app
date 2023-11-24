import { authOptions } from "@/lib/auth";
import { Await } from "@/components/buildui/await";
import { ChatInput } from "@/components/chats/chat-input";
import { HeaderChat } from "@/components/chats/header-chat";
import  MessageList  from "@/components/chats/message-list";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import dynamic from "next/dynamic";

type PageProps = {
  params: {
    chatId: string;
  };
};

const Messages = dynamic(
  () =>
    import("@/components/chats/message-list"),
  {
    loading: () => <p>Loading...</p>,
  }
);

// export const dynamic = "force-dynamic";

async function getInitialMessages(chatId: string) {
  try {
    const messages: string[] = await db.zrange(
      `chat:${chatId}:messages`,
      0,
      -1
    );

    // const results = messages
    //   .map((message) => message as Message)
    //   .reverse();

    console.log("mesanjes", messages);

    return messages;
  } catch (error) {
    console.log(error);
  }
}

export default async function Chat({ params }: PageProps) {
  const { chatId } = params;
  const session = await getServerSession(authOptions);

  const user = session?.user;

  const [userId1, userId2] = chatId.split("--");

  const chatPartnerId = user?.id === userId1 ? userId2 : userId1;

  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getInitialMessages(chatId) as unknown as Message[];

  return (
    <div className="w-full md:flex flex-col lg:w-[calc(100%-384px)]">
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
      <ChatInput chatId={chatId} userId={user?.id!} />
    </div>
  );
}
