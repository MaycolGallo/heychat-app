import usePartySocket from "partysocket/react";

export function useParty(roomId: string) {
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomId,
  });
  return { socket };
}
