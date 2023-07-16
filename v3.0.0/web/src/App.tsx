import { useEffect, useRef, useState } from "react";
import "strophe.js";

type SendMessageProps = {
  to: string;
  from: string;
  body: string;
  field1?: string;
};

function SendMessage({ to, from, body, field1 }: SendMessageProps) {
  const message = $msg({
    to,
    from,
    type: "chat",
  })
    .c("body")
    .t(body);

  connection.send(message);
}

const XMPP_USER = "zzlen-agent-1@5222.de";
const XMPP_PASS = '9"Xp^NCDcLzh>-j';
const BOSH_URL = "https://5222.de/http-bind";
const WEBSOCKET_URL = "wss://5222.de/xmpp-websocket";

const connection = new Strophe.Connection(BOSH_URL, {});
connection.authcid = XMPP_USER;
connection.jid = XMPP_USER;
connection.pass = XMPP_PASS;
console.log("CON", connection);

connection.connect(XMPP_USER, XMPP_PASS, (connected) => {
  console.log("CONNECTED", connected);
});

const Bosh = new Strophe.Bosh(connection);

//const Socket = new Strophe.Websocket(connection);
//const ConnectedSocket = Socket._connect();

console.log("BOSH", Bosh);
//console.log("SOCKET", Socket);

type NPC = {
  jid: string;
  name: string;
};

type Message = {
  sender: NPC;
  receiver: NPC;
  message: string;
  received: Date;
};

