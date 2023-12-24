import Image from "next/image";
import { Suspense } from "react";
import { BlockUser } from "./block-user";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { EmptyList } from "./empty-list";

type Props = {
  initialContacts: Array<{
    blocked: any;
    added: any;
    id: string;
    name: string;
    email: string;
    image: string;
  }>;
  sessionId?: string;
};

export async function ListBlocked({ initialContacts }: Props) {
  const session = await getServerSession(authOptions);
  const numBlocked = initialContacts.filter(
    (contact) => contact.blocked
  ).length;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {numBlocked > 0 ? (
        <div className="request-container">
          <section className="grid grid-cols-1 requests gap-4 my-3">
            {initialContacts
              .filter((contact) => contact.blocked)
              .map((contact) => (
                <article
                  className="flex items-center bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white justify-between border gap-3 border-neutral-300 rounded-lg p-4 shadow"
                  key={contact.id}
                >
                  <div className="flex w-full items-center gap-3">
                    <Image
                      src={contact.image}
                      alt={contact.name}
                      width={40}
                      height={40}
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold space-x-2">
                        {contact.name}
                      </h3>
                      <p className="dark:text-neutral-400">{contact.email}</p>
                    </div>
                    <BlockUser
                      type="unblock"
                      contactId={contact.id}
                      name={contact.name}
                      sessionId={session?.user.id}
                    />
                  </div>
                </article>
              ))}
          </section>
        </div>
      ) : (
        <EmptyList />
      )}
    </Suspense>
  );
}
