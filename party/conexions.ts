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

  user_status = Array<Test>();
  async onMessage(
    message: string | ArrayBuffer | ArrayBufferView,
    sender: Party.Connection<unknown>
  ) {
    // this.party.broadcast(message, [sender.id]);

    // this.user_status.push(JSON.parse(message as string));
    this.addObjectToStorage(this.user_status, JSON.parse(message as string));
    this.party.broadcast(JSON.stringify({ connecteds: this.user_status }), []);

    this.party.storage.put("connecteds", this.user_status);

    const storage = await this.party.storage.get("connecteds");
    console.log("storage", storage);
    // this.party.broadcast(JSON.stringify({ connecteds:this.user_status }), []);
  }

  async onStart() {
    if (!this.user_status) {
      this.user_status = (await this.party.storage.get("connecteds")) as Test[];
    }
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
      }
    }

    this.addObjectToStorage(this.user_status, status)

    this.party.broadcast(JSON.stringify({ connecteds: this.user_status }), []);
    
    // // await this.party.storage.put("user_status", this.user_status);
    // // const user_status = await this.party.storage.get("user_status");
    // const el = this.user_status.map((status) => {
    //     if (status.id === conn.id) {
    //         return{
    //             ...status,
    //             isConnected:false,
    //             disconnectedAt:Date.now()
    //         }
    //     }
    //     return status
    // })

    // this.party.broadcast(JSON.stringify({ type: "leave", connecteds: el }));

    // await this.party.storage.put("list_users", el);

    // for (const con of this.party.getConnections()) {
    //   if (con.id !== conn.id) {
    //     conn.send(JSON.stringify({ type: "leave", yo: user_status }));
    //   }
    // }
  }
}
ConnServer satisfies Party.Worker;