function App() {
  const NPCs: NPC[] = [
    {
      name: "NPC 1",
      jid: "zzlen-agent-2@5222.de",
    },
    {
      name: "NPC 2",
      jid: "zzlen-agent-3@5222.de",
    },
    {
      name: "NPC 3",
      jid: "zzlen-agent-4@5222.de",
    },
    {
      name: "NPC 4",
      jid: "zzlen-agent-5@5222.de",
    },
    {
      name: "NPC 5",
      jid: "zzlen-agent-6@5222.de",
    },
  ];
  const [message, setMessage] = useState("");
  const [selectedNPC, setSelectedNPC] = useState<NPC>(NPCs[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [coins, setCoins] = useState(0);
  const currentNPCMessages = messages.filter(
    (x) => x.sender.jid === selectedNPC.jid || x.receiver.jid === selectedNPC.jid
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    // @ts-expect-error Can be undefined but isn't
    messagesContainerRef.current.scrollTop = messagesContainerRef.current?.scrollHeight;

    if (message === "") return;

    const newMessage: Message = {
      message: message,
      sender: {
        jid: "Player",
        name: "Player",
      },
      receiver: selectedNPC,
      received: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    SendMessage({
      to: selectedNPC.jid,
      from: XMPP_USER,
      body: message,
    });

    setMessage("");
    if (messagesContainerRef.current?.scrollTop)
      messagesContainerRef.current.scrollTop = messagesContainerRef.current?.scrollHeight;
  };

  connection.xmlInput = function (data) {
    console.log("DATA", data);

    const body = data.getElementsByTagName("body");
    const _message = Strophe.getText(body[0]);
    let senderJid = "";

    if (!_message || _message === "") return;

    senderJid = body[0]?.parentElement?.getAttribute("from")?.split("/")[0] ?? "";

    let receivedCoins = 0;
    let lostCoins = 0;
    let receivedMessage = _message;

    if (_message.includes("RECEIVED_COINS")) {
      const splitMessage = _message.split("RECEIVED_COINS=") ?? "";
      console.log(splitMessage);
      receivedMessage = splitMessage[0];

      if (_message.includes("GIVEN_COINS")) {
        const splitArr = splitMessage[1].split(":::");
        receivedCoins = parseInt(splitArr[0]);

        console.log("SA", splitArr);

        const splitGivenCoins = splitArr[1]?.split("GIVEN_COINS=");
        console.log("SGVC", splitGivenCoins);

        lostCoins = parseInt(splitGivenCoins[1]);
        console.log("LC", lostCoins);
      } else {
        receivedCoins = parseInt(splitMessage[1]);
      }
    }

    console.log("RM", receivedMessage);
    console.log("RC", receivedCoins);

    const newMessage: Message = {
      message: receivedMessage,
      received: new Date(),
      receiver: {
        jid: "Player",
        name: "Player",
      },
      sender: NPCs.find((x) => x.jid === senderJid) ?? NPCs[0],
    };

    const coinDiff = receivedCoins - lostCoins;

    setMessages((prev) => [...prev, newMessage]);
    setCoins((prev) => (prev += Number.isNaN(coinDiff) ? 0 : coinDiff));
  };

  useEffect(() => {
    if (messagesContainerRef.current?.scrollTop)
      messagesContainerRef.current.scrollTop = messagesContainerRef.current?.scrollHeight;
  }, [currentNPCMessages]);

  function RestartGame() {
    setCoins(0);
    setMessage("");

    const newMessages: Message[] = [];

    NPCs.forEach((npc) => {
      newMessages.push({
        message: "RESET_GAME",
        sender: {
          jid: "Player",
          name: "Player",
        },
        receiver: npc,
        received: new Date(),
      });
    });

    setMessages((prev) => [...prev, ...newMessages]);

    NPCs.forEach((npc) => {
      SendMessage({
        to: npc.jid,
        from: XMPP_USER,
        body: "RESET_GAME",
      });
    });
  }
  return (
    <main className="w-screen min-h-screen bg-indigo-900 ">
      <div className="py-20 px-8 max-w-4xl mx-auto">
        <h1 className="text-center text-4xl text-white mb-20 font-black">Miniplayer VAS</h1>
        <div className="grid grid-cols-2 w-full gap-4">
          {/** CHAT */}
          <div className="w-full bg-fuchsia-100/60 rounded-md p-4">
            <h2 className="font-bold mb-6">Chat</h2>

            <select
              className="mb-4 p-2 rounded-md"
              onChange={(e) => setSelectedNPC(NPCs[parseInt(e.target.value) ?? 0])}
            >
              {NPCs.map((npc, index) => {
                return (
                  <option key={`option-${index}`} value={index}>
                    {npc.name}
                  </option>
                );
              })}
            </select>

            <div
              ref={messagesContainerRef}
              className="w-full flex flex-col gap-2 h-[400px] overflow-hidden mb-4 border rounded-sm p-2 scroll-m-1 overflow-y-scroll"
            >
              {currentNPCMessages?.map((m, index) => {
                return (
                  <div key={`message-${index}`} className="flex flex-row gap-2 items-center">
                    <p className="text-xs"></p>
                    <p className="flex-1">
                      <span className="text-xs font-light">{m.sender.name}: </span>
                      {m.message}
                    </p>
                    <p className="text-xs text-gray-600">
                      {m.received.getHours().toString().padStart(2, "0")}:
                      {m.received.getMinutes().toString().padStart(2, "0")}:
                      {m.received.getSeconds().toString().padStart(2, "0")}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-row gap-2">
              <input
                placeholder="Message..."
                className="px-3 py-2 rounded-lg w-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="rounded-lg bg-green-700 text-white hover:bg-green-800 px-6"
              >
                Send
              </button>
            </div>
          </div>

          {/** INSTRUCTIONS AND STATS */}
          <div className="w-full min-h-20 bg-fuchsia-100/60 rounded-md p-4">
            <h2 className="font-black mb-4 text-lg">Instructions</h2>
            <p className="italic mb-2">
              The goal of the game is to collect 10 coins. Talk to the NPCs and figure out how to
              get them!
            </p>
            <p className="italic">
              To start talking to an NPC select their name and send them a message with the
              following content: <span className="font-bold underline">Hi</span>
            </p>

            <h2 className="mt-10 mb-4 text-lg font-black">Stats</h2>
            <p>Coins: {coins}/10</p>

            {coins >= 10 && (
              <div className="mt-20 w-full h-40 rounded-lg flex flex-col gap-2 p-4 bg-amber-500 justify-center items-center">
                <p className="text-3xl font-bold underline ">You beat the game!</p>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  type="button"
                  onClick={() => RestartGame()}
                >
                  Play again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
