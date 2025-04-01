import { FastifyInstance } from "fastify";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ noServer: true });

const rooms = new Map<string, Set<WebSocket>>();

export function setupWebSocket(server: FastifyInstance) {
  server.server.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    console.log("Novo cliente conectado!");
    ws.on("message", (message) => {
      try {
        const { event, matchId } = JSON.parse(message.toString());

        if (event === "join_room" && matchId) {
          if (!rooms.has(matchId)) {
            rooms.set(matchId, new Set());
          }
          rooms.get(matchId)!.add(ws);
          console.log(`Cliente entrou na sala ${matchId}`);
        }
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    });

    ws.on("close", () => {
      console.log("Cliente desconectado");

      rooms.forEach((clients, matchId) => {
        clients.delete(ws);
        if (clients.size === 0) {
          rooms.delete(matchId);
        }
      });
    });
  });
}

export function broadcastToRoom(matchId: string, event: string, data: any) {
  const clients = rooms.get(matchId);
  if (clients) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}
