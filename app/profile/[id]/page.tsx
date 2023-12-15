import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Profile() {
  const user = await getServerSession(authOptions);
  return (
    <div className="p-6 w-full bg-sky-50 dark:bg-neutral-900 lg:w-[calc(100%-384px)]">
      <form className="flex flex-col gap-3 max-w-lg mx-auto">
        <Label htmlFor="name">
          <Input id="name" name="name" defaultValue={user?.user?.name!} />
        </Label>
      </form>
    </div>
  );
}
