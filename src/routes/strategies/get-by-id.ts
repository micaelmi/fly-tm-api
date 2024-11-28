import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getStrategyById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/strategies/:strategyId",
    {
      schema: {
        summary: "Get strategy by id",
        tags: ["strategies"],
        params: z.object({
          strategyId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { strategyId } = request.params;
      const strategy = await prisma.strategy.findFirst({
        where: { id: strategyId },
        include: {
          strategy_items: {
            select: {
              description: true,
              movement: {
                select: {
                  id: true,
                  average_time: true,
                  description: true,
                  image_url: true,
                  name: true,
                  video_url: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          level: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      if (strategy === null) throw new BadRequest("strategy not found");

      return reply.send({ strategy });
    }
  );
}
