import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDistinctCategories } from "@/lib/getFilters";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const data = await db.json.get(`user:${session?.user?.id}:friends_info`, "$.friends.[*]") as Friend[];
    const contacts = getDistinctCategories(data) as string[]
    return Response.json(contacts)
}