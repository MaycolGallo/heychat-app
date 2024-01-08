import PartySocket from "partysocket";

export function Party(roomId: string) {
  const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";
  return new PartySocket({ host, room: roomId });
}
