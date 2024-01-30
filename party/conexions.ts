import type * as Party from "partykit/server";

type Test = {
  type: string;
  status: {
    userId?: string;
    id: string;
    isConnected: boolean;
    connectedAt: number;
    disconnectedAt: number | null;
  };
};

export default class ConnServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  async onConnect(
    connection: Party.Connection<unknown>,
    ctx: Party.ConnectionContext
  ) {
    // connection.send(JSON.stringify({ chatters: this.user_status }));
    await this.party.storage.deleteAll();
  }

  user_status = Array<Test>();
  junk = 0;
  async onMessage(
    message: string | ArrayBuffer | ArrayBufferView,
    sender: Party.Connection<unknown>
  ) {
    // this.party.broadcast(message, [sender.id]);

    // this.user_status.push(JSON.parse(message as string));
    this.addObjectToStorage(this.user_status, JSON.parse(message as string));
    // this.party.broadcast(JSON.stringify(message), []);
    // this.party.broadcast(JSON.stringify({ connecteds: this.user_status }), []);

    await this.party.storage.put("connecteds", this.user_status);
    // this.party.storage.put("junk", 25);

    // this.party.broadcast(JSON.stringify({ junk: this.junk }), []);

    const storage = await this.party.storage.get("connecteds");
    this.party.broadcast(JSON.stringify({ connecteds: storage }), []);
    // console.log("storage", storage);
    // this.party.broadcast(JSON.stringify({ connecteds:this.user_status }), []);
  }

  async onStart() {
    if (!this.user_status) {
      this.user_status = (await this.party.storage.get("connecteds")) as Test[];
    }
    this.junk = (await this.party.storage.get("junk")) as number;
  }

  addObjectToStorage(arr: Test[], newItem: Test) {
    const existingIndex = arr.findIndex(
      (item) =>
        item.status.userId === newItem.status.userId ||
        item.status.id === newItem.status.id
    );
    if (existingIndex !== -1) {
      arr[existingIndex].status = {
        ...arr[existingIndex].status,
        ...newItem.status,
      };
    } else {
      arr.push(newItem);
    }
  }

  async onClose(conn: Party.Connection<unknown>) {
    console.log(`connection ${conn.id} closed`);

    const status = {
      type: "leave",
      status: {
        id: conn.id,
        isConnected: false,
        connectedAt: Date.now(),
        disconnectedAt: Date.now(),
      },
    };

    this.addObjectToStorage(this.user_status, status);
    // this.party.storage.put("connecteds", this.user_status);

    // this.party.broadcast(JSON.stringify({ connecteds: this.user_status }), []);
    this.party.broadcast(JSON.stringify({ connecteds: this.user_status }), []);

  }
}
ConnServer satisfies Party.Worker;
