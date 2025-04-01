import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { broadcastToRoom } from "../../lib/ws";
import { BadRequest } from "../../errors/bad-request";

export async function updateScore(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/scoreboards/games/update-score",
    {
      schema: {
        summary: "Update the score of a game",
        tags: ["scoreboards"],
        body: z.object({
          game_id: z.number(),
          points_player1: z.number(),
          points_player2: z.number(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { game_id, points_player1, points_player2 } = request.body;

      // Verifica se o game existe
      const game = await prisma.gameHistory.findUnique({
        where: { id: game_id },
        select: { match_history_id: true },
      });

      if (!game) throw new BadRequest("Game not found");

      // Atualiza os pontos do game
      await prisma.gameHistory.update({
        where: { id: game_id },
        data: { points_player1, points_player2 },
      });

      // Envia atualização em tempo real
      broadcastToRoom(game.match_history_id, "score_updated", {
        game_id,
        points_player1,
        points_player2,
      });

      return reply.status(200).send({ message: "Score updated" });
    }
  );
}
