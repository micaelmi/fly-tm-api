import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteStrategy(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/strategies/:strategyId",
    {
      schema: {
        summary: "Delete a strategy by id",
        tags: ["strategies"],
        params: z.object({
          strategyId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { strategyId } = request.params;
      const strategy = await prisma.strategy.delete({
        where: {
          id: strategyId,
        },
      });

      return reply.send({ strategy });
    }
  );
}
