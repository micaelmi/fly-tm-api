import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { broadcastToRoom } from "../../lib/ws";
import { ForbiddenError } from "../../errors/forbidden-error";
import { BadRequest } from "../../errors/bad-request";

export async function recordGame(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/scoreboards/games/end",
    {
      schema: {
        summary: "Finalize a game and update match sets",
        tags: ["scoreboards"],
        body: z.object({
          game_id: z.number(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { game_id } = request.body;

      const request_owner = request.user;

      const game = await prisma.gameHistory.findUnique({
        where: { id: game_id },
        select: {
          match_history_id: true,
          points_player1: true,
          points_player2: true,
        },
      });

      if (!game) throw new BadRequest("Game not found");

      const match = await prisma.matchHistory.findFirst({
        where: { id: game.match_history_id },
        select: { user_id: true },
      });

      if (!match) throw new BadRequest("Match not found");

      if (request_owner.sub !== match.user_id)
        throw new ForbiddenError("You can only edit your own matches");

      // Verifica quem ganhou e atualiza os sets
      if (game.points_player1 > game.points_player2) {
        await prisma.matchHistory.update({
          where: { id: game.match_history_id },
          data: { sets_player1: { increment: 1 } },
        });
      } else if (game.points_player2 > game.points_player1) {
        await prisma.matchHistory.update({
          where: { id: game.match_history_id },
          data: { sets_player2: { increment: 1 } },
        });
      }

      // Notifica os clientes que o game acabou
      broadcastToRoom(game.match_history_id, "game_ended", {
        game_id,
        winner:
          game.points_player1 > game.points_player2 ? "player1" : "player2",
      });

      return reply.status(200).send({ message: "Game ended and sets updated" });
    }
  );
}
