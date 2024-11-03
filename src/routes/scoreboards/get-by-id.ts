import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getMatchById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/scoreboards/:matchId",
    {
      schema: {
        summary: "Get match by id",
        tags: ["scoreboards"],
        params: z.object({
          matchId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { matchId } = request.params;
      const match = await prisma.matchHistory.findFirst({
        where: { id: matchId },
        include: {
          games_history: {
            select: {
              id: true,
              points_player1: true,
              points_player2: true,
              game_number: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
      });
      if (match === null) throw new BadRequest("match not found");

      return reply.send({ match });
    }
  );
}
