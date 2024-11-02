import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../errors/forbidden-error";
import { BadRequest } from "../../errors/bad-request";

export async function recordGame(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/scoreboards/games",
    {
      schema: {
        summary: "Record a game to the match",
        tags: ["scoreboards"],
        body: z.object({
          points_player1: z.number(),
          points_player2: z.number(),
          game_number: z.number(),
          match_history_id: z.string().uuid(),
        }),
        response: {
          201: z.object({
            gameId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { points_player1, points_player2, game_number, match_history_id } =
        request.body;

      const request_owner = request.user;

      const match = await prisma.matchHistory.findFirst({
        where: { id: match_history_id },
        select: {
          sets_player1: true,
          sets_player2: true,
          user_id: true,
        },
      });

      if (!match) throw new BadRequest("match not found");

      if (request_owner.sub !== match.user_id)
        throw new ForbiddenError("You can only edit your own matches");

      const game = await prisma.gameHistory.create({
        data: {
          points_player1,
          points_player2,
          game_number,
          match_history_id,
        },
      });

      if (points_player1 > points_player2) {
        await prisma.matchHistory.update({
          where: { id: match_history_id },
          data: { sets_player1: match.sets_player1 + 1 },
        });
      } else if (points_player2 > points_player1) {
        await prisma.matchHistory.update({
          where: { id: match_history_id },
          data: { sets_player2: match.sets_player2 + 1 },
        });
      }

      return reply.status(201).send({ gameId: game.id });
    }
  );
}
