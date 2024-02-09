import type * as Party from "partykit/server";

type Unseen = Record<string, { unseen: number }>;

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  unseen: Unseen = {};

  async onStart() {
    this.unseen = ((await this.party.storage.get("unseen")) as Unseen) ?? {};
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
        id: ${conn.id}
        room: ${this.party.id}
        url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send(JSON.stringify({ unseen: this.unseen }));
    // this.party.storage.delete("unseen");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    const mess = JSON.parse(message);

    if (mess.type === "new_message") {
      this.unseen = this.updateUnseenMessages({id: mess.message.senderId, unseen: 1}, 'new_message') as Unseen;
      this.party.storage.put("unseen", this.unseen);
      this.party.broadcast(JSON.stringify({ unseen: this.unseen }));
    }

    if (mess.type === "seen") {
      this.unseen = this.updateUnseenMessages({id: mess.id, unseen: 0}, 'seen') as Unseen;
      this.party.storage.put("unseen", this.unseen);
      this.party.broadcast(JSON.stringify({ ness:'pol',unseen: this.unseen }));
    }

    this.party.broadcast(
      message,
      // ...except for the connection it came from
      []
    );
  }

  /**
   * Updates the number of unseen messages for a given user.
   *
   * @param {object} obj - An object containing the user ID and the number of unseen messages
   * @return {object} The updated list of unseen messages
   */
  updateUnseenMessages(obj: { id: string; unseen: number }, type:'seen' | 'new_message'): object {
    const { id, unseen } = obj;
    if (type === 'seen') {
      if (this.unseen[id]) {
        this.unseen[id].unseen = 0;
      }
    } else if (type === 'new_message') {
      if (this.unseen[id]) {
        this.unseen[id].unseen += unseen;
      } else {
        this.unseen[id] = { unseen };
      }
    }
    return this.unseen;
  }
}

Server satisfies Party.Worker;
