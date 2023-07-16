# Vas projekt - MiniMMO

## Agenti

| Agent   | JID                   | password        |
| ------- | --------------------- | --------------- |
| Agent 1 | zzlen-agent-1@5222.de | 9"Xp^NCDcLzh>-j |
| Agent 2 | zzlen-agent-2@5222.de | 9"Xp^NCDcLzh>-j |
| Agent 3 | zzlen-agent-3@5222.de | 9"Xp^NCDcLzh>-j |
| Agent 4 | zzlen-agent-4@5222.de | 9"Xp^NCDcLzh>-j |
| Agent 5 | zzlen-agent-5@5222.de | 9"Xp^NCDcLzh>-j |
| Agent 6 | zzlen-agent-6@5222.de | 9"Xp^NCDcLzh>-j |

## Upute

1. Instalirati **TOČNO** Python 3.9
2. Instalirati pip installer
3. Imati instaliran NodeJS
4. Instalirati spade
5. Pokrenuti sve NPCjeve koji se nalaze u mapi /agents
6. Unutar mape game/ pokrenuti `npm install`
7. Kako su neke biblioteke zastarjele potrebno je izmijeniti sljedece dvije datoteke:
   1. `node_modules/@xmpp/resolve/lib/http.js` izmijeniti varijablu `global` sa `globalThis`
   2. `node_modules/@xmpp/websocket/lib/Socket.js` izmijeniti varijablu `global` sa `globalThis`
8. Kako smo izmijenili datoteke potrebno je maknuti cache od Vite-a, tako da se obriše mapa `node_modules/.vite`
9. Unutar mape game/ pokrenuti `npm run dev`
10. U pregledniku otvoriti `localhost:5173`
