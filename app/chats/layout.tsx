import { UserListChat } from "@/components/chats/list-chat";
import { Header } from "@/components/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex h-[calc(100vh-90px)]  overflow-hidden">
        <UserListChat />
        {children}
      </main>
    </>
  );
}
