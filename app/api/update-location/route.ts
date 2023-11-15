import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();

  await pusherServer.trigger(
    toPusherKey(`update-location`),
    "location-updated",
    {
      locationActive:body.locationActive,
      city: body.cityName,
      userId:body.userId,
      countryName: body.countryName,
      countryCode: body.countryCode,
    }
  );
  return new Response(JSON.stringify(body), { status: 200 });
}
