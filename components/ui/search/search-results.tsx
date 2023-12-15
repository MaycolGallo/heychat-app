import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { SearchUsers } from "./search-users";

export async function SearchResults() {
    const session = await getServerSession(authOptions)

    return (
        <SearchUsers userId={session?.user.id!} />
    )
}