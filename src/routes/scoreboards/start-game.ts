import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { broadcastToRoom } from "../../lib/ws";
import { BadRequest } from "../../errors/bad-request";

export async function startGame(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/scoreboards/games/start",
    {
      schema: {
        summary: "Start a new game in a match",
        tags: ["scoreboards"],
        body: z.object({
          match_history_id: z.string().uuid(),
          game_number: z.number(),
        }),
        response: {
          201: z.object({
            gameId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { match_history_id, game_number } = request.body;

      // Verifica se a partida existe
      const match = await prisma.matchHistory.findUnique({
        where: { id: match_history_id },
      });

      if (!match) throw new BadRequest("Match not found");

      // Cria um novo game começando em 0x0
      const game = await prisma.gameHistory.create({
        data: {
          match_history_id,
          game_number,
          points_player1: 0,
          points_player2: 0,
        },
      });

      // Notifica os clientes que um novo game começou
      broadcastToRoom(match_history_id, "game_started", {
        match_history_id,
        game_number,
        points_player1: 0,
        points_player2: 0,
      });

      return reply.status(201).send({ gameId: game.id });
    }
  );
}
