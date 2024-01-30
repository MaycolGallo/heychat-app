"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useOptimistic, useState } from "react";
import { BlockUser } from "./block-user";
import { EmptyList } from "./empty-list";
import { Filters } from "./filters";
import { getDistinctCategories } from "@/lib/getFilters";
import { FancyBox } from "@/components/ui/change-cat";
import { unstable_cache } from "next/cache";

type Props = {
  initialContacts: Array<{
    blocked: any;
    added: any;
    id: string;
    name: string;
    email: string;
    image: string;
    category: string;
  }>;
  sessionId?: string;
};

export function ListContacts({ initialContacts, sessionId }: Props) {
  // const [contact, setContact] = useOptimistic(initialContacts);
  const numNotBlocked = initialContacts.filter(
    (contact) => !contact.blocked
  ).length;

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filterContacts = useMemo(() => {
    if (selectedFilter) {
      return initialContacts.filter((contact) =>
        contact.category.includes(selectedFilter)
      );
    }
    return initialContacts;
  }, [initialContacts, selectedFilter]);


  const contect = getDistinctCategories(initialContacts) as string[];
  return (
    <>
      <Filters
        filters={contect}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      {numNotBlocked > 0 ? (
        <div className="request-container">
          {selectedFilter ? <span className="text-xl font-semibold">{selectedFilter}</span> : null}
          <section className="grid grid-cols-1 requests gap-4 my-3">
            {filterContacts
              .filter((contact) => !contact.blocked)
              .map((contact, index) => (
                <article
                  className="flex items-center bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white justify-between border gap-3 border-neutral-300 rounded-lg p-4 shadow"
                  key={contact.id}
                >
                  <div className="flex items-center w-full gap-3">
                    <Image
                      src={contact.image}
                      alt={contact.name}
                      width={40}
                      height={40}
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold space-x-2">
                        {contact.name}

                        <span className="font-normal mx-1 text-sm">
                          {/* &bull; agregado {formatTimePassed(contact.added)} */}
                        </span>
                      </h3>
                      <p className="dark:text-neutral-400">{contact.email}</p>
                    </div>
                    <FancyBox
                      categories={contect}
                      contactId={contact.id}
                      category={contact.category}
                    />
                    <BlockUser
                      type="block"
                      contactId={contact.id}
                      name={contact.name}
                      sessionId={sessionId}
                    />
                  </div>
                </article>
              ))}
          </section>
        </div>
      ) : (
        <EmptyList />
      )}
    </>
  );
}
