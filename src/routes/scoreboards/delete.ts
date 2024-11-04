import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteMatch(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/scoreboards/:matchId",
    {
      schema: {
        summary: "Delete a match by id",
        tags: ["scoreboards"],
        params: z.object({
          matchId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { matchId } = request.params;
      const match = await prisma.matchHistory.delete({
        where: { id: matchId },
      });

      return reply.send({ match });
    }
  );
}
