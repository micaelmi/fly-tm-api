import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function listMatchesByUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/scoreboards/user/:userId",
    {
      schema: {
        summary: "List matches by user",
        tags: ["scoreboards", "users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const matches = await prisma.matchHistory.findMany({
        where: { user_id: userId },
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
        orderBy: [{ date: "desc" }],
      });

      return reply.send({ matches });
    }
  );
}
