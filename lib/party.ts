import PartySocket from "partysocket";

let instance: PartySocket | null = null;

export function Party(roomId: string) {
  if (!instance) {
    instance = new PartySocket({
      host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
      room: roomId,
    });
  }
  return instance;
}

