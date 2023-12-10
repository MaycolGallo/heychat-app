import { UserListChat } from "@/components/chats/list-chat";
import { Header } from "@/components/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex justify-stretch h-[calc(100dvh-72px)]  overflow-hidden">
        <UserListChat />
        {children}
      </main>
    </>
  );
}
